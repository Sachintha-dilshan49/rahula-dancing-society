import { Request, Response } from "express";
import * as announcementService from "../services/announcement.service";

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, description, grade } = req.body;

    const announcement = await announcementService.createAnnouncement({
      title,
      description,
      grade: grade ? parseInt(grade) : undefined
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { grade } = req.query;
    
    // Convert grade to number if passing
    const parsedGrade = grade ? parseInt(grade as string) : undefined;

    const announcements = await announcementService.getAnnouncements({
      grade: parsedGrade
    });

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, grade } = req.body;

    // Use null explicitly if they remove the grade to make it overall
    let gradeValue;
    if (grade === null || grade === "overall") {
      gradeValue = null;
    } else if (grade !== undefined) {
      gradeValue = parseInt(grade);
    }

    const dataToUpdate: any = {};
    if (title) dataToUpdate.title = title;
    if (description) dataToUpdate.description = description;
    if (gradeValue !== undefined) dataToUpdate.grade = gradeValue;

    const announcement = await announcementService.updateAnnouncement(id as string, dataToUpdate);
    res.json(announcement);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await announcementService.deleteAnnouncement(id as string);
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
