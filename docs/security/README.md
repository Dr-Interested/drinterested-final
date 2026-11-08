# Security review follow-up (review dated November 5, 2026)

What was fixed in the code, and the settings that have to be changed by hand in DNS, Supabase
and Vercel.

## Status of every finding

| ID | Finding | Status |
| --- | --- | --- |
| F-01 | No Content Security Policy | **Fixed in code.** Enforced CSP on every response (`next.config.mjs`). |
| F-02 | Marketing scripts on the portal login | **Fixed in code.** Google Analytics and the Meta Pixel load only after "Allow" in the cookie banner and never on portal pages; ConvertKit loads only with a newsletter form; privacy policy updated. |
| F-03 | DMARC is monitoring-only | **DNS change needed** (section 1). |
| H-01 | No security.txt | **Fixed in code.** `public/.well-known/security.txt`. Update `Expires` before November 2027. |
| H-02 | No CAA record | **DNS change needed** (section 2). |
| H-03 | HSTS without includeSubDomains | **Fixed in code** for responses the site serves (section 3 for the apex). |
| H-04 | X-Powered-By and X-XSS-Protection headers | **Fixed in code.** Both removed. |
| Follow-up 1 | Database authorization | **Check needed.** Run `docs/security/rls-audit.sql` (section 4). |
| Follow-up 2 | Drive authorization and tokens | **Fixed in code.** Found and fixed a real gap: members could pass any file/folder id the connected Google account can see (its whole Drive), and folder ids went unescaped into a Drive search query. Every Drive route now validates ids and checks they are inside the portal's shared folder. Also an OAuth `state` check and a no-store/no-referrer token page. |
| Follow-up 3 | Supabase relay | **Fixed in code.** Path, method, header and key allowlists, no redirects, size limits, timeout, rate limit. |
| Follow-up 4 | Authentication and sessions | **Supabase settings** (section 5). |
| Follow-up 5 | Notification and form abuse | **Fixed in code.** Per-account rate limits on every email route; contact and apply routes were already validated and rate limited. |
| Follow-up 6 | Caching | No change needed: portal data is fetched in the browser with the member's own token, not cached by the CDN. |
| Follow-up 7 | Dependencies | **Fixed.** `npm audit fix` and zod 4. Only 8 moderate findings remain, all in ESLint's dev tooling (never shipped to visitors). Re-run `npm audit` monthly. |

## 1. Email anti-spoofing (F-03): DMARC

Today: `v=DMARC1; p=none; ...` (receivers are asked to take no action on forged mail).

Do this in order. Every step is a DNS change where the domain is managed.

1. **Make sure each real sender is authenticated for drinterested.org:**
   * Zoho Mail (staff mail): Zoho Mail Admin -> Domains -> drinterested.org -> Email
     Configuration -> DKIM: add a selector, publish the TXT record it shows, then click Verify.
   * Resend (portal emails from `portal@drinterested.org`, and Supabase sign-in emails once they
     go through Resend SMTP): Resend -> Domains -> drinterested.org should show DKIM and SPF as
     Verified.
   * Kit / ConvertKit (newsletter): if newsletters are sent "from" an @drinterested.org address,
     Kit -> Settings -> Email -> Sending domain: add drinterested.org and publish its records.
   * Anything else that sends "from" @drinterested.org (another form tool, Google Workspace, etc.)
     needs the same.
2. **Watch the reports for 1-2 weeks.** DMARC reports already go to admin@drinterested.org.
   A free viewer (for example dmarcian or Postmark's DMARC digests) makes them readable. Every
   legitimate sender should show "DKIM pass, aligned".
3. **Start enforcing** by replacing the `_dmarc.drinterested.org` TXT record with:

   ```
   v=DMARC1; p=quarantine; sp=quarantine; pct=100; rua=mailto:admin@drinterested.org; adkim=r; aspf=r
   ```

   Forged mail now lands in spam. (`ruf`/`fo=1` forensic reports were dropped: they can contain
   message contents and few providers send them.)
4. **After another 2-4 weeks with no legitimate mail failing**, change `p=quarantine` and
   `sp=quarantine` to `p=reject` and `sp=reject`.

The SPF record (`v=spf1 include:zohomail.com ~all`) can stay as is: Resend and Kit send with
their own return-path subdomains and pass DMARC through DKIM. Only move to `-all` once reports
show nothing legitimate failing SPF.

## 2. CAA record (H-02)

A CAA record limits which certificate authorities may issue certificates for the domain. It
applies to every subdomain too, so first check who issues each one: open
`https://www.drinterested.org`, `https://impact.drinterested.org`,
`https://news.impact.drinterested.org`, `https://chess.drinterested.org` and
`https://link.drinterested.org` in a browser, click the padlock, and note the certificate's
**Issuer**.

* Vercel uses **Let's Encrypt**. If every issuer is Let's Encrypt, add these records at
  `drinterested.org`:

  ```
  drinterested.org.  CAA  0 issue "letsencrypt.org"
  drinterested.org.  CAA  0 iodef "mailto:admin@drinterested.org"
  ```

* For each other issuer you saw, add another `0 issue "<ca domain>"` line, for example
  `pki.goog` for Google Trust Services or `sectigo.com` for Sectigo. A missing one would stop
  that site's certificate from renewing.

## 3. HSTS on the apex (H-03)

The site now sends `Strict-Transport-Security: max-age=63072000; includeSubDomains` on everything
it serves at www. The bare-domain redirect (`drinterested.org` -> `www`) is answered by Vercel
before the site runs, so it keeps Vercel's default header. Covering every subdomain from the apex
(and HSTS preloading) is optional. Only consider it once every subdomain in section 2 works over
HTTPS.

## 4. Database permissions (follow-up 1)

Run `docs/security/rls-audit.sql` in Supabase -> SQL Editor. It is read-only. Look at rows whose
`check` starts with `PROBLEM`:

* **table without RLS**: anyone with the public key can read and change every row. Turn on RLS
  for the table and add policies.
* **anonymous write policy**: signed-out visitors can write. `members` INSERT for anon should be
  removed now: applications are saved by the server (`/api/members/apply`).
* **view ... runs with owner rights**: recreate the view `with (security_invoker = true)`.
* **security definer function**: check it can't be misused by any signed-in member.

Then test with real accounts (a member, a director, an unapproved applicant): a member must not
be able to read other members' private fields or tasks, change their own `role`/`approved`, or
approve others.

## 5. Sign-in settings (follow-up 4)

In Supabase -> Authentication:

* **URL Configuration**: Site URL `https://www.drinterested.org`; Redirect URLs only
  `https://www.drinterested.org/**` (remove old or preview domains you no longer use).
* **Rate Limits**: keep the defaults or lower: sign-in/OTP and password-reset emails per hour
  limit abuse.
* **Email**: OTP and link expiry of 1 hour or less; "Secure email change" on.
* **Password**: minimum length 8 (the forms already require it); turn on leaked-password
  protection if your plan offers it.
* **Owner account**: use a long unique password, and sign in with Google SSO where possible.
