import { NextResponse } from "next/server";
import { getSessionAdminId } from "./auth";

/** Segunda barrera de autorización dentro de cada ruta admin, además del middleware. */
export async function requireAdmin(): Promise<
  { adminId: string; response: null } | { adminId: null; response: NextResponse }
> {
  const adminId = await getSessionAdminId();
  if (!adminId) {
    return { adminId: null, response: NextResponse.json({ error: "No autorizado." }, { status: 401 }) };
  }
  return { adminId, response: null };
}
