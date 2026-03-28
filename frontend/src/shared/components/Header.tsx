'use client';

import { Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      {/* Left side: Greeting */}
      <div>
        <p className="text-sm font-medium text-slate-500">Welcome back,</p>
        <h2 className="text-xl font-bold text-rahula-blue">Mr. Jayasinghe</h2>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 hover:text-rahula-blue rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200"></div>
        
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
