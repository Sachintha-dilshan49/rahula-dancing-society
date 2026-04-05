import { Request, Response } from "express";
import * as noteService from "../services/note.service";
import { prisma } from "../config/prisma";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, studentId } = req.body;
    console.log("[createNote] body:", { title, content: !!content, studentId });
    if (!title || !content || !studentId) {
      return res.status(400).json({ message: "title, content and studentId are required" });
    }
    const note = await noteService.createNote({ title, content, studentId });
    res.status(201).json(note);
  } catch (error: any) {
    console.error("[createNote] ERROR:", error?.message, error?.code);
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

export const createNoteForGrade = async (req: Request, res: Response) => {
  try {
    const { title, content, grade } = req.body;
    if (!title || !content || !grade) {
      return res.status(400).json({ message: "title, content and grade are required" });
    }
    const notes = await noteService.createNoteForGrade(parseInt(grade), { title, content });
    res.status(201).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyNotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    // Resolve the student record from userId
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    const notes = await noteService.getNotesForStudent(student.id);
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const { studentId, grade } = req.query;
    const notes = await noteService.getAllNotes({
      studentId: studentId as string | undefined,
      grade: grade ? parseInt(grade as string) : undefined
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await noteService.deleteNote(id as string);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
