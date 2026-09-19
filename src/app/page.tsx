import type { Metadata } from "next";
import { marketingCss } from "./marketing-css";
import { buildMarketingHtml } from "./marketing-html";
import HomeInteractions from "./HomeInteractions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Destiny Barber",
  description: "Barbería de autor. Reserva tu cita en línea — cortes clásicos, fades de precisión y ritual de barba a navaja.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, barbers] = await Promise.all([
    prisma.settings.findUnique({ where: { id: 1 } }),
    prisma.barber.findMany({ orderBy: { sortOrder: "asc" }, take: 4 }),
  ]);

  const marketingHtml = buildMarketingHtml({
    hero: settings?.heroImageUrl,
    compareBefore: settings?.compareBeforeUrl,
    compareAfter: settings?.compareAfterUrl,
    barbers: barbers.map((b) => b.photoUrl),
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marketingCss }} />
      <div className="db-page" dangerouslySetInnerHTML={{ __html: marketingHtml }} />
      <HomeInteractions />
    </>
  );
}
