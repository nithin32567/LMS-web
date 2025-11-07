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

dotenv.config();
const app = express();

app.use(helmet());
app.use(cookieParser());




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

