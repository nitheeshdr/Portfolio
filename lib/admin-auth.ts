export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET environment variable");
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const withPadding = padded + "=".repeat((4 - (padded.length % 4)) % 4);
  return atob(withPadding);
}

async function hmacSign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toBase64Url(signature);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Creates a signed `<payload>.<signature>` session token — no external JWT dependency needed, Edge-runtime safe. */
export async function createSessionToken(email: string): Promise<string> {
  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS })
    )
  );
  return `${payload}.${await hmacSign(payload)}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await hmacSign(payload);
  if (!constantTimeEqual(signature, expected)) return false;

  try {
    const { exp } = JSON.parse(fromBase64Url(payload)) as { exp: number };
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

/**
 * Compares two values via HMAC digest rather than raw string equality.
 * A plain constant-time loop still leaks the expected length (it
 * short-circuits when lengths differ); hashing first means both sides are
 * always a fixed-length digest, so length is never observable from timing.
 */
async function hashedEqual(a: string, b: string): Promise<boolean> {
  const [hashA, hashB] = await Promise.all([hmacSign(a), hmacSign(b)]);
  return constantTimeEqual(hashA, hashB);
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;

  const [emailMatch, passwordMatch] = await Promise.all([
    hashedEqual(email, adminEmail),
    hashedEqual(password, adminPassword),
  ]);
  return emailMatch && passwordMatch;
}
