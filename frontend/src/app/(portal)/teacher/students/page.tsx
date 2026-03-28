import { StudentsTable } from '@/features/students/components/StudentsTable';

export const metadata = {
  title: 'Students | Teacher Portal | Rahula Dance',
  description: 'Manage students for the Rahula Dancing Society',
};

export default function StudentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 max-h-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your dancing society students, their contact details, and grades.
        </p>
      </div>

      {/* Main Content Component */}
      <StudentsTable />
    </div>
  );
}
