'use client';

import { X, Megaphone } from 'lucide-react';
import { Announcement } from '@/services/announcement.service';

interface ViewAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement | null;
}

export function ViewAnnouncementModal({ isOpen, onClose, announcement }: ViewAnnouncementModalProps) {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50 shrink-0 gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg flex items-center justify-center ${announcement.grade === null ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-rahula-blue'}`}>
              <Megaphone size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 truncate">
              {announcement.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors shrink-0 bg-white border border-slate-200"
          >
            <X size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>

        <div className="px-4 md:px-8 py-2 md:py-3 bg-slate-50 text-[10px] md:text-sm text-slate-500 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-100 shrink-0 gap-1 sm:gap-0">
          <span className="font-semibold text-slate-600">
            {announcement.grade === null ? '📢 General Announcement' : `🎓 Grade ${announcement.grade} Announcement`}
          </span>
          <span className="opacity-75 sm:opacity-100">
            {new Date(announcement.createdAt).toLocaleDateString('en-US', {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
        </div>

        <div className="p-4 md:p-8 overflow-y-auto bg-white text-slate-700">
           {/* We use dangerouslySetInnerHTML safely since input is from trusted authenticated Teachers via React Quill */}
           <div dangerouslySetInnerHTML={{ __html: announcement.description }} className="quill-content text-sm md:text-base" />
        </div>

        <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors text-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
      <style jsx global>{`
        .quill-content h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; color: #1e293b; }
        .quill-content h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: #1e293b; }
        .quill-content p { margin-bottom: 1rem; line-height: 1.6; color: #334155; }
        .quill-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; padding-left: 0.5rem; }
        .quill-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; padding-left: 0.5rem; }
        .quill-content li { margin-bottom: 0.25rem; }
        .quill-content a { color: #0284c7; text-decoration: underline; font-weight: 500; }
        .quill-content blockquote { border-left: 4px solid #cbd5e1; padding-left: 1rem; color: #64748b; font-style: italic; margin-bottom: 1rem; background: #f8fafc; padding-top: 0.5rem; padding-bottom: 0.5rem; border-radius: 0 0.5rem 0.5rem 0; }
        .quill-content pre { background-color: #f1f5f9; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; color: #334155; }
        .quill-content strong { font-weight: 700; color: #0f172a; }
        .quill-content em { font-style: italic; }
        .quill-content u { text-decoration: underline; }
      `}</style>
    </div>
  );
}
