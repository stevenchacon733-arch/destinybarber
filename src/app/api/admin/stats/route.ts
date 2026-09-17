import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getDashboardStats } from "@/lib/stats";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
