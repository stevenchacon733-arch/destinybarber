import { PrismaClient } from "@prisma/client";
import type { Service, Barber, Client } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MIN = (h: number, m = 0) => h * 60 + m;

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      shopName: "Destiny Barber",
      phone: "+56900000000",
      whatsapp: "+56900000000",
      address: "Av. Providencia 1234, Local 3, Santiago",
      instagram: "@destinybarber",
      currency: "CLP",
      slotIntervalMin: 15,
      bufferMin: 5,
      minLeadHours: 1,
      maxAdvanceDays: 30,
      cancelWindowHours: 2,
    },
  });

  // Horario general del local: Lun-Vie 10:00-20:00, Sáb 09:00-18:00, Dom cerrado.
  const shopHours: { weekday: number; startMin: number; endMin: number }[] = [1, 2, 3, 4, 5].map((weekday) => ({
    weekday,
    startMin: MIN(10),
    endMin: MIN(20),
  }));
  shopHours.push({ weekday: 6, startMin: MIN(9), endMin: MIN(18) });

  await prisma.workingHours.deleteMany({ where: { barberId: null } });
  await prisma.workingHours.createMany({
    data: shopHours.map((h) => ({ ...h, barberId: null })),
  });

  const services = [
    { name: "Corte Clásico", description: "Tijera y navaja sobre un corte atemporal, acabado con toalla caliente.", defaultDurationMin: 45, price: 18000, sortOrder: 1 },
    { name: "Fade / Degradado", description: "Degradado preciso a máquina, de piel a textura, ajustado a tu estilo.", defaultDurationMin: 40, price: 20000, sortOrder: 2 },
    { name: "Corte + Barba", description: "El clásico completo: corte de autor y barba perfilada a navaja.", defaultDurationMin: 60, price: 28000, sortOrder: 3 },
    { name: "Perfilado de Barba", description: "Diseño y perfilado a navaja con toalla caliente y aceites esenciales.", defaultDurationMin: 30, price: 15000, sortOrder: 4 },
    { name: "Servicio Premium", description: "Corte, barba, tratamiento capilar y ritual de navaja completo.", defaultDurationMin: 90, price: 42000, sortOrder: 5 },
  ];

  const serviceRecords: Service[] = [];
  for (const s of services) {
    const rec = await prisma.service.upsert({
      where: { id: services.indexOf(s) + 1 },
      update: s,
      create: s,
    });
    serviceRecords.push(rec);
  }

  const barbers = [
    { name: "Mateo Rivas", specialty: "Especialista en fades", bio: "Diez años definiendo líneas limpias y degradados de precisión.", sortOrder: 1 },
    { name: "Julián Torres", specialty: "Barba y navaja", bio: "Formado en barbería clásica; maestro de la toalla caliente.", sortOrder: 2 },
    { name: "Simón Vega", specialty: "Cortes de autor", bio: "Cortes a medida para rostros y estilos de vida distintos.", sortOrder: 3 },
    { name: "Noah Dumas", specialty: "Color y textura", bio: "Especialista en canas, textura y acabados mate.", sortOrder: 4 },
  ];

  const barberRecords: Barber[] = [];
  for (const b of barbers) {
    const existing = await prisma.barber.findFirst({ where: { name: b.name } });
    const rec = existing
      ? await prisma.barber.update({ where: { id: existing.id }, data: b })
      : await prisma.barber.create({ data: b });
    barberRecords.push(rec);
  }

  // Todos los barberos hacen todos los servicios a la duración/precio por defecto (se puede ajustar desde el panel admin).
  for (const barber of barberRecords) {
    for (const service of serviceRecords) {
      await prisma.barberService.upsert({
        where: { barberId_serviceId: { barberId: barber.id, serviceId: service.id } },
        update: {},
        create: { barberId: barber.id, serviceId: service.id },
      });
    }
  }

  // Citas de ejemplo para que el panel no se vea vacío en una demo.
  function isoDaysFromNow(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }
  const svc = (name: string) => serviceRecords.find((s) => s.name === name)!;
  const brb = (name: string) => barberRecords.find((b) => b.name === name)!;

  const demoClients = [
    { phone: "+56911111111", name: "Andrés Muñoz", email: null },
    { phone: "+56922222222", name: "Felipe Rojas", email: null },
    { phone: "+56933333333", name: "Diego Salas", email: null },
    { phone: "+56944444444", name: "Camilo Vera", email: null },
    { phone: "+56955555555", name: "Ignacio Prat", email: null },
  ];
  const clientRecords: Client[] = [];
  for (const c of demoClients) {
    const rec = await prisma.client.upsert({ where: { phone: c.phone }, update: {}, create: c });
    clientRecords.push(rec);
  }

  const demoBookings: {
    date: string;
    startMin: number;
    service: ReturnType<typeof svc>;
    barber: ReturnType<typeof brb>;
    client: (typeof clientRecords)[number];
    status: "DONE" | "CONFIRMED" | "PENDING" | "CANCELLED";
  }[] = [
    { date: isoDaysFromNow(0), startMin: MIN(10), service: svc("Corte Clásico"), barber: brb("Mateo Rivas"), client: clientRecords[0], status: "DONE" },
    { date: isoDaysFromNow(0), startMin: MIN(11, 30), service: svc("Fade / Degradado"), barber: brb("Julián Torres"), client: clientRecords[1], status: "DONE" },
    { date: isoDaysFromNow(0), startMin: MIN(14), service: svc("Corte + Barba"), barber: brb("Simón Vega"), client: clientRecords[2], status: "CONFIRMED" },
    { date: isoDaysFromNow(0), startMin: MIN(16, 30), service: svc("Perfilado de Barba"), barber: brb("Mateo Rivas"), client: clientRecords[3], status: "PENDING" },
    { date: isoDaysFromNow(1), startMin: MIN(10, 30), service: svc("Servicio Premium"), barber: brb("Noah Dumas"), client: clientRecords[4], status: "CONFIRMED" },
    { date: isoDaysFromNow(1), startMin: MIN(15), service: svc("Fade / Degradado"), barber: brb("Julián Torres"), client: clientRecords[0], status: "CONFIRMED" },
    { date: isoDaysFromNow(2), startMin: MIN(12), service: svc("Corte Clásico"), barber: brb("Simón Vega"), client: clientRecords[1], status: "PENDING" },
    { date: isoDaysFromNow(-1), startMin: MIN(17), service: svc("Corte + Barba"), barber: brb("Mateo Rivas"), client: clientRecords[2], status: "CANCELLED" },
  ];

  for (const b of demoBookings) {
    const exists = await prisma.booking.findFirst({
      where: { date: b.date, startMin: b.startMin, barberId: b.barber.id },
    });
    if (exists) continue;
    await prisma.booking.create({
      data: {
        code: "DB-" + Math.floor(10000 + Math.random() * 89999),
        date: b.date,
        startMin: b.startMin,
        endMin: b.startMin + (b.service.defaultDurationMin as number),
        status: b.status,
        serviceId: b.service.id,
        barberId: b.barber.id,
        clientId: b.client.id,
        customerName: b.client.name,
        customerPhone: b.client.phone,
      },
    });
  }

  const adminEmail = "admin@destinybarber.com";
  const adminPassword = "Destiny2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Dueño" },
  });

  console.log("Seed listo.");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
