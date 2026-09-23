import { NextResponse } from "next/server"
import { z } from "zod"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { postDiscordEmbed } from "@/lib/discord"
import { verifyTurnstile } from "@/lib/turnstile"

export const dynamic = "force-dynamic"

const Contact = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  turnstileToken: z.string().optional().nullable(),
})

/** Posts a copy of a /contact form submission to the staff Discord channel. */
export async function POST(request: Request) {
  const ip = clientIp(request)
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 })
  }

  let parsed
  try {
    parsed = Contact.safeParse(await request.json())
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 })
  }
  const c = parsed.data

  if (!(await verifyTurnstile(c.turnstileToken, ip))) {
    return NextResponse.json({ error: "Please complete the verification check and try again." }, { status: 400 })
  }

  const { sent, reason } = await postDiscordEmbed({
    title: "✉️ New Contact Inquiry",
    description: "A visitor has submitted a message via the website contact form.",
    color: 5158340, // #4ECDC4
    fields: [
      { name: "Sender Name", value: c.name, inline: true },
      { name: "Sender Email", value: c.email, inline: true },
      { name: "Subject", value: c.subject },
      { name: "Message", value: c.message },
    ],
    footer: "Dr. Interested Contact Service",
  })

  if (!sent && reason !== "not_configured") {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 502 })
  }
  return NextResponse.json({ success: true })
}
