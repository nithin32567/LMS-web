import mongoose, { Schema, Document } from "mongoose";


export interface IUser extends Document {
    name: "string",
    email: "string",
    password: "string" | null,
    phone: "string",
    avatar: "string",
    provider: "local | google",
    role: mongoose.Types.ObjectId,
    tenant: mongoose.Types.ObjectId,
    isActive: boolean,
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date,
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    avatar: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, default: null },
    isActive: { type: Boolean, required: true, default: true },
    lastLogin: { type: Date, required: true, default: null },

}, { timestamps: true });


export default mongoose.model<IUser>("User", userSchema);