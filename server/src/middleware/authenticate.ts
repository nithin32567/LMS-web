import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/jwtServices.ts";
import Role from "../models/role.model.ts";
import RolePermission from "../models/role-permisstion.ts";

export default function authenticate(permissions: string[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.jid;
      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const payload = verifyAccessToken(token) as any;
      if (!payload) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      console.log(payload, "payload");
      req.user = payload;
      if (permissions.length === 0) {
        next();
        return;
      }
      const role = await Role.findOne({ name: payload.role });
      if (!role) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const rolePermissions = await RolePermission
        .find({ role: role._id })
        .populate("permission");
      const userPermNames = rolePermissions.map((rp: any) => rp.permission.name);
      const hasAll = permissions.every(p =>
        userPermNames.includes(p)
      );
      if (!hasAll) {
        res.status(403).json({
          message: "Forbidden: Missing required permissions",
          required: permissions,
          userHas: userPermNames,
        });
        return;
      }
      next();
    } catch (error) {
      console.log(error, "error in authenticate");
      res.status(500).json({ message: "Internal server error", detail: (error as Error).message });
      return;
    }
  };
}