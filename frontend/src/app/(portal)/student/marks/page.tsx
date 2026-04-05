'use client';

import { useEffect, useState } from 'react';
import { studentPortalService, StudentMark } from '@/services/student-portal.service';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { FileText, Filter, TrendingUp, Award } from 'lucide-react';

export default function StudentMarksPage() {
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedTerm, setSelectedTerm] = useState<number | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    const role = authService.getRoleFromToken();
    if (role !== 'STUDENT') {
      router.push('/login');
      return;
    }

    studentPortalService.getMyMarks()
      .then(setMarks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-rahula-blue rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading your marks...</p>
        </div>
      </div>
    );
  }

  // Derive available grades and terms for filters
  const availableGrades = [...new Set(marks.map(m => m.grade))].sort();
  const availableTerms = [...new Set(marks.map(m => m.term))].sort();

  // Filter marks
  const filteredMarks = marks.filter(m => {
    if (selectedGrade !== 'all' && m.grade !== selectedGrade) return false;
    if (selectedTerm !== 'all' && m.term !== selectedTerm) return false;
    return true;
  });

  // Calculate filtered stats
  const filteredScores = filteredMarks
    .filter(m => m.practicalMark !== null || m.paperMark !== null)
    .map(m => {
      let maxPossible = 0;
      if (m.practicalMark !== null) maxPossible += 100;
      if (m.paperMark !== null) maxPossible += 100;
      return Math.round((((m.practicalMark ?? 0) + (m.paperMark ?? 0)) / maxPossible) * 100);
    });
  const avgScore = filteredScores.length > 0
    ? (filteredScores.reduce((a, b) => a + b, 0) / filteredScores.length).toFixed(1) + '%'
    : '—';
  const highestScore = filteredScores.length > 0 ? Math.max(...filteredScores) + '%' : '—';
  

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Marks</h1>
        <p className="text-slate-500 mt-1">View your assessment results across all terms</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={18} className="text-rahula-blue" />
          <h3 className="font-semibold text-slate-700">Filters</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Grade</label>
            <select 
              value={selectedGrade} 
              onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium bg-white hover:border-blue-300 focus:border-rahula-blue focus:ring-2 focus:ring-rahula-blue/20 outline-none transition-all"
            >
              <option value="all">All Grades</option>
              {availableGrades.map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Term</label>
            <select 
              value={selectedTerm} 
              onChange={(e) => setSelectedTerm(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium bg-white hover:border-blue-300 focus:border-rahula-blue focus:ring-2 focus:ring-rahula-blue/20 outline-none transition-all"
            >
              <option value="all">All Terms</option>
              {availableTerms.map(t => (
                <option key={t} value={t}>Term {t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <TrendingUp size={22} className="text-rahula-blue" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{avgScore}</p>
            <p className="text-xs text-slate-500 font-medium">Average Score</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Award size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{highestScore || '—'}</p>
            <p className="text-xs text-slate-500 font-medium">Highest Score</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileText size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{filteredMarks.length}</p>
            <p className="text-xs text-slate-500 font-medium">Total Records</p>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Assessment Results</h3>
        </div>

        {filteredMarks.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No marks found</p>
            <p className="text-sm text-slate-400 mt-1">
              {marks.length === 0 
                ? 'Your marks will appear here once your teacher adds them' 
                : 'Try adjusting the filters above'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="min-w-[700px] w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Term</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Practical Mark</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Paper Mark</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarks.map((mark) => {
                  const practical = mark.practicalMark ?? 0;
                  const paper = mark.paperMark ?? 0;
                  
                  let maxPossible = 0;
                  if (mark.practicalMark !== null) maxPossible += 100;
                  if (mark.paperMark !== null) maxPossible += 100;

                  const percentage = maxPossible > 0 ? Math.round(((practical + paper) / maxPossible) * 100) : 0;

                  let performanceColor = 'bg-red-100 text-red-700';
                  let performanceLabel = 'Needs Improvement';
                  if (percentage >= 80) {
                    performanceColor = 'bg-blue-100 text-blue-700';
                    performanceLabel = 'Excellent';
                  } else if (percentage >= 60) {
                    performanceColor = 'bg-blue-100 text-blue-700';
                    performanceLabel = 'Good';
                  } else if (percentage >= 40) {
                    performanceColor = 'bg-amber-100 text-amber-700';
                    performanceLabel = 'Average';
                  }

                  return (
                    <tr key={mark.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-rahula-blue text-xs font-semibold">
                          Grade {mark.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">Term {mark.term}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{mark.practicalMark ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{mark.paperMark ?? '—'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-sm font-bold">
                          {maxPossible > 0 ? `${percentage}%` : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${performanceColor}`}>
                          {performanceLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visual Progress */}
      {filteredMarks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-6">Score Progress</h3>
          <div className="space-y-4">
            {filteredMarks.map((mark) => {
              const practical = mark.practicalMark ?? 0;
              const paper = mark.paperMark ?? 0;
              
              let maxPossible = 0;
              if (mark.practicalMark !== null) maxPossible += 100;
              if (mark.paperMark !== null) maxPossible += 100;
              
              const percentage = maxPossible > 0 ? Math.round(((practical + paper) / maxPossible) * 100) : 0;
              
              let barColor = 'bg-red-500';
              if (percentage >= 80) barColor = 'bg-rahula-blue';
              else if (percentage >= 60) barColor = 'bg-blue-500';
              else if (percentage >= 40) barColor = 'bg-amber-500';

              return (
                <div key={mark.id} className="flex items-center gap-4">
                  <div className="w-20 sm:w-28 text-xs sm:text-sm text-slate-600 font-medium shrink-0">
                    G{mark.grade} T{mark.term}
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-sm font-bold text-slate-700">
                    {maxPossible > 0 ? `${percentage}%` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
