import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const schema = z.object({
  heroImageUrl: z.string().url().nullable().optional(),
  compareBeforeUrl: z.string().url().nullable().optional(),
  compareAfterUrl: z.string().url().nullable().optional(),
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });

  const settings = await prisma.settings.update({ where: { id: 1 }, data: parsed.data });
  return NextResponse.json({ settings });
}
