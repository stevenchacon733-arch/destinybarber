"use client";

import { useEffect, useState } from "react";
import { formatDateLabel, toMin } from "@/lib/time";

type Exception = {
  id: number;
  date: string;
  type: string;
  startMin: number | null;
  endMin: number | null;
  reason: string | null;
  barber: { name: string } | null;
};

export default function ExceptionsManager({ barberId, title }: { barberId: string | "shop"; title: string }) {
  const [items, setItems] = useState<Exception[] | null>(null);
  const [date, setDate] = useState("");
  const [type, setType] = useState<"off" | "special">("off");
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("14:00");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/exceptions?barberId=${barberId}`);
    const data = await res.json();
    setItems(data.exceptions ?? []);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barberId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/exceptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barberId: barberId === "shop" ? null : barberId,
        date,
        type,
        startMin: type === "special" ? toMin(start) : undefined,
        endMin: type === "special" ? toMin(end) : undefined,
        reason: reason.trim(),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo agregar.");
      return;
    }
    setDate("");
    setReason("");
    load();
  }

  async function remove(id: number) {
    await fetch(`/api/admin/exceptions/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim mb-4">{title}</h3>

      <form onSubmit={submit} className="flex flex-wrap items-end gap-3 mb-5">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cream-dim text-xs">Fecha</span>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="focus-gold bg-transparent border border-white/15 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-cream-dim text-xs">Tipo</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "off" | "special")}
            className="focus-gold bg-ink border border-white/15 px-2 py-1.5 text-sm"
          >
            <option value="off">Día libre / cerrado</option>
            <option value="special">Horario especial</option>
          </select>
        </label>
        {type === "special" && (
          <>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-cream-dim text-xs">Desde</span>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="focus-gold bg-transparent border border-white/15 px-2 py-1.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-cream-dim text-xs">Hasta</span>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="focus-gold bg-transparent border border-white/15 px-2 py-1.5 text-sm"
              />
            </label>
          </>
        )}
        <label className="flex flex-col gap-1 text-sm flex-1 min-w-[160px]">
          <span className="text-cream-dim text-xs">Motivo (opcional)</span>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Vacaciones, feriado…"
            className="focus-gold bg-transparent border border-white/15 px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="focus-gold px-4 py-2 bg-gold text-ink text-xs font-semibold uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
        >
          Agregar
        </button>
      </form>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      {!items ? (
        <p className="text-cream-dim text-sm">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-cream-dim text-sm">Sin excepciones registradas.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {items.map((ex) => (
            <li key={ex.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span>
                <span className="text-gold-bright font-mono">{formatDateLabel(ex.date)}</span>{" "}
                {ex.type === "off" ? (
                  <span className="text-danger">— cerrado</span>
                ) : (
                  <span className="text-cream-dim">
                    — especial {ex.startMin != null ? `(${Math.floor(ex.startMin / 60)}:${String(ex.startMin % 60).padStart(2, "0")}–${Math.floor((ex.endMin ?? 0) / 60)}:${String((ex.endMin ?? 0) % 60).padStart(2, "0")})` : ""}
                  </span>
                )}
                {ex.reason && <span className="text-cream-dim"> · {ex.reason}</span>}
                {barberId === "shop" && ex.barber && <span className="text-cream-dim"> · {ex.barber.name}</span>}
              </span>
              <button
                type="button"
                onClick={() => remove(ex.id)}
                className="focus-gold text-xs uppercase tracking-wide px-2 py-1 border border-white/15 text-cream-dim hover:border-danger hover:text-danger"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
