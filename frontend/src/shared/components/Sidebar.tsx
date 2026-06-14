'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Image as ImageIcon,
  Trophy,
  LogOut,
  Music,
  BookMarked,
  Megaphone,
  MessageSquare,
  ClipboardList,
  ShieldCheck
} from 'lucide-react';
import { authService } from '@/services/auth.service';

const baseNavItems = [
  { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/teacher/students', icon: Users },
  { name: 'Marks', href: '/teacher/marks', icon: FileText },
  { name: 'Gallery', href: '/teacher/gallery', icon: ImageIcon },
  { name: 'Achievements', href: '/teacher/achievements', icon: Trophy },
  { name: 'Past Papers', href: '/teacher/pastpapers', icon: BookMarked },
  { name: 'Announcements', href: '/teacher/announcements', icon: Megaphone },
  { name: 'Notes', href: '/teacher/notes', icon: MessageSquare },
  { name: 'Quizzes', href: '/teacher/quizzes', icon: ClipboardList },
];

// Admin-only entry, inserted right after Dashboard
const teachersNavItem = { name: 'Teachers', href: '/teacher/teachers', icon: ShieldCheck };

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(authService.getRoleFromToken() === 'ADMIN');
  }, []);

  const navItems = isAdmin
    ? [baseNavItems[0], teachersNavItem, ...baseNavItems.slice(1)]
    : baseNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="w-10 h-10 bg-rahula-blue rounded-xl flex items-center justify-center text-white mr-3 shadow-md shadow-blue-900/20">
          <Music size={20} />
        </div>
        <div>
          <h1 className="font-bold text-rahula-blue text-lg leading-tight">Rahula Dance</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide">{isAdmin ? 'Admin Portal' : 'Teacher Portal'}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50/50 text-rahula-blue' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-rahula-blue rounded-r-full" />
              )}
              <Icon size={20} className={isActive ? 'text-rahula-blue' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className={`font-medium text-sm ${isActive ? 'font-semibold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors group">
          <LogOut size={20} className="text-red-400 group-hover:text-red-500" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
      </aside>
    </>
  );
}
