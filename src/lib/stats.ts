import { prisma } from "./prisma";
import { addDaysISO, todayISO } from "./time";
import type { BookingStatus } from "@prisma/client";

export async function getDashboardStats() {
  const today = todayISO();
  const weekAhead = addDaysISO(today, 7);
  const activeStatuses: BookingStatus[] = ["PENDING", "CONFIRMED", "ARRIVED", "IN_SERVICE"];

  const [todayBookings, upcoming, doneBookings, barbers] = await Promise.all([
    prisma.booking.findMany({
      where: { date: today, status: { notIn: ["CANCELLED"] } },
      include: { service: true, barber: true },
      orderBy: { startMin: "asc" },
    }),
    prisma.booking.count({
      where: { date: { gt: today, lte: weekAhead }, status: { in: activeStatuses } },
    }),
    prisma.booking.findMany({
      where: { date: today, status: "DONE" },
      include: { service: true },
    }),
    prisma.barber.findMany({ where: { active: true } }),
  ]);

  const revenueToday = doneBookings.reduce((sum, b) => sum + b.service.price, 0);

  const byService = new Map<string, number>();
  const byBarber = new Map<string, number>();
  for (const b of todayBookings) {
    byService.set(b.service.name, (byService.get(b.service.name) ?? 0) + 1);
    byBarber.set(b.barber.name, (byBarber.get(b.barber.name) ?? 0) + 1);
  }

  const shopHours = await prisma.workingHours.findMany({
    where: { barberId: null, weekday: new Date().getDay() },
  });
  const openMinutes = shopHours.reduce((sum, h) => sum + (h.endMin - h.startMin), 0);
  const bookedMinutes = todayBookings.reduce((sum, b) => sum + (b.endMin - b.startMin), 0);
  const occupancy =
    openMinutes > 0 && barbers.length > 0
      ? Math.min(100, Math.round((bookedMinutes / (openMinutes * barbers.length)) * 100))
      : 0;

  return {
    todayCount: todayBookings.length,
    upcomingWeek: upcoming,
    revenueToday,
    occupancy,
    topServices: [...byService.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
    topBarbers: [...byBarber.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
    todayBookings,
  };
}
