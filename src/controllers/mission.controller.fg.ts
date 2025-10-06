import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { z } from 'zod';
import {
  createMissionSchema,
  updateMissionSchema,
  updateMissionStatusSchema,
} from '../schemas/mission.schema.fg.js';
import {
  createMission,
  findAllMissions,
  findMissionById,
  updateMissionById,
  deleteMissionById,
  updateMissionStatus,
  createFlightHistory,
  findFlightHistoryByMission,
} from '../services/mission.service.fg.js';
import { AppError } from '../utils/errors.fg.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createFlightHistorySchema = z
  .object({
    missionId: z.string().regex(objectIdRegex, 'MissionId invalido'),
    droneId: z.string().regex(objectIdRegex, 'DroneId invalido'),
    startedAt: z.coerce.date(),
    endedAt: z.coerce.date().optional(),
    log: z.unknown().optional(),
  })
  .passthrough();

export async function createMissionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = createMissionSchema.parse(req.body);
    const mission = await createMission(payload);
    return res.status(201).json(mission.toJSON());
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return next(new AppError(409, 'Missao ja cadastrada'));
    }
    if (error instanceof Error) {
      if (error.message === 'DRONE_INVALID_ID') {
        return next(new AppError(400, 'Drone invalido'));
      }
      if (error.message === 'DRONE_NOT_FOUND') {
        return next(new AppError(404, 'Drone nao encontrado'));
      }
    }
    return next(error);
  }
}

export async function listMissionsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const missions = await findAllMissions();
    return res.json(missions.map((mission) => mission.toJSON()));
  } catch (error) {
    return next(error);
  }
}

export async function getMissionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(400, 'Identificador invalido');
    }
    const mission = await findMissionById(id);
    if (!mission) {
      throw new AppError(404, 'Missao nao encontrada');
    }
    return res.json(mission.toJSON());
  } catch (error) {
    return next(error);
  }
}

export async function updateMissionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(400, 'Identificador invalido');
    }
    const payload = updateMissionSchema.parse(req.body);
    const mission = await updateMissionById(id, payload);
    if (!mission) {
      throw new AppError(404, 'Missao nao encontrada');
    }
    return res.json(mission.toJSON());
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'DRONE_INVALID_ID') {
        return next(new AppError(400, 'Drone invalido'));
      }
      if (error.message === 'DRONE_NOT_FOUND') {
        return next(new AppError(404, 'Drone nao encontrado'));
      }
    }
    return next(error);
  }
}

export async function deleteMissionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(400, 'Identificador invalido');
    }
    const deleted = await deleteMissionById(id);
    if (!deleted) {
      throw new AppError(404, 'Missao nao encontrada');
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function updateMissionStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(400, 'Identificador invalido');
    }
    const payload = updateMissionStatusSchema.parse(req.body);
    const mission = await updateMissionStatus(id, payload);
    if (!mission) {
      throw new AppError(404, 'Missao nao encontrada');
    }
    return res.json(mission.toJSON());
  } catch (error) {
    return next(error);
  }
}

export async function createFlightHistoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createFlightHistorySchema.parse(req.body);
    const { missionId, droneId, startedAt, endedAt } = parsed;
    const rest = { ...parsed } as Record<string, unknown>;
    delete rest.missionId;
    delete rest.droneId;
    delete rest.startedAt;
    delete rest.endedAt;
    const logPayload = (parsed as { log?: unknown }).log ?? rest;

    const history = await createFlightHistory({
      missionId,
      droneId,
      startedAt,
      endedAt,
      log: logPayload,
    });

    return res.status(201).json(history.toJSON());
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'MISSION_INVALID_ID') {
        return next(new AppError(400, 'Missao invalida'));
      }
      if (error.message === 'MISSION_NOT_FOUND') {
        return next(new AppError(404, 'Missao nao encontrada'));
      }
      if (error.message === 'DRONE_INVALID_ID') {
        return next(new AppError(400, 'Drone invalido'));
      }
      if (error.message === 'DRONE_NOT_FOUND') {
        return next(new AppError(404, 'Drone nao encontrado'));
      }
    }
    return next(error);
  }
}

export async function listFlightHistoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { missionId } = req.query;
    if (!missionId || typeof missionId !== 'string') {
      throw new AppError(400, 'Parametro missionId obrigatorio');
    }
    if (!objectIdRegex.test(missionId)) {
      throw new AppError(400, 'Missao invalida');
    }
    const history = await findFlightHistoryByMission(missionId);
    return res.json(history.map((item) => item.toJSON()));
  } catch (error) {
    return next(error);
  }
}
