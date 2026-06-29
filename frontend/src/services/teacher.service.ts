import { authService } from './auth.service';
import { API_URL } from '@/config/api';

export interface Teacher {
  id: string;
  name: string | null;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateTeacherDTO {
  name: string;
  email: string;
}

function authHeaders(): HeadersInit {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export interface PublicTeacher {
  id: string;
  name: string | null;
}

export const teacherService = {
  // Public — no auth. Used by the About page instructors section.
  async getPublicTeachers(): Promise<PublicTeacher[]> {
    const response = await fetch(`${API_URL}/teachers/public`);
    if (!response.ok) throw new Error('Failed to fetch instructors');
    return response.json();
  },

  async getTeachers(): Promise<Teacher[]> {
    const response = await fetch(`${API_URL}/teachers`, { headers: authHeaders() });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch teachers');
    }
    return response.json();
  },

  async createTeacher(data: CreateTeacherDTO): Promise<{ teacher: Teacher }> {
    const response = await fetch(`${API_URL}/teachers`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create teacher');
    }
    return response.json();
  },

  async deleteTeacher(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/teachers/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete teacher');
    }
  },
};
