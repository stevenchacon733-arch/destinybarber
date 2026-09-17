"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/lib/format";
import { formatDateLabel } from "@/lib/time";

type Service = {
  id: number;
  name: string;
  description: string | null;
  defaultDurationMin: number;
  price: number;
};
type Barber = {
  id: string;
  name: string;
  specialty: string | null;
  bio: string | null;
  rating: number | null;
  serviceIds: number[];
};
type DayAvail = { date: string; hasSlots: boolean };
type Slot = { time: string; startMin: number; barberId: string; barberName: string };
type BookingResult = {
  id: string;
  code: string;
  date: string;
  startMin: number;
  endMin: number;
  customerName: string;
};

const STEPS = ["Servicio", "Barbero", "Fecha", "Hora", "Tus datos", "Confirmar"];

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className}`} />;
}

export default function BookingWizard() {
  const [step, setStep] = useState(1);

  const [services, setServices] = useState<Service[] | null>(null);
  const [barbers, setBarbers] = useState<Barber[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [barberChoice, setBarberChoice] = useState<string | null>(null); // null = "cualquiera"

  const [days, setDays] = useState<DayAvail[] | null>(null);
  const [daysLoading, setDaysLoading] = useState(false);
  const [date, setDate] = useState<string | null>(null);

  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [chosenSlot, setChosenSlot] = useState<Slot | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/services").then((r) => r.json()), fetch("/api/barbers").then((r) => r.json())])
      .then(([s, b]) => {
        setServices(s.services);
        setBarbers(b.barbers);
      })
      .catch(() => setLoadError("No pudimos cargar los servicios. Intenta recargar la página."));
  }, []);

  const service = useMemo(() => services?.find((s) => s.id === serviceId) ?? null, [services, serviceId]);

  const eligibleBarbers = useMemo(
    () => (barbers ?? []).filter((b) => !serviceId || b.serviceIds.includes(serviceId)),
    [barbers, serviceId],
  );

  // Paso 3: cargar días con disponibilidad al entrar (o cambiar servicio/barbero)
  useEffect(() => {
    if (step !== 3 || !serviceId) return;
    setDaysLoading(true);
    setDate(null);
    const params = new URLSearchParams({ serviceId: String(serviceId) });
    if (barberChoice) params.set("barberId", barberChoice);
    fetch(`/api/availability/days?${params}`)
      .then((r) => r.json())
      .then((d) => setDays(d.days))
      .finally(() => setDaysLoading(false));
  }, [step, serviceId, barberChoice]);

  // Paso 4: cargar horarios al elegir fecha
  useEffect(() => {
    if (step !== 4 || !serviceId || !date) return;
    setSlotsLoading(true);
    setChosenSlot(null);
    const params = new URLSearchParams({ serviceId: String(serviceId), date });
    if (barberChoice) params.set("barberId", barberChoice);
    fetch(`/api/availability?${params}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots))
      .finally(() => setSlotsLoading(false));
  }, [step, serviceId, date, barberChoice]);

  function goNext() {
    setStep((s) => Math.min(6, s + 1));
  }
  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function validateClientInfo(): boolean {
    const errs: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) errs.name = "Escribe tu nombre completo.";
    if (!/^[0-9+()\-\s]{7,20}$/.test(phone.trim())) errs.phone = "Ingresa un teléfono válido.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function confirmBooking() {
    if (!serviceId || !chosenSlot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          barberId: chosenSlot.barberId,
          date,
          time: chosenSlot.time,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "No se pudo confirmar la reserva.");
        return;
      }
      setResult(data.booking);
    } catch {
      setSubmitError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return <p className="text-danger">{loadError}</p>;
  }

  if (result) {
    return <SuccessScreen result={result} service={service} barberName={chosenSlot?.barberName ?? ""} />;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
      <div>
        <StepIndicator step={step} />

        {step === 1 && (
          <StepBlock title="¿Qué servicio quieres reservar?">
            {!services ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setServiceId(s.id);
                      goNext();
                    }}
                    className={`focus-gold text-left p-5 border transition-colors ${
                      serviceId === s.id ? "border-gold bg-gold/5" : "border-white/10 hover:border-gold/60"
                    }`}
                  >
                    <p className="font-display text-xl">{s.name}</p>
                    {s.description && <p className="text-sm text-cream-dim mt-1">{s.description}</p>}
                    <div className="flex justify-between items-center mt-4 font-mono text-sm">
                      <span className="text-cream-dim">{s.defaultDurationMin} min</span>
                      <span className="text-gold-bright text-base">{formatMoney(s.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </StepBlock>
        )}

        {step === 2 && (
          <StepBlock title="Elige a tu barbero">
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setBarberChoice(null);
                  goNext();
                }}
                className={`focus-gold text-left p-5 border transition-colors ${
                  barberChoice === null ? "border-gold bg-gold/5" : "border-white/10 hover:border-gold/60"
                }`}
              >
                <p className="font-display text-lg">Cualquier barbero disponible</p>
                <p className="text-sm text-cream-dim mt-1">La opción más rápida — te asignamos el primer horario libre.</p>
              </button>
              {eligibleBarbers.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBarberChoice(b.id);
                    goNext();
                  }}
                  className={`focus-gold text-left p-5 border transition-colors ${
                    barberChoice === b.id ? "border-gold bg-gold/5" : "border-white/10 hover:border-gold/60"
                  }`}
                >
                  <p className="font-display text-lg">{b.name}</p>
                  {b.specialty && <p className="font-mono text-[0.7rem] tracking-wide uppercase text-gold mt-1">{b.specialty}</p>}
                  {b.bio && <p className="text-sm text-cream-dim mt-2">{b.bio}</p>}
                  {b.rating && <p className="text-xs text-cream-dim mt-2">★ {b.rating.toFixed(1)}</p>}
                </button>
              ))}
            </div>
            <BackButton onClick={goBack} />
          </StepBlock>
        )}

        {step === 3 && (
          <StepBlock title="¿Qué día te viene bien?">
            {daysLoading || !days ? (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {days.map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    disabled={!d.hasSlots}
                    onClick={() => {
                      setDate(d.date);
                      goNext();
                    }}
                    className={`focus-gold font-mono text-center p-3 border transition-colors ${
                      !d.hasSlots
                        ? "border-white/5 text-white/20 cursor-not-allowed"
                        : date === d.date
                          ? "border-gold bg-gold/5"
                          : "border-white/10 hover:border-gold/60"
                    }`}
                  >
                    <span className="block text-[0.65rem] uppercase tracking-wide text-cream-dim">
                      {formatDateLabel(d.date).split(" ")[0]}
                    </span>
                    <span className="block text-lg mt-1">{formatDateLabel(d.date).split(" ")[1]}</span>
                  </button>
                ))}
              </div>
            )}
            <BackButton onClick={goBack} />
          </StepBlock>
        )}

        {step === 4 && (
          <StepBlock title="Horarios disponibles">
            {slotsLoading || !slots ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-20" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <EmptyState text="No hay horarios disponibles este día. Prueba otra fecha." />
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={`${s.time}-${s.barberId}`}
                    type="button"
                    onClick={() => {
                      setChosenSlot(s);
                      goNext();
                    }}
                    className={`focus-gold font-mono text-sm px-4 py-3 border transition-colors ${
                      chosenSlot?.time === s.time && chosenSlot?.barberId === s.barberId
                        ? "border-gold bg-gold/5"
                        : "border-white/10 hover:border-gold/60"
                    }`}
                  >
                    {s.time}
                    {!barberChoice && <span className="block text-[0.6rem] text-cream-dim mt-0.5">{s.barberName}</span>}
                  </button>
                ))}
              </div>
            )}
            <BackButton onClick={goBack} />
          </StepBlock>
        )}

        {step === 5 && (
          <StepBlock title="Tus datos">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre completo" error={fieldErrors.name}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="focus-gold w-full bg-transparent border border-white/15 px-4 py-3 text-cream"
                />
              </Field>
              <Field label="Teléfono" error={fieldErrors.phone}>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+56 9 1234 5678"
                  className="focus-gold w-full bg-transparent border border-white/15 px-4 py-3 text-cream"
                />
              </Field>
              <Field label="Correo (opcional)">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  className="focus-gold w-full bg-transparent border border-white/15 px-4 py-3 text-cream"
                />
              </Field>
              <Field label="Observaciones (opcional)">
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: alergias, referencia de estilo…"
                  className="focus-gold w-full bg-transparent border border-white/15 px-4 py-3 text-cream"
                />
              </Field>
            </div>
            <div className="flex justify-between mt-6">
              <BackButton onClick={goBack} />
              <button
                type="button"
                onClick={() => validateClientInfo() && goNext()}
                className="focus-gold px-8 py-3 bg-gold text-ink font-semibold text-sm uppercase tracking-wide hover:bg-gold-bright transition-colors"
              >
                Continuar
              </button>
            </div>
          </StepBlock>
        )}

        {step === 6 && chosenSlot && service && (
          <StepBlock title="Revisa y confirma">
            <dl className="divide-y divide-white/10 border-y border-white/10 font-mono text-sm">
              <Row label="Servicio" value={service.name} />
              <Row label="Barbero" value={chosenSlot.barberName} />
              <Row label="Fecha" value={date ? formatDateLabel(date) : "—"} />
              <Row label="Hora" value={chosenSlot.time} />
              <Row label="Duración" value={`${service.defaultDurationMin} min`} />
              <Row label="Cliente" value={`${name} · ${phone}`} />
              <Row label="Total" value={formatMoney(service.price)} strong />
            </dl>
            {submitError && <p className="text-danger text-sm mt-4">{submitError}</p>}
            <div className="flex justify-between mt-6">
              <BackButton onClick={goBack} disabled={submitting} />
              <button
                type="button"
                disabled={submitting}
                onClick={confirmBooking}
                className="focus-gold px-8 py-3 bg-gold text-ink font-semibold text-sm uppercase tracking-wide hover:bg-gold-bright transition-colors disabled:opacity-50"
              >
                {submitting ? "Confirmando…" : "Confirmar reserva"}
              </button>
            </div>
          </StepBlock>
        )}
      </div>

      <SummaryCard service={service} barberName={chosenSlot?.barberName ?? null} date={date} time={chosenSlot?.time ?? null} />
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap gap-2 mb-8">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <li key={label} className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-wide">
            <span
              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                done
                  ? "bg-gold border-gold text-ink"
                  : active
                    ? "border-gold text-gold-bright"
                    : "border-white/15 text-cream-dim"
              }`}
            >
              {n}
            </span>
            <span className={active ? "text-cream" : "text-cream-dim"}>{label}</span>
            {n < STEPS.length && <span className="w-4 h-px bg-white/10 ml-1" />}
          </li>
        );
      })}
    </ol>
  );
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl mb-4">{title}</h2>
      {children}
    </div>
  );
}

function BackButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="focus-gold px-6 py-3 border border-white/15 text-sm uppercase tracking-wide hover:border-gold hover:text-gold-bright transition-colors disabled:opacity-50"
    >
      Atrás
    </button>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[0.7rem] uppercase tracking-wide text-cream-dim">{label}</span>
      {children}
      <span className="text-xs text-danger min-h-[1em]">{error}</span>
    </label>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between py-3">
      <span className="text-cream-dim">{label}</span>
      <span className={strong ? "text-gold-bright text-base" : ""}>{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-cream-dim border border-white/10 p-6 text-center">{text}</p>;
}

function SummaryCard({
  service,
  barberName,
  date,
  time,
}: {
  service: Service | null;
  barberName: string | null;
  date: string | null;
  time: string | null;
}) {
  return (
    <aside className="border border-white/10 p-6 sticky top-6 bg-coffee/40">
      <h3 className="font-mono text-[0.7rem] uppercase tracking-wide text-gold-dim mb-4">Tu reserva</h3>
      <dl className="space-y-3 text-sm font-mono">
        <Row label="Servicio" value={service?.name ?? "—"} />
        <Row label="Barbero" value={barberName ?? "—"} />
        <Row label="Fecha" value={date ? formatDateLabel(date) : "—"} />
        <Row label="Hora" value={time ?? "—"} />
        <div className="pt-3 border-t border-white/10 flex justify-between">
          <span className="text-cream-dim">Total</span>
          <span className="text-gold-bright text-lg">{service ? formatMoney(service.price) : "—"}</span>
        </div>
      </dl>
    </aside>
  );
}

function SuccessScreen({
  result,
  service,
  barberName,
}: {
  result: BookingResult;
  service: Service | null;
  barberName: string;
}) {
  return (
    <div className="max-w-lg border border-gold/40 p-8">
      <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold-bright mb-4">✓</div>
      <h2 className="font-display text-2xl mb-2">Gracias, {result.customerName}.</h2>
      <p className="text-cream-dim mb-6">
        Tu reserva <span className="text-gold-bright font-mono">{result.code}</span> quedó pre-agendada.
      </p>
      <dl className="divide-y divide-white/10 border-y border-white/10 font-mono text-sm mb-6">
        <Row label="Servicio" value={service?.name ?? "—"} />
        <Row label="Barbero" value={barberName} />
        <Row label="Fecha" value={formatDateLabel(result.date)} />
      </dl>
      <div className="flex flex-wrap gap-3">
        <a href="/mis-citas" className="focus-gold px-6 py-3 border border-white/15 text-sm uppercase tracking-wide hover:border-gold hover:text-gold-bright transition-colors">
          Ver mis citas
        </a>
        <a href="/" className="focus-gold px-6 py-3 bg-gold text-ink text-sm uppercase tracking-wide font-semibold hover:bg-gold-bright transition-colors">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
