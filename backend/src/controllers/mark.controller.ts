import { Request, Response } from "express";
import * as markService from "../services/mark.service";
import { getStudentByUserId } from "../services/student.service";

export const getMarksByGradeAndTerm = async (req: Request, res: Response) => {
  try {
    const { grade, term } = req.query;

    if (!grade || !term) {
      return res.status(400).json({ message: "Grade and term are required" });
    }

    const studentsWithMarks = await markService.getStudentsWithMarks(
      parseInt(grade as string),
      parseInt(term as string)
    );

    res.json(studentsWithMarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentMarks = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const marks = await markService.getStudentMarks(studentId as string);

    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const bulkUpsertMarks = async (req: Request, res: Response) => {
  try {
    const { grade, term, marks } = req.body;

    if (!grade || !term || !Array.isArray(marks)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    await markService.bulkUpsertMarks(
      parseInt(grade),
      parseInt(term),
      marks
    );

    res.json({ message: "Marks saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyMarks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const student = await getStudentByUserId(userId);

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const marks = await markService.getStudentMarks(student.id);

    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
