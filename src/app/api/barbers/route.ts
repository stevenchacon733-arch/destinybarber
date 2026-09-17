import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");

  const barbers = await prisma.barber.findMany({
    where: {
      active: true,
      ...(serviceId ? { services: { some: { serviceId: Number(serviceId) } } } : {}),
    },
    orderBy: { sortOrder: "asc" },
    include: { services: { select: { serviceId: true } } },
  });

  return NextResponse.json({
    barbers: barbers.map((b) => ({
      id: b.id,
      name: b.name,
      specialty: b.specialty,
      bio: b.bio,
      photoUrl: b.photoUrl,
      rating: b.rating,
      serviceIds: b.services.map((s) => s.serviceId),
    })),
  });
}
