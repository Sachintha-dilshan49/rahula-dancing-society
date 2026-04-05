'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { pastPaperService, PastPaper } from '@/services/pastpaper.service';
import { BookMarked, Plus, Filter, Edit, Trash2, Download } from 'lucide-react';
import { UploadPastPaperModal } from '@/features/pastpapers/components/UploadPastPaperModal';

export default function TeacherPastPapersPage() {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<PastPaper | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const fetchPapers = useCallback(async () => {
    try {
      const data = await pastPaperService.getPastPapers(selectedGrade, 'all');
      setPapers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade]);

  useEffect(() => {
    const role = authService.getRoleFromToken();
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    fetchPapers();
  }, [router, fetchPapers]);

  const handleDelete = (id: string) => {
    setDeleteError(null);
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await pastPaperService.deletePastPaper(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchPapers();
    } catch (err) {
      console.error(err);
      setConfirmDeleteId(null);
      setDeleteError('Failed to delete past paper. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Past Papers</h1>
          <p className="text-slate-500 mt-1">Manage and upload past examination papers</p>
        </div>
        <button
          onClick={() => {
            setEditingPaper(null);
            setIsModalOpen(true);
          }}
          className="bg-rahula-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Upload Paper</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {deleteError && (
          <div className="mx-5 mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {deleteError}
          </div>
        )}
        {confirmDeleteId && (
          <div className="mx-5 mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
            <p className="text-sm text-amber-800 font-medium">Are you sure you want to delete this past paper?</p>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Yes, Delete</button>
            </div>
          </div>
        )}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-slate-400" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
            >
              <option value="all">All Grades</option>
              {[...Array(13)].map((_, i) => (
                <option key={i+1} value={i+1}>Grade {i+1}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {papers.length} {papers.length === 1 ? 'Paper' : 'Papers'} Found
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin"></div>
          </div>
        ) : papers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookMarked size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No past papers found</p>
            <p className="text-sm text-slate-400 mt-1">Upload a PDF to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Term</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {papers.map((paper) => (
                  <tr key={paper.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <BookMarked size={18} className="text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-800">{paper.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">Grade {paper.grade}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{paper.term ? `Term ${paper.term}` : '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{paper.year}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={paper.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </a>
                        <button
                          onClick={() => {
                            setEditingPaper(paper);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(paper.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UploadPastPaperModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPapers}
        editingPaper={editingPaper}
      />
    </div>
  );
}
