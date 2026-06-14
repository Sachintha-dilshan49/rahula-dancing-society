'use client';

import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { teacherService, PublicTeacher } from '@/services/teacher.service';

export default function InstructorsSection() {
  const [instructors, setInstructors] = useState<PublicTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherService
      .getPublicTeachers()
      .then(setInstructors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Hide the whole section until at least one teacher has been added
  if (!loading && instructors.length === 0) return null;

  return (
    <section className="bg-[#f4f6fb] py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-rahula-blue text-center mb-12">Our Expert Instructors</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-rahula-blue rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {instructors.map((inst) => (
              <div
                key={inst.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e8ecf8] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-rahula-blue" />
                </div>
                <div>
                  <h4 className="font-extrabold text-rahula-blue text-base leading-tight">{inst.name}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Instructor</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
