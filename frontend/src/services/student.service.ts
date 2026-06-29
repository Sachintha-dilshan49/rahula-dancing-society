import { authService } from './auth.service';
import { API_URL } from '@/config/api';

function authHeaders(): HeadersInit {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  email: string | null;
  phone: string | null;
  parentContact: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateStudentDTO = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

export const studentService = {
  async getStudents(): Promise<Student[]> {
    const response = await fetch(`${API_URL}/students`, { headers: authHeaders() });
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  },

  async createStudent(data: CreateStudentDTO): Promise<{ student: Student }> {
    const response = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create student");
    }

    return response.json();
  },


  async updateStudent(id: string, data: Partial<CreateStudentDTO>): Promise<Student> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update student');
    }

    const result = await response.json();
    return result.student;
  },

  async deleteStudent(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
  }
};
