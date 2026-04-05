'use client';

import { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import { announcementService, Announcement } from '@/services/announcement.service';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAnnouncement: Announcement | null;
}

export function AnnouncementModal({ isOpen, onClose, onSuccess, editingAnnouncement }: AnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    grade: 'overall',
  });
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingAnnouncement) {
        setFormData({
          title: editingAnnouncement.title,
          grade: editingAnnouncement.grade ? editingAnnouncement.grade.toString() : 'overall'
        });
        setDescription(editingAnnouncement.description);
      } else {
        setFormData({ title: '', grade: 'overall' });
        setDescription('');
      }
      setError(null);
    }
  }, [isOpen, editingAnnouncement]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!description || description.trim() === '<p><br></p>') {
        throw new Error('Please enter a valid description for the announcement.');
      }
      
      const payload = {
        title: formData.title,
        description: description,
        grade: formData.grade === 'overall' ? null : parseInt(formData.grade)
      };

      if (editingAnnouncement) {
        await announcementService.updateAnnouncement(editingAnnouncement.id, payload);
      } else {
        await announcementService.createAnnouncement(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-xl font-bold text-rahula-blue">
            {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
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

          <form id="announcement-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                placeholder="e.g. End of Term Practices Schedule"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Target Audience</label>
              <select 
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({...prev, grade: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-white"
              >
                <option value="overall">Overall (All Students)</option>
                {[...Array(13)].map((_, i) => (
                  <option key={i+1} value={i+1}>Grade {i+1} Only</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Description (Rich Text)</label>
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-rahula-blue/20 focus-within:border-transparent transition-all h-[300px] flex flex-col">
                <ReactQuill 
                  theme="snow" 
                  value={description} 
                  onChange={setDescription} 
                  className="flex-grow flex flex-col h-full"
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                      ['blockquote', 'code-block'],
                      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                      ['clean']                                         // remove formatting button
                    ]
                  }}
                  formats={[
                    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent', 'link', 'color', 'background', 'code-block'
                  ]}
                />
              </div>
              <style jsx global>{`
                .quill {
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                  border: none;
                }
                .ql-toolbar {
                  border: none !important;
                  border-bottom: 1px solid #e2e8f0 !important;
                  background-color: #f8fafc;
                  border-radius: 0.75rem 0.75rem 0 0;
                }
                .ql-container {
                  border: none !important;
                  flex-grow: 1;
                  overflow-y: auto;
                  font-family: inherit !important;
                }
                .ql-editor {
                  min-height: 200px;
                  font-size: 1rem;
                  color: #334155;
                }
              `}</style>
            </div>
            
          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
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
            form="announcement-form"
            className="px-6 py-2.5 rounded-xl font-medium bg-rahula-blue text-white hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-75 flex items-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Megaphone size={18} />
            )}
            <span>{editingAnnouncement ? 'Save Changes' : 'Broadcast'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
