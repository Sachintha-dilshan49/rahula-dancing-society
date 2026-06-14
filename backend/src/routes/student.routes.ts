import { Router } from "express";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  promoteStudents
} from "../controllers/student.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Student management is restricted to teachers and admins
router.use(authenticate, authorize(["TEACHER", "ADMIN"]));

router.post("/promote", promoteStudents);
router.post("/", createStudent);
router.get("/", getStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;