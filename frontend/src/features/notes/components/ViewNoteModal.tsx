'use client';

import { X, MessageSquare } from 'lucide-react';
import { Note } from '@/services/note.service';

interface ViewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

export function ViewNoteModal({ isOpen, onClose, note }: ViewNoteModalProps) {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50 shrink-0 gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 truncate">{note.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors shrink-0 bg-white border border-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metadata strip */}
        <div className="px-8 py-3 bg-slate-50 text-sm flex justify-between items-center border-b border-slate-100 shrink-0">
          <span className="font-semibold text-slate-600">📝 Personal Note from Teacher</span>
          <span className="text-slate-400">
            {new Date(note.createdAt).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          <div
            dangerouslySetInnerHTML={{ __html: note.content }}
            className="quill-content text-slate-700"
          />
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      <style jsx global>{`
        .quill-content p { margin-bottom: 1rem; line-height: 1.6; }
        .quill-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .quill-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .quill-content li { margin-bottom: 0.25rem; }
        .quill-content strong { font-weight: 700; color: #0f172a; }
        .quill-content em { font-style: italic; }
        .quill-content u { text-decoration: underline; }
      `}</style>
    </div>
  );
}
