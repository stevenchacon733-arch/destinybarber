import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE_NAME, readSessionToken, signAdminToken } from "./session-token";

export { ADMIN_COOKIE_NAME };

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export async function createSession(adminId: string): Promise<void> {
  const token = await signAdminToken(adminId);
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
}

export async function getSessionAdminId(): Promise<string | null> {
  const store = await cookies();
  return readSessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}
