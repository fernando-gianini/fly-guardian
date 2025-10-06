import { Router } from 'express';
import { auth } from '../middleware/auth.fg.js';
import { requireRole } from '../middleware/roles.fg.js';
import { Roles } from '../types/roles.fg.js';
import {
  createEmergencyAlertHandler,
  createPoliceAlertHandler,
  listAlertsHandler,
  updateAlertStatusHandler,
} from '../controllers/alert.controller.fg.js';

const router = Router();

router.use(auth);

const allRoles = [Roles.admin_global, Roles.cliente, Roles.operador, Roles.morador] as const;
const managementRoles = [Roles.admin_global, Roles.cliente, Roles.operador] as const;

router.post('/alerts/emergency', requireRole(...allRoles), createEmergencyAlertHandler);
router.post('/alerts/190', requireRole(...allRoles), createPoliceAlertHandler);
router.get('/alerts', requireRole(...allRoles), listAlertsHandler);
router.patch('/alerts/:id/status', requireRole(...managementRoles), updateAlertStatusHandler);

export default router;
