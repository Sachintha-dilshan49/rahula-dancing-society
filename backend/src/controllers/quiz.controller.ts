import { Request, Response } from "express";
import * as quizService from "../services/quiz.service";
import { checkStudentQuizAccess } from "../utils/quizAccess";
import fs from "fs";

// Helper to get student ID from the currently logged-in user
const getStudentId = async (userId: string): Promise<string | null> => {
  const { prisma } = require("../config/prisma");
  const student = await prisma.student.findFirst({ where: { userId } });
  return student?.id ?? null;
};

// ─── Teacher / Admin ──────────────────────────────────────────────────────────

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const { grade } = req.query;
    const user = (req as any).user;
    // Students must only ever see published quizzes — even if they omit the
    // grade filter. Teachers/admins still see their unpublished drafts.
    const publishedOnly = user?.role === "STUDENT";
    const quizzes = await quizService.getQuizzes(
      grade ? parseInt(grade as string) : undefined,
      publishedOnly
    );
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = (req as any).user;
    const isPrivileged = user.role === "TEACHER" || user.role === "ADMIN";

    const quiz = await quizService.getQuizById(id, isPrivileged);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Enforce exam integrity server-side: students may only read a quiz that is
    // published and has already started. The client-side time check is cosmetic
    // and can be bypassed by calling the API directly.
    if (!isPrivileged) {
      const access = checkStudentQuizAccess(quiz);
      if (!access.allowed) {
        return res.status(access.status).json({ message: access.message });
      }
    }

    res.json(quiz);
  } catch (error: any) {
    console.error("Get Quiz Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quiz = await quizService.updateQuiz(id as string, req.body);
    res.json(quiz);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    console.log(`[DEBUG] Attempting to delete quiz ID: ${id}`);
    await quizService.deleteQuiz(id);
    console.log(`[DEBUG] Successfully deleted quiz ID: ${id}`);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error: any) {
    console.error("Deletion Error Details:", {
      message: error.message,
      stack: error.stack,
      id: req.params.id
    });
    res.status(500).json({ 
      message: "Deletion failed: " + (error.message || "Unknown error"),
      error: process.env.NODE_ENV === "development" ? error : undefined
    });
  }
};

export const getAttemptsByQuiz = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const attempts = await quizService.getAttemptsByQuiz(id);
    res.json(attempts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Student ──────────────────────────────────────────────────────────────────

export const submitAttempt = async (req: Request, res: Response) => {
  try {
    const { id: quizId } = req.params;
    const user = (req as any).user;
    const studentId = await getStudentId(user.id);
    if (!studentId) return res.status(403).json({ message: "Student profile not found" });

    const { answers } = req.body;
    const attempt = await quizService.submitAttempt(quizId as string, studentId, answers);
    res.status(201).json(attempt);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || "Server error" });
  }
};

export const getMyAttempt = async (req: Request, res: Response) => {
  try {
    const { id: quizId } = req.params;
    const user = (req as any).user;
    const studentId = await getStudentId(user.id);
    if (!studentId) return res.status(403).json({ message: "Student profile not found" });

    const attempt = await quizService.getMyAttempt(quizId as string, studentId);
    if (!attempt) return res.status(404).json({ message: "No attempt found" });
    res.json(attempt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── File Parsing ─────────────────────────────────────────────────────────────

export const parseFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const text = await quizService.parseUploadedFile(req.file.path, req.file.mimetype);

    // Clean up the uploaded file after parsing
    try { fs.unlinkSync(req.file.path); } catch (_) {}

    res.json({ text });
  } catch (error: any) {
    console.error(error);
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (_) {}
    res.status(500).json({ message: error.message || "Failed to parse file" });
  }
};
