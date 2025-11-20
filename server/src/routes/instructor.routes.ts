import { Router } from "express";
import { createProfile } from "../controllers/instructor/instructor.controller.ts";
import authenticate from "../middleware/authenticate.ts";
const router = Router();

router.post("/profile", authenticate([]), createProfile);

export default router;