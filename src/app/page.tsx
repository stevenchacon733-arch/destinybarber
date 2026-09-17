import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-10 px-6 py-24 text-center">
      <div>
        <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-4">Destiny Barber</p>
        <h1 className="font-display text-4xl sm:text-6xl leading-none">
          Sistema de <em className="italic text-gold-bright font-normal">reservas</em>
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/reservar"
          className="focus-gold inline-flex items-center justify-center px-8 py-4 bg-gold text-ink font-semibold text-sm uppercase tracking-wide hover:bg-gold-bright transition-colors"
        >
          Reservar cita
        </Link>
        <Link
          href="/mis-citas"
          className="focus-gold inline-flex items-center justify-center px-8 py-4 border border-white/15 text-cream text-sm uppercase tracking-wide hover:border-gold hover:text-gold-bright transition-colors"
        >
          Ver mis citas
        </Link>
      </div>
    </main>
  );
}
