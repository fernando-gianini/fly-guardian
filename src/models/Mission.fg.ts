import mongoose, { Schema } from 'mongoose';

export type MissionStatus = 'planejada' | 'em_execucao' | 'concluida' | 'falha';

export interface Waypoint {
  lat: number;
  lng: number;
  alt: number;
  speed?: number;
}

export interface MissionAttrs {
  name: string;
  droneId: mongoose.Types.ObjectId;
  waypoints: Waypoint[];
  etaSeconds: number;
  status: MissionStatus;
  tenantId?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MissionDocument = mongoose.HydratedDocument<MissionAttrs>;

const statusValues: readonly MissionStatus[] = ['planejada', 'em_execucao', 'concluida', 'falha'];

const WaypointSchema = new Schema<Waypoint>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    alt: { type: Number, required: true },
    speed: { type: Number },
  },
  { _id: false }
);

const MissionSchema = new Schema<MissionAttrs>(
  {
    name: { type: String, required: true, trim: true },
    droneId: { type: Schema.Types.ObjectId, ref: 'Drone', required: true, index: true },
    waypoints: {
      type: [WaypointSchema],
      required: true,
      validate: {
        validator: (value: Waypoint[]) => value.length > 0,
        message: 'Waypoints required',
      },
    },
    etaSeconds: { type: Number, required: true, min: 1 },
    status: { type: String, enum: statusValues, default: 'planejada', required: true },
    tenantId: { type: String, trim: true, index: true },
    notes: { type: String, trim: true },
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

export const Mission = mongoose.model<MissionAttrs>('Mission', MissionSchema);
