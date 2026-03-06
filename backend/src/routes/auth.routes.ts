import { Router } from "express";
import {
  login,
  sendOtp,
  verifyOtp,
  resetPassword
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;