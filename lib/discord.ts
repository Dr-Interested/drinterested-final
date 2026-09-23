/**
 * Posts an embed to the staff Discord channel (DISCORD_WEBHOOK_URL). Everything in these
 * embeds is typed by the public, so mentions are disabled (no @everyone pings from a contact
 * form message) and every field is clipped to Discord's limits so an oversized value can't
 * make the whole notification fail. No-ops when the webhook isn't configured.
 */
type Field = { name: string; value: string | null | undefined; inline?: boolean }

const clip = (s: string, max: number) => (s.length > max ? s.slice(0, max - 1) + "…" : s)

export async function postDiscordEmbed(embed: {
  title: string
  description?: string
  color: number
  fields: Field[]
  thumbnailUrl?: string | null
  footer: string
}): Promise<{ sent: boolean; reason?: string }> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn("DISCORD_WEBHOOK_URL is not configured — skipping notification:", embed.title)
    return { sent: false, reason: "not_configured" }
  }

  const body = {
    allowed_mentions: { parse: [] as string[] },
    embeds: [
      {
        title: clip(embed.title, 256),
        description: embed.description ? clip(embed.description, 2000) : undefined,
        color: embed.color,
        thumbnail: embed.thumbnailUrl ? { url: embed.thumbnailUrl } : undefined,
        fields: embed.fields.slice(0, 25).map((f) => ({
          name: clip(f.name, 256),
          value: clip((f.value || "").trim() || "N/A", 1024),
          inline: !!f.inline,
        })),
        timestamp: new Date().toISOString(),
        footer: { text: embed.footer },
      },
    ],
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error("Discord notification failed:", res.status, await res.text().catch(() => ""))
      return { sent: false, reason: `discord_${res.status}` }
    }
    return { sent: true }
  } catch (err) {
    console.error("Discord notification threw:", err)
    return { sent: false, reason: "network_error" }
  }
}
