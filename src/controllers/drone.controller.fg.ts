import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import {
  createDroneSchema,
  updateDroneSchema,
} from '../schemas/drone.schema.fg.js';
import {
  createDrone,
  findAllDrones,
  findDroneById,
  updateDroneById,
  deleteDroneById,
} from '../services/drone.service.fg.js';
import { AppError } from '../utils/errors.fg.js';

export async function createDroneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = createDroneSchema.parse(req.body);
    const drone = await createDrone(payload);
    return res.status(201).json(drone.toJSON());
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return next(new AppError(409, 'Serial ja cadastrado'));
    }
    return next(error);
  }
}

export async function listDronesHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const drones = await findAllDrones();
    return res.json(drones.map((drone) => drone.toJSON()));
  } catch (error) {
    return next(error);
  }
}

export async function getDroneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(400, 'Identificador invalido');
    }
    const drone = await findDroneById(id);
    if (!drone) {
      throw new AppError(404, 'Drone nao encontrado');
    }
    return res.json(drone.toJSON());
  } catch (error) {
    return next(error);
  }
}

export async function updateDroneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(400, 'Identificador invalido');
    }
    const payload = updateDroneSchema.parse(req.body);
    const drone = await updateDroneById(id, payload);
    if (!drone) {
      throw new AppError(404, 'Drone nao encontrado');
    }
    return res.json(drone.toJSON());
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return next(new AppError(409, 'Serial ja cadastrado'));
    }
    return next(error);
  }
}

export async function deleteDroneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError(400, 'Identificador invalido');
    }
    const deleted = await deleteDroneById(id);
    if (!deleted) {
      throw new AppError(404, 'Drone nao encontrado');
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
