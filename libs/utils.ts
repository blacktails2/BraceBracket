export const sha1 = async (str: string) => {
  const buff = new Uint8Array(Array.from(str).map((c) => c.charCodeAt(0)))
    .buffer
  const digest = await crypto.subtle.digest("SHA-1", buff)
  return Array.from(new Uint8Array(digest))
    .map((x) => ("00" + x.toString(16)).slice(-2))
    .join("")
}
