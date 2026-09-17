"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { formatDateLabel, fromMin } from "@/lib/time";

type Booking = {
  id: string;
  code: string;
  date: string;
  startMin: number;
  status: string;
  customerPhone: string;
  service: { name: string; price: number };
  barber: { name: string };
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  ARRIVED: "Cliente llegó",
  IN_SERVICE: "En servicio",
  DONE: "Finalizada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-cream-dim border-white/20",
  CONFIRMED: "text-gold-bright border-gold/50",
  ARRIVED: "text-success border-success/50",
  IN_SERVICE: "text-success border-success/50",
  DONE: "text-cream-dim border-white/20",
  CANCELLED: "text-danger border-danger/40",
  NO_SHOW: "text-danger border-danger/40",
};

export default function MisCitasPage() {
  const [mode, setMode] = useState<"code" | "phone">("phone");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setBookings(null);
    const params = new URLSearchParams(mode === "code" ? { code: query.trim() } : { phone: query.trim() });
    const res = await fetch(`/api/bookings/lookup?${params}`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "No pudimos buscar tu reserva.");
      return;
    }
    if (data.bookings.length === 0) {
      setError("No encontramos citas con esos datos.");
      return;
    }
    setBookings(data.bookings);
  }

  async function cancelBooking(booking: Booking) {
    setCancelling(true);
    const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: booking.customerPhone }),
    });
    const data = await res.json();
    setCancelling(false);
    setCancelId(null);
    if (!res.ok) {
      setError(data.error ?? "No se pudo cancelar.");
      return;
    }
    setBookings((prev) => prev?.map((b) => (b.id === booking.id ? { ...b, status: "CANCELLED" } : b)) ?? null);
  }

  return (
    <main className="flex-1 px-4 sm:px-8 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-3">Destiny Barber</p>
        <h1 className="font-display text-3xl sm:text-5xl mb-8">Mis citas</h1>

        <div className="flex gap-2 mb-4 font-mono text-xs uppercase tracking-wide">
          <button
            type="button"
            onClick={() => setMode("phone")}
            className={`focus-gold px-4 py-2 border ${mode === "phone" ? "border-gold text-gold-bright" : "border-white/15 text-cream-dim"}`}
          >
            Por teléfono
          </button>
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`focus-gold px-4 py-2 border ${mode === "code" ? "border-gold text-gold-bright" : "border-white/15 text-cream-dim"}`}
          >
            Por código
          </button>
        </div>

        <form onSubmit={search} className="flex gap-3 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === "phone" ? "+56 9 1234 5678" : "DB-12345"}
            className="focus-gold flex-1 bg-transparent border border-white/15 px-4 py-3 text-cream"
          />
          <button
            type="submit"
            disabled={loading}
            className="focus-gold px-6 py-3 bg-gold text-ink font-semibold text-sm uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
          >
            {loading ? "Buscando…" : "Buscar"}
          </button>
        </form>

        {error && <p className="text-danger mb-6">{error}</p>}

        {bookings && (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li key={b.id} className="border border-white/10 p-5">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="font-display text-xl">{b.service.name}</p>
                    <p className="text-sm text-cream-dim mt-1">
                      {formatDateLabel(b.date)} · {fromMin(b.startMin)} · {b.barber.name}
                    </p>
                    <p className="font-mono text-xs text-cream-dim mt-1">{b.code}</p>
                  </div>
                  <span className={`font-mono text-[0.65rem] uppercase tracking-wide px-2 py-1 border ${STATUS_COLOR[b.status]}`}>
                    {STATUS_LABEL[b.status] ?? b.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-mono text-sm text-gold-bright">{formatMoney(b.service.price)}</span>
                  {["PENDING", "CONFIRMED"].includes(b.status) &&
                    (cancelId === b.id ? (
                      <div className="flex gap-2">
                        <span className="text-sm text-cream-dim self-center">¿Cancelar esta cita?</span>
                        <button
                          type="button"
                          disabled={cancelling}
                          onClick={() => cancelBooking(b)}
                          className="focus-gold text-xs uppercase tracking-wide px-3 py-2 border border-danger text-danger"
                        >
                          Sí, cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelId(null)}
                          className="focus-gold text-xs uppercase tracking-wide px-3 py-2 border border-white/15 text-cream-dim"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCancelId(b.id)}
                        className="focus-gold text-xs uppercase tracking-wide px-3 py-2 border border-white/15 text-cream-dim hover:border-danger hover:text-danger"
                      >
                        Cancelar
                      </button>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
