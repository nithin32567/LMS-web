import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/database.js";
import { corsOptions } from "./config/cors.config.js";

dotenv.config();
const app = express();

app.use(helmet());

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = Number(process.env.PORT) || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`[Server] Listening on port ${PORT}`);
});

export default app;