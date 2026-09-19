import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const schema = z.object({
  hours: z.array(
    z.object({
      weekday: z.number().int().min(0).max(6),
      startMin: z.number().int().min(0).max(1440),
      endMin: z.number().int().min(0).max(1440),
    }),
  ),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id: barberId } = await params;
  const hours = await prisma.workingHours.findMany({ where: { barberId }, orderBy: { weekday: "asc" } });
  return NextResponse.json({ hours });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id: barberId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });

  for (const h of parsed.data.hours) {
    if (h.endMin <= h.startMin) {
      return NextResponse.json({ error: "La hora de cierre debe ser después de la de apertura." }, { status: 400 });
    }
  }

  await prisma.$transaction([
    prisma.workingHours.deleteMany({ where: { barberId } }),
    prisma.workingHours.createMany({
      data: parsed.data.hours.map((h) => ({ ...h, barberId })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
