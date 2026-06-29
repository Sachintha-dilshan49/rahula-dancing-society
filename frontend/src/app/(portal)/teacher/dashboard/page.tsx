'use client';

import { useEffect, useState } from 'react';
import { Users, FileText, ImageIcon, Trophy, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/config/api';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({ students: 0, marks: 0, gallery: 0, achievements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We would fetch actual stats here, for now using dummy or basic counts based on APIs
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [studentsRes, galleryRes, achievementsRes] = await Promise.all([
          fetch(`${API_URL}/students`, { headers }),
          fetch(`${API_URL}/gallery`, { headers }),
          fetch(`${API_URL}/achievements`, { headers })
        ]);

        const students = await studentsRes.ok ? await studentsRes.json() : [];
        const gallery = await galleryRes.ok ? await galleryRes.json() : [];
        const achievements = await achievementsRes.ok ? await achievementsRes.json() : [];
        
        setStats({
          students: students.length || 0,
          marks: 0, // Need specific marks endpoint to count, left as 0 for now
          gallery: gallery.length || 0,
          achievements: achievements.length || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rahula-blue" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: Users, link: '/teacher/students', color: 'bg-blue-50 text-blue-600' },
    { title: 'Gallery Items', value: stats.gallery, icon: ImageIcon, link: '/teacher/gallery', color: 'bg-blue-50 text-blue-600' },
    { title: 'Achievements', value: stats.achievements, icon: Trophy, link: '/teacher/achievements', color: 'bg-amber-50 text-amber-600' },
    { title: 'Student Marks', value: 'Manage', icon: FileText, link: '/teacher/marks', color: 'bg-purple-50 text-purple-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Teacher Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here is an overview of your society portal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} href={card.link} className="block group">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-rahula-blue transition-colors">{card.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${card.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/teacher/students" className="flex items-center px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-slate-700 hover:text-blue-700 font-medium transition-colors">
              <Users size={18} className="mr-3" /> Add New Student
            </Link>
            <Link href="/teacher/marks" className="flex items-center px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-lg text-slate-700 hover:text-blue-700 font-medium transition-colors">
              <FileText size={18} className="mr-3" /> Update Term Marks
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Portal Information</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            This workspace allows you to manage Rahula College Dancing Society students, update their practical and paper marks, upload achievements, and organize gallery events. All updates made here are instantly reflected on the public portal and the student portal.
          </p>
        </div>
      </div>
    </div>
  );
}
