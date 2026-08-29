import { NextResponse } from "next/server"
import { sendEmail, taskEmailShell } from "@/lib/send-email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { assignee_email, assignee_name, title, description, due_date, assigned_by_name } = body

    if (!assignee_email || !title) {
      return NextResponse.json({ error: "assignee_email and title are required" }, { status: 400 })
    }

    const dueLine = due_date
      ? `<p><strong>Due:</strong> ${new Date(due_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>`
      : ""

    const result = await sendEmail({
      to: assignee_email,
      subject: `New task assigned: ${title}`,
      html: taskEmailShell(
        `Hi ${assignee_name || "there"}, you've been assigned a task`,
        `
          <p><strong>${title}</strong></p>
          ${description ? `<p>${description}</p>` : ""}
          ${dueLine}
          ${assigned_by_name ? `<p style="color:#888;font-size:13px;">Assigned by ${assigned_by_name}</p>` : ""}
        `
      ),
    })

    return NextResponse.json({ success: true, emailSent: result.sent })
  } catch (err: any) {
    console.error("notify-assigned error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
