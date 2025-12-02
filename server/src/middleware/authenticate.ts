import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "../services/jwtServices.ts";

export default function authenticate(allowedRoles: string[] = []) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.jid;
      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const payload = verifyRefreshToken(token) as any;
      if (!payload) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      console.log(payload, "payload");
      req.user = payload;
      if (allowedRoles.length === 0) {
        next();
        return;
      }
      const userRole = payload.role;
      if (!userRole) {
        res.status(401).json({ message: "Unauthorized: Role not found" });
        return;
      }
      const hasRole = allowedRoles.includes(userRole);
      if (!hasRole) {
        res.status(403).json({
          message: "Forbidden: Insufficient role privileges",
          required: allowedRoles,
          userRole: userRole,
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