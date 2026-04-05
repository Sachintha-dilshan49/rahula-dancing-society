'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { announcementService, Announcement } from '@/services/announcement.service';
import { Megaphone, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { AnnouncementModal } from '@/features/announcements/components/AnnouncementModal';

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAnnouncements(selectedFilter);
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    const role = authService.getRoleFromToken();
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    fetchAnnouncements();
  }, [router, fetchAnnouncements]);

  const handleDelete = (id: string) => {
    setDeleteError(null);
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await announcementService.deleteAnnouncement(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setConfirmDeleteId(null);
      setDeleteError('Failed to delete announcement. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
          <p className="text-slate-500 mt-1">Broadcast updates and notices to students</p>
        </div>
        <button
          onClick={() => {
            setEditingAnnouncement(null);
            setIsModalOpen(true);
          }}
          className="bg-rahula-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={20} />
          <span>New Announcement</span>
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
            <p className="text-sm text-amber-800 font-medium">Are you sure you want to delete this announcement?</p>
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
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-white"
            >
              <option value="all">Overall + All Grades</option>
              {[...Array(13)].map((_, i) => (
                <option key={i+1} value={i+1}>Grade {i+1} Only</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {announcements.length} {announcements.length === 1 ? 'Notice' : 'Notices'} Found
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Megaphone size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No announcements found</p>
            <p className="text-sm text-slate-400 mt-1">Create one to notify your students</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Announcement</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Created</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1 ${announcement.grade === null ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Megaphone size={18} />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 line-clamp-1">{announcement.title}</span>
                          <div 
                            className="text-sm text-slate-500 mt-1 line-clamp-2 max-w-lg"
                            dangerouslySetInnerHTML={{ __html: announcement.description }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {announcement.grade === null ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Overall (All Students)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Grade {announcement.grade}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingAnnouncement(announcement);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
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

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAnnouncements}
        editingAnnouncement={editingAnnouncement}
      />
    </div>
  );
}
