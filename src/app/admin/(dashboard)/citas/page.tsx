import CitasTable from "./CitasTable";

export const metadata = { title: "Citas — Panel Destiny Barber" };

export default function CitasPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Citas</h1>
      <CitasTable />
    </div>
  );
}
