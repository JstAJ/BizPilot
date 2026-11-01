/**
 * Local-only credential hashing using the Web Crypto API (SHA-256 + per-app salt).
 * There is no backend in V1 — this exists to avoid storing raw passwords/PINs in
 * IndexedDB, not to defend against a determined local attacker with device access.
 */
const SALT = "bizpilot::v1::";

async function sha256(input: string): Promise<string> {
  const enc = new TextEncoder().encode(SALT + input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashSecret(value: string): Promise<string> {
  return sha256(value);
}

export async function verifySecret(value: string, hash: string): Promise<boolean> {
  const computed = await sha256(value);
  return computed === hash;
}
