import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { daysBetweenISO, nowMinInDay, todayISO } from "@/lib/time";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.customerPhone !== phone) {
    return NextResponse.json({ error: "No encontramos esa reserva con ese teléfono." }, { status: 404 });
  }
  if (booking.status === "CANCELLED") {
    return NextResponse.json({ booking });
  }
  if (["DONE", "ARRIVED", "IN_SERVICE"].includes(booking.status)) {
    return NextResponse.json({ error: "Esta cita ya no se puede cancelar." }, { status: 409 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const windowHours = settings?.cancelWindowHours ?? 2;

  const daysAhead = daysBetweenISO(todayISO(), booking.date);
  const minutesUntil = daysAhead * 24 * 60 + (booking.startMin - nowMinInDay());
  if (minutesUntil < windowHours * 60) {
    return NextResponse.json(
      { error: `Solo se puede cancelar hasta ${windowHours} h antes de la cita. Contacta directamente al local.` },
      { status: 409 },
    );
  }

  const updated = await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
  return NextResponse.json({ booking: updated });
}
