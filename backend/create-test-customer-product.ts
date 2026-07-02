import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test customer...');
  const customer = await prisma.customer.create({
    data: {
      tenantId: 'test-tenant-1',
      displayName: 'Test Customer for Pricing',
      gstNumber: '27ABCDE9999F1Z5',
      creditLimit: 50000,
      statusId: '533a6b28-0c79-40ee-8946-22abe090b53c',
      createdBy: 'test-user',
    },
  });
  console.log('Created customer:', JSON.stringify(customer, null, 2));

  console.log('\nCreating test product...');
  const product = await prisma.product.create({
    data: {
      tenantId: 'test-tenant-1',
      displayName: 'Test Product for Pricing',
      sku: 'SKU-PRICING-TEST',
      unit: 'PCS',
      isActive: true,
      createdBy: 'test-user',
    },
  });
  console.log('Created product:', JSON.stringify(product, null, 2));

  console.log('\nCustomer ID:', customer.id);
  console.log('Product ID:', product.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
