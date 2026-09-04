import { OAuth2Client } from "google-auth-library"
import type { SupabaseClient } from "@supabase/supabase-js"

export type DriveItem = {
  id: string
  name: string
  mimeType: string
  isFolder: boolean
  webViewLink?: string
  /** True when Google has a preview image for this file. The actual image is fetched through
   *  /api/drive/thumbnail (auth-gated, like everything else here) — never Google's raw
   *  thumbnailLink, since that URL isn't reliably fetchable straight from the browser. */
  hasThumbnail: boolean
}

export type DriveFolderListing = {
  id: string
  name: string
  items: DriveItem[]
}

// Full `drive` scope (not `drive.readonly`) — required for creating folders/files, copying
// templates, and uploads. This is the ONE Google account (connected via OAuth — see
// app/api/drive/oauth/*) the whole portal shares, so every write capability that touches
// Drive MUST go through the functions in this file, and this file intentionally implements NO
// delete/trash function. Do not add one: the org's explicit requirement is that nothing
// reachable through the portal can delete a Drive file, and since members never hold this
// credential themselves (see lib/portal-auth.ts), omitting the function here is what actually
// enforces that, not the connected account's role.
//
// This uses a real, OAuth-connected Google account rather than a service account on purpose:
// service accounts have zero Drive storage quota of their own, so creating/copying/uploading
// a file — which makes the service account its owner — fails immediately with "storage quota
// exceeded" unless the folder lives in a Google Workspace Shared Drive. A regular account has
// real quota, so this only works at all when the connected account is a normal Gmail/Workspace
// user (ideally the one that already owns the shared folder, so no re-sharing is needed).
export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive"
const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3/files"
const DRIVE_UPLOAD_BASE = "https://www.googleapis.com/upload/drive/v3/files"
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder"
const ITEM_FIELDS = "id,name,mimeType,webViewLink,thumbnailLink"

// Google Workspace file types members can create blank from the toolbar.
export const CREATABLE_GOOGLE_TYPES = {
  document: "application/vnd.google-apps.document",
  spreadsheet: "application/vnd.google-apps.spreadsheet",
  presentation: "application/vnd.google-apps.presentation",
  form: "application/vnd.google-apps.form",
} as const
export type CreatableGoogleType = keyof typeof CREATABLE_GOOGLE_TYPES

// Stays safely under Vercel Serverless Functions' ~4.5MB request body ceiling — uploads route
// through our server (never a raw credential handed to the browser), so this is a hard cap.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

/** A Drive API error the route handler can safely turn into a user-facing message. */
export class DriveApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getOAuthClientCredentials() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new DriveApiError(500, "Server is missing GOOGLE_OAUTH_CLIENT_ID/GOOGLE_OAUTH_CLIENT_SECRET.")
  }
  return { clientId, clientSecret }
}

let oauthClient: OAuth2Client | null = null

/** Lazily builds (and reuses) the OAuth client for the one connected Google account —
 *  google-auth-library caches and silently refreshes the access token internally across calls
 *  on the same instance using the long-lived refresh token. */
function getConnectedDriveClient(): OAuth2Client {
  if (oauthClient) return oauthClient

  const { clientId, clientSecret } = getOAuthClientCredentials()
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN
  if (!refreshToken) {
    throw new DriveApiError(
      500,
      "Google Drive isn't connected yet. A true owner needs to visit /api/drive/oauth/start to connect an account, then set GOOGLE_DRIVE_REFRESH_TOKEN from the result."
    )
  }

  oauthClient = new OAuth2Client({ clientId, clientSecret })
  oauthClient.setCredentials({ refresh_token: refreshToken })
  return oauthClient
}

/** Exposed so routes that need to talk to the Drive API directly (e.g. the thumbnail proxy)
 *  can, without re-implementing the OAuth token-refresh dance. */
export async function getDriveAccessToken(): Promise<string> {
  const client = getConnectedDriveClient()
  const { token } = await client.getAccessToken()
  if (!token) throw new DriveApiError(500, "Could not obtain a Google Drive access token.")
  return token
}

async function driveFetch(
  path: string,
  searchParams: Record<string, string>,
  init?: { method?: string; jsonBody?: unknown }
) {
  const token = await getDriveAccessToken()

  const url = new URL(`${DRIVE_API_BASE}${path}`)
  for (const [key, value] of Object.entries(searchParams)) url.searchParams.set(key, value)

  const res = await fetch(url.toString(), {
    method: init?.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.jsonBody ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.jsonBody ? JSON.stringify(init.jsonBody) : undefined,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.error?.message || res.statusText
    throw new DriveApiError(res.status, message)
  }
  return res.json()
}

function toDriveItem(file: { id: string; name: string; mimeType: string; webViewLink?: string; thumbnailLink?: string }): DriveItem {
  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    isFolder: file.mimeType === FOLDER_MIME_TYPE,
    webViewLink: file.webViewLink,
    hasThumbnail: Boolean(file.thumbnailLink),
  }
}

/** Lists the immediate children of a Drive folder, folders first then files, alphabetically. */
export async function listDriveFolder(folderId: string): Promise<DriveFolderListing> {
  const [folder, children] = await Promise.all([
    driveFetch(`/${folderId}`, { fields: "id,name,mimeType" }),
    driveFetch("", {
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id,name,mimeType,webViewLink,thumbnailLink)",
      orderBy: "folder,name",
      pageSize: "300",
    }),
  ])

  if (folder.mimeType !== FOLDER_MIME_TYPE) {
    throw new DriveApiError(400, `${folder.name || folderId} is not a folder.`)
  }

  return {
    id: folder.id,
    name: folder.name,
    items: (children.files || []).map(toDriveItem),
  }
}

function validateName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) throw new DriveApiError(400, "Name is required.")
  return trimmed
}

/** Creates a new, empty subfolder. */
export async function createDriveFolder(name: string, parentId: string): Promise<DriveItem> {
  const created = await driveFetch("", { fields: ITEM_FIELDS }, {
    method: "POST",
    jsonBody: { name: validateName(name), mimeType: FOLDER_MIME_TYPE, parents: [parentId] },
  })
  return toDriveItem(created)
}

/** Creates a new, blank Google Doc/Sheet/Slides/Form directly in a folder — for "make a new
 *  one" as opposed to starting from an existing template (see copyDriveFile below). */
export async function createDriveFile(name: string, parentId: string, type: CreatableGoogleType): Promise<DriveItem> {
  const created = await driveFetch("", { fields: ITEM_FIELDS }, {
    method: "POST",
    jsonBody: { name: validateName(name), mimeType: CREATABLE_GOOGLE_TYPES[type], parents: [parentId] },
  })
  return toDriveItem(created)
}

/** Copies an existing file (e.g. a template Doc/Sheet/Form) into a destination folder. Works
 *  for any file type Drive supports copying — Google Workspace files and regular uploads
 *  alike. Note: copying a *folder* only creates an empty folder with the same name, it does
 *  not recursively copy contents, so the UI only offers this action on files. */
export async function copyDriveFile(fileId: string, parentId: string, name?: string): Promise<DriveItem> {
  const created = await driveFetch(`/${fileId}/copy`, { fields: ITEM_FIELDS }, {
    method: "POST",
    jsonBody: { parents: [parentId], ...(name ? { name: validateName(name) } : {}) },
  })
  return toDriveItem(created)
}

/** Uploads a small file (see MAX_UPLOAD_BYTES) into a folder. Builds the multipart/related
 *  body Drive's upload endpoint expects by hand — Node has no built-in helper for it. */
export async function uploadDriveFile(parentId: string, filename: string, mimeType: string, bytes: Buffer): Promise<DriveItem> {
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new DriveApiError(413, `File is too large — the portal accepts files up to ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB.`)
  }

  const token = await getDriveAccessToken()
  const boundary = `dr-interested-portal-${Math.random().toString(36).slice(2)}`
  const metadata = JSON.stringify({ name: validateName(filename), parents: [parentId] })

  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType || "application/octet-stream"}\r\n\r\n`),
    bytes,
    Buffer.from(`\r\n--${boundary}--`),
  ])

  const res = await fetch(`${DRIVE_UPLOAD_BASE}?uploadType=multipart&fields=${ITEM_FIELDS}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  })
  if (!res.ok) {
    const errBody = await res.json().catch(() => null)
    throw new DriveApiError(res.status, errBody?.error?.message || res.statusText)
  }
  return toDriveItem(await res.json())
}

/** Fetches a file's small preview image (if Google has generated one) as raw bytes, for
 *  /api/drive/thumbnail to relay to the browser — the file's thumbnailLink isn't a public URL,
 *  it requires the same Bearer token the rest of this module uses. */
export async function getFileThumbnail(fileId: string): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const token = await getDriveAccessToken()

  const metaRes = await fetch(
    `${DRIVE_API_BASE}/${fileId}?fields=thumbnailLink`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!metaRes.ok) return null
  const meta = await metaRes.json()
  if (!meta.thumbnailLink) return null

  const imgRes = await fetch(meta.thumbnailLink, { headers: { Authorization: `Bearer ${token}` } })
  if (!imgRes.ok) return null

  return {
    buffer: await imgRes.arrayBuffer(),
    contentType: imgRes.headers.get("content-type") || "image/jpeg",
  }
}

/** Reads the configured template file for a creatable type (settings key
 *  `drive_template_<type>`, e.g. `drive_template_document`) — set via the dashboard's "Drive
 *  'New' Templates" admin card. Returns null (not an error) when nothing's configured yet, so
 *  callers can fall back to creating a blank file for that type. */
export async function resolveTemplateFileId(supabase: SupabaseClient, type: CreatableGoogleType): Promise<string | null> {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", `drive_template_${type}`)
    .maybeSingle()

  if (!data?.value) return null
  const match = /\/d\/([a-zA-Z0-9_-]+)/.exec(data.value)
  return match ? match[1] : null
}

/** Reads the root folder ID from the same `settings.google_drive_url` value the dashboard's
 *  "Drive Folder URL" admin field already edits, so there's no separate setting to manage. */
export async function resolveRootFolderId(supabase: SupabaseClient): Promise<string> {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "google_drive_url")
    .maybeSingle()

  if (error || !data?.value) {
    throw new DriveApiError(500, "No Google Drive folder URL is configured (settings.google_drive_url).")
  }

  const match = /folders\/([a-zA-Z0-9_-]+)/.exec(data.value)
  if (!match) {
    throw new DriveApiError(500, "The configured Drive URL doesn't look like a folder link.")
  }
  return match[1]
}
