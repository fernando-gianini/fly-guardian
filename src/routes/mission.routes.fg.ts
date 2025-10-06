import { Router } from 'express';
import { auth } from '../middleware/auth.fg.js';
import { requireRole } from '../middleware/roles.fg.js';
import { Roles } from '../types/roles.fg.js';
import {
  createMissionHandler,
  listMissionsHandler,
  getMissionHandler,
  updateMissionHandler,
  deleteMissionHandler,
  updateMissionStatusHandler,
  createFlightHistoryHandler,
  listFlightHistoryHandler,
} from '../controllers/mission.controller.fg.js';

const router = Router();

router.use(auth);

router.post(
  '/missions',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador),
  createMissionHandler
);

router.get(
  '/missions',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador, Roles.morador),
  listMissionsHandler
);

router.get(
  '/missions/:id',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador, Roles.morador),
  getMissionHandler
);

router.patch(
  '/missions/:id',
  requireRole(Roles.admin_global, Roles.cliente),
  updateMissionHandler
);

router.delete(
  '/missions/:id',
  requireRole(Roles.admin_global, Roles.cliente),
  deleteMissionHandler
);

router.patch(
  '/missions/:id/status',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador),
  updateMissionStatusHandler
);

router.post(
  '/flight-history',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador),
  createFlightHistoryHandler
);

router.get(
  '/flight-history',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador, Roles.morador),
  listFlightHistoryHandler
);

export default router;
