import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const STATUSES = ["PENDING", "CONFIRMED", "ARRIVED", "IN_SERVICE", "DONE", "CANCELLED", "NO_SHOW"] as const;

const patchSchema = z.object({
  status: z.enum(STATUSES).optional(),
  internalNotes: z.string().max(1000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startMin: z.number().int().min(0).max(1440).optional(),
  barberId: z.string().optional(),
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

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Cita no encontrada." }, { status: 404 });

  const data = parsed.data;
  const isMoving = data.date !== undefined || data.startMin !== undefined || data.barberId !== undefined;

  if (isMoving) {
    const duration = existing.endMin - existing.startMin;
    const nextDate = data.date ?? existing.date;
    const nextStart = data.startMin ?? existing.startMin;
    const nextBarber = data.barberId ?? existing.barberId;
    const nextEnd = nextStart + duration;

    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    const buffer = settings?.bufferMin ?? 0;

    const free = await prisma.booking.findFirst({
      where: {
        id: { not: id },
        barberId: nextBarber,
        date: nextDate,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        startMin: { lt: nextEnd + buffer },
        endMin: { gt: nextStart - buffer },
      },
    });
    if (free) {
      return NextResponse.json({ error: "Ese barbero ya tiene una cita en ese horario." }, { status: 409 });
    }

    await prisma.booking.update({
      where: { id },
      data: { date: nextDate, startMin: nextStart, endMin: nextEnd, barberId: nextBarber },
    });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.internalNotes !== undefined ? { internalNotes: data.internalNotes } : {}),
    },
    include: { service: true, barber: true },
  });

  return NextResponse.json({ booking: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.booking.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
