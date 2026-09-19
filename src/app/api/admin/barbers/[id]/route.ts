import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const patchSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  specialty: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(400).optional().or(z.literal("")),
  active: z.boolean().optional(),
  photoUrl: z.string().url().nullable().optional(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const barber = await prisma.barber.findUnique({
    where: { id },
    include: {
      services: true,
      hours: { orderBy: { weekday: "asc" } },
      exceptions: { orderBy: { date: "asc" } },
    },
  });
  if (!barber) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json({ barber });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const barber = await prisma.barber.update({
    where: { id },
    data: {
      ...parsed.data,
      specialty: parsed.data.specialty === "" ? null : parsed.data.specialty,
      bio: parsed.data.bio === "" ? null : parsed.data.bio,
    },
  });
  return NextResponse.json({ barber });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.barber.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se puede eliminar: tiene citas asociadas. Desactívalo en vez de borrarlo." },
      { status: 409 },
    );
  }
}
