import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { addDaysISO, todayISO } from "@/lib/time";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = Number(searchParams.get("serviceId"));
  const barberId = searchParams.get("barberId");
  const date = searchParams.get("date");

  if (!serviceId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Parámetros inválidos." }, { status: 400 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const maxDate = addDaysISO(todayISO(), settings?.maxAdvanceDays ?? 30);
  if (date < todayISO() || date > maxDate) {
    return NextResponse.json({ slots: [] });
  }

  const slots = await getAvailableSlots({
    serviceId,
    barberId: barberId && barberId !== "any" ? barberId : null,
    date,
  });

  return NextResponse.json({ slots });
}
