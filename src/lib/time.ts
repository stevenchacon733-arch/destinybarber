/**
 * Todo el motor de disponibilidad trabaja con fechas "YYYY-MM-DD" (día de
 * calendario del local, sin hora) y minutos-desde-medianoche (enteros).
 * Nunca se usan objetos Date con offset UTC para la lógica de horarios —
 * así se evitan los errores de zona horaria que cambian el día o la hora
 * al cruzar medianoche en UTC.
 *
 * "Hoy" y "ahora" (todayISO/nowMinInDay) se calculan explícitamente en la
 * zona horaria del local vía Intl, en vez de depender de la zona horaria
 * del proceso del servidor: Vercel no deja fijar la variable TZ (nombre
 * reservado) y corre en UTC, así que confiar en new Date().getHours()
 * daría la hora equivocada en producción.
 */
const SHOP_TZ = "America/Santiago";

function shopParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: SHOP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;
  return parts;
}

export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMin(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseISO(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  return { y, m, d };
}

export function weekdayOfISO(dateISO: string): number {
  const { y, m, d } = parseISO(dateISO);
  return new Date(y, m - 1, d).getDay();
}

export function todayISO(): string {
  const p = shopParts(new Date());
  return `${p.year}-${p.month}-${p.day}`;
}

export function addDaysISO(dateISO: string, days: number): string {
  const { y, m, d } = parseISO(dateISO);
  const dt = new Date(y, m - 1, d + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export function daysBetweenISO(a: string, b: string): number {
  const pa = parseISO(a);
  const pb = parseISO(b);
  const da = Date.UTC(pa.y, pa.m - 1, pa.d);
  const db = Date.UTC(pb.y, pb.m - 1, pb.d);
  return Math.round((db - da) / 86400000);
}

export function nowMinInDay(): number {
  const p = shopParts(new Date());
  return Number(p.hour) * 60 + Number(p.minute);
}

const WEEKDAY_LABEL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_LABEL = [
  "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic",
];

export function formatDateLabel(dateISO: string): string {
  const { m, d } = parseISO(dateISO);
  return `${WEEKDAY_LABEL[weekdayOfISO(dateISO)]} ${d} ${MONTH_LABEL[m - 1]}`;
}
