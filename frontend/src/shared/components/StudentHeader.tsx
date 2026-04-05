'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, LogOut, Key, ChevronDown } from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { studentPortalService } from '@/services/student-portal.service';

interface StudentHeaderProps {
  onMenuClick?: () => void;
}

export function StudentHeader({ onMenuClick }: StudentHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    studentPortalService.getMyProfile()
      .then((data) => {
        if (data.studentProfile) {
          setStudentName(data.studentProfile.name);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    authService.removeToken();
    router.push('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 w-full">
        {/* Left side: Mobile Menu + Greeting */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl md:hidden transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-500">Welcome back,</p>
            <h2 className="text-xl font-bold text-rahula-blue tracking-tight">{studentName}</h2>
          </div>
          
          <div className="sm:hidden">
            <h2 className="text-lg font-bold text-rahula-blue tracking-tight truncate max-w-[150px]">{studentName}</h2>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-6">
          <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-rahula-blue rounded-xl transition-all duration-200">
            <Bell size={20} />
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200"></div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center space-x-3 p-1.5 pr-3 rounded-xl transition-all duration-200 ${isUserMenuOpen ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            >
              <div className="w-9 h-9 rounded-lg bg-rahula-blue text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-900/20">
                {initials}
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                </div>
                
                <button 
                  onClick={() => {
                    setIsChangePasswordOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-rahula-blue transition-colors text-left"
                >
                  <Key size={18} />
                  <span className="font-medium">Change Password</span>
                </button>
                
                <div className="h-[1px] bg-slate-50 my-1 mx-2"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ChangePasswordModal 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
      />
    </>
  );
}
