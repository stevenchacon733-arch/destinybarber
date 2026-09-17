/**
 * Todo el motor de disponibilidad trabaja con fechas "YYYY-MM-DD" (día de
 * calendario del local, sin hora) y minutos-desde-medianoche (enteros).
 * Nunca se usan objetos Date con offset UTC para la lógica de horarios —
 * así se evitan los errores de zona horaria que cambian el día o la hora
 * al cruzar medianoche en UTC. El servidor debe correr con TZ configurado
 * a la zona horaria real del local (variable de entorno TZ, ej.
 * "America/Santiago") para que "hoy" y "ahora" sean correctos.
 */

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
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
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
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

const WEEKDAY_LABEL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_LABEL = [
  "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic",
];

export function formatDateLabel(dateISO: string): string {
  const { m, d } = parseISO(dateISO);
  return `${WEEKDAY_LABEL[weekdayOfISO(dateISO)]} ${d} ${MONTH_LABEL[m - 1]}`;
}
