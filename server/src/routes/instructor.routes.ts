import { Router } from "express";
import { createProfile, getProfile } from "../controllers/instructor/instructor.controller.ts";
import authenticate from "../middleware/authenticate.ts";
const router = Router();

router.post("/profile", authenticate([]), createProfile);
router.get("/profile", authenticate([
    
]), getProfile);

export default router;