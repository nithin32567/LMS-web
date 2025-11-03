import type { CorsOptions } from "cors";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  // production
  "https://lms.velense.in",
  "https://www.lms.velense.in",

  // development

  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const originCheck = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) => {
  if (!origin) {
    return callback(null, true);
  }
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  return callback(new Error("Not allowed by CORS"), false);
};

export const corsOptions: CorsOptions = {
  origin: isDevelopment ? true : originCheck,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
  ],

  exposedHeaders: [
    "x-total-count",
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
  ],

  maxAge: 86400,
  optionsSuccessStatus: 200,
};

export const devCorsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

export const getCorsOptions = () => {
  return isDevelopment ? devCorsOptions : corsOptions;
};
