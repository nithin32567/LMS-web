import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import instructorRoutes from "./instructor.routes.ts";

const router = Router();
router.use("/auth", authRoutes);
router.use("/instructor", instructorRoutes);


export default router;