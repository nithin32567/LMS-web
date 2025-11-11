import mongoose, { Schema, Document, Types } from "mongoose";
import Permission from "./permission.model.ts";

interface IRole extends Document {
    name: string;
    permissions: Types.ObjectId[];
}

const roleSchema = new Schema<IRole>({
    name: { type: String, required: true, unique: true },
    permissions: { type: [Schema.Types.ObjectId], ref: Permission, required: true },
});

export default mongoose.model<IRole>("Role", roleSchema);