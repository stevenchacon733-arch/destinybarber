"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/format";
import { fromMin, todayISO } from "@/lib/time";

type Booking = {
  id: string;
  code: string;
  date: string;
  startMin: number;
  status: string;
  customerName: string;
  customerPhone: string;
  service: { name: string; price: number };
  barber: { id: string; name: string };
};
type Barber = { id: string; name: string };

const STATUSES = ["PENDING", "CONFIRMED", "ARRIVED", "IN_SERVICE", "DONE", "CANCELLED", "NO_SHOW"] as const;
const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  ARRIVED: "Cliente llegó",
  IN_SERVICE: "En servicio",
  DONE: "Finalizada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};
const STATUS_DOT: Record<string, string> = {
  PENDING: "bg-cream-dim",
  CONFIRMED: "bg-gold",
  ARRIVED: "bg-success",
  IN_SERVICE: "bg-success",
  DONE: "bg-white/30",
  CANCELLED: "bg-danger",
  NO_SHOW: "bg-danger",
};

export default function CitasTable() {
  const [date, setDate] = useState(todayISO());
  const [barberId, setBarberId] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/barbers")
      .then((r) => r.json())
      .then((d) => setBarbers(d.barbers));
  }, []);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (barberId) params.set("barberId", barberId);
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/bookings?${params}`);
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, barberId, status]);

  async function updateStatus(id: string, newStatus: string) {
    setSavingId(id);
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setBookings((prev) => prev?.map((b) => (b.id === id ? { ...b, status: newStatus } : b)) ?? null);
    }
    setSavingId(null);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="focus-gold bg-transparent border border-white/15 px-3 py-2 text-sm"
        />
        <select
          value={barberId}
          onChange={(e) => setBarberId(e.target.value)}
          className="focus-gold bg-ink border border-white/15 px-3 py-2 text-sm"
        >
          <option value="">Todos los barberos</option>
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="focus-gold bg-ink border border-white/15 px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar cliente, teléfono o código…"
          className="focus-gold bg-transparent border border-white/15 px-3 py-2 text-sm flex-1 min-w-[180px]"
        />
        <button
          type="submit"
          className="focus-gold px-4 py-2 bg-gold text-ink text-xs uppercase tracking-wide font-semibold hover:bg-gold-bright transition-colors"
        >
          Filtrar
        </button>
      </form>

      {loading || !bookings ? (
        <p className="text-cream-dim">Cargando…</p>
      ) : bookings.length === 0 ? (
        <p className="text-cream-dim border border-white/10 p-6 text-center">No hay citas con esos filtros.</p>
      ) : (
        <div className="border border-white/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-white/10 text-left font-mono text-[0.65rem] uppercase tracking-wide text-cream-dim">
                <th className="p-3">Hora</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Servicio</th>
                <th className="p-3">Barbero</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-3 font-mono text-gold-bright">{fromMin(b.startMin)}</td>
                  <td className="p-3">
                    <p>{b.customerName}</p>
                    <p className="text-xs text-cream-dim">{b.customerPhone}</p>
                  </td>
                  <td className="p-3">{b.service.name}</td>
                  <td className="p-3">{b.barber.name}</td>
                  <td className="p-3 font-mono">{formatMoney(b.service.price)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[b.status]}`} />
                      <select
                        value={b.status}
                        disabled={savingId === b.id}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="focus-gold bg-ink border border-white/15 px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
