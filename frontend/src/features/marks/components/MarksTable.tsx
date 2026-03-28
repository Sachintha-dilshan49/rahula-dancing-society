'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { markService, StudentWithMarks } from '@/services/mark.service';
import { BulkAddMarksModal } from './BulkAddMarksModal';
import { StudentTermsModal } from './StudentTermsModal';
import { Student } from '@/services/student.service';

export function MarksTable() {
  const [students, setStudents] = useState<StudentWithMarks[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [studentModalData, setStudentModalData] = useState<Student | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await markService.getStudentsWithMarks(selectedGrade, selectedTerm);
      setStudents(data);
    } catch (error) {
      console.error('Failed to load marks:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade, selectedTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredStudents = students.filter(
    (student) => student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateAverage = (practical: number | null, paper: number | null) => {
    if (practical === null && paper === null) return null;
    return Math.round(((practical || 0) + (paper || 0)) / 2);
  };

  return (
    <div className="space-y-6">
      {/* Controls Container (from mockup layout) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grade Selector */}
          <div className="space-y-2">
             <label className="text-sm font-semibold text-slate-700">Grade</label>
             <select 
               value={selectedGrade}
               onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
               className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-slate-50 transition-colors appearance-none"
             >
               {[6, 7, 8, 9, 10, 11, 12, 13].map(g => (
                 <option key={g} value={g}>Grade {g}</option>
               ))}
             </select>
          </div>

          {/* Term Selector */}
          <div className="space-y-2">
             <label className="text-sm font-semibold text-slate-700">Term</label>
             <select 
               value={selectedTerm}
               onChange={(e) => setSelectedTerm(parseInt(e.target.value))}
               className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-slate-50 transition-colors appearance-none"
             >
               {[1, 2, 3].map(t => (
                 <option key={t} value={t}>Term {t}</option>
               ))}
             </select>
          </div>

          {/* Search */}
          <div className="space-y-2">
             <label className="text-sm font-semibold text-slate-700">Search Student</label>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-slate-50 transition-colors"
                />
             </div>
          </div>
        </div>
        
        <div className="mt-8">
           <button 
             onClick={() => setIsBulkModalOpen(true)}
             className="px-6 py-2.5 bg-rahula-blue text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm font-medium flex items-center space-x-2"
           >
              <Plus size={18} />
              <span>Add/Update Marks for Term {selectedTerm}</span>
           </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase text-center">Practical</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase text-center">Paper</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase text-center">Average</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center space-x-3">
                      <div className="w-6 h-6 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin"></div>
                      <p>Fetching marks...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No students currently assigned to Grade {selectedGrade}.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const termMark = student.marks.find(m => m.term === selectedTerm);
                  const average = calculateAverage(termMark?.practicalMark ?? null, termMark?.paperMark ?? null);
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-rahula-blue text-white font-medium text-sm shadow-sm shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block leading-tight">{student.name}</span>
                            <span className="text-xs text-slate-400 font-medium tracking-wide">Grade {student.grade}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {termMark?.practicalMark ?? '-'}%
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {termMark?.paperMark ?? '-'}%
                      </td>
                      <td className="px-6 py-4 text-center">
                         {average !== null ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 font-bold text-sm rounded-md border border-green-200">
                              {average}%
                            </span>
                         ) : (
                           <span className="text-slate-400">-</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setStudentModalData(student)}
                          className="text-sm font-semibold text-rahula-blue hover:text-blue-900 hover:underline transition-all"
                        >
                          View All Terms &gt;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <BulkAddMarksModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        onSuccess={loadData}
        students={students}
        grade={selectedGrade}
        term={selectedTerm}
      />

      <StudentTermsModal 
        isOpen={!!studentModalData} 
        onClose={() => setStudentModalData(null)} 
        student={studentModalData}
        currentGrade={selectedGrade}
      />
    </div>
  );
}
