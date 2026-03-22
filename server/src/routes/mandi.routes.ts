import { Router } from 'express';
import { MandiController } from '../controllers/mandi.controller';

const router = Router();

router.get('/prices', MandiController.getPrices);
router.get('/history', MandiController.getHistory);
router.get('/metadata/states', MandiController.getStates);
router.get('/metadata/markets', MandiController.getMarkets);
router.get('/metadata/commodities', MandiController.getCommodities);
router.get('/msp', MandiController.getMSP);
router.get('/arbitrage', MandiController.getArbitrage);
router.get('/navigator', MandiController.getNavigatorDeals);
router.get('/seasonal', MandiController.getSeasonal);

export default router;
