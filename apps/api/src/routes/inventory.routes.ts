import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const inventoryController = new InventoryController();

router.use(authenticateToken);

router.get('/', inventoryController.getProducts);
router.get('/low-stock', inventoryController.getLowStock);

export default router;
