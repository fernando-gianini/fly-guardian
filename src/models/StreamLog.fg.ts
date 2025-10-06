import mongoose, { Schema } from 'mongoose';

export interface StreamLogAttrs {
  sessionId: string;
  droneId: string;
  startedAt: Date;
  endedAt?: Date;
  errors?: unknown[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type StreamLogDocument = mongoose.HydratedDocument<StreamLogAttrs>;

const StreamLogSchema = new Schema<StreamLogAttrs>(
  {
    sessionId: { type: String, required: true, unique: true, index: true, trim: true },
    droneId: { type: String, required: true, index: true, trim: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date },
    errors: { type: [Schema.Types.Mixed], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    suppressReservedKeysWarning: true,
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

export const StreamLog = mongoose.model<StreamLogAttrs>('StreamLog', StreamLogSchema);
