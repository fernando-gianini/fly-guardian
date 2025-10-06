import { Router } from 'express';
import { auth } from '../middleware/auth.fg.js';
import { requireRole } from '../middleware/roles.fg.js';
import { Roles } from '../types/roles.fg.js';
import {
  postTelemetryHandler,
  getLatestTelemetryHandler,
} from '../controllers/telemetry.controller.fg.js';

const router = Router();

router.use(auth);

const writerRoles = [Roles.admin_global, Roles.cliente, Roles.operador];

router.post('/telemetry/:droneId', requireRole(...writerRoles), postTelemetryHandler);
router.get(
  '/telemetry/:droneId/latest',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador, Roles.morador),
  getLatestTelemetryHandler
);

export default router;
