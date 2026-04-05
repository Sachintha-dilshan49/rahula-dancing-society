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

router.get("/", getMarksByGradeAndTerm);
router.post("/bulk", bulkUpsertMarks);
router.get("/student/:studentId", getStudentMarks);

export default router;
