'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Timer,
  LayoutDashboard,
  LogOut,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { quizService, Quiz, QuizQuestion, QuizAttempt } from '@/services/quiz.service';
import { useRouter } from 'next/navigation';

export default function StudentQuizTakingPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submitQuiz = useCallback(async () => {
    if (isSubmitting || isFinished) return;
    
    try {
      setIsSubmitting(true);
      const result = await quizService.submitAttempt(params.id, answers);
      setAttempt(result);
      setIsFinished(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  }, [params.id, answers, isSubmitting, isFinished]);

  useEffect(() => {
    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    if (!quiz || isFinished) return;

    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz, isFinished, submitQuiz]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      
      // Check if already attempted
      const existingAttempt = await quizService.getMyAttempt(params.id).catch(() => null);
      if (existingAttempt) {
        setAttempt(existingAttempt);
        setIsFinished(true);
        setLoading(false);
        return;
      }

      const data = await quizService.getQuizById(params.id);
      
      // Check if within time window
      const now = new Date();
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);

      if (now < start) {
        setError('This quiz hasn\'t started yet.');
      } else if (now > end) {
        setError('The quiz time window has ended.');
      } else {
        setQuiz(data);
        setTimeLeft(data.duration * 60);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz.');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-900/10 border-t-rahula-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-blue-900/5 border border-slate-50">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Quiz Unavailable</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">{error}</p>
          <button 
            onClick={() => router.push('/student/quizzes')}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all active:scale-95"
          >
            Go Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (isFinished && attempt) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-16 text-center shadow-2xl shadow-blue-900/5 border border-slate-50 relative overflow-hidden">
          <div className="relative z-10">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg ${
              attempt.score >= 50 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-amber-500 text-white shadow-amber-500/20'
            }`}>
              <Trophy size={48} />
            </div>
            
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Quiz Completed!</h2>
            <p className="text-slate-500 font-medium mb-12">Your score has been recorded permanently.</p>
            
            <div className="bg-slate-50 rounded-[2.5rem] p-10 flex items-center justify-around mb-12 border border-slate-100">
              <div className="text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Your Score</span>
                <span className="text-5xl font-black text-slate-900">{attempt.score.toFixed(0)}%</span>
              </div>
              <div className="w-px h-16 bg-slate-200"></div>
              <div className="text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Correct</span>
                <span className="text-5xl font-black text-slate-900">
                  {Math.round((attempt.score / 100) * attempt.totalMarks)}
                  <span className="text-xl text-slate-300 ml-1">/ {attempt.totalMarks}</span>
                </span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/student/quizzes')}
              className="w-full bg-rahula-blue text-white font-extrabold py-5 rounded-[2rem] hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
            >
              Return to Quizzes
            </button>
          </div>
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-50 rounded-full -translate-x-1/4 translate-y-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Quiz Top Nav */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to leave? Your progress will not be saved until you submit.')) {
                  router.push('/student/quizzes');
                }
              }}
              className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
            <div className="h-10 w-px bg-slate-100 mx-2"></div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg md:text-xl line-clamp-1">{quiz?.title}</h1>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {quiz?.questions?.length}</p>
            </div>
          </div>

          <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border transition-all duration-500 ${
            timeLeft < 60 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'
          }`}>
            <Clock size={20} className={timeLeft < 60 ? 'animate-pulse' : ''} />
            <span className="text-xl font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Question Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-blue-900/5 min-h-[400px] flex flex-col border border-slate-100">
            <div className="flex-1">
              <span className="text-rahula-blue font-black text-xs uppercase tracking-[0.2em] mb-4 block">Question {currentQuestionIndex + 1}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight mb-12">
                {currentQuestion?.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                  const isSelected = answers[currentQuestion?.id || ''] === opt;
                  return (
                    <button 
                      key={opt}
                      onClick={() => setAnswers({...answers, [currentQuestion?.id || '']: opt})}
                      className={`group p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden flex items-center space-x-5 ${
                        isSelected 
                          ? 'border-rahula-blue bg-blue-50 shadow-lg shadow-blue-900/5' 
                          : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-white shadow-sm'
                      }`}
                    >
                      <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center font-black transition-all ${
                        isSelected 
                          ? 'bg-rahula-blue text-white scale-110' 
                          : 'bg-slate-50 text-slate-400 group-hover:bg-rahula-blue/10 group-hover:text-rahula-blue'
                      }`}>
                        {opt}
                      </div>
                      <span className={`text-lg font-bold transition-colors ${
                        isSelected ? 'text-rahula-blue' : 'text-slate-700'
                      }`}>
                        {currentQuestion?.[`option${opt}` as keyof QuizQuestion] as string}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 size={20} className="text-rahula-blue/20" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 md:mt-20 pt-8 border-t border-slate-50 flex items-center justify-between">
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-700 disabled:opacity-0 transition-all font-sans"
              >
                <ChevronLeft size={24} />
                <span>Previous</span>
              </button>

              <div className="flex gap-4">
                {currentQuestionIndex < (quiz?.questions?.length || 0) - 1 ? (
                  <button 
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="flex items-center space-x-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-extrabold hover:bg-black transition-all shadow-xl active:scale-95 group"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button 
                    onClick={submitQuiz}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-emerald-500 text-white px-12 py-5 rounded-[2rem] font-black hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group disabled:opacity-50"
                  >
                    {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle2 size={24} />}
                    <span>Submit Exam</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Navigator */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-800 mb-8 flex items-center space-x-2">
              <LayoutDashboard size={20} className="text-rahula-blue" />
              <span>Exam Navigator</span>
            </h3>
            
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-3">
              {quiz?.questions?.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentQuestionIndex;
                
                return (
                  <button 
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all border-2 relative ${
                      isCurrent 
                        ? 'border-rahula-blue bg-blue-50 text-rahula-blue shadow-lg shadow-blue-900/10' 
                        : isAnswered 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {isAnswered && !isCurrent && (
                      <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 size={8} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-12 space-y-3">
              <div className="flex items-center text-xs font-bold text-slate-500 space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center text-xs font-bold text-slate-500 space-x-3">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center text-xs font-bold text-slate-500 space-x-3">
                <div className="w-3 h-3 rounded-full border-2 border-rahula-blue"></div>
                <span>Current</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100">
            <h4 className="font-extrabold text-amber-800 text-sm flex items-center space-x-2 mb-3">
              <Timer size={16} />
              <span>Exam Tip</span>
            </h4>
            <p className="text-amber-700/80 text-xs font-medium leading-relaxed">
              Don't leave any questions blank! There's no negative marking for incorrect answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
