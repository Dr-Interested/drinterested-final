import { JWT } from "google-auth-library"
import type { SupabaseClient } from "@supabase/supabase-js"

export type DriveItem = {
  id: string
  name: string
  mimeType: string
  isFolder: boolean
  webViewLink?: string
  iconLink?: string
}

export type DriveFolderListing = {
  id: string
  name: string
  items: DriveItem[]
}

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly"
const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3/files"
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder"

let jwtClient: JWT | null = null

/** Lazily builds (and reuses) the service-account JWT client — google-auth-library caches
 *  and refreshes the underlying access token internally across calls on the same instance. */
function getJwtClient(): JWT {
  if (jwtClient) return jwtClient

  const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64
  if (!encoded) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is not set — see .env.example for how to create and encode a Drive service account key."
    )
  }

  let credentials: { client_email?: string; private_key?: string }
  try {
    credentials = JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"))
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is not valid base64-encoded JSON.")
  }
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("The decoded service account JSON is missing client_email/private_key.")
  }

  jwtClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [DRIVE_SCOPE],
  })
  return jwtClient
}

/** A Drive API error the route handler can safely turn into a user-facing message. */
export class DriveApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function driveFetch(path: string, searchParams: Record<string, string>) {
  const client = getJwtClient()
  const { token } = await client.getAccessToken()
  if (!token) throw new DriveApiError(500, "Could not obtain a Google Drive access token.")

  const url = new URL(`${DRIVE_API_BASE}${path}`)
  for (const [key, value] of Object.entries(searchParams)) url.searchParams.set(key, value)

  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.error?.message || res.statusText
    throw new DriveApiError(res.status, message)
  }
  return res.json()
}

function toDriveItem(file: { id: string; name: string; mimeType: string; webViewLink?: string; iconLink?: string }): DriveItem {
  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    isFolder: file.mimeType === FOLDER_MIME_TYPE,
    webViewLink: file.webViewLink,
    iconLink: file.iconLink,
  }
}

/** Lists the immediate children of a Drive folder, folders first then files, alphabetically. */
export async function listDriveFolder(folderId: string): Promise<DriveFolderListing> {
  const [folder, children] = await Promise.all([
    driveFetch(`/${folderId}`, { fields: "id,name,mimeType" }),
    driveFetch("", {
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id,name,mimeType,webViewLink,iconLink)",
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
