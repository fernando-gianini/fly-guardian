import { Router } from 'express';
import coreRoutes from '../routes/index.fg.js';
import authRoutes from '../routes/auth.routes.fg.js';

const router = Router();

router.use(coreRoutes);
router.use(authRoutes);

export default router;
