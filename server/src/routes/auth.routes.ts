import express from "express";
import * as AuthController from "../controllers/auth/auth.controller.ts";
import { adminLogin } from "../controllers/auth/admin.auth.controller.ts";
const router = express.Router();

router.get("/google", AuthController.googleAuth);
router.get("/google/callback", AuthController.googleCallback);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/signup-with-email-and-otp", AuthController.signupWithEmailAndOtp);
router.post("/verify-otp", AuthController.verifyOtp);

router.post("/admin-login", (req, res, next) => {
  console.log("Admin login route hit", req.method, req.path);
  console.log("Request body:", req.body);
  adminLogin(req, res).catch(next);
});


export default router;
