import mongoose, { Schema } from 'mongoose';

export interface FlightHistoryAttrs {
  missionId: mongoose.Types.ObjectId;
  droneId: mongoose.Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  log?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
}

export type FlightHistoryDocument = mongoose.HydratedDocument<FlightHistoryAttrs>;

const FlightHistorySchema = new Schema<FlightHistoryAttrs>(
  {
    missionId: { type: Schema.Types.ObjectId, ref: 'Mission', required: true, index: true },
    droneId: { type: Schema.Types.ObjectId, ref: 'Drone', required: true, index: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date },
    log: { type: Schema.Types.Mixed },
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

export const FlightHistory = mongoose.model<FlightHistoryAttrs>('FlightHistory', FlightHistorySchema);
