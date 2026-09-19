"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WeeklyHoursEditor from "../../WeeklyHoursEditor";
import ExceptionsManager from "../../ExceptionsManager";

type Barber = { id: string; name: string; specialty: string | null; bio: string | null; active: boolean };
type Service = { id: number; name: string; active: boolean };

export default function BarberDetail({ barberId }: { barberId: string }) {
  const [barber, setBarber] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [barberRes, servicesRes] = await Promise.all([
      fetch(`/api/admin/barbers/${barberId}`),
      fetch("/api/admin/services"),
    ]);
    const barberData = await barberRes.json();
    const servicesData = await servicesRes.json();
    setBarber(barberData.barber);
    setServices(servicesData.services ?? []);
    setSelectedServiceIds(new Set((barberData.barber.services ?? []).map((s: { serviceId: number }) => s.serviceId)));
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barberId]);

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!barber) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/barbers/${barberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: barber.name, specialty: barber.specialty ?? "", bio: barber.bio ?? "", active: barber.active }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar.");
      return;
    }
  }

  function toggleService(id: number) {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function saveServices() {
    setSaving(true);
    await fetch(`/api/admin/barbers/${barberId}/services`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceIds: Array.from(selectedServiceIds) }),
    });
    setSaving(false);
  }

  if (!barber) return <p className="text-cream-dim">Cargando…</p>;

  return (
    <div>
      <Link href="/admin/barberos" className="focus-gold font-mono text-xs uppercase tracking-wide text-gold hover:text-gold-bright">
        ← Barberos
      </Link>
      <h1 className="font-display text-3xl mt-3 mb-8">{barber.name}</h1>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <form onSubmit={saveInfo} className="border border-white/10 p-5">
          <h3 className="font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim mb-4">Información</h3>
          <div className="space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-cream-dim text-xs">Nombre</span>
              <input
                required
                value={barber.name}
                onChange={(e) => setBarber({ ...barber, name: e.target.value })}
                className="focus-gold bg-transparent border border-white/15 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-cream-dim text-xs">Especialidad</span>
              <input
                value={barber.specialty ?? ""}
                onChange={(e) => setBarber({ ...barber, specialty: e.target.value })}
                className="focus-gold bg-transparent border border-white/15 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-cream-dim text-xs">Bio</span>
              <textarea
                value={barber.bio ?? ""}
                onChange={(e) => setBarber({ ...barber, bio: e.target.value })}
                rows={3}
                className="focus-gold bg-transparent border border-white/15 px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={barber.active}
                onChange={(e) => setBarber({ ...barber, active: e.target.checked })}
              />
              Disponible para reservar
            </label>
          </div>
          {error && <p className="text-danger text-sm mt-3">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="focus-gold mt-4 px-5 py-2 bg-gold text-ink text-xs font-semibold uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
          >
            Guardar información
          </button>
        </form>

        <div className="border border-white/10 p-5">
          <h3 className="font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim mb-4">Servicios que realiza</h3>
          <div className="space-y-2">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={selectedServiceIds.has(s.id)} onChange={() => toggleService(s.id)} />
                <span className={s.active ? "" : "opacity-40"}>{s.name}</span>
              </label>
            ))}
            {services.length === 0 && <p className="text-cream-dim text-sm">No hay servicios creados todavía.</p>}
          </div>
          <button
            type="button"
            onClick={saveServices}
            disabled={saving}
            className="focus-gold mt-4 px-5 py-2 bg-gold text-ink text-xs font-semibold uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
          >
            Guardar servicios
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <WeeklyHoursEditor endpoint={`/api/admin/barbers/${barberId}/hours`} title="Horario semanal (si no se define, usa el horario general del local)" />
        <ExceptionsManager barberId={barberId} title="Días libres y horarios especiales" />
      </div>
    </div>
  );
}
