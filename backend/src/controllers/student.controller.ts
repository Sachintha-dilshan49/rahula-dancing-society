import { Request, Response } from "express";
import * as studentService from "../services/student.service";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { student } = await studentService.createStudent(req.body);

    res.status(201).json({
      message: "Student created",
      student
    });

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await studentService.getStudents();

    res.json(students);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await studentService.updateStudent(id as string, req.body);

    res.json({
      message: "Student updated",
      student
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await studentService.deleteStudent(id as string);

    res.json({
      message: "Student deleted"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const promoteStudents = async (req: Request, res: Response) => {
  try {
    const result = await studentService.promoteStudents();
    res.json({
      message: "Students promoted successfully",
      count: result.count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during promotion" });
  }
};