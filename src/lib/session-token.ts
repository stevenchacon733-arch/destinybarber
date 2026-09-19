import { SignJWT, jwtVerify } from "jose";

/** Sin dependencias de next/headers — usable en middleware (Edge runtime). */
const secretValue = process.env.SESSION_SECRET && process.env.SESSION_SECRET.length > 0
  ? process.env.SESSION_SECRET
  : "dev-insecure-secret-change-me";
const secret = new TextEncoder().encode(secretValue);

export const ADMIN_COOKIE_NAME = "db_admin_session";

export async function signAdminToken(adminId: string): Promise<string> {
  return new SignJWT({ sub: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
}

export async function readSessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.sub as string) ?? null;
  } catch {
    return null;
  }
}
