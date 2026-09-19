import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const patchSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  defaultDurationMin: z.number().int().min(5).max(480).optional(),
  price: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const service = await prisma.service.update({
    where: { id: Number(id) },
    data: {
      ...parsed.data,
      description: parsed.data.description === "" ? null : parsed.data.description,
    },
  });
  return NextResponse.json({ service });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.service.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se puede eliminar: tiene citas asociadas. Desactívalo en vez de borrarlo." },
      { status: 409 },
    );
  }
}
