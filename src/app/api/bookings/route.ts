import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isBarberFree } from "@/lib/availability";
import { toMin, todayISO, addDaysISO, nowMinInDay } from "@/lib/time";

const bookingSchema = z.object({
  serviceId: z.number().int().positive(),
  barberId: z.string().min(1).nullable(), // null = "cualquier barbero disponible"
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function genCode(): string {
  return "DB-" + Math.floor(10000 + Math.random() * 89999);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const maxDate = addDaysISO(todayISO(), settings?.maxAdvanceDays ?? 30);
  const minLeadMin = (settings?.minLeadHours ?? 1) * 60;
  const buffer = settings?.bufferMin ?? 0;

  if (data.date < todayISO() || data.date > maxDate) {
    return NextResponse.json({ error: "Fecha fuera del rango permitido para reservar." }, { status: 400 });
  }
  if (data.date === todayISO() && toMin(data.time) < nowMinInDay() + minLeadMin) {
    return NextResponse.json({ error: "Ese horario ya no tiene la anticipación mínima requerida." }, { status: 409 });
  }

  const service = await prisma.service.findFirst({ where: { id: data.serviceId, active: true } });
  if (!service) {
    return NextResponse.json({ error: "El servicio seleccionado no existe." }, { status: 404 });
  }

  // Resuelve barbero: uno específico, o el primero libre entre los que ofrecen el servicio ("cualquier barbero").
  const candidateLinks = await prisma.barberService.findMany({
    where: {
      serviceId: data.serviceId,
      ...(data.barberId ? { barberId: data.barberId } : {}),
      barber: { active: true },
    },
  });
  if (candidateLinks.length === 0) {
    return NextResponse.json({ error: "Ningún barbero disponible realiza ese servicio." }, { status: 409 });
  }

  const startMin = toMin(data.time);

  const booking = await prisma.$transaction(async (tx) => {
    for (const link of candidateLinks) {
      const duration = link.durationMin ?? service.defaultDurationMin;
      const endMin = startMin + duration;
      const free = await isBarberFree(link.barberId, data.date, startMin, endMin, buffer);
      if (!free) continue;

      let client = await tx.client.findUnique({ where: { phone: data.customerPhone } });
      if (!client) {
        client = await tx.client.create({
          data: { phone: data.customerPhone, name: data.customerName, email: data.customerEmail || null },
        });
      } else if (client.name !== data.customerName) {
        client = await tx.client.update({ where: { id: client.id }, data: { name: data.customerName } });
      }

      return tx.booking.create({
        data: {
          code: genCode(),
          date: data.date,
          startMin,
          endMin,
          status: "PENDING",
          serviceId: data.serviceId,
          barberId: link.barberId,
          clientId: client.id,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          notes: data.notes || null,
        },
        include: { service: true, barber: true },
      });
    }
    return null;
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Ese horario ya no está disponible — alguien más lo tomó recién. Elige otro." },
      { status: 409 },
    );
  }

  await prisma.notificationLog.create({
    data: { bookingId: booking.id, channel: "whatsapp", type: "confirmation" },
  });

  return NextResponse.json({ booking });
}
