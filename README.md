# Destiny Barber — Sistema de reservas

App de reservas y panel administrativo para Destiny Barber. Next.js (App Router) + Prisma + SQLite en desarrollo local.

## Desarrollo local

```bash
npm install
npm run db:migrate   # crea/actualiza la base local (prisma/dev.db)
npm run db:seed      # datos de ejemplo: servicios, barberos, admin
npm run dev
```

- Reserva pública: http://localhost:3000/reservar
- Mis citas: http://localhost:3000/mis-citas
- Panel del dueño: http://localhost:3000/admin (login: `admin@destinybarber.com` / `Destiny2026!` — cámbialo antes de producción)
- Editor visual de la base de datos: `npm run db:studio`

## Desplegar en Vercel

**SQLite no sirve en Vercel** (su filesystem es efímero). Antes de desplegar:

1. Importa este repo en Vercel (New Project → Import from GitHub).
2. En el proyecto de Vercel, agrega una base de datos Postgres (integración "Storage → Postgres" de Vercel, o Neon) — esto inyecta `DATABASE_URL` automáticamente en las variables de entorno.
3. Cambia `prisma/schema.prisma`: `provider = "postgresql"` (el modelo de datos ya es compatible, no requiere cambios de tipos).
4. Corre `npx prisma migrate deploy` contra esa base (localmente, apuntando `DATABASE_URL` a la Postgres real, o desde un build step de Vercel).
5. En Vercel, agrega también la variable de entorno `SESSION_SECRET` (genera una nueva, no reutilices la de `.env` local) y `TZ=America/Santiago` (o la zona horaria real del local) para que "hoy" y los horarios se calculen correctamente en el servidor.
6. Vuelve a correr `npm run db:seed` apuntando a la base de producción para crear el primer usuario admin (o créalo manualmente).

## Estructura

- `prisma/schema.prisma` — modelo de datos (servicios, barberos, horarios, excepciones, bloqueos, citas, clientes, configuración).
- `src/lib/availability.ts` — motor de disponibilidad (cruza horario del local, del barbero, duración del servicio, citas existentes y bloqueos; nunca permite doble reserva).
- `src/lib/auth.ts`, `src/proxy.ts` — sesión de administrador (cookie firmada) y protección de rutas `/admin/*`.
- `src/app/reservar` — asistente de reserva de 6 pasos (cliente).
- `src/app/mis-citas` — consulta/cancelación por teléfono o código (cliente).
- `src/app/admin` — dashboard y gestión de citas (dueño).
