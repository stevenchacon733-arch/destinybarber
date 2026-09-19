import WeeklyHoursEditor from "../WeeklyHoursEditor";
import ExceptionsManager from "../ExceptionsManager";

export const metadata = { title: "Horario del local — Panel Destiny Barber" };

export default function HorarioPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Horario del local</h1>
      <p className="text-cream-dim mb-8 max-w-[60ch]">
        Este es el horario por defecto. Un barbero sin horario propio configurado usa este. Los feriados o cierres
        excepcionales de acá abajo aplican a todos los barberos.
      </p>
      <div className="grid lg:grid-cols-2 gap-6">
        <WeeklyHoursEditor endpoint="/api/admin/shop-hours" title="Horario semanal general" />
        <ExceptionsManager barberId="shop" title="Feriados y cierres excepcionales" />
      </div>
    </div>
  );
}
