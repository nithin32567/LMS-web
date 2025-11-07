import { Schema, model, Document, Types } from "mongoose";

interface IRefreshToken extends Document {
  user: Types.ObjectId;
  token: string;
  createdAt: Date;
  revoked?: boolean;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
});

export default model<IRefreshToken>("RefreshToken", RefreshTokenSchema);