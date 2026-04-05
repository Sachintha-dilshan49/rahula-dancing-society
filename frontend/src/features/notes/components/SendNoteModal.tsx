'use client';

import { useState, useEffect } from 'react';
import { X, Send, User, Users } from 'lucide-react';
import { noteService } from '@/services/note.service';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Student {
  id: string;
  name: string;
  grade: number;
}

interface SendNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students: Student[];
}

export function SendNoteModal({ isOpen, onClose, onSuccess, students }: SendNoteModalProps) {
  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [studentId, setStudentId] = useState('');
  const [grade, setGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setStudentId('');
      setGrade('');
      setSearchQuery('');
      setError(null);
      setMode('individual');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const plainContent = content.replace(/<[^>]*>/g, '').trim();
    if (!title.trim()) return setError('Please enter a title.');
    if (!plainContent) return setError('Please enter a description.');
    if (mode === 'individual' && !studentId) return setError('Please select a student.');
    if (mode === 'group' && !grade) return setError('Please select a grade.');

    setIsSubmitting(true);
    try {
      if (mode === 'individual') {
        await noteService.createNote({ title, content, studentId });
      } else {
        await noteService.createNoteForGrade({ title, content, grade: parseInt(grade) });
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send note';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-rahula-blue">Send a Note</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-5">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
          )}

          {/* Mode Toggle */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode('individual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm border-2 transition-all ${
                mode === 'individual'
                  ? 'border-rahula-blue bg-rahula-blue/5 text-rahula-blue'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <User size={16} />
              Individual Student
            </button>
            <button
              type="button"
              onClick={() => setMode('group')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm border-2 transition-all ${
                mode === 'group'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <Users size={16} />
              Entire Grade
            </button>
          </div>

          <form id="send-note-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient */}
            {mode === 'individual' ? (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Student</label>
                <input
                  type="text"
                  placeholder="Search student by name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 text-sm"
                />
                {searchQuery && (
                  <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl bg-white shadow-sm divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-slate-400">No students found</p>
                    ) : (
                      filteredStudents.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setStudentId(s.id); setSearchQuery(s.name); }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex justify-between items-center ${studentId === s.id ? 'bg-rahula-blue/5' : ''}`}
                        >
                          <span className="font-medium text-slate-800">{s.name}</span>
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Grade {s.grade}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Target Grade</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                >
                  <option value="">Select a grade...</option>
                  {[...Array(13)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Practice attendance reminder"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
              />
            </div>

            {/* Rich Text Content */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Note Content</label>
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-rahula-blue/20 h-[220px] flex flex-col">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  className="flex-grow flex flex-col h-full"
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['clean'],
                    ],
                  }}
                  formats={['bold', 'italic', 'underline', 'list', 'bullet']}
                />
              </div>
              <style jsx global>{`
                .quill { display: flex; flex-direction: column; height: 100%; border: none; }
                .ql-toolbar { border: none !important; border-bottom: 1px solid #e2e8f0 !important; background: #f8fafc; }
                .ql-container { border: none !important; flex-grow: 1; overflow-y: auto; font-family: inherit !important; }
                .ql-editor { min-height: 120px; font-size: 0.95rem; color: #334155; }
              `}</style>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-medium text-slate-600 border border-slate-200 hover:bg-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="send-note-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-medium bg-rahula-blue text-white hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-75 flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
            <span>Send Note</span>
          </button>
        </div>
      </div>
    </div>
  );
}
