import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } from "../config/index.ts";

export function signAccessToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: object) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}