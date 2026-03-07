import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InventoryService {
  
  /**
   * Get all products for a specific organization
   */
  async getProducts(organizationId: string) {
    return prisma.product.findMany({
      where: { organizationId },
      include: {
        inventories: true // Include stock levels
      },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Get low stock alerts for an organization
   */
  async getLowStock(organizationId: string) {
    // Find products where total inventory quantity is low
    // This is a simplified check. Real logic might be more complex.
    const products = await prisma.product.findMany({
      where: { organizationId },
      include: { inventories: true }
    });

    return products.filter(p => {
      const totalStock = p.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
      return totalStock < 50; // Threshold
    });
  }
}
