import BookingWizard from "./BookingWizard";

export const metadata = { title: "Reservar cita — Destiny Barber" };

export default function ReservarPage() {
  return (
    <main className="flex-1 px-4 sm:px-8 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-3">Destiny Barber</p>
        <h1 className="font-display text-3xl sm:text-5xl mb-10">Reserva tu cita</h1>
        <BookingWizard />
      </div>
    </main>
  );
}
