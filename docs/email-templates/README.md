# Branded email setup

Every email the portal sends uses the same Dr. Interested look (logo, #405862 / #4ecdc4 colors,
card layout, legal footer). There are two senders:

| Emails | Sent by | Where the design lives |
| --- | --- | --- |
| Task assigned, due tomorrow, due today, task completed | This app, through Resend | `taskEmailShell()` in `lib/send-email.ts` |
| Confirm signup, sign-in code, reset password, change email, invite, reauthentication | Supabase Auth | The HTML files in this folder, pasted into Supabase |

## 1. Supabase Auth templates

In Supabase: **Authentication → Emails → Templates**. For each template, set the subject and paste
the whole matching file into the message body.

| Supabase template | File | Subject |
| --- | --- | --- |
| Confirm signup | `confirm-signup.html` | Confirm your Dr. Interested email |
| Magic Link | `magic-link.html` | Your Dr. Interested sign-in code |
| Reset Password | `reset-password.html` | Reset your Dr. Interested password |
| Change Email Address | `change-email.html` | Confirm your new Dr. Interested email |
| Invite user | `invite-user.html` | You're invited to the Dr. Interested portal |
| Reauthentication | `reauthentication.html` | Your Dr. Interested confirmation code |

The Magic Link template must show `{{ .Token }}` as plain text, not a link. The portal's
"Sign in with a code" screen asks for the typed code, because email scanners that open links
would otherwise use up a one-time link before the member clicks it.

## 2. Send Supabase Auth mail from your own domain (important)

Supabase's built-in mail server is for testing only: it sends only a couple of emails per hour
for the whole project and comes from a Supabase address. That is the most common reason password
reset and sign-in code emails "never arrive". Route Supabase Auth through Resend instead:

1. In Resend, verify the `drinterested.org` domain (Domains → Add domain, add the DNS records).
2. In Supabase: **Authentication → Emails → SMTP Settings → Enable custom SMTP**
   * Host `smtp.resend.com`, port `465`, username `resend`, password = a Resend API key
   * Sender email e.g. `portal@drinterested.org`, sender name `Dr. Interested`
3. In **Authentication → Rate Limits**, raise "emails per hour" to something sensible (e.g. 100).

## 3. App emails (Resend)

Set these environment variables in Vercel (Production and Preview):

* `RESEND_API_KEY`: a Resend API key
* `RESEND_FROM_EMAIL`: e.g. `Dr. Interested <portal@drinterested.org>` on the verified domain.
  Without it the app falls back to `onboarding@resend.dev`, which Resend only delivers to the
  Resend account owner, so nobody else gets task emails.

Also make sure `SUPABASE_SERVICE_ROLE_KEY` is set: the server needs it to read tasks before
emailing them. To check everything at once, open the portal's **Admin** tab and click
**Send test email**: it emails you and lists any missing or wrong settings, including Resend's
own error message if it rejects the send.

Assignment emails are sent by the Supabase "tasks INSERT" webhook (Database → Webhooks →
`https://www.drinterested.org/api/tasks/on-insert`) the moment a task is created, and the daily
9 AM ET job sends any that didn't go out. If Resend is briefly busy (a task assigned to a whole
department), sends are retried, and nobody gets the same email twice.

## 4. Redirect URLs

In **Authentication → URL Configuration**, set Site URL to `https://www.drinterested.org` and add
`https://www.drinterested.org/**` to Redirect URLs. The portal sends people back to
`/dashboard?login=true` (email confirmation, Google/Discord sign in) and
`/dashboard/reset-password` (password reset); a link whose destination isn't allowed here falls
back to the Site URL homepage instead.
