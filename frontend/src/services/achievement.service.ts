import { API_URL } from '@/config/api';

export interface Achievement {
  id: string;
  title: string;
  placement: string;
  subtitle: string | null;
  year: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateAchievementDTO = Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>;

export const achievementService = {
  async getAll(): Promise<Achievement[]> {
    const res = await fetch(`${API_URL}/achievements`);
    if (!res.ok) throw new Error('Failed to fetch achievements');
    return res.json();
  },

  async create(data: CreateAchievementDTO): Promise<Achievement> {
    const res = await fetch(`${API_URL}/achievements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create achievement');
    const r = await res.json();
    return r.achievement;
  },

  async update(id: string, data: Partial<CreateAchievementDTO>): Promise<Achievement> {
    const res = await fetch(`${API_URL}/achievements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update achievement');
    const r = await res.json();
    return r.achievement;
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/achievements/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete achievement');
  },
};
