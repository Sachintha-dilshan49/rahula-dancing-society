'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { markService, StudentWithMarks, BulkMarkInput } from '@/services/mark.service';

interface BulkAddMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students: StudentWithMarks[];
  grade: number;
  term: number;
}

export function BulkAddMarksModal({ isOpen, onClose, onSuccess, students, grade, term }: BulkAddMarksModalProps) {
  const [marksState, setMarksState] = useState<Record<string, { practical: string, paper: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize state with existing marks if they exist
      const initialState: Record<string, { practical: string, paper: string }> = {};
      students.forEach(student => {
        const termMark = student.marks.find(m => m.term === term);
        initialState[student.id] = {
          practical: termMark && termMark.practicalMark !== null ? termMark.practicalMark.toString() : '',
          paper: termMark && termMark.paperMark !== null ? termMark.paperMark.toString() : ''
        };
      });
      setMarksState(initialState);
      setError(null);
    }
  }, [isOpen, students, term]);

  if (!isOpen) return null;

  const handleInputChange = (studentId: string, field: 'practical' | 'paper', value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    // Max 100 limit
    if (value && parseInt(value) > 100) return;

    setMarksState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Map state into submission payload
      const marksPayload: BulkMarkInput[] = students.map(student => {
        const studentMarks = marksState[student.id] || { practical: '', paper: '' };
        return {
          studentId: student.id,
          grade,
          term,
          practicalMark: studentMarks.practical !== '' ? parseInt(studentMarks.practical) : null,
          paperMark: studentMarks.paper !== '' ? parseInt(studentMarks.paper) : null
        };
      });

      await markService.bulkUpsertMarks(grade, term, marksPayload);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving marks.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <div>
             <h2 className="text-xl font-bold text-rahula-blue">Add/Update Marks - Grade {grade} (Term {term})</h2>
             <p className="text-sm text-slate-500 font-medium">Enter marks for each student (0-100). Leave blank if not available.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* List of students & inputs */}
        <div className="p-6 overflow-y-auto bg-slate-50" style={{ maxHeight: 'calc(90vh - 150px)' }}>
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <form id="bulk-marks-form" onSubmit={handleSubmit} className="space-y-4">
            {students.length === 0 ? (
               <div className="text-center py-8 text-slate-500">No students found in Grade {grade}.</div>
            ) : (
              students.map((student) => (
                <div key={student.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                  
                  {/* Student Info */}
                  <div className="flex items-center space-x-3 lg:w-1/3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-rahula-blue text-white font-bold text-sm shadow-sm shrink-0">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{student.name}</h4>
                      <p className="text-xs text-slate-500">Grade {student.grade}</p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="flex gap-4 lg:w-2/3">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Practical Mark</label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        placeholder="0-100"
                        value={marksState[student.id]?.practical || ''}
                        onChange={(e) => handleInputChange(student.id, 'practical', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue transition-colors"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Paper Mark</label>
                      <input 
                        type="text"
                        inputMode="numeric"
                        placeholder="0-100"
                        value={marksState[student.id]?.paper || ''}
                        onChange={(e) => handleInputChange(student.id, 'paper', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end space-x-3 mt-auto shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="bulk-marks-form"
            className="px-6 py-2.5 rounded-lg font-medium bg-rahula-blue text-white hover:bg-blue-900 transition-colors shadow-sm focus:ring-2 focus:ring-rahula-blue focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={isSubmitting || students.length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Marks</span>
              </>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}
