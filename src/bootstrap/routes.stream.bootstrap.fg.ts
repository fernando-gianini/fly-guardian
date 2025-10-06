import { Router } from 'express';
import opsRoutes from './routes.ops.bootstrap.fg.js';
import streamRoutes from '../routes/stream.routes.fg.js';
import telemetryRoutes from '../routes/telemetry.routes.fg.js';

const router = Router();

router.use(opsRoutes);
router.use(streamRoutes);
router.use(telemetryRoutes);

export default router;

