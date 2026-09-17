import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code")?.trim();
  const phone = searchParams.get("phone")?.trim();

  if (!code && !phone) {
    return NextResponse.json({ error: "Ingresa tu código de reserva o tu teléfono." }, { status: 400 });
  }

  const bookings = await prisma.booking.findMany({
    where: code ? { code } : { customerPhone: phone },
    include: { service: true, barber: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ bookings });
}
