import { Router } from 'express';
import { MLController } from '../controllers/ml.controller';

const router = Router();
const mlController = new MLController();

// Demand Forecasting
router.post('/forecast', mlController.getDemandForecast);

// Inventory Optimization
router.get('/inventory/optimize/:medicineId', mlController.optimizeInventory);

// Expiry Prediction
router.get('/expiry/predict/:medicineId', mlController.predictExpiryRisk);

export default router;
