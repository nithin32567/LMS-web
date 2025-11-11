import mongoose, { Schema, Document } from "mongoose";

interface IPermission extends Document {
    name: string;
    description: string;
}

const permissionSchema = new Schema<IPermission>({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});

export default mongoose.model("Permission", permissionSchema);
