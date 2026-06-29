'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { noteService, Note } from '@/services/note.service';
import { studentPortalService } from '@/services/student-portal.service';
import { MessageSquare, Plus, Trash2, User, Users } from 'lucide-react';
import { SendNoteModal } from '@/features/notes/components/SendNoteModal';
import { API_URL } from '@/config/api';

interface Student { id: string; name: string; grade: number; }

export default function TeacherNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await noteService.getAllNotes(
        filterGrade !== 'all' ? { grade: filterGrade } : undefined
      );
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterGrade]);

  useEffect(() => {
    const role = authService.getRoleFromToken();
    if (role !== 'TEACHER' && role !== 'ADMIN') { router.push('/login'); return; }

    // Load students for the modal dropdown
    const token = authService.getToken();
    fetch(`${API_URL}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetchNotes();
  }, [router, fetchNotes]);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await noteService.deleteNote(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchNotes();
    } catch (err) {
      setConfirmDeleteId(null);
      setDeleteError('Failed to delete note. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notes</h1>
          <p className="text-slate-500 mt-1">Send personal notes to individual students or groups</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rahula-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={20} />
          Send Note
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Delete error */}
        {deleteError && (
          <div className="mx-5 mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {deleteError}
          </div>
        )}
        {/* Confirm delete banner */}
        {confirmDeleteId && (
          <div className="mx-5 mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800 font-medium">Are you sure you want to delete this note?</p>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Yes, Delete</button>
            </div>
          </div>
        )}
        {/* Filter bar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <select
            value={filterGrade}
            onChange={e => setFilterGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-white"
          >
            <option value="all">All Grades</option>
            {[...Array(13)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
            ))}
          </select>
          <span className="text-sm text-slate-500 font-medium">{notes.length} {notes.length === 1 ? 'Note' : 'Notes'}</span>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No notes sent yet</p>
            <p className="text-sm text-slate-400 mt-1">Click "Send Note" to write to a student</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipient</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes.map(note => (
                  <tr key={note.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 shrink-0 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mt-0.5">
                          <MessageSquare size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{note.title}</p>
                          <div
                            className="text-sm text-slate-500 mt-0.5 line-clamp-1 max-w-md [&>*]:inline [&>*]:m-0"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{note.student?.name}</span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          Gr. {note.student?.grade}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(note.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SendNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchNotes}
        students={students}
      />
    </div>
  );
}
