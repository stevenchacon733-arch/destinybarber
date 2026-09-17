import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { addDaysISO, todayISO } from "@/lib/time";
import { prisma } from "@/lib/prisma";

/** Qué días del rango de reserva tienen al menos un horario libre — para pintar el calendario del paso 3. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = Number(searchParams.get("serviceId"));
  const barberId = searchParams.get("barberId");

  if (!serviceId) {
    return NextResponse.json({ error: "Falta serviceId." }, { status: 400 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const maxAdvanceDays = settings?.maxAdvanceDays ?? 30;
  const start = todayISO();
  const resolvedBarberId = barberId && barberId !== "any" ? barberId : null;

  const dates = Array.from({ length: maxAdvanceDays + 1 }, (_, i) => addDaysISO(start, i));
  const results = await Promise.all(
    dates.map(async (date) => {
      const slots = await getAvailableSlots({ serviceId, barberId: resolvedBarberId, date });
      return { date, hasSlots: slots.length > 0 };
    }),
  );

  return NextResponse.json({ days: results });
}
