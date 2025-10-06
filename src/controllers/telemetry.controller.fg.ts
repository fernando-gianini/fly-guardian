import { NextFunction, Request, Response } from 'express';
import { telemetryFrameSchema } from '../schemas/telemetry.schema.fg.js';
import { recordTelemetry, getLatestTelemetry } from '../services/telemetry.service.fg.js';
import { AppError } from '../utils/errors.fg.js';

export async function postTelemetryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { droneId } = req.params;
    if (!droneId) {
      throw new AppError(400, 'droneId obrigatorio');
    }
    const payload = telemetryFrameSchema.parse(req.body);
    await recordTelemetry(droneId, payload);
    return res.status(201).json({ ok: true });
  } catch (error) {
    return next(error);
  }
}

export async function getLatestTelemetryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { droneId } = req.params;
    if (!droneId) {
      throw new AppError(400, 'droneId obrigatorio');
    }
    const frame = await getLatestTelemetry(droneId);
    return res.json({ ok: true, data: frame ? frame.toJSON() : null });
  } catch (error) {
    return next(error);
  }
}
