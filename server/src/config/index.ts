import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI!;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const ACCESS_EXPIRES_IN = "15m";
export const REFRESH_EXPIRES_IN = "30d";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = `${process.env.API_URL}/api/auth/google/callback`;
