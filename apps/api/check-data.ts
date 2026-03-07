import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const orgId = '85bd13de-4b92-4951-bdd3-946fa4baa8a7';
  
  console.log('Checking data for Org:', orgId);

  const products = await prisma.product.findMany({
    where: { organizationId: orgId },
    include: { inventories: true }
  });

  console.log(`Found ${products.length} products.`);
  
  if (products.length > 0) {
    console.log('First product:', JSON.stringify(products[0], null, 2));
  } else {
    console.log('No products found!');
  }

  const users = await prisma.user.findMany({
    where: { organizationId: orgId }
  });
  console.log(`Found ${users.length} users.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
