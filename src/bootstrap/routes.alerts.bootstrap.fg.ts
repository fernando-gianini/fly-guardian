import { Router } from 'express';
import streamRoutes from './routes.stream.bootstrap.fg.js';
import alertRoutes from '../routes/alert.routes.fg.js';

const router = Router();

router.use(streamRoutes);
router.use(alertRoutes);

export default router;
