import { Router } from "express";
import {
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  changePassword,
  getMe
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.put("/change-password", authenticate, changePassword);
router.get("/me", authenticate, getMe);


export default router;