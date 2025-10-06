import mongoose, { Schema } from 'mongoose';

export type DroneStatus = 'ativo' | 'manutencao' | 'inativo';

export interface DroneAttrs {
  model: string;
  status: DroneStatus;
  batteryPct: number;
  serial: string;
  notes?: string;
  tenantId?: string;
  name?: string;
  manufacturer?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DroneDocument = mongoose.HydratedDocument<DroneAttrs>;

const statusValues: readonly DroneStatus[] = ['ativo', 'manutencao', 'inativo'];

const DroneSchema = new Schema<DroneAttrs>(
  {
    model: { type: String, required: true, trim: true },
    status: { type: String, enum: statusValues, default: 'ativo', required: true },
    batteryPct: { type: Number, required: true, min: 0, max: 100 },
    serial: { type: String, required: true, unique: true, trim: true },
    notes: { type: String, trim: true },
    tenantId: { type: String, trim: true, index: true },
    name: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        const plain = ret as Record<string, unknown> & { _id?: mongoose.Types.ObjectId };
        if (plain._id instanceof mongoose.Types.ObjectId) {
          plain.id = plain._id.toString();
        }
        delete plain._id;
        return plain;
      },
    },
  }
);


export const Drone = mongoose.model<DroneAttrs>('Drone', DroneSchema);
