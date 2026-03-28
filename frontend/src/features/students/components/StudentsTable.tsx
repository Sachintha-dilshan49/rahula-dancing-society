'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { studentService, Student } from '@/services/student.service';
import { AddStudentModal } from './AddStudentModal';
import { EditStudentModal } from './EditStudentModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<number | 'ALL'>('ALL');

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStudentActionSuccess = () => {
    loadStudents();
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade === 'ALL' ? true : student.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Table Header / Toolbar */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto flex-1">
          {/* Search */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue transition-colors"
            />
          </div>
          
          {/* Filter */}
          <div className="relative flex items-center pr-2">
            <Filter size={18} className="absolute left-3 text-slate-400 pointer-events-none" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
              className="pl-9 pr-8 py-2.5 appearance-none border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-transparent font-medium text-sm cursor-pointer"
            >
              <option value="ALL">All Grades</option>
              {[6, 7, 8, 9, 10, 11, 12, 13].map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Button */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-rahula-blue text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm shadow-rahula-blue/30 whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span className="font-medium">Add Student</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Grade</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Phone</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Parent Contact</th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="h-8 w-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin"></div>
                    <p>Loading students...</p>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <p>No students found.</p>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-rahula-blue text-white font-medium text-sm shadow-sm">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-xs border border-slate-200">
                      Grade {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.parentContact || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => setStudentToEdit(student)}
                        className="p-1.5 text-slate-400 hover:text-rahula-blue hover:bg-slate-100 rounded transition-colors" 
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setStudentToDelete(student)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={handleStudentActionSuccess} 
      />

      <EditStudentModal
        isOpen={!!studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onSuccess={handleStudentActionSuccess}
        student={studentToEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onSuccess={handleStudentActionSuccess}
        student={studentToDelete}
      />
    </div>
  );
}
