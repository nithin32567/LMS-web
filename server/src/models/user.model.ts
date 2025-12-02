import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  provider?: 'local' | 'google';
  role: 'admin' | 'instructor' | 'student';
  isActive: boolean;
  lastLogin?: Date;
  otp?: string;
  otpExpiresAt?: Date | null;
  otpVerified?: boolean;
  inactiveSince?: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, default: null },
    avatar: { type: String },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    role: {
      type: String,
      enum: ['admin', 'instructor', 'student'],
      default: 'student',
      ref: 'Role',
    },
    isActive: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: Date.now() + 5 * 60 * 1000 },
    otpVerified: { type: Boolean, default: false },
    inactiveSince: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true },
);

userSchema.index({ inactiveSince: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model<IUser>('User', userSchema);

