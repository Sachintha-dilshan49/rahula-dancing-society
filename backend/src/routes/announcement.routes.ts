import { Router } from "express";
import { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } from "../controllers/announcement.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Retrieve announcements. Students pass ?grade=10 to filter.
router.get("/", authenticate, getAnnouncements);

// Teacher/Admin actions
router.post("/", authenticate, authorize(["TEACHER", "ADMIN"]), createAnnouncement);
router.put("/:id", authenticate, authorize(["TEACHER", "ADMIN"]), updateAnnouncement);
router.delete("/:id", authenticate, authorize(["TEACHER", "ADMIN"]), deleteAnnouncement);

export default router;
