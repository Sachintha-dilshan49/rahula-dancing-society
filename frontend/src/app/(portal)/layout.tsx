import { Sidebar } from '@/shared/components/Sidebar';
import { Header } from '@/shared/components/Header';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar - fixed on the left */}
      <Sidebar />
      
      {/* Main Content Wrapper - offset by Sidebar width (256px/w-64) */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Sticky Header */}
        <Header />
        
        {/* Main Content Scrollable Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
