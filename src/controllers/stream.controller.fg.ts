import { NextFunction, Request, Response } from 'express';
import {
  startStreamSessionSchema,
  streamAnswerSchema,
  streamIceCandidateSchema,
  stopStreamSessionSchema,
  streamLogsQuerySchema,
} from '../schemas/stream.schema.fg.js';
import {
  startStreamSession,
  submitStreamAnswer,
  submitIceCandidate,
  stopStreamSession,
  listStreamLogs,
} from '../services/stream.service.fg.js';

export async function startStreamSessionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { droneId } = startStreamSessionSchema.parse(req.body);
    const session = await startStreamSession(droneId);
    return res.status(201).json({ ok: true, data: session });
  } catch (error) {
    return next(error);
  }
}

export async function streamAnswerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: sessionId } = req.params;
    const { sdpAnswer } = streamAnswerSchema.parse(req.body);
    await submitStreamAnswer(sessionId, sdpAnswer);
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
}

export async function streamIceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: sessionId } = req.params;
    const { candidate } = streamIceCandidateSchema.parse(req.body);
    await submitIceCandidate(sessionId, candidate);
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
}

export async function stopStreamSessionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: sessionId } = req.params;
    const payload = stopStreamSessionSchema.parse(req.body ?? {});
    const log = await stopStreamSession(sessionId, payload.reason);
    return res.json({ ok: true, data: log.toJSON() });
  } catch (error) {
    return next(error);
  }
}

export async function listStreamLogsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = streamLogsQuerySchema.parse({
      droneId: typeof req.query.droneId === 'string' ? req.query.droneId : undefined,
      sessionId: typeof req.query.sessionId === 'string' ? req.query.sessionId : undefined,
    });
    const logs = await listStreamLogs(filters);
    return res.json({ ok: true, data: logs.map((log) => log.toJSON()) });
  } catch (error) {
    return next(error);
  }
}
