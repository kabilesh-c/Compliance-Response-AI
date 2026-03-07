import { PrismaClient, Role, OrganizationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const orgId = '85bd13de-4b92-4951-bdd3-946fa4baa8a7';
  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Seeding Zenith Pharmacy...');

  // 1. Create or Update Organization
  const org = await prisma.organization.upsert({
    where: { id: orgId },
    update: {},
    create: {
      id: orgId,
      name: 'Zenith Pharmacy',
      type: OrganizationType.RETAIL_PHARMACY,
      address: '123 Zenith St, Health City',
      phone: '555-0123',
      email: 'contact@zenith.com'
    }
  });

  console.log('Organization created:', org.name);

  // 2. Create Users
  const users = [
    { email: 'admin@zenith.com', role: Role.ADMIN, name: 'Zenith Admin' },
    { email: 'manager@zenith.com', role: Role.INVENTORY_MANAGER, name: 'Zenith Manager' },
    { email: 'pharmacist@zenith.com', role: Role.PHARMACIST, name: 'Zenith Pharmacist' }
  ];

  for (const u of users) {
    const [firstName, ...lastNameParts] = u.name.split(' ');
    const lastName = lastNameParts.join(' ');

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        passwordHash,
        organizationId: orgId,
        role: u.role
      },
      create: {
        email: u.email,
        passwordHash,
        firstName,
        lastName,
        role: u.role,
        organizationId: orgId
      }
    });
    console.log(`User ${u.email} created/updated.`);
  }

  // 3. Create Products and Inventory
  const products = [
    { name: 'Paracetamol 500mg', generic: 'Paracetamol', manufacturer: 'HealthCorp', category: 'Pain Relief', price: 5.00, cost: 2.50, stock: 500 },
    { name: 'Amoxicillin 250mg', generic: 'Amoxicillin', manufacturer: 'PharmaInc', category: 'Antibiotics', price: 12.50, cost: 8.00, stock: 200 },
    { name: 'Ibuprofen 400mg', generic: 'Ibuprofen', manufacturer: 'HealthCorp', category: 'Pain Relief', price: 6.00, cost: 3.00, stock: 350 },
    { name: 'Cetirizine 10mg', generic: 'Cetirizine', manufacturer: 'AllergySol', category: 'Antihistamine', price: 4.50, cost: 1.50, stock: 150 },
    { name: 'Omeprazole 20mg', generic: 'Omeprazole', manufacturer: 'GastroMed', category: 'Gastrointestinal', price: 8.00, cost: 4.00, stock: 100 },
    { name: 'Metformin 500mg', generic: 'Metformin', manufacturer: 'DiabetCare', category: 'Diabetes', price: 3.00, cost: 1.00, stock: 600 },
    { name: 'Amlodipine 5mg', generic: 'Amlodipine', manufacturer: 'HeartHealth', category: 'Cardiovascular', price: 7.00, cost: 3.50, stock: 400 },
    { name: 'Atorvastatin 10mg', generic: 'Atorvastatin', manufacturer: 'HeartHealth', category: 'Cardiovascular', price: 15.00, cost: 9.00, stock: 300 },
    { name: 'Azithromycin 500mg', generic: 'Azithromycin', manufacturer: 'PharmaInc', category: 'Antibiotics', price: 20.00, cost: 12.00, stock: 80 },
    { name: 'Vitamin C 1000mg', generic: 'Ascorbic Acid', manufacturer: 'VitaLife', category: 'Supplements', price: 10.00, cost: 5.00, stock: 1000 }
  ];

  for (const p of products) {
    // Check if product exists by name for this org
    let product = await prisma.product.findFirst({
      where: { name: p.name, organizationId: orgId }
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: p.name,
          genericName: p.generic,
          manufacturer: p.manufacturer,
          category: p.category,
          organizationId: orgId
        }
      });
    }

    // Check inventory
    const inventory = await prisma.inventory.findFirst({
      where: { productId: product.id, organizationId: orgId }
    });

    if (!inventory) {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          organizationId: orgId,
          quantity: p.stock,
          costPrice: p.cost,
          sellingPrice: p.price,
          batchNumber: `BATCH-${Math.floor(Math.random() * 10000)}`,
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (30 + Math.random() * 365)) // 30 days to 1 year from now
        }
      });
    }
  }

  console.log('Inventory seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
