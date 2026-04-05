import { prisma } from "../config/prisma";
import fs from "fs";
import path from "path";

export const createPastPaper = async (data: { title: string; grade: number; term?: number; year: number; fileUrl: string }) => {
  return prisma.pastPaper.create({ data });
};

export const getPastPapers = async (filters: { grade?: number; term?: number }) => {
  const where: any = {};
  if (filters.grade) where.grade = filters.grade;
  if (filters.term) where.term = filters.term;
  
  return prisma.pastPaper.findMany({
    where,
    orderBy: [{ year: "desc" }, { term: "desc" }]
  });
};

export const updatePastPaper = async (id: string, data: { title?: string; grade?: number; term?: number; year?: number; fileUrl?: string }) => {
  const paper = await prisma.pastPaper.findUnique({ where: { id } });
  if (!paper) throw new Error("Past paper not found");

  // If a new file is uploaded, try to delete the old one
  if (data.fileUrl && paper.fileUrl) {
    try {
      const oldPath = path.join(process.cwd(), 'uploads', path.basename(paper.fileUrl));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    } catch (err) {
      console.error("Failed to delete old past paper file:", err);
    }
  }

  return prisma.pastPaper.update({
    where: { id },
    data
  });
};

export const deletePastPaper = async (id: string) => {
  const paper = await prisma.pastPaper.findUnique({ where: { id } });
  if (paper && paper.fileUrl) {
    try {
      const filename = path.basename(paper.fileUrl);
      const filePath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  }
  return prisma.pastPaper.delete({ where: { id } });
};
