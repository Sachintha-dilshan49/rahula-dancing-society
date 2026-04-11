'use client';

import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Timer,
  Trophy,
  History
} from 'lucide-react';
import { quizService, Quiz, QuizAttempt } from '@/services/quiz.service';
import { authService } from '@/services/auth.service';
import Link from 'next/link';

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Record<string, QuizAttempt>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const studentData = await authService.getMe();
      const grade = studentData.studentProfile?.grade;
      if (!grade) return;

      const [quizData] = await Promise.all([
        quizService.getQuizzes(grade)
      ]);

      setQuizzes(quizData);

      // Fetch attempts for each quiz
      const attemptPromises = quizData.map((q: Quiz) => quizService.getMyAttempt(q.id).catch(() => null));
      const attemptResults = await Promise.all(attemptPromises);
      
      const attemptMap: Record<string, QuizAttempt> = {};
      attemptResults.forEach((attempt: QuizAttempt | null, index: number) => {
        if (attempt) attemptMap[quizData[index].id] = attempt;
      });
      setAttempts(attemptMap);

    } catch (error) {
      console.error('Error fetching student quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuizStatus = (quiz: Quiz) => {
    const now = new Date();
    const start = new Date(quiz.startTime);
    const end = new Date(quiz.endTime);
    const attempt = attempts[quiz.id];

    if (attempt) return { label: 'Completed', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2, status: 'completed' };
    if (now < start) return { label: 'Upcoming', color: 'bg-amber-100 text-amber-600', icon: Calendar, status: 'upcoming' };
    if (now > end) return { label: 'Missed', color: 'bg-red-100 text-red-600', icon: AlertCircle, status: 'missed' };
    return { label: 'Active', color: 'bg-blue-100 text-rahula-blue', icon: Timer, status: 'active' };
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Available Quizzes</h1>
          <p className="text-slate-500 font-medium">Attempt your quizzes and track your progress</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rahula-blue transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search for a quiz..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rahula-blue/10 focus:border-rahula-blue transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-72 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuizzes.map((quiz) => {
            const status = getQuizStatus(quiz);
            const attempt = attempts[quiz.id];
            const StatusIcon = status.icon;

            return (
              <div 
                key={quiz.id} 
                className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Status Header */}
                <div className={`px-8 py-4 flex items-center justify-between ${status.color.replace('text-', 'bg-').replace('100', '10')}`}>
                  <span className={`flex items-center space-x-1.5 text-xs font-black uppercase tracking-widest ${status.color}`}>
                    <StatusIcon size={14} />
                    <span>{status.label}</span>
                  </span>
                  {status.status === 'active' && (
                    <span className="flex items-center space-x-1 text-rahula-blue text-xs font-bold animate-pulse">
                      <Clock size={12} />
                      <span>ENDS {new Date(quiz.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  )}
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-slate-800 leading-tight group-hover:text-rahula-blue transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                    {quiz.description || 'Test your knowledge on this topic. All questions follow the MCQ format.'}
                  </p>

                  {/* Info Row */}
                  <div className="mt-8 grid grid-cols-2 gap-6 pb-6 border-b border-slate-50">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                      <div className="flex items-center space-x-2 text-slate-700 font-bold">
                        <Clock size={16} className="text-slate-300" />
                        <span>{quiz.duration} min</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</span>
                      <div className="flex items-center space-x-2 text-slate-700 font-bold">
                        <ClipboardList size={16} className="text-slate-300" />
                        <span>{quiz._count?.questions || 0} Total</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div className="mt-auto pt-6 flex items-center justify-between">
                    {status.status === 'completed' ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Your Result</span>
                        <div className="flex items-center space-x-2">
                          <Trophy size={20} className="text-amber-400" />
                          <span className="text-xl font-extrabold text-slate-800">{attempt?.score.toFixed(0)}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Until</span>
                        <span className="text-sm font-bold text-slate-700">{new Date(quiz.endTime).toLocaleDateString()}</span>
                      </div>
                    )}

                    {status.status === 'active' ? (
                      <Link 
                        href={`/student/quizzes/${quiz.id}`}
                        className="bg-rahula-blue text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 active:scale-95 group/btn"
                      >
                        <span>Start Quiz</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : status.status === 'completed' ? (
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={24} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center border border-slate-100">
                        <History size={24} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 max-w-2xl mx-auto mt-12 shadow-sm">
          <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ClipboardList size={40} className="text-rahula-blue/30" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4">No Quizzes Found</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            There are currently no quizzes scheduled for your grade. Check back later or contact your instructor.
          </p>
        </div>
      )}
    </div>
  );
}
