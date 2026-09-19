import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const barberSchema = z.object({
  name: z.string().trim().min(2).max(80),
  specialty: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(400).optional().or(z.literal("")),
  active: z.boolean().optional(),
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const barbers = await prisma.barber.findMany({
    orderBy: { sortOrder: "asc" },
    include: { services: { select: { serviceId: true } } },
  });
  return NextResponse.json({
    barbers: barbers.map((b) => ({ ...b, serviceIds: b.services.map((s) => s.serviceId), services: undefined })),
  });
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = barberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const maxSort = await prisma.barber.aggregate({ _max: { sortOrder: true } });
  const barber = await prisma.barber.create({
    data: {
      name: parsed.data.name,
      specialty: parsed.data.specialty || null,
      bio: parsed.data.bio || null,
      active: parsed.data.active ?? true,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json({ barber });
}
