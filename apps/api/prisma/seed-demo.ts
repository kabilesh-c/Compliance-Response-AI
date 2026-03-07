import { PrismaClient, Role, OrganizationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Demo Data (Retail & Hospital)...');

  // --- 1. Retail Pharmacy Setup ---
  const retailOrgId = '11111111-1111-1111-1111-111111111111'; // Fixed UUID for consistency
  const retailOrg = await prisma.organization.upsert({
    where: { id: retailOrgId },
    update: {},
    create: {
      id: retailOrgId,
      name: 'Demo Retail Pharmacy',
      type: OrganizationType.RETAIL_PHARMACY,
      address: '123 Market St',
      phone: '555-0001'
    }
  });
  console.log('Retail Org created:', retailOrg.name);

  // Retail Users
  const retailUsers = [
    { email: 'admin@pharmacy.com', password: 'admin123', role: Role.ADMIN, name: 'Retail Admin' },
    { email: 'manager@pharmacy.com', password: 'manager123', role: Role.INVENTORY_MANAGER, name: 'Retail Manager' },
    { email: 'pharmacist@pharmacy.com', password: 'pharmacist123', role: Role.PHARMACIST, name: 'Retail Pharmacist' }
  ];

  for (const u of retailUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const [firstName, ...lastNameParts] = u.name.split(' ');
    
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash, role: u.role, organizationId: retailOrgId },
      create: {
        email: u.email,
        passwordHash,
        firstName,
        lastName: lastNameParts.join(' '),
        role: u.role,
        organizationId: retailOrgId
      }
    });
    console.log(`User ${u.email} created.`);
  }

  // --- 2. Hospital Setup ---
  const hospitalOrgId = '22222222-2222-2222-2222-222222222222';
  const hospitalOrg = await prisma.organization.upsert({
    where: { id: hospitalOrgId },
    update: {},
    create: {
      id: hospitalOrgId,
      name: 'City General Hospital',
      type: OrganizationType.HOSPITAL,
      address: '456 Health Ave',
      phone: '555-0002'
    }
  });
  console.log('Hospital Org created:', hospitalOrg.name);

  // Hospital Users
  const hospitalUsers = [
    { email: 'admin@hospital.com', password: 'admin123', role: Role.ADMIN, name: 'Hospital Admin' },
    { email: 'manager@hospital.com', password: 'manager123', role: Role.INVENTORY_MANAGER, name: 'Hospital Manager' },
    { email: 'staff@hospital.com', password: 'staff123', role: Role.PHARMACIST, name: 'Hospital Staff' } // Mapping Staff to Pharmacist role for now
  ];

  for (const u of hospitalUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const [firstName, ...lastNameParts] = u.name.split(' ');

    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash, role: u.role, organizationId: hospitalOrgId },
      create: {
        email: u.email,
        passwordHash,
        firstName,
        lastName: lastNameParts.join(' '),
        role: u.role,
        organizationId: hospitalOrgId
      }
    });
    console.log(`User ${u.email} created.`);
  }

  // --- 3. Seed Inventory for Both ---
  const commonProducts = [
    { name: 'Paracetamol 500mg', generic: 'Paracetamol', category: 'Pain Relief', price: 5.00, stock: 500 },
    { name: 'Amoxicillin 250mg', generic: 'Amoxicillin', category: 'Antibiotics', price: 12.50, stock: 200 },
    { name: 'Ibuprofen 400mg', generic: 'Ibuprofen', category: 'Pain Relief', price: 6.00, stock: 350 },
    { name: 'Cetirizine 10mg', generic: 'Cetirizine', category: 'Antihistamine', price: 4.50, stock: 150 },
    { name: 'Vitamin C 1000mg', generic: 'Ascorbic Acid', category: 'Supplements', price: 10.00, stock: 1000 }
  ];

  const orgs = [retailOrgId, hospitalOrgId];

  for (const orgId of orgs) {
    for (const p of commonProducts) {
      // Create Product
      let product = await prisma.product.findFirst({
        where: { name: p.name, organizationId: orgId }
      });

      if (!product) {
        product = await prisma.product.create({
          data: {
            name: p.name,
            genericName: p.generic,
            category: p.category,
            organizationId: orgId
          }
        });
      }

      // Create Inventory
      const inventory = await prisma.inventory.findFirst({
        where: { productId: product.id, organizationId: orgId }
      });

      if (!inventory) {
        await prisma.inventory.create({
          data: {
            productId: product.id,
            organizationId: orgId,
            quantity: p.stock,
            costPrice: p.price * 0.6,
            sellingPrice: p.price,
            batchNumber: `DEMO-${Math.floor(Math.random() * 1000)}`,
            expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180) // 6 months
          }
        });
      }
    }
  }
  console.log('Inventory seeded for Demo Orgs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
