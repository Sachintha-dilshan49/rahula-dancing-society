import { Request, Response } from 'express';
import * as achievementService from '../services/achievement.service';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await achievementService.getAllAchievements();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, placement, subtitle, year, description } = req.body;
    const achievement = await achievementService.createAchievement({
      title: String(title),
      placement: String(placement),
      subtitle: subtitle ? String(subtitle) : null,
      year: parseInt(String(year), 10),
      description: description ? String(description) : null,
    });
    res.status(201).json({ achievement });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { title, placement, subtitle, year, description } = req.body;
    const updateData: any = {};
    if (title !== undefined) updateData.title = String(title);
    if (placement !== undefined) updateData.placement = String(placement);
    if (subtitle !== undefined) updateData.subtitle = subtitle ? String(subtitle) : null;
    if (year !== undefined) updateData.year = parseInt(String(year), 10);
    if (description !== undefined) updateData.description = description ? String(description) : null;

    const achievement = await achievementService.updateAchievement(id, updateData);
    res.json({ achievement });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await achievementService.deleteAchievement(id);
    res.json({ message: 'Achievement deleted' });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
