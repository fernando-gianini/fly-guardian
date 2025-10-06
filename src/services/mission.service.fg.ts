import mongoose from 'mongoose';
import { Drone } from '../models/Drone.fg.js';
import { Mission, MissionDocument, MissionAttrs } from '../models/Mission.fg.js';
import { FlightHistory, FlightHistoryDocument } from '../models/FlightHistory.fg.js';
import {
  CreateMissionInput,
  UpdateMissionInput,
  UpdateMissionStatusInput,
} from '../schemas/mission.schema.fg.js';

export interface CreateFlightHistoryInput {
  missionId: string;
  droneId: string;
  startedAt: Date;
  endedAt?: Date;
  log?: unknown;
}

async function ensureDroneExists(droneId: string): Promise<void> {
  if (!mongoose.isValidObjectId(droneId)) {
    throw new Error('DRONE_INVALID_ID');
  }
  const exists = await Drone.exists({ _id: new mongoose.Types.ObjectId(droneId) });
  if (!exists) {
    throw new Error('DRONE_NOT_FOUND');
  }
}

async function ensureMissionExists(missionId: string): Promise<void> {
  if (!mongoose.isValidObjectId(missionId)) {
    throw new Error('MISSION_INVALID_ID');
  }
  const exists = await Mission.exists({ _id: new mongoose.Types.ObjectId(missionId) });
  if (!exists) {
    throw new Error('MISSION_NOT_FOUND');
  }
}

export async function createMission(input: CreateMissionInput): Promise<MissionDocument> {
  await ensureDroneExists(input.droneId);
  const mission = await Mission.create({
    ...input,
    droneId: new mongoose.Types.ObjectId(input.droneId),
  });
  return mission;
}

export async function findAllMissions(): Promise<MissionDocument[]> {
  return Mission.find().sort({ createdAt: -1 }).exec();
}

export async function findMissionById(id: string): Promise<MissionDocument | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Mission.findById(id).exec();
}

export async function updateMissionById(
  id: string,
  update: UpdateMissionInput
): Promise<MissionDocument | null> {
  if (!mongoose.isValidObjectId(id)) return null;

  if (update.droneId) {
    await ensureDroneExists(update.droneId);
  }

  const updateDoc: mongoose.UpdateQuery<MissionAttrs> = { ...update } as mongoose.UpdateQuery<MissionAttrs>;
  if (update.droneId) {
    updateDoc.droneId = new mongoose.Types.ObjectId(update.droneId);
  }

  return Mission.findByIdAndUpdate(id, updateDoc, { new: true, runValidators: true }).exec();
}

export async function deleteMissionById(id: string): Promise<boolean> {
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await Mission.findByIdAndDelete(id).exec();
  return Boolean(result);
}

export async function updateMissionStatus(
  id: string,
  update: UpdateMissionStatusInput
): Promise<MissionDocument | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Mission.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
}

export async function createFlightHistory(
  input: CreateFlightHistoryInput
): Promise<FlightHistoryDocument> {
  await ensureMissionExists(input.missionId);
  await ensureDroneExists(input.droneId);

  const history = await FlightHistory.create({
    missionId: new mongoose.Types.ObjectId(input.missionId),
    droneId: new mongoose.Types.ObjectId(input.droneId),
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    log: input.log,
  });
  return history;
}

export async function findFlightHistoryByMission(
  missionId: string
): Promise<FlightHistoryDocument[]> {
  if (!mongoose.isValidObjectId(missionId)) return [];
  return FlightHistory.find({ missionId }).sort({ startedAt: -1 }).exec();
}
