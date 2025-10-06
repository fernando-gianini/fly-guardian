import mongoose, { Schema } from 'mongoose';
import { Roles } from '../types/roles.fg.js';

export type AlertPriority = 'low' | 'medium' | 'high';
export type AlertType = 'emergency' | 'police_190';
export type AlertStatus = 'aberto' | 'em_atendimento' | 'resolvido';

export interface AlertTimelineEntry {
  event: string;
  at: Date;
  meta?: Record<string, unknown>;
}

export interface AlertLocation {
  lat: number;
  lng: number;
}

export interface AlertAttrs {
  createdBy: string;
  role: Roles;
  location: AlertLocation;
  note?: string;
  priority: AlertPriority;
  type: AlertType;
  status: AlertStatus;
  timeline: AlertTimelineEntry[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type AlertDocument = mongoose.HydratedDocument<AlertAttrs>;

const LocationSchema = new Schema<AlertLocation>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const TimelineSchema = new Schema<AlertTimelineEntry>(
  {
    event: { type: String, required: true, trim: true },
    at: { type: Date, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const AlertSchema = new Schema<AlertAttrs>(
  {
    createdBy: { type: String, required: true, index: true, trim: true },
    role: { type: String, enum: Object.values(Roles), required: true },
    location: { type: LocationSchema, required: true },
    note: { type: String, trim: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
    type: { type: String, enum: ['emergency', 'police_190'], required: true },
    status: { type: String, enum: ['aberto', 'em_atendimento', 'resolvido'], default: 'aberto', required: true },
    timeline: { type: [TimelineSchema], required: true },
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

AlertSchema.index({ status: 1, createdAt: -1 });
AlertSchema.index({ type: 1, createdAt: -1 });

export const Alert = mongoose.model<AlertAttrs>('Alert', AlertSchema);
