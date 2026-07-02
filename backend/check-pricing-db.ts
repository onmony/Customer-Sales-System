import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking pricing statuses...');
  const pricingStatuses = await prisma.pricingStatus.findMany();
  console.log(JSON.stringify(pricingStatuses, null, 2));

  console.log('\nChecking customers...');
  const customers = await prisma.customer.findMany({ take: 5 });
  console.log(JSON.stringify(customers, null, 2));

  console.log('\nChecking products...');
  const products = await prisma.product.findMany({ take: 5 });
  console.log(JSON.stringify(products, null, 2));

  console.log('\nChecking pricing...');
  const pricing = await prisma.pricing.findMany({ take: 5 });
  console.log(JSON.stringify(pricing, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
