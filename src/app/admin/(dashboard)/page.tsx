import { getDashboardStats } from "@/lib/stats";
import { formatMoney } from "@/lib/format";
import { fromMin } from "@/lib/time";
import Link from "next/link";

export const metadata = { title: "Dashboard — Panel Destiny Barber" };
// Lee datos en vivo (citas de hoy, ingresos, ocupación) — nunca se debe cachear como página estática de build.
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  ARRIVED: "Llegó",
  IN_SERVICE: "En servicio",
  DONE: "Finalizada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Hoy en Destiny Barber</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Citas hoy" value={String(stats.todayCount)} />
        <StatCard label="Próximos 7 días" value={String(stats.upcomingWeek)} />
        <StatCard label="Ingresos de hoy" value={formatMoney(stats.revenueToday)} hint="Solo citas finalizadas" />
        <StatCard label="Ocupación de hoy" value={`${stats.occupancy}%`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <TopList title="Servicios más reservados hoy" entries={stats.topServices} />
        <TopList title="Barberos con más citas hoy" entries={stats.topBarbers} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">Agenda de hoy</h2>
        <Link href="/admin/citas" className="focus-gold font-mono text-xs uppercase tracking-wide text-gold hover:text-gold-bright">
          Ver todas las citas →
        </Link>
      </div>

      {stats.todayBookings.length === 0 ? (
        <p className="text-cream-dim border border-white/10 p-6 text-center">No hay citas hoy.</p>
      ) : (
        <div className="border border-white/10 divide-y divide-white/10">
          {stats.todayBookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="font-mono text-sm w-16 text-gold-bright">{fromMin(b.startMin)}</div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm">{b.customerName} <span className="text-cream-dim">· {b.customerPhone}</span></p>
                <p className="text-xs text-cream-dim">{b.service.name} · {b.barber.name}</p>
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-wide px-2 py-1 border border-white/15 text-cream-dim">
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-white/10 p-5">
      <p className="font-mono text-[0.65rem] uppercase tracking-wide text-cream-dim">{label}</p>
      <p className="font-display text-3xl text-gold-bright mt-2">{value}</p>
      {hint && <p className="text-xs text-cream-dim mt-1">{hint}</p>}
    </div>
  );
}

function TopList({ title, entries }: { title: string; entries: [string, number][] }) {
  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-mono text-[0.65rem] uppercase tracking-wide text-cream-dim mb-3">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-cream-dim">Sin datos todavía.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map(([name, count]) => (
            <li key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span className="font-mono text-gold-bright">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
