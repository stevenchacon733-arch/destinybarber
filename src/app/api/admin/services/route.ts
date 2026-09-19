import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const serviceSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  defaultDurationMin: z.number().int().min(5).max(480),
  price: z.number().int().min(0),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }

  const maxSort = await prisma.service.aggregate({ _max: { sortOrder: true } });
  const service = await prisma.service.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      defaultDurationMin: parsed.data.defaultDurationMin,
      price: parsed.data.price,
      active: parsed.data.active ?? true,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
    },
  });
  return NextResponse.json({ service });
}
