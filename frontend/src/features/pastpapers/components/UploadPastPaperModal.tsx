'use client';

import { useState, useEffect } from 'react';
import { X, Upload, File as FileIcon } from 'lucide-react';
import { pastPaperService, PastPaper } from '@/services/pastpaper.service';

interface UploadPastPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPaper: PastPaper | null;
}

export function UploadPastPaperModal({ isOpen, onClose, onSuccess, editingPaper }: UploadPastPaperModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    grade: '',
    term: '',
    year: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingPaper) {
        setFormData({
          title: editingPaper.title,
          grade: editingPaper.grade.toString(),
          term: editingPaper.term ? editingPaper.term.toString() : '',
          year: editingPaper.year.toString()
        });
      } else {
        setFormData({ title: '', grade: '', term: '', year: new Date().getFullYear().toString() });
      }
      setFile(null);
      setError(null);
    }
  }, [isOpen, editingPaper]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!editingPaper && !file) {
        throw new Error('Please select a PDF file to upload.');
      }
      
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('grade', formData.grade);
      if (formData.term) payload.append('term', formData.term);
      payload.append('year', formData.year);
      if (file) payload.append('file', file);

      if (editingPaper) {
        await pastPaperService.updatePastPaper(editingPaper.id, payload);
      } else {
        await pastPaperService.uploadPastPaper(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error saving past paper');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-rahula-blue">
            {editingPaper ? 'Edit Past Paper' : 'Upload Past Paper'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form id="pastpaper-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                placeholder="e.g. 2023 End of Year Exam"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Grade</label>
                <input 
                  type="number" 
                  required
                  min="1" max="13"
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({...prev, grade: e.target.value}))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm font-semibold text-slate-700">Term (Optional)</label>
                <input 
                  type="number" 
                  min="1" max="3"
                  value={formData.term}
                  onChange={(e) => setFormData(prev => ({...prev, term: e.target.value}))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Year</label>
              <input 
                type="number" 
                required
                min="1990" max="2100"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({...prev, year: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
              />
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-sm font-semibold text-slate-700">Past Paper PDF</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:bg-slate-50 transition-colors relative cursor-pointer group">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-rahula-blue transition-colors" />
                  <div className="flex text-sm text-slate-600 justify-center">
                    <span className="relative rounded-md font-medium text-rahula-blue hover:text-blue-900 focus-within:outline-none">
                      <span>{file ? file.name : (editingPaper ? 'Upload new PDF to replace' : 'Upload a PDF file')}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">PDF up to 50MB</p>
                </div>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-slate-600 border border-slate-200 hover:bg-white transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="pastpaper-form"
            className="px-6 py-2.5 rounded-xl font-medium bg-rahula-blue text-white hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-75 flex items-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <FileIcon size={18} />
            )}
            <span>{editingPaper ? 'Save Changes' : 'Upload'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
