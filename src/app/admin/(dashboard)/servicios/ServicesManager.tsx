"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/format";

type Service = {
  id: number;
  name: string;
  description: string | null;
  defaultDurationMin: number;
  price: number;
  active: boolean;
};

const emptyForm = { name: "", description: "", defaultDurationMin: 45, price: 15000 };

export default function ServicesManager() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data.services ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  function startEdit(s: Service) {
    setEditingId(s.id);
    setForm({ name: s.name, description: s.description ?? "", defaultDurationMin: s.defaultDurationMin, price: s.price });
    setError(null);
  }
  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      defaultDurationMin: Number(form.defaultDurationMin),
      price: Number(form.price),
    };
    const res = editingId
      ? await fetch(`/api/admin/services/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar.");
      return;
    }
    cancelEdit();
    load();
  }

  async function toggleActive(s: Service) {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    load();
  }

  async function remove(s: Service) {
    if (!confirm(`¿Eliminar "${s.name}"? Esto no se puede deshacer.`)) return;
    const res = await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "No se pudo eliminar.");
      return;
    }
    load();
  }

  return (
    <div>
      <form onSubmit={submit} className="border border-white/10 p-5 mb-8 grid sm:grid-cols-2 gap-4">
        <h2 className="sm:col-span-2 font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim">
          {editingId ? "Editar servicio" : "Nuevo servicio"}
        </h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cream-dim text-xs">Nombre</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="focus-gold bg-transparent border border-white/15 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cream-dim text-xs">Descripción</span>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="focus-gold bg-transparent border border-white/15 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cream-dim text-xs">Duración (min)</span>
          <input
            required
            type="number"
            min={5}
            max={480}
            value={form.defaultDurationMin}
            onChange={(e) => setForm({ ...form, defaultDurationMin: Number(e.target.value) })}
            className="focus-gold bg-transparent border border-white/15 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cream-dim text-xs">Precio</span>
          <input
            required
            type="number"
            min={0}
            step={500}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="focus-gold bg-transparent border border-white/15 px-3 py-2"
          />
        </label>
        {error && <p className="sm:col-span-2 text-danger text-sm">{error}</p>}
        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="focus-gold px-5 py-2 bg-gold text-ink text-xs font-semibold uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando…" : editingId ? "Guardar cambios" : "Crear servicio"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="focus-gold px-5 py-2 border border-white/15 text-xs uppercase tracking-wide text-cream-dim"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {!services ? (
        <p className="text-cream-dim">Cargando…</p>
      ) : (
        <div className="border border-white/10 divide-y divide-white/10">
          {services.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-[220px]">
                <p className={s.active ? "" : "opacity-40 line-through"}>{s.name}</p>
                <p className="text-xs text-cream-dim">
                  {s.defaultDurationMin} min · {formatMoney(s.price)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(s)}
                  className={`focus-gold text-xs uppercase tracking-wide px-3 py-2 border ${s.active ? "border-success text-success" : "border-white/15 text-cream-dim"}`}
                >
                  {s.active ? "Activo" : "Inactivo"}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(s)}
                  className="focus-gold text-xs uppercase tracking-wide px-3 py-2 border border-white/15 text-cream-dim hover:border-gold hover:text-gold-bright"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(s)}
                  className="focus-gold text-xs uppercase tracking-wide px-3 py-2 border border-white/15 text-cream-dim hover:border-danger hover:text-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {services.length === 0 && <p className="p-6 text-center text-cream-dim">Aún no hay servicios.</p>}
        </div>
      )}
    </div>
  );
}
