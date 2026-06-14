'use client';

import { useState, useEffect, use } from 'react';
import {
  ArrowLeft,
  Users,
  Trophy,
  ClipboardList,
  AlertCircle,
  Calendar,
  Clock,
  Search,
} from 'lucide-react';
import { quizService, Quiz, QuizAttempt } from '@/services/quiz.service';
import Link from 'next/link';

export default function TeacherQuizAttemptsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [quizData, attemptsData] = await Promise.all([
        quizService.getQuizById(params.id),
        quizService.getAttemptsByQuiz(params.id),
      ]);
      setQuiz(quizData);
      setAttempts(attemptsData);
    } catch (err: any) {
      console.error('Error fetching quiz attempts:', err);
      setError(err.message || 'Failed to load quiz attempts.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAttempts = attempts.filter((a) =>
    (a.student?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageScore =
    attempts.length > 0
      ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
      : 0;

  const scoreColor = (score: number) =>
    score >= 75
      ? 'bg-emerald-100 text-emerald-700'
      : score >= 50
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-900/10 border-t-rahula-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/teacher/quizzes" className="inline-flex items-center space-x-2 text-slate-500 hover:text-rahula-blue font-semibold">
          <ArrowLeft size={18} />
          <span>Back to Quizzes</span>
        </Link>
        <div className="bg-white rounded-3xl border-2 border-dashed border-red-200 p-12 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Could not load attempts</h3>
          <p className="text-slate-500 max-w-sm mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/teacher/quizzes" className="inline-flex items-center space-x-2 text-slate-500 hover:text-rahula-blue font-semibold">
          <ArrowLeft size={18} />
          <span>Back to Quizzes</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{quiz?.title}</h1>
          <p className="text-slate-500 mt-1">{quiz?.description || 'Student attempts and scores'}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5"><Users size={15} /><span>Grade {quiz?.grade}</span></span>
            <span className="flex items-center space-x-1.5"><Clock size={15} /><span>{quiz?.duration} min</span></span>
            {quiz?.startTime && (
              <span className="flex items-center space-x-1.5"><Calendar size={15} /><span>{new Date(quiz.startTime).toLocaleDateString()}</span></span>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl"><Users size={22} className="text-rahula-blue" /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Attempts</p>
            <p className="text-2xl font-bold text-slate-900">{attempts.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl"><Trophy size={22} className="text-emerald-500" /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-bold text-slate-900">{averageScore.toFixed(1)}%</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center space-x-4">
          <div className="p-3 bg-slate-50 rounded-xl"><ClipboardList size={22} className="text-slate-400" /></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Questions</p>
            <p className="text-2xl font-bold text-slate-900">{quiz?.questions?.length ?? quiz?._count?.questions ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative">
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 transition-all"
        />
      </div>

      {/* Attempts Table */}
      {filteredAttempts.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Correct</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{attempt.student?.name || 'Unknown Student'}</td>
                    <td className="px-6 py-4 text-slate-600">{attempt.student?.grade ?? '-'}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {Math.round((attempt.score / 100) * attempt.totalMarks)} / {attempt.totalMarks}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${scoreColor(attempt.score)}`}>
                        {attempt.score.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(attempt.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {attempts.length === 0 ? 'No attempts yet' : 'No matching students'}
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            {attempts.length === 0
              ? 'Once students complete this quiz, their scores will appear here.'
              : 'Try a different search term.'}
          </p>
        </div>
      )}
    </div>
  );
}
