'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { markService, Mark } from '@/services/mark.service';
import { Student } from '@/services/student.service';

interface StudentTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  currentGrade: number;
}

export function StudentTermsModal({ isOpen, onClose, student, currentGrade }: StudentTermsModalProps) {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      loadMarks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, student]);

  const loadMarks = async () => {
    try {
      setLoading(true);
      const data = await markService.getStudentHistoricalMarks(student!.id);
      // Filter marks for the current grade being viewed
      const currentGradeMarks = data.filter(m => m.grade === currentGrade);
      setMarks(currentGradeMarks);
    } catch (error) {
      console.error('Failed to load historical marks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  const calculateAverage = (practical: number | null, paper: number | null) => {
    if (practical === null && paper === null) return null;
    return Math.round(((practical || 0) + (paper || 0)) / 2);
  };

  // Helper to find a specific term mark safely
  const getMarkForTerm = (term: number) => {
    return marks.find(m => m.term === term);
  };

  const calculateOverallAverage = () => {
    let total = 0;
    let count = 0;
    [1, 2, 3].forEach(term => {
      const mk = getMarkForTerm(term);
      if (mk && mk.practicalMark !== null && mk.paperMark !== null) {
        total += calculateAverage(mk.practicalMark, mk.paperMark)!;
        count++;
      }
    });
    return count > 0 ? Math.round(total / count) : null;
  };

  const getOverallByCol = (colProvider: (m: Mark) => number | null) => {
    let total = 0;
    let count = 0;
    [1, 2, 3].forEach(term => {
      const mk = getMarkForTerm(term);
      if (mk) {
        const val = colProvider(mk);
        if (val !== null) {
           total += val;
           count++;
        }
      }
    });
    return count > 0 ? Math.round(total / count) : null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-rahula-blue">{student.name}</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Grade {currentGrade} History</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
             <div className="flex justify-center items-center py-12">
               <div className="w-8 h-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin"></div>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 text-xs font-bold tracking-wider text-slate-500 uppercase">Term</th>
                  <th className="py-3 text-xs font-bold tracking-wider text-slate-500 uppercase text-center">Practical</th>
                  <th className="py-3 text-xs font-bold tracking-wider text-slate-500 uppercase text-center">Paper</th>
                  <th className="py-3 text-xs font-bold tracking-wider text-slate-500 uppercase text-center">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3].map(term => {
                  const termMark = getMarkForTerm(term);
                  const isAvailable = termMark && (termMark.practicalMark !== null || termMark.paperMark !== null);
                  const average = isAvailable ? calculateAverage(termMark.practicalMark, termMark.paperMark) : null;

                  return (
                    <tr key={term} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-semibold text-slate-700">Term {term}</td>
                      <td className="py-4 text-center font-medium text-slate-600">{termMark?.practicalMark ?? '-'}%</td>
                      <td className="py-4 text-center font-medium text-slate-600">{termMark?.paperMark ?? '-'}%</td>
                      <td className="py-4 text-center">
                         {average !== null ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 font-bold text-sm rounded-md">
                              {average}%
                            </span>
                         ) : (
                           <span className="text-slate-400">-</span>
                         )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {/* Overall Average Row */}
              <tfoot className="bg-rahula-blue text-white rounded-b-lg">
                <tr>
                  <td className="py-4 px-4 font-bold rounded-bl-lg">Overall Average</td>
                  <td className="py-4 text-center font-bold">{getOverallByCol(m => m.practicalMark) ?? '-'}%</td>
                  <td className="py-4 text-center font-bold">{getOverallByCol(m => m.paperMark) ?? '-'}%</td>
                  <td className="py-4 text-center rounded-br-lg">
                    {calculateOverallAverage() !== null ? (
                      <span className="px-3 py-1 bg-rahula-gold text-white font-bold text-sm rounded-md border border-yellow-500">
                        {calculateOverallAverage()}%
                      </span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
