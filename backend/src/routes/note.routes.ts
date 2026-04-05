import { Router } from "express";
import { createNote, createNoteForGrade, getMyNotes, getAllNotes, deleteNote } from "../controllers/note.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Student: get their own notes
router.get("/my", authenticate, getMyNotes);

// Teacher/Admin: list all notes (filterable by studentId or grade)
router.get("/", authenticate, authorize(["TEACHER", "ADMIN"]), getAllNotes);

// Teacher/Admin: create note for single student
router.post("/", authenticate, authorize(["TEACHER", "ADMIN"]), createNote);

// Teacher/Admin: send note to entire grade
router.post("/group", authenticate, authorize(["TEACHER", "ADMIN"]), createNoteForGrade);

// Teacher/Admin: delete a note
router.delete("/:id", authenticate, authorize(["TEACHER", "ADMIN"]), deleteNote);

export default router;
