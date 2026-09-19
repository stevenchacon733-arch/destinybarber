import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const schema = z.object({ serviceIds: z.array(z.number().int()) });

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id: barberId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });

  await prisma.$transaction([
    prisma.barberService.deleteMany({ where: { barberId } }),
    prisma.barberService.createMany({
      data: parsed.data.serviceIds.map((serviceId) => ({ barberId, serviceId })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
