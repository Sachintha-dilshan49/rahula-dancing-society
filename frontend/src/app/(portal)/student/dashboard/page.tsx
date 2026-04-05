'use client';

import { useEffect, useState } from 'react';
import { studentPortalService, StudentProfile, StudentMark } from '@/services/student-portal.service';
import { announcementService, Announcement } from '@/services/announcement.service';
import { noteService, Note } from '@/services/note.service';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Award,
  FileText,
  ArrowRight,
  Megaphone,
  Bell,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { ViewAnnouncementModal } from '@/features/announcements/components/ViewAnnouncementModal';
import { ViewNoteModal } from '@/features/notes/components/ViewNoteModal';

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check auth
    const role = authService.getRoleFromToken();
    if (role !== 'STUDENT') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, marksRes] = await Promise.all([
          studentPortalService.getMyProfile(),
          studentPortalService.getMyMarks(),
        ]);
        setProfile(profileRes.studentProfile);
        setMarks(marksRes);

        if (profileRes.studentProfile?.grade) {
          const annRes = await announcementService.getAnnouncements(profileRes.studentProfile.grade);
          setAnnouncements(annRes);
        }

        // Fetch personal notes
        const myNotes = await noteService.getMyNotes();
        setNotes(myNotes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-rahula-blue rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalTerms = new Set(marks.map(m => `${m.grade}-${m.term}`)).size;
  
  const allScores = marks
    .filter(m => m.practicalMark !== null || m.paperMark !== null)
    .map(m => {
      const practical = m.practicalMark ?? 0;
      const paper = m.paperMark ?? 0;
      let maxPossible = 0;
      if (m.practicalMark !== null) maxPossible += 100;
      if (m.paperMark !== null) maxPossible += 100;
      return Math.round(((practical + paper) / maxPossible) * 100);
    });
  
  const averageScore = allScores.length > 0 
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) + '%'
    : '—';

  const highestScore = allScores.length > 0 ? Math.max(...allScores) + '%' : '—';

  // Get latest term marks
  

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome to your student portal overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Current Grade */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <GraduationCap size={24} className="text-rahula-blue" />
            </div>
            <span className="text-xs font-semibold text-rahula-blue bg-blue-50 px-3 py-1 rounded-full">Current</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">Grade {profile?.grade ?? '—'}</p>
          <p className="text-sm text-slate-500 mt-1">Current grade level</p>
        </div>

        {/* Terms Assessed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Terms</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{totalTerms}</p>
          <p className="text-sm text-slate-500 mt-1">Terms with marks</p>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Avg</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{averageScore}</p>
          <p className="text-sm text-slate-500 mt-1">Average total score</p>
        </div>

        {/* Highest Score */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Award size={24} className="text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Best</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{highestScore || '—'}</p>
          <p className="text-sm text-slate-500 mt-1">Highest total score</p>
        </div>
      </div>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden mb-8">
          <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-rahula-blue">
              <Megaphone size={16} />
            </div>
            <h3 className="font-bold text-blue-800">Latest Announcements</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {announcements.slice(0, 3).map((announcement) => (
              <div 
                key={announcement.id} 
                onClick={() => setSelectedAnnouncement(announcement)}
                className="p-5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 items-start group"
              >
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${announcement.grade === null ? 'bg-amber-400' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 group-hover:text-rahula-blue transition-colors line-clamp-1">{announcement.title}</h4>
                  <div className="text-sm text-slate-500 mt-1 line-clamp-1 truncate [&>*]:inline [&>*]:m-0" dangerouslySetInnerHTML={{ __html: announcement.description.slice(0, 150) + '...' }} />
                </div>
                <div className="text-xs font-medium text-slate-400 shrink-0 bg-slate-100 px-2.5 py-1 rounded-md">
                  {new Date(announcement.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Notes Section */}
      {notes.length > 0 && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden mb-8">
          <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <MessageSquare size={16} />
            </div>
            <h3 className="font-bold text-indigo-800">My Notes</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {notes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="p-5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 items-start group"
              >
                <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-indigo-400" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors line-clamp-1">{note.title}</h4>
                  <div className="text-sm text-slate-500 mt-1 line-clamp-1 truncate [&>*]:inline [&>*]:m-0" dangerouslySetInnerHTML={{ __html: note.content.slice(0, 150) + '...' }} />
                </div>
                <div className="text-xs font-medium text-slate-400 shrink-0 bg-slate-100 px-2.5 py-1 rounded-md">
                  {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Marks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Marks */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText size={18} className="text-rahula-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Recent Marks</h3>
                <p className="text-xs text-slate-500">Your latest assessment results</p>
              </div>
            </div>
            <Link 
              href="/student/marks" 
              className="text-sm text-rahula-blue hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {marks.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No marks available yet</p>
              <p className="text-sm text-slate-400 mt-1">Your marks will appear here once your teacher adds them</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1 px-1">
              <table className="min-w-[600px] w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Term</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Practical</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Paper</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marks.slice(-5).reverse().map((mark) => {
                    const practical = mark.practicalMark ?? 0;
                    const paper = mark.paperMark ?? 0;
                    let maxPossible = 0;
                    if (mark.practicalMark !== null) maxPossible += 100;
                    if (mark.paperMark !== null) maxPossible += 100;
                    const percentage = maxPossible > 0 ? Math.round(((practical + paper) / maxPossible) * 100) : 0;
                    
                    return (
                      <tr key={mark.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-rahula-blue text-xs font-semibold">
                            Grade {mark.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">Term {mark.term}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{mark.practicalMark ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{mark.paperMark ?? '—'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-sm font-bold">
                            {maxPossible > 0 ? `${percentage}%` : '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions / Info Card */}
        <div className="space-y-6">
          {/* Student Info Card */}
          <div className="bg-gradient-to-br from-rahula-blue to-blue-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1">{profile?.name ?? 'Student'}</h3>
            <p className="text-blue-100 text-sm mb-4">Grade {profile?.grade ?? '—'} Student</p>
            <div className="space-y-2">
              {profile?.email && (
                <p className="text-blue-100 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
                  {profile.email}
                </p>
              )}
              {profile?.phone && (
                <p className="text-blue-100 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
                  {profile.phone}
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link 
                href="/student/marks"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-rahula-blue transition-colors group"
              >
                <FileText size={18} className="text-slate-400 group-hover:text-rahula-blue" />
                <span className="text-sm font-medium">View All Marks</span>
                <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-rahula-blue/60" />
              </Link>
              <Link 
                href="/student/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-rahula-blue transition-colors group"
              >
                <GraduationCap size={18} className="text-slate-400 group-hover:text-rahula-blue" />
                <span className="text-sm font-medium">My Profile</span>
                <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-rahula-blue/60" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ViewAnnouncementModal 
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement}
      />

      <ViewNoteModal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        note={selectedNote}
      />
    </div>
  );
}
