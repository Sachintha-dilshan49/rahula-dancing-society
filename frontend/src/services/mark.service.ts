import { Student } from './student.service';

const API_URL = 'http://localhost:5000/api';

export interface Mark {
  id: string;
  studentId: string;
  grade: number;
  term: number;
  practicalMark: number | null;
  paperMark: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentWithMarks extends Student {
  marks: Mark[];
}

export interface BulkMarkInput {
  studentId: string;
  grade: number;
  term: number;
  practicalMark: number | null;
  paperMark: number | null;
}

export const markService = {
  async getStudentsWithMarks(grade: number, term: number): Promise<StudentWithMarks[]> {
    const response = await fetch(`${API_URL}/marks?grade=${grade}&term=${term}`);
    if (!response.ok) {
      throw new Error('Failed to fetch marks');
    }
    return response.json();
  },

  async getStudentHistoricalMarks(studentId: string): Promise<Mark[]> {
    const response = await fetch(`${API_URL}/marks/student/${studentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch historical marks');
    }
    return response.json();
  },

  async bulkUpsertMarks(grade: number, term: number, marks: BulkMarkInput[]): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/marks/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grade, term, marks }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save marks');
    }
    
    return response.json();
  }
};
