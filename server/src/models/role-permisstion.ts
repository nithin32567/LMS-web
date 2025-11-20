import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";

interface IRolePermission extends Document {
    role: Types.ObjectId;
    permission: Types.ObjectId;
}

const rolePermissionSchema = new Schema<IRolePermission>({
    role:
    {
        type: Schema.Types.ObjectId,
        ref: "Role", required: true
    },
    permission:
    {
        type: Schema.Types.ObjectId,
        ref: "Permission", required: true
    },
}, { timestamps: true });


export default mongoose.model<IRolePermission>("RolePermission", rolePermissionSchema);