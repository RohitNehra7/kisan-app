import { Request, Response } from 'express';
import { AdvisoryService } from '../services/advisory.service';

export class AdvisoryController {
  static async getRecommendation(req: Request, res: Response) {
    try {
      const { crop, quantity, district, storageCostPerDay, urgency } = req.body;
      
      if (!crop || !district) {
        return res.status(400).json({ error: 'Crop and District are required' });
      }

      const recommendation = await AdvisoryService.getRecommendation(
        crop,
        quantity || 50,
        district,
        storageCostPerDay || 0.5,
        urgency || 'flexible'
      );

      res.json({ success: true, data: recommendation });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async analyzeDisease(req: Request, res: Response) {
    try {
      const { image, crop } = req.body;
      if (!image) return res.status(400).json({ error: 'Image is required' });

      const data = await AdvisoryService.analyzePlantDisease(image, crop);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
