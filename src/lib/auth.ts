import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getEncodedKey() {
  const secretKey = process.env.JWT_SECRET || "fallback-dev-secret-change-me-1234567890-secure-key";
  return new TextEncoder().encode(secretKey);
}

const COOKIE_NAME = "admin_session";

export async function signToken(payload: { username: string }): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getEncodedKey());
}

export async function verifyToken(
  token: string
): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload as { username: string };
  } catch (err) {
    console.error("JWT doğrulama hatası:", err);
    return null;
  }
}

export async function createSession(username: string): Promise<void> {
  const token = await signToken({ username });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function validateCredentials(
  username: string,
  password: string
): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error("ADMIN_USERNAME or ADMIN_PASSWORD not set");
    return false;
  }

  return username === adminUsername && password === adminPassword;
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
