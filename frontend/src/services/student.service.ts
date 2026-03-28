const API_URL = 'http://localhost:5000/api';

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
    const response = await fetch(`${API_URL}/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  },

  async createStudent(data: CreateStudentDTO): Promise<Student> {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create student');
    }
    
    const result = await response.json();
    return result.student;
  },

  async updateStudent(id: string, data: Partial<CreateStudentDTO>): Promise<Student> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
  }
};
