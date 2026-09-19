import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const createSchema = z.object({
  barberId: z.string().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["off", "special"]),
  startMin: z.number().int().min(0).max(1440).nullable().optional(),
  endMin: z.number().int().min(0).max(1440).nullable().optional(),
  reason: z.string().trim().max(200).optional().or(z.literal("")),
});

export async function GET(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const barberId = searchParams.get("barberId");

  const exceptions = await prisma.scheduleException.findMany({
    where: barberId === "shop" ? { barberId: null } : barberId ? { barberId } : {},
    orderBy: { date: "asc" },
    include: { barber: { select: { name: true } } },
  });
  return NextResponse.json({ exceptions });
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos.", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  if (d.type === "special" && (d.startMin == null || d.endMin == null || d.endMin <= d.startMin)) {
    return NextResponse.json({ error: "Un horario especial necesita hora de inicio y fin válidas." }, { status: 400 });
  }

  const exception = await prisma.scheduleException.create({
    data: {
      barberId: d.barberId,
      date: d.date,
      type: d.type,
      startMin: d.type === "special" ? d.startMin : null,
      endMin: d.type === "special" ? d.endMin : null,
      reason: d.reason || null,
    },
  });
  return NextResponse.json({ exception });
}
