import { prisma } from "../config/prisma";
import path from "path";
import fs from "fs";
import { scoreAttempt } from "../utils/quizScoring";

export interface QuestionInput {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  orderIndex: number;
}

export interface CreateQuizInput {
  title: string;
  description?: string;
  grade: number;
  startTime: string;
  endTime: string;
  duration: number;
  isPublished?: boolean;
  questions: QuestionInput[];
}

// ------------------------ CRUD -------------------------

export const createQuiz = async (data: CreateQuizInput) => {
  const { questions, ...quizData } = data;
  return (prisma as any).quiz.create({
    data: {
      ...quizData,
      startTime: new Date(quizData.startTime),
      endTime: new Date(quizData.endTime),
      questions: {
        create: questions.map((q) => ({
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          orderIndex: q.orderIndex,
        })),
      },
    },
    include: { questions: { orderBy: { orderIndex: "asc" } } },
  });
};

export const getQuizzes = async (grade?: number, publishedOnly = false) => {
  const where: any = {};
  if (grade) where.grade = grade;
  if (publishedOnly) where.isPublished = true;

  return (prisma as any).quiz.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: { startTime: "desc" },
    include: {
      _count: { select: { questions: true, attempts: true } },
    },
  });
};

export const getQuizById = async (id: string, includeCorrect = false) => {
  const quiz = await (prisma as any).quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!quiz) return null;

  if (!includeCorrect) {
    // Strip correct answers for student view
    return {
      ...quiz,
      questions: quiz.questions.map(({ correctAnswer: _ca, ...q }: { correctAnswer: string; [key: string]: any }) => q),
    };
  }

  return quiz;
};

export const updateQuiz = async (id: string, data: Partial<CreateQuizInput>) => {
  const { questions, ...quizData } = data;

  const updateData: any = { ...quizData };
  if (quizData.startTime) updateData.startTime = new Date(quizData.startTime);
  if (quizData.endTime) updateData.endTime = new Date(quizData.endTime);

  if (questions) {
    // Delete existing questions and re-create
    await (prisma as any).quizQuestion.deleteMany({ where: { quizId: id } });
    updateData.questions = {
      create: questions.map((q) => ({
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        orderIndex: q.orderIndex,
      })),
    };
  }

  return (prisma as any).quiz.update({
    where: { id },
    data: updateData,
    include: { questions: { orderBy: { orderIndex: "asc" } } },
  });
};

export const deleteQuiz = async (id: string) => {
  // Manually delete questions and attempts to ensure robust cascade
  await (prisma as any).quizQuestion.deleteMany({ where: { quizId: id } });
  await (prisma as any).quizAttempt.deleteMany({ where: { quizId: id } });
  return (prisma as any).quiz.delete({ where: { id } });
};

// ------------------- ATTEMPTS -------------------------

export const submitAttempt = async (
  quizId: string,
  studentId: string,
  answers: Record<string, string>
) => {
  // Check existing attempt
  const existing = await (prisma as any).quizAttempt.findUnique({
    where: { quizId_studentId: { quizId, studentId } },
  });
  if (existing) throw new Error("You have already submitted this quiz.");

  // Load quiz with correct answers
  const quiz = await (prisma as any).quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });
  if (!quiz) throw new Error("Quiz not found");

  // Check time window
  const now = new Date();
  if (now < quiz.startTime) throw new Error("Quiz has not started yet.");
  if (now > new Date(quiz.endTime.getTime() + quiz.duration * 60 * 1000))
    throw new Error("Quiz submission window has closed.");

  // Score the answers
  const { score, total } = scoreAttempt(quiz.questions, answers);

  return (prisma as any).quizAttempt.create({
    data: {
      quizId,
      studentId,
      answers,
      score,
      totalMarks: total,
    },
  });
};

export const getAttemptsByQuiz = async (quizId: string) => {
  return (prisma as any).quizAttempt.findMany({
    where: { quizId },
    include: {
      student: { select: { id: true, name: true, grade: true } },
    },
    orderBy: { score: "desc" },
  });
};

export const getMyAttempt = async (quizId: string, studentId: string) => {
  return (prisma as any).quizAttempt.findUnique({
    where: { quizId_studentId: { quizId, studentId } },
  });
};

// ------------------- FILE PARSING ----------------------

export const parseUploadedFile = async (filePath: string, mimeType: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf" || mimeType === "application/pdf") {
    // pdf-parse v2 exposes a PDFParse class (the v1 callable default was removed)
    const { PDFParse } = require("pdf-parse");
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buffer });
    try {
      const data = await parser.getText();
      return data.text || "";
    } finally {
      await parser.destroy();
    }
  }

  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    const { createWorker } = require("tesseract.js");
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(filePath);
    await worker.terminate();
    return data.text || "";
  }

  throw new Error("Unsupported file type for text extraction. Use PDF or image files.");
};
