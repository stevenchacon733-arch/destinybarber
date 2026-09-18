import type { Metadata } from "next";
import { marketingCss } from "./marketing-css";
import { marketingHtml } from "./marketing-html";
import HomeInteractions from "./HomeInteractions";

export const metadata: Metadata = {
  title: "Destiny Barber",
  description: "Barbería de autor. Reserva tu cita en línea — cortes clásicos, fades de precisión y ritual de barba a navaja.",
};

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: marketingCss }} />
      <div className="db-page" dangerouslySetInnerHTML={{ __html: marketingHtml }} />
      <HomeInteractions />
    </>
  );
}
