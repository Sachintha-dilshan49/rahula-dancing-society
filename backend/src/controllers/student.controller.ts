import { Request, Response } from "express";
import * as studentService from "../services/student.service";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, parentContact, notes, grade } = req.body;

    // Request is multipart/form-data so the optional photo can be uploaded
    // alongside the text fields — every value arrives as a string.
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const { student } = await studentService.createStudent({
      name,
      grade: grade !== undefined && grade !== "" ? parseInt(grade, 10) : undefined,
      email: email || undefined,
      phone: phone || undefined,
      parentContact: parentContact || undefined,
      notes: notes || undefined,
      photoUrl,
    });

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

// Student-only: update my own photo. Identified from the JWT, so a student can
// never change another student's photo.
export const updateMyPhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    const student = await studentService.updateStudentPhotoByUserId(userId, photoUrl);

    res.json({ message: "Photo updated", student });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || "Server error" });
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