"use client";

import { useEffect, useState } from "react";
import { fromMin, toMin } from "@/lib/time";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

type Row = { open: boolean; start: string; end: string };
type ApiHour = { weekday: number; startMin: number; endMin: number };

export default function WeeklyHoursEditor({ endpoint, title }: { endpoint: string; title: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        const byDay = new Map<number, ApiHour>((data.hours as ApiHour[]).map((h) => [h.weekday, h]));
        const next: Row[] = Array.from({ length: 7 }, (_, weekday) => {
          const h = byDay.get(weekday);
          return h
            ? { open: true, start: fromMin(h.startMin), end: fromMin(h.endMin) }
            : { open: false, start: "10:00", end: "20:00" };
        });
        setRows(next);
      });
  }, [endpoint]);

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((prev) => prev && prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function save() {
    if (!rows) return;
    setSaving(true);
    setError(null);
    const hours = rows
      .map((r, weekday) => ({ weekday, open: r.open, startMin: toMin(r.start), endMin: toMin(r.end) }))
      .filter((r) => r.open)
      .map(({ weekday, startMin, endMin }) => ({ weekday, startMin, endMin }));

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar.");
      return;
    }
    setSavedAt(Date.now());
  }

  if (!rows) return <p className="text-cream-dim">Cargando horario…</p>;

  return (
    <div className="border border-white/10 p-5">
      <h3 className="font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim mb-4">{title}</h3>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 w-32 text-sm">
              <input type="checkbox" checked={r.open} onChange={(e) => updateRow(i, { open: e.target.checked })} />
              {DAYS[i]}
            </label>
            {r.open ? (
              <>
                <input
                  type="time"
                  value={r.start}
                  onChange={(e) => updateRow(i, { start: e.target.value })}
                  className="focus-gold bg-transparent border border-white/15 px-2 py-1 text-sm"
                />
                <span className="text-cream-dim text-sm">a</span>
                <input
                  type="time"
                  value={r.end}
                  onChange={(e) => updateRow(i, { end: e.target.value })}
                  className="focus-gold bg-transparent border border-white/15 px-2 py-1 text-sm"
                />
              </>
            ) : (
              <span className="text-cream-dim text-sm">Cerrado</span>
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-danger text-sm mt-3">{error}</p>}
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="focus-gold px-5 py-2 bg-gold text-ink text-xs font-semibold uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar horario"}
        </button>
        {savedAt && <span className="text-success text-xs">Guardado ✓</span>}
      </div>
    </div>
  );
}
