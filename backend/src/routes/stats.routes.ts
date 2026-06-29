import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const [students, achievements, performances] = await Promise.all([
      prisma.student.count(),
      prisma.achievement.count(),
      prisma.galleryItem.count({ where: { category: "PERFORMANCES" } }),
    ]);

    const yearsOfExcellence = new Date().getFullYear() - 2001;

    res.json({ students, achievements, performances, yearsOfExcellence });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
