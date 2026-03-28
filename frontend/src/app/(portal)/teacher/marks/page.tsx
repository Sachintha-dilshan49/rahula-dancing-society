import { MarksTable } from '@/features/marks/components/MarksTable';

export const metadata = {
  title: 'Marks | Teacher Portal | Rahula Dance',
  description: 'Manage student marks based on grade and term.',
};

export default function MarksPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 max-h-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Marks Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          View and manage student marks by grade and term
        </p>
      </div>

      {/* Main Content Component */}
      <MarksTable />
    </div>
  );
}
