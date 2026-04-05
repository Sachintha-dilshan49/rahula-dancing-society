import { Router } from "express";
import { uploadPastPaper, getPastPapers, deletePastPaper, updatePastPaper } from "../controllers/pastpaper.controller";
import { upload } from "../middlewares/upload";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Everyone who is authenticated can get papers
router.get("/", authenticate, getPastPapers);

// Only teachers can upload/edit/delete
router.post("/", authenticate, authorize(["TEACHER", "ADMIN"]), upload.single("file"), uploadPastPaper);
router.put("/:id", authenticate, authorize(["TEACHER", "ADMIN"]), upload.single("file"), updatePastPaper);
router.delete("/:id", authenticate, authorize(["TEACHER", "ADMIN"]), deletePastPaper);

export default router;
