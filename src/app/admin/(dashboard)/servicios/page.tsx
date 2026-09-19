import ServicesManager from "./ServicesManager";

export const metadata = { title: "Servicios — Panel Destiny Barber" };

export default function ServiciosPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Servicios</h1>
      <ServicesManager />
    </div>
  );
}
