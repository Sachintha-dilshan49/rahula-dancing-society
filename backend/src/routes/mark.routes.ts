import { Router } from "express";
import {
  getMarksByGradeAndTerm,
  getStudentMarks,
  bulkUpsertMarks,
  getMyMarks
} from "../controllers/mark.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Student-only: get my own marks (must be before /:studentId to avoid conflict)
router.get("/my-marks", authenticate, authorize(["STUDENT"]), getMyMarks);

router.get("/", authenticate, authorize(["TEACHER", "ADMIN"]), getMarksByGradeAndTerm);
router.post("/bulk", authenticate, authorize(["TEACHER", "ADMIN"]), bulkUpsertMarks);
router.get("/student/:studentId", authenticate, authorize(["TEACHER", "ADMIN"]), getStudentMarks);

export default router;
