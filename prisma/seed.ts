import { PrismaClient } from "@prisma/client";
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

  const serviceRecords = [];
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

  const barberRecords = [];
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
