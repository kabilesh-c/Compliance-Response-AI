import { Request, Response } from 'express';
import { MLService } from '../services/ml.service';

const mlService = new MLService();

export class MLController {
  
  async getDemandForecast(req: Request, res: Response) {
    try {
      const periods = req.body.periods ? parseInt(req.body.periods) : 30;
      const result = await mlService.getDemandForecast(periods);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async optimizeInventory(req: Request, res: Response) {
    try {
      const { medicineId } = req.params;
      if (!medicineId) {
        return res.status(400).json({ error: 'Medicine ID is required' });
      }
      const result = await mlService.optimizeInventory(medicineId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async predictExpiryRisk(req: Request, res: Response) {
    try {
      const { medicineId } = req.params;
      if (!medicineId) {
        return res.status(400).json({ error: 'Medicine ID is required' });
      }
      const result = await mlService.predictExpiryRisk(medicineId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
