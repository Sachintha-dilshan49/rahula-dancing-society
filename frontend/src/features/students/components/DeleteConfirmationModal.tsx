'use client';

import { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { studentService, Student } from '@/services/student.service';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: Student | null;
}

export function DeleteConfirmationModal({ isOpen, onClose, onSuccess, student }: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await studentService.deleteStudent(student.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the student.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h2 className="text-xl font-bold flex items-center text-slate-800">
            <AlertTriangle className="text-red-500 mr-2" size={24} />
            Confirm Deletion
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <p className="text-slate-600">
            Are you sure you want to remove <strong className="text-slate-900">{student.name}</strong> from the system?
          </p>
          <p className="text-sm text-red-500 mt-2 font-medium">
            This action cannot be undone and will permanently delete all associated marks and records.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="px-5 py-2.5 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span>Deleting...</span>
               </>
            ) : (
              <>
                 <Trash2 size={18} />
                 <span>Yes, Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
