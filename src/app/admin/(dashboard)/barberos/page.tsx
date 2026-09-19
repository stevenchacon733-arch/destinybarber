import BarbersManager from "./BarbersManager";

export const metadata = { title: "Barberos — Panel Destiny Barber" };

export default function BarberosPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Barberos</h1>
      <BarbersManager />
    </div>
  );
}
