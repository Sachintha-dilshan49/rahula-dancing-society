import { Router } from "express";
import {
  getMarksByGradeAndTerm,
  getStudentMarks,
  bulkUpsertMarks
} from "../controllers/mark.controller";

const router = Router();

router.get("/", getMarksByGradeAndTerm);
router.post("/bulk", bulkUpsertMarks);
router.get("/student/:studentId", getStudentMarks);

export default router;
