import { Router } from 'express';
import { auth } from '../middleware/auth.fg.js';
import { requireRole } from '../middleware/roles.fg.js';
import { Roles } from '../types/roles.fg.js';
import {
  createDroneHandler,
  listDronesHandler,
  getDroneHandler,
  updateDroneHandler,
  deleteDroneHandler,
} from '../controllers/drone.controller.fg.js';

const router = Router();

router.use(auth);

router.post(
  '/drones',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador),
  createDroneHandler
);

router.get(
  '/drones',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador, Roles.morador),
  listDronesHandler
);

router.get(
  '/drones/:id',
  requireRole(Roles.admin_global, Roles.cliente, Roles.operador, Roles.morador),
  getDroneHandler
);

router.patch(
  '/drones/:id',
  requireRole(Roles.admin_global, Roles.cliente),
  updateDroneHandler
);

router.delete(
  '/drones/:id',
  requireRole(Roles.admin_global, Roles.cliente),
  deleteDroneHandler
);

export default router;
