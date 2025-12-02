import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/database.ts";
import indexRoutes from "./routes/index.routes.ts";
import passport from "./services/passport.ts";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { CLIENT_URL } from "./config/index.ts";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: ["http://localhost:5173", CLIENT_URL, "https://your-production-domain.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};
app.use(cors(corsOptions));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "http://localhost:5000", "data:", "blob:"],
        },
    },
}));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(morgan("dev"));
passport.initialize();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", indexRoutes)


const PORT = Number(process.env.PORT) || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`[Server] Listening on port ${PORT}`);
});

