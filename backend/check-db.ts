import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking tenants...');
  const tenants = await prisma.tenant.findMany();
  console.log(JSON.stringify(tenants, null, 2));

  console.log('\nChecking customer statuses...');
  const statuses = await prisma.customerStatus.findMany();
  console.log(JSON.stringify(statuses, null, 2));

  console.log('\nChecking customers...');
  const customers = await prisma.customer.findMany();
  console.log(JSON.stringify(customers, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
