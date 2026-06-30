import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test tenant...');
  const tenant = await prisma.tenant.create({
    data: {
      id: 'test-tenant-1',
      name: 'Test Tenant',
      subdomain: 'test',
      isActive: true,
    },
  });
  console.log('Created tenant:', JSON.stringify(tenant, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
