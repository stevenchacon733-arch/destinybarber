import { prisma } from "./prisma";
import { fromMin, nowMinInDay, todayISO, weekdayOfISO } from "./time";

export type Interval = { start: number; end: number };

/** Resta intervalos ocupados de una lista de intervalos base. Pura. */
export function subtractIntervals(base: Interval[], busy: Interval[]): Interval[] {
  let free = [...base];
  for (const b of busy) {
    const next: Interval[] = [];
    for (const f of free) {
      if (b.end <= f.start || b.start >= f.end) {
        next.push(f);
        continue;
      }
      if (b.start > f.start) next.push({ start: f.start, end: Math.min(b.start, f.end) });
      if (b.end < f.end) next.push({ start: Math.max(b.end, f.start), end: f.end });
    }
    free = next.filter((iv) => iv.end > iv.start);
  }
  return free;
}

/**
 * Intervalos libres de un barbero en una fecha, cruzando:
 * horario propio (o el del local si no tiene uno) → excepciones/feriados →
 * bloqueos manuales → citas existentes (con buffer entre citas).
 */
export async function getBarberFreeIntervals(barberId: string, dateISO: string): Promise<Interval[]> {
  const weekday = weekdayOfISO(dateISO);

  const own = await prisma.workingHours.findMany({ where: { barberId, weekday } });
  let base: Interval[];
  if (own.length > 0) {
    base = own.map((h) => ({ start: h.startMin, end: h.endMin }));
  } else {
    const shop = await prisma.workingHours.findMany({ where: { barberId: null, weekday } });
    base = shop.map((h) => ({ start: h.startMin, end: h.endMin }));
  }
  if (base.length === 0) return [];

  const exceptions = await prisma.scheduleException.findMany({
    where: { date: dateISO, OR: [{ barberId }, { barberId: null }] },
  });
  for (const ex of exceptions) {
    if (ex.type === "off") {
      if (ex.startMin == null || ex.endMin == null) return [];
      base = subtractIntervals(base, [{ start: ex.startMin, end: ex.endMin }]);
    } else if (ex.type === "special" && ex.startMin != null && ex.endMin != null) {
      base = [{ start: ex.startMin, end: ex.endMin }];
    }
  }
  if (base.length === 0) return [];

  const blocks = await prisma.block.findMany({ where: { barberId, date: dateISO } });
  base = subtractIntervals(base, blocks.map((b) => ({ start: b.startMin, end: b.endMin })));

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const buffer = settings?.bufferMin ?? 0;
  const bookings = await prisma.booking.findMany({
    where: { barberId, date: dateISO, status: { notIn: ["CANCELLED", "NO_SHOW"] } },
  });
  const busy = bookings.map((b) => ({ start: b.startMin - buffer, end: b.endMin + buffer }));
  base = subtractIntervals(base, busy);

  return base.filter((iv) => iv.end > iv.start).sort((a, b) => a.start - b.start);
}

export type AvailableSlot = { time: string; startMin: number; barberId: string; barberName: string };

/**
 * Horarios disponibles para un servicio en una fecha, para un barbero
 * específico o "cualquier barbero disponible" (barberId null → une los
 * horarios de todos los barberos que hacen ese servicio).
 */
export async function getAvailableSlots(params: {
  serviceId: number;
  barberId: string | null;
  date: string;
}): Promise<AvailableSlot[]> {
  const { serviceId, date } = params;

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const slotInterval = settings?.slotIntervalMin ?? 15;
  const minLeadMin = (settings?.minLeadHours ?? 1) * 60;

  const isToday = date === todayISO();
  const cutoff = isToday ? nowMinInDay() + minLeadMin : -Infinity;

  const barberServices = await prisma.barberService.findMany({
    where: {
      serviceId,
      ...(params.barberId ? { barberId: params.barberId } : {}),
      barber: { active: true },
    },
    include: { barber: true, service: true },
  });

  const results: AvailableSlot[] = [];
  const seenTimes = new Set<string>();

  for (const bs of barberServices) {
    const duration = bs.durationMin ?? bs.service.defaultDurationMin;
    const free = await getBarberFreeIntervals(bs.barberId, date);
    for (const iv of free) {
      for (let start = iv.start; start + duration <= iv.end; start += slotInterval) {
        if (start < cutoff) continue;
        const time = fromMin(start);
        if (!params.barberId) {
          if (seenTimes.has(time)) continue;
          seenTimes.add(time);
        }
        results.push({ time, startMin: start, barberId: bs.barberId, barberName: bs.barber.name });
      }
    }
  }

  return results.sort((a, b) => a.startMin - b.startMin);
}

/** Verifica que un barbero esté realmente libre para [startMin,endMin) — se usa dentro de la transacción de creación de cita, como última barrera contra doble reserva. */
export async function isBarberFree(
  barberId: string,
  date: string,
  startMin: number,
  endMin: number,
  bufferMin: number,
): Promise<boolean> {
  const overlapping = await prisma.booking.findFirst({
    where: {
      barberId,
      date,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      startMin: { lt: endMin + bufferMin },
      endMin: { gt: startMin - bufferMin },
    },
  });
  if (overlapping) return false;

  const block = await prisma.block.findFirst({
    where: { barberId, date, startMin: { lt: endMin }, endMin: { gt: startMin } },
  });
  return !block;
}
