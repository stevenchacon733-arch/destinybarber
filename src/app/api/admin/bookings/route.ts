import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { Prisma, BookingStatus } from "@prisma/client";

export async function GET(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const barberId = searchParams.get("barberId");
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

  const where: Prisma.BookingWhereInput = {};
  if (date) where.date = date;
  if (from || to) where.date = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };
  if (barberId) where.barberId = barberId;
  if (status) where.status = status as BookingStatus;
  if (q) {
    where.OR = [
      { customerName: { contains: q } },
      { customerPhone: { contains: q } },
      { code: { contains: q } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { service: true, barber: true },
    orderBy: [{ date: "asc" }, { startMin: "asc" }],
  });

  return NextResponse.json({ bookings });
}
