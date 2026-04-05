'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Trophy } from 'lucide-react';
import { achievementService, Achievement } from '@/services/achievement.service';
import { X, Save } from 'lucide-react';

function AchievementModal({
  isOpen, onClose, onSuccess, initial,
}: {
  isOpen: boolean; onClose: () => void; onSuccess: () => void; initial?: Achievement | null;
}) {
  const [form, setForm] = useState({ title: '', placement: '', subtitle: '', year: new Date().getFullYear().toString(), description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setForm({
          title: initial.title,
          placement: initial.placement,
          subtitle: initial.subtitle || '',
          year: initial.year.toString(),
          description: initial.description || '',
        });
      } else {
        setForm({ title: '', placement: '', subtitle: '', year: new Date().getFullYear().toString(), description: '' });
      }
      setError(null);
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.placement || !form.year) { setError('Title, Placement, and Year are required'); return; }
    try {
      setSubmitting(true);
      const payload = { title: form.title, placement: form.placement, subtitle: form.subtitle || null, year: parseInt(form.year), description: form.description || null };
      if (initial) await achievementService.update(initial.id, payload);
      else await achievementService.create(payload);
      onSuccess();
      onClose();
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-rahula-blue">{initial ? 'Edit Achievement' : 'Add Achievement'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <form id="achievement-form" onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-semibold text-slate-700">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. National Youth Dance Championship" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Placement *</label>
              <input name="placement" value={form.placement} onChange={handleChange} placeholder="e.g. Gold Medal, 1st Place" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Year *</label>
              <select name="year" value={form.year} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 appearance-none focus:outline-none focus:ring-2 focus:ring-rahula-blue/20">
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-semibold text-slate-700">Subtitle / Category</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="e.g. Kandyan Dance - Group Performance" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Additional details about this achievement..." className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 resize-none" />
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors" disabled={submitting}>Cancel</button>
          <button type="submit" form="achievement-form" disabled={submitting} className="px-5 py-2.5 rounded-lg font-medium bg-rahula-blue text-white hover:bg-blue-900 transition-colors flex items-center gap-2 disabled:opacity-60">
            {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></> : <><Save size={16} /><span>Save</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    try { setLoading(true); setAchievements(await achievementService.getAll()); } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (a: Achievement) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    try { setDeleting(a.id); await achievementService.delete(a.id); setAchievements(prev => prev.filter(x => x.id !== a.id)); } finally { setDeleting(null); }
  };

  const openEdit = (a: Achievement) => { setEditing(a); setModalOpen(true); };
  const openAdd = () => { setEditing(null); setModalOpen(true); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Achievements</h1>
          <p className="text-sm text-slate-500 mt-1">Manage awards and recognitions displayed on the public site</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-rahula-blue text-white rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm">
          <Plus size={18} /><span>Add Achievement</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Achievement</th>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Year</th>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Placement</th>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="py-16 text-center"><div className="flex justify-center"><div className="w-7 h-7 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin" /></div></td></tr>
            ) : achievements.length === 0 ? (
              <tr><td colSpan={4} className="py-16 text-center text-slate-400">No achievements yet. Click "Add Achievement" to get started.</td></tr>
            ) : (
              achievements.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#f0f3fb] rounded-lg flex items-center justify-center">
                        <Trophy size={18} className="text-rahula-blue" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{a.title}</p>
                        {a.subtitle && <p className="text-xs text-slate-400">{a.subtitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{a.year}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{a.placement}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(a)} className="p-1.5 text-slate-400 hover:text-rahula-blue hover:bg-slate-100 rounded-lg transition-colors"><Edit size={17} /></button>
                      <button onClick={() => handleDelete(a)} disabled={deleting === a.id} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                        {deleting === a.id ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> : <Trash2 size={17} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AchievementModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={load} initial={editing} />
    </div>
  );
}
