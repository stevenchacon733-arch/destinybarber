import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <aside className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 p-5 flex sm:flex-col justify-between sm:justify-start gap-6">
        <div>
          <p className="font-mono text-[0.65rem] tracking-[0.3em] text-gold uppercase">Destiny Barber</p>
          <p className="font-display text-lg mt-1">Panel</p>
        </div>
        <nav className="flex sm:flex-col gap-1 font-mono text-xs uppercase tracking-wide">
          <Link href="/admin" className="px-3 py-2 hover:text-gold-bright text-cream-dim">
            Dashboard
          </Link>
          <Link href="/admin/citas" className="px-3 py-2 hover:text-gold-bright text-cream-dim">
            Citas
          </Link>
          <Link href="/admin/barberos" className="px-3 py-2 hover:text-gold-bright text-cream-dim">
            Barberos
          </Link>
          <Link href="/admin/servicios" className="px-3 py-2 hover:text-gold-bright text-cream-dim">
            Servicios
          </Link>
          <Link href="/admin/horario" className="px-3 py-2 hover:text-gold-bright text-cream-dim">
            Horario del local
          </Link>
          <Link href="/admin/fotos" className="px-3 py-2 hover:text-gold-bright text-cream-dim">
            Fotos
          </Link>
        </nav>
        <div className="sm:mt-auto">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
