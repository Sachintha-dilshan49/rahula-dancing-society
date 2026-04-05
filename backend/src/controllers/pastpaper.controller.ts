import { Request, Response } from "express";
import * as pastpaperService from "../services/pastpaper.service";

export const uploadPastPaper = async (req: Request, res: Response) => {
  try {
    const { title, grade, term, year } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    
    const paper = await pastpaperService.createPastPaper({
      title,
      grade: parseInt(grade),
      term: term ? parseInt(term) : undefined,
      year: parseInt(year),
      fileUrl
    });

    res.status(201).json(paper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPastPapers = async (req: Request, res: Response) => {
  try {
    const { grade, term } = req.query;
    
    const papers = await pastpaperService.getPastPapers({
      grade: grade ? parseInt(grade as string) : undefined,
      term: term ? parseInt(term as string) : undefined
    });

    res.json(papers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePastPaper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, grade, term, year } = req.body;
    const file = req.file;

    const dataToUpdate: any = {};
    if (title) dataToUpdate.title = title;
    if (grade) dataToUpdate.grade = parseInt(grade);
    if (term) dataToUpdate.term = parseInt(term);
    if (year) dataToUpdate.year = parseInt(year);

    if (file) {
      dataToUpdate.fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    }

    const paper = await pastpaperService.updatePastPaper(id as string, dataToUpdate);
    res.json(paper);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deletePastPaper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pastpaperService.deletePastPaper(id as string);
    res.json({ message: "Past paper deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
