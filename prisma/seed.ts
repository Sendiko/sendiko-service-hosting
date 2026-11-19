import { PrismaClient } from "../lib/generated/prisma/client";
import { adminSeed, clientSeed, customerSeed, packageSeed } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.admin.upsert({
    where: { id: adminSeed.id },
    update: { name: adminSeed.name, email: adminSeed.email, role: adminSeed.role },
    create: adminSeed,
  });

  for (const item of customerSeed) {
    await prisma.customer.upsert({
      where: { id: item.id },
      update: { name: item.name, email: item.email, password: item.password },
      create: {
        id: item.id,
        name: item.name,
        email: item.email,
        password: item.password,
      },
    });
  }

  for (const item of packageSeed) {
    await prisma.package.upsert({ where: { id: item.id }, update: item, create: item });
  }

  for (const item of clientSeed) {
    await prisma.client.upsert({ where: { id: item.id }, update: item, create: item });
  }

  console.log(`Seeded ${customerSeed.length} customers, ${packageSeed.length} packages, and ${clientSeed.length} clients.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
