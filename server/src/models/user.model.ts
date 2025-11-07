import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string | null;
    avatar?: string;
    provider: "local" | "google";
    role: "admin" | "instructor" | "student";
    isActive: boolean;
    lastLogin?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, default: null },
        avatar: { type: String },
        provider: { type: String, enum: ["local", "google"], required: true },
        role: {
            type: String,
            enum: ["admin", "instructor", "student"],
            default: "student",
        },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
