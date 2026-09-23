import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { APPLY_DEPARTMENTS, APPLY_ROLES_BY_DEPARTMENT } from "@/lib/apply-options"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { postDiscordEmbed } from "@/lib/discord"
import { verifyTurnstile } from "@/lib/turnstile"

export const dynamic = "force-dynamic"

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .nullable()
  .transform((v) => v || null)
  .refine((v) => !v || /^https?:\/\/[^\s]+$/i.test(v), "Social links must start with http:// or https://")

const avatarPrefix = `${(process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "")}/storage/v1/object/public/avatar/`

const Application = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name.").max(100, "Full name must be under 100 characters."),
    email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(254),
    discord_username: z.string().trim().min(2, "Please enter your Discord username.").max(40).transform((v) => v.replace(/^@/, "")),
    department: z.string().refine((d) => APPLY_DEPARTMENTS.includes(d), "Please choose a department."),
    role: z.string(),
    bio: z.string().trim().min(10, "Bio must be at least 10 characters.").max(2000, "Bio must be under 2000 characters."),
    image: z.string().refine((u) => u.startsWith(avatarPrefix), "Please upload a profile image."),
    socials: z
      .object({ website: optionalUrl, linkedin: optionalUrl, instagram: optionalUrl })
      .optional()
      .default({}),
    turnstileToken: z.string().optional().nullable(),
  })
  .refine((a) => (APPLY_ROLES_BY_DEPARTMENT[a.department] || []).includes(a.role), {
    message: "Please choose a role for your department.",
    path: ["role"],
  })

/**
 * Server-side half of the public /members/apply form (task.md A10). The browser still creates
 * the Supabase Auth account itself, but the `members` row is validated and inserted here with
 * the service role: every field is checked against the same presets and limits the form
 * uses, `approved` is always forced to false, submissions are rate limited per IP, and (when
 * TURNSTILE_SECRET_KEY is set) must carry a valid CAPTCHA token. The staff Discord
 * notification is sent from here too, so there's no public endpoint that posts arbitrary text
 * to Discord.
 */
export async function POST(request: Request) {
  const ip = clientIp(request)
  if (!rateLimit(`apply:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many applications from this network. Please try again later." }, { status: 429 })
  }

  let parsed
  try {
    parsed = Application.safeParse(await request.json())
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid application." }, { status: 400 })
  }
  const a = parsed.data

  if (!(await verifyTurnstile(a.turnstileToken, ip))) {
    return NextResponse.json({ error: "Please complete the verification check and try again." }, { status: 400 })
  }

  const { data: existing } = await supabaseAdmin.from("members").select("id").eq("email", a.email).maybeSingle()
  if (existing) {
    return NextResponse.json(
      { error: "An application with this email already exists. Sign in to the portal, or contact us if you need help." },
      { status: 409 },
    )
  }

  const member = {
    name: a.name,
    email: a.email,
    discord_username: a.discord_username,
    role: a.role,
    department: a.department,
    bio: a.bio,
    image: a.image,
    socials: {
      website: a.socials.website ?? null,
      linkedin: a.socials.linkedin ?? null,
      instagram: a.socials.instagram ?? null,
    },
    approved: false,
  }

  const { error } = await supabaseAdmin.from("members").insert([member])
  if (error) {
    console.error("Apply insert failed:", error)
    return NextResponse.json({ error: "We couldn't save your application. Please try again." }, { status: 500 })
  }

  const socialLinks = [
    member.socials.website && `[Website](${member.socials.website})`,
    member.socials.linkedin && `[LinkedIn](${member.socials.linkedin})`,
    member.socials.instagram && `[Instagram](${member.socials.instagram})`,
  ].filter(Boolean)

  await postDiscordEmbed({
    title: "📋 New Member Application",
    description: "A new application has been submitted and is pending review.",
    color: 5025661, // #4CAF7D
    thumbnailUrl: member.image,
    fields: [
      { name: "Full Name", value: member.name, inline: true },
      { name: "Discord Username", value: `@${member.discord_username}`, inline: true },
      { name: "Email Address", value: member.email },
      { name: "Department", value: member.department, inline: true },
      { name: "Role", value: member.role, inline: true },
      { name: "Bio", value: member.bio },
      ...(socialLinks.length ? [{ name: "Social Links", value: socialLinks.join(" | ") }] : []),
    ],
    footer: "Dr. Interested Portal",
  })

  return NextResponse.json({ success: true })
}
