import { Router } from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitAttempt,
  getMyAttempt,
  getAttemptsByQuiz,
  parseFile,
} from "../controllers/quiz.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

const router = Router();

// ── File Parsing (teacher only) ─────────────────────────────────────────────
router.post(
  "/parse-file",
  authenticate,
  authorize(["TEACHER", "ADMIN"]),
  upload.single("file"),
  parseFile
);

// ── Quiz CRUD ────────────────────────────────────────────────────────────────
router.get("/", authenticate, getQuizzes);
router.get("/:id", authenticate, getQuizById);

router.post("/", authenticate, authorize(["TEACHER", "ADMIN"]), createQuiz);
router.put("/:id", authenticate, authorize(["TEACHER", "ADMIN"]), updateQuiz);
router.delete("/:id", authenticate, authorize(["TEACHER", "ADMIN"]), deleteQuiz);

// ── Attempts ─────────────────────────────────────────────────────────────────
router.get("/:id/attempts", authenticate, authorize(["TEACHER", "ADMIN"]), getAttemptsByQuiz);
router.get("/:id/my-attempt", authenticate, getMyAttempt);
router.post("/:id/attempt", authenticate, authorize(["STUDENT"]), submitAttempt);

export default router;
