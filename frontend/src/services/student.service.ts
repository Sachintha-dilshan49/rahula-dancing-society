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
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// The photo is uploaded as a separate File, so it's excluded from the text payload.
export type CreateStudentDTO = Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'photoUrl'>;

export const studentService = {
  async getStudents(): Promise<Student[]> {
    const response = await fetch(`${API_URL}/students`, { headers: authHeaders() });
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  },

  async createStudent(data: CreateStudentDTO, photo?: File | null): Promise<{ student: Student }> {
    // Sent as multipart/form-data so the optional photo can ride along.
    const form = new FormData();
    form.append('name', data.name);
    form.append('grade', String(data.grade));
    if (data.email) form.append('email', data.email);
    if (data.phone) form.append('phone', data.phone);
    if (data.parentContact) form.append('parentContact', data.parentContact);
    if (data.notes) form.append('notes', data.notes);
    if (photo) form.append('photo', photo);

    const response = await fetch(`${API_URL}/students`, {
      method: "POST",
      // No Content-Type — the browser sets the multipart boundary automatically.
      headers: { Authorization: `Bearer ${authService.getToken()}` },
      body: form,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
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
