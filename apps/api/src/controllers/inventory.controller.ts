import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { AuthRequest } from '../middleware/auth.middleware';

const inventoryService = new InventoryService();

export class InventoryController {
  
  async getProducts(req: Request, res: Response) {
    try {
      const user = (req as AuthRequest).user;
      // Fallback to Zenith ID if not found (FOR DEMO ONLY)
      const organizationId = user?.organizationId || req.query.organizationId as string || '85bd13de-4b92-4951-bdd3-946fa4baa8a7';

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is required' });
      }

      console.log(`Fetching products for Org: ${organizationId}`);
      const products = await inventoryService.getProducts(organizationId);
      console.log(`Found ${products.length} products`);
      
      res.json(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getLowStock(req: Request, res: Response) {
    try {
      const user = (req as AuthRequest).user;
      const organizationId = user?.organizationId || req.query.organizationId as string;

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is required' });
      }
      const alerts = await inventoryService.getLowStock(organizationId);
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
