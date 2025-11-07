import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/jwtServices.ts";

export default function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing auth" });
  const token = auth.split(" ")[1];
  try {
    const payload = verifyAccessToken(token) as any;
    (req as any).user = { id: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}