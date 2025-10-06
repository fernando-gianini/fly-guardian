import { Router } from 'express';
import { auth } from '../middleware/auth.fg.js';
import { requireRole } from '../middleware/roles.fg.js';
import { Roles } from '../types/roles.fg.js';
import {
  startStreamSessionHandler,
  streamAnswerHandler,
  streamIceHandler,
  stopStreamSessionHandler,
  listStreamLogsHandler,
} from '../controllers/stream.controller.fg.js';

const router = Router();

router.use(auth);

const permittedRoles = [Roles.admin_global, Roles.cliente, Roles.operador];

router.post('/stream/session', requireRole(...permittedRoles), startStreamSessionHandler);
router.post('/stream/session/:id/answer', requireRole(...permittedRoles), streamAnswerHandler);
router.post('/stream/session/:id/ice', requireRole(...permittedRoles), streamIceHandler);
router.post('/stream/session/:id/stop', requireRole(...permittedRoles), stopStreamSessionHandler);
router.get('/stream/logs', requireRole(...permittedRoles), listStreamLogsHandler);

export default router;

