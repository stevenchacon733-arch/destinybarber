import BarberDetail from "./BarberDetail";

export const metadata = { title: "Barbero — Panel Destiny Barber" };

export default async function BarberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <BarberDetail barberId={id} />
    </div>
  );
}
