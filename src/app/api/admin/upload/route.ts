import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/require-admin";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Formato no soportado. Usa JPG, PNG, WebP o AVIF." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen pesa más de 8 MB." }, { status: 400 });
  }

  const folder = (form?.get("folder") as string) || "misc";
  const ext = file.type.split("/")[1];
  const pathname = `${folder}/${crypto.randomUUID()}.${ext}`;

  const blob = await put(pathname, file, { access: "public", addRandomSuffix: false });
  return NextResponse.json({ url: blob.url });
}
