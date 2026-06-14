import { Request, Response } from "express";
import * as teacherService from "../services/teacher.service";

export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await teacherService.getTeachers();
    res.json(teachers);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Public endpoint — used by the public About page (no auth)
export const getPublicTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await teacherService.getPublicTeachers();
    res.json(teachers);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    const teacher = await teacherService.createTeacher({ name, email });
    res.status(201).json({ teacher });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || "Failed to create teacher" });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    await teacherService.deleteTeacher(req.params.id as string);
    res.json({ message: "Teacher deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || "Failed to delete teacher" });
  }
};
