import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/db', (_req: Request, res: Response) => {
  // Database health check will be added when Prisma is configured
  res.json({
    status: 'ok',
    database: 'not configured yet',
  });
});

export default router;
