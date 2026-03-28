import { Router } from "express";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  promoteStudents
} from "../controllers/student.controller";

const router = Router();

router.post("/promote", promoteStudents);
router.post("/", createStudent);
router.get("/", getStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;