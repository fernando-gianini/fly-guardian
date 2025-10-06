import mongoose from 'mongoose';
import { Drone, DroneDocument } from '../models/Drone.fg.js';
import { CreateDroneInput, UpdateDroneInput } from '../schemas/drone.schema.fg.js';

export async function createDrone(input: CreateDroneInput): Promise<DroneDocument> {
  const drone = await Drone.create(input);
  return drone;
}

export async function findAllDrones(): Promise<DroneDocument[]> {
  return Drone.find().sort({ createdAt: -1 }).exec();
}

export async function findDroneById(id: string): Promise<DroneDocument | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Drone.findById(id).exec();
}

export async function updateDroneById(id: string, update: UpdateDroneInput): Promise<DroneDocument | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Drone.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
}

export async function deleteDroneById(id: string): Promise<boolean> {
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await Drone.findByIdAndDelete(id).exec();
  return Boolean(result);
}
