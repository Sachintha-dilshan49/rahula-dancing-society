'use client';

import { useState } from 'react';
import { StudentSidebar } from '@/shared/components/StudentSidebar';
import { StudentHeader } from '@/shared/components/StudentHeader';

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-x-hidden">
      {/* Sidebar - fixed on the left */}
      <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Wrapper - offset by Sidebar width (256px/w-64) */}
      <div className="md:ml-64 flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <StudentHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Main Content Scrollable Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
