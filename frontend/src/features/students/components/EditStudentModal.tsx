'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { studentService, Student } from '@/services/student.service';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: Student | null;
}

export function EditStudentModal({ isOpen, onClose, onSuccess, student }: EditStudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    email: '',
    phone: '',
    parentContact: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        name: student.name || '',
        grade: student.grade?.toString() || '',
        email: student.email || '',
        phone: student.phone || '',
        parentContact: student.parentContact || '',
        notes: student.notes || ''
      });
      setError(null);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name || !formData.grade) {
        throw new Error('Name and Grade are required fields.');
      }

      await studentService.updateStudent(student.id, {
        name: formData.name,
        grade: parseInt(formData.grade),
        email: formData.email || null,
        phone: formData.phone || null,
        parentContact: formData.parentContact || null,
        notes: formData.notes || null
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-rahula-blue">Edit Student Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <form id="edit-student-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue bg-slate-50 transition-colors"
                  required
                />
              </div>

              {/* Grade */}
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-semibold text-slate-700">Grade *</label>
                <select 
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue bg-slate-50 transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select Grade</option>
                  {[6, 7, 8, 9, 10, 11, 12, 13].map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue bg-slate-50 transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Student Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue bg-slate-50 transition-colors"
                />
              </div>

              {/* Parent Contact */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Parent Contact</label>
                <input 
                  type="tel" 
                  name="parentContact"
                  value={formData.parentContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue bg-slate-50 transition-colors"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2 col-span-1 md:col-span-2 flex flex-col">
                <label className="text-sm font-semibold text-slate-700">Additional Notes</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue bg-slate-50 transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 mt-auto">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="edit-student-form"
            className="px-6 py-2.5 rounded-lg font-medium bg-rahula-blue text-white hover:bg-blue-900 transition-colors shadow-sm focus:ring-2 focus:ring-rahula-blue focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
