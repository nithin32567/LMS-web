import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import instructorRoutes from "./instructor.routes.ts";
import userRoutes from "./user.routes.ts";
import courseRoutes from "./course.routes.ts";
import categoryRoutes from "./category.routes.ts";
import moduleRoutes from "./module.routes.ts";
import lessonRoutes from "./lesson.routes.ts";

const router = Router();
router.use("/auth", authRoutes);
router.use("/instructor", instructorRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/categories", categoryRoutes);
router.use("/modules", moduleRoutes);
router.use("/lessons", lessonRoutes);

// router.use("/instructors", instructorRoutes);
// router.use("/students", studentRoutes);
// router.use("/admin", adminRoutes);




export default router;