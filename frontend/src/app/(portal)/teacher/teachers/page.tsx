'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Mail, X, Check, UserCog, ShieldCheck } from 'lucide-react';
import { teacherService, Teacher } from '@/services/teacher.service';
import { authService } from '@/services/auth.service';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

function AddTeacherModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const reset = () => { setName(''); setEmail(''); setError(null); setSuccessEmail(null); };

  useEffect(() => { if (!isOpen) reset(); }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) { setError('Name and email are required.'); return; }
    try {
      setIsSubmitting(true);
      await teacherService.createTeacher({ name: name.trim(), email: email.trim() });
      setSuccessEmail(email.trim());
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create teacher.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successEmail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Teacher Added!</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 my-6 text-left">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">Login credentials sent by email</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  A welcome email with the login email and a temporary password has been sent to{' '}
                  <span className="font-bold">{successEmail}</span>.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-rahula-blue">Add New Teacher</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nimal Fernando"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue bg-slate-50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 focus:border-rahula-blue bg-slate-50 transition-colors"
            />
            <p className="text-[11px] text-slate-500">A generated password will be emailed to this address for first login.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-lg font-medium bg-rahula-blue text-white hover:bg-blue-900 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60">
              {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></> : <><Plus size={16} /><span>Add Teacher</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminTeachersPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmTeacher, setConfirmTeacher] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Guard: ADMIN only
  useEffect(() => {
    const role = authService.getRoleFromToken();
    if (role !== 'ADMIN') {
      router.replace('/teacher/dashboard');
      return;
    }
    setAuthorized(true);
  }, [router]);

  const load = async () => {
    try {
      setLoading(true);
      setTeachers(await teacherService.getTeachers());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) load();
  }, [authorized]);

  const handleDelete = async () => {
    if (!confirmTeacher) return;
    try {
      setDeleting(true);
      await teacherService.deleteTeacher(confirmTeacher.id);
      setTeachers((prev) => prev.filter((t) => t.id !== confirmTeacher.id));
      setConfirmTeacher(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = teachers.filter(
    (t) =>
      (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!authorized) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={24} className="text-rahula-blue" /> Teachers
          </h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage teacher accounts. Teachers can manage students and content.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-rahula-blue text-white rounded-xl font-medium hover:bg-blue-900 transition-colors shadow-sm"
        >
          <Plus size={18} /><span>Add Teacher</span>
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teachers..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rahula-blue/20"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Teacher</th>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Added</th>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="py-16 text-center"><div className="flex justify-center"><div className="w-7 h-7 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin" /></div></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="py-16 text-center text-slate-400">No teachers yet. Click &quot;Add Teacher&quot; to create the first one.</td></tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#f0f3fb] rounded-lg flex items-center justify-center">
                        <UserCog size={18} className="text-rahula-blue" />
                      </div>
                      <span className="font-semibold text-slate-800">{t.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{t.email}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{new Date(t.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setConfirmTeacher(t)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddTeacherModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={load} />

      <ConfirmDialog
        isOpen={!!confirmTeacher}
        title="Delete Teacher"
        message={<>Are you sure you want to delete <strong className="text-slate-900">{confirmTeacher?.name || confirmTeacher?.email}</strong>? They will lose access to the system immediately.</>}
        confirmLabel="Yes, Delete"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setConfirmTeacher(null)}
      />
    </div>
  );
}
