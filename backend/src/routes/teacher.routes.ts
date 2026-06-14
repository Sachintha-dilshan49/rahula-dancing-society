import { Router } from "express";
import {
  getTeachers,
  getPublicTeachers,
  createTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Public — instructors list for the About page (must be before the admin guard)
router.get("/public", getPublicTeachers);

// Everything below is ADMIN-only
router.use(authenticate, authorize(["ADMIN"]));

router.get("/", getTeachers);
router.post("/", createTeacher);
router.delete("/:id", deleteTeacher);

export default router;
