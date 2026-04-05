'use client';

import { useEffect, useState } from 'react';
import { studentPortalService, StudentProfile } from '@/services/student-portal.service';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { 
  User,
  Mail, 
  Phone, 
  GraduationCap, 
  Users, 
  StickyNote,
  Calendar,
  Shield
} from 'lucide-react';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = authService.getRoleFromToken();
    if (role !== 'STUDENT') {
      router.push('/login');
      return;
    }

    studentPortalService.getMyProfile()
      .then((data) => {
        setProfile(data.studentProfile);
        setUserEmail(data.user.email);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-rahula-blue rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">Profile not found</p>
          <p className="text-sm text-slate-400 mt-1">Please contact your teacher for assistance</p>
        </div>
      </div>
    );
  }

  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const infoItems = [
    { label: 'Full Name', value: profile.name, icon: User, color: 'text-rahula-blue bg-blue-50' },
    { label: 'Current Grade', value: `Grade ${profile.grade}`, icon: GraduationCap, color: 'text-blue-600 bg-blue-50' },
    { label: 'Email Address', value: profile.email || userEmail || 'Not provided', icon: Mail, color: 'text-purple-600 bg-purple-50' },
    { label: 'Phone Number', value: profile.phone || 'Not provided', icon: Phone, color: 'text-amber-600 bg-amber-50' },
    { label: 'Parent Contact', value: profile.parentContact || 'Not provided', icon: Users, color: 'text-rose-600 bg-rose-50' },
    { label: 'Notes', value: profile.notes || 'No notes', icon: StickyNote, color: 'text-cyan-600 bg-cyan-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Your personal information and details</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-rahula-blue via-blue-800 to-blue-900 rounded-2xl p-8 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold backdrop-blur-sm border border-white/20">
            {initials}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-sm font-medium backdrop-blur-sm">
                <GraduationCap size={14} />
                Grade {profile.grade}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-sm font-medium backdrop-blur-sm">
                <Shield size={14} />
                Student
              </span>
            </div>
            {profile.email && (
              <p className="text-blue-200 text-sm mt-2">{profile.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-base font-semibold text-slate-800 break-words">{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-slate-400" />
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Login Email</p>
            <p className="text-sm font-semibold text-slate-700">{userEmail}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
            <p className="text-sm font-semibold text-slate-700">
              {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> If any of your information is incorrect, please contact your teacher to update it through the Teacher Portal.
        </p>
      </div>
    </div>
  );
}
