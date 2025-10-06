import mongoose, { Schema } from 'mongoose';

export interface TelemetryPayload {
  lat: number;
  lng: number;
  alt: number;
  speed: number;
  batteryPct: number;
  heading: number;
}

export interface TelemetryFrameAttrs {
  droneId: string;
  payload: TelemetryPayload;
  ts: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TelemetryFrameDocument = mongoose.HydratedDocument<TelemetryFrameAttrs>;

const TelemetryPayloadSchema = new Schema<TelemetryPayload>(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    alt: { type: Number, required: true },
    speed: { type: Number, required: true },
    batteryPct: { type: Number, required: true },
    heading: { type: Number, required: true },
  },
  { _id: false }
);

const TelemetryFrameSchema = new Schema<TelemetryFrameAttrs>(
  {
    droneId: { type: String, required: true, index: true, trim: true },
    payload: { type: TelemetryPayloadSchema, required: true },
    ts: { type: Date, required: true, index: true },
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

TelemetryFrameSchema.index({ droneId: 1, ts: -1 });

export const TelemetryFrame = mongoose.model<TelemetryFrameAttrs>('TelemetryFrame', TelemetryFrameSchema);
