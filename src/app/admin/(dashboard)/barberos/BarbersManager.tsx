"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Barber = { id: string; name: string; specialty: string | null; active: boolean };

export default function BarbersManager() {
  const [barbers, setBarbers] = useState<Barber[] | null>(null);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/barbers");
    const data = await res.json();
    setBarbers(data.barbers ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/barbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), specialty: specialty.trim() }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo crear.");
      return;
    }
    setName("");
    setSpecialty("");
    load();
  }

  async function toggleActive(b: Barber) {
    await fetch(`/api/admin/barbers/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !b.active }),
    });
    load();
  }

  async function remove(b: Barber) {
    if (!confirm(`¿Eliminar a ${b.name}? Esto no se puede deshacer.`)) return;
    const res = await fetch(`/api/admin/barbers/${b.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "No se pudo eliminar.");
      return;
    }
    load();
  }

  return (
    <div>
      <form onSubmit={create} className="border border-white/10 p-5 mb-8 grid sm:grid-cols-3 gap-4 items-end">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cream-dim text-xs">Nombre</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-gold bg-transparent border border-white/15 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cream-dim text-xs">Especialidad</span>
          <input
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Ej: Fades, barba…"
            className="focus-gold bg-transparent border border-white/15 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="focus-gold px-5 py-2.5 bg-gold text-ink text-xs font-semibold uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
        >
          {saving ? "Creando…" : "Agregar barbero"}
        </button>
        {error && <p className="sm:col-span-3 text-danger text-sm">{error}</p>}
      </form>

      {!barbers ? (
        <p className="text-cream-dim">Cargando…</p>
      ) : (
        <div className="border border-white/10 divide-y divide-white/10">
          {barbers.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-[220px]">
                <p className={b.active ? "" : "opacity-40 line-through"}>{b.name}</p>
                {b.specialty && <p className="text-xs text-cream-dim">{b.specialty}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(b)}
                  className={`focus-gold text-xs uppercase tracking-wide px-3 py-2 border ${b.active ? "border-success text-success" : "border-white/15 text-cream-dim"}`}
                >
                  {b.active ? "Disponible" : "No disponible"}
                </button>
                <Link
                  href={`/admin/barberos/${b.id}`}
                  className="focus-gold text-xs uppercase tracking-wide px-3 py-2 border border-white/15 text-cream-dim hover:border-gold hover:text-gold-bright"
                >
                  Horario y servicios
                </Link>
                <button
                  type="button"
                  onClick={() => remove(b)}
                  className="focus-gold text-xs uppercase tracking-wide px-3 py-2 border border-white/15 text-cream-dim hover:border-danger hover:text-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {barbers.length === 0 && <p className="p-6 text-center text-cream-dim">Aún no hay barberos.</p>}
        </div>
      )}
    </div>
  );
}
