import mongoose, { Schema, Document } from 'mongoose';
import { Roles } from '../types/roles.fg.js';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Roles;
  tenantId?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(Roles), required: true },
    tenantId: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

UserSchema.pre('save', function preSave(next) {
  if (this.isModified('email') && this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
