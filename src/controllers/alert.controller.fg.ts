import { NextFunction, Request, Response } from 'express';
import {
  createEmergencyAlertSchema,
  createPoliceAlertSchema,
  listAlertsSchema,
  updateAlertStatusSchema,
} from '../schemas/alert.schema.fg.js';
import {
  createEmergencyAlert,
  createPolice190Alert,
  listAlerts,
  updateAlertStatus,
} from '../services/alert.service.fg.js';
import { Roles } from '../types/roles.fg.js';
import { AppError } from '../utils/errors.fg.js';

function getUserContext(req: Request) {
  const user = req.user;
  if (!user?.sub || !user.role) {
    throw new AppError(401, 'Unauthorized');
  }
  return { id: user.sub, role: user.role as Roles };
}

export async function createEmergencyAlertHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = createEmergencyAlertSchema.parse(req.body);
    const user = getUserContext(req);
    const alert = await createEmergencyAlert(payload, user);
    return res.status(201).json({ ok: true, data: alert.toJSON() });
  } catch (error) {
    return next(error);
  }
}

export async function createPoliceAlertHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = createPoliceAlertSchema.parse(req.body ?? {});
    const user = getUserContext(req);
    const alert = await createPolice190Alert(payload, user);
    return res.status(201).json({ ok: true, data: alert.toJSON() });
  } catch (error) {
    return next(error);
  }
}

export async function listAlertsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = listAlertsSchema.parse({
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      from: typeof req.query.from === 'string' ? req.query.from : undefined,
      to: typeof req.query.to === 'string' ? req.query.to : undefined,
    });
    const user = getUserContext(req);
    const alerts = await listAlerts(filters, user);
    return res.json({ ok: true, data: alerts.map((alert) => alert.toJSON()) });
  } catch (error) {
    return next(error);
  }
}

export async function updateAlertStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const payload = updateAlertStatusSchema.parse(req.body);
    const user = getUserContext(req);
    const alert = await updateAlertStatus(id, payload, user);
    return res.json({ ok: true, data: alert.toJSON() });
  } catch (error) {
    return next(error);
  }
}
