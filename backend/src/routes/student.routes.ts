import { Router } from "express";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  promoteStudents,
  updateMyPhoto
} from "../controllers/student.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

const router = Router();

// Student-only: update my own photo. Declared before the teacher/admin guard
// below so it isn't blocked by it.
router.patch(
  "/me/photo",
  authenticate,
  authorize(["STUDENT"]),
  upload.single("photo"),
  updateMyPhoto
);

// Everything below is restricted to teachers and admins
router.use(authenticate, authorize(["TEACHER", "ADMIN"]));

router.post("/promote", promoteStudents);
router.post("/", upload.single("photo"), createStudent);
router.get("/", getStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;