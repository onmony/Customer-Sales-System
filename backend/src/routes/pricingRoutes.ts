import { Router } from 'express';
import { PricingController } from '../controllers/PricingController';

export function createPricingRoutes(pricingController: PricingController): Router {
  const router = Router();

  // POST /api/pricing - Create pricing
  router.post('/pricing', (req, res) => pricingController.createPricing(req, res));

  // POST /api/pricing/import - Import pricing (placeholder)
  router.post('/pricing/import', (req, res) => pricingController.importPricing(req, res));

  // GET /api/pricing/customer/:customerId/product/:productId - Resolve pricing (must come before /:id)
  router.get('/pricing/customer/:customerId/product/:productId', (req, res) => pricingController.resolvePricing(req, res));

  // GET /api/pricing/history/:customerId/:productId - Get pricing history (must come before /:id)
  router.get('/pricing/history/:customerId/:productId', (req, res) => pricingController.getPricingHistory(req, res));

  // PUT /api/pricing/:id - Update pricing (creates new version)
  router.put('/pricing/:id', (req, res) => pricingController.updatePricing(req, res));

  // GET /api/pricing/:id - Get pricing by ID
  router.get('/pricing/:id', (req, res) => pricingController.getPricing(req, res));

  // GET /api/pricing - List pricing
  router.get('/pricing', (req, res) => pricingController.listPricing(req, res));

  return router;
}
