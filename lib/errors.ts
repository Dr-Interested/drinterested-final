/** Message text from anything thrown (Error, Supabase error object, or a string). */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === "object" && "message" in err) return String((err as { message: unknown }).message)
  return typeof err === "string" ? err : ""
}
