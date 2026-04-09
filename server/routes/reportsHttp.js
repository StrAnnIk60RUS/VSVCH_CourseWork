import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    route: 'reportsHttp',
    message: 'Temporary stub route. Implement endpoint handlers.'
  });
});

export default router;
