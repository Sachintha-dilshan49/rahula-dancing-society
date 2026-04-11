'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  X
} from 'lucide-react';
import { quizService, Quiz } from '@/services/quiz.service';
import { QuizFormModal } from "@/features/quizzes/components/QuizFormModal";
import Link from 'next/link';

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        setStatus(null);
        await quizService.deleteQuiz(id);
        setStatus({ type: 'success', message: 'Quiz deleted successfully!' });
        fetchQuizzes();
        // Clear success message after 3 seconds
        setTimeout(() => setStatus(null), 3000);
      } catch (error: any) {
        console.error('Error deleting quiz:', error);
        setStatus({ 
          type: 'error', 
          message: error.message || 'Failed to delete quiz. Check console for details.' 
        });
      }
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatus = (quiz: Quiz) => {
    const now = new Date();
    const start = new Date(quiz.startTime);
    const end = new Date(quiz.endTime);

    if (!quiz.isPublished) return { label: 'Draft', color: 'bg-slate-100 text-slate-600' };
    if (now < start) return { label: 'Upcoming', color: 'bg-amber-100 text-amber-600' };
    if (now > end) return { label: 'Ended', color: 'bg-red-100 text-red-600' };
    return { label: 'Active', color: 'bg-emerald-100 text-emerald-600' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quizzes</h1>
          <p className="text-slate-500 mt-1">Manage and monitor student quizzes</p>
        </div>
        <button 
          onClick={() => {
            setEditingQuiz(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center space-x-2 bg-rahula-blue text-white px-6 py-3 rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 font-semibold"
        >
          <Plus size={20} />
          <span>Create Quiz</span>
        </button>
      </div>
      {/* Status Alerts */}
      {status && (
        <div className={`p-4 rounded-2xl flex items-center justify-between animate-fadeIn border ${
          status.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          <div className="flex items-center space-x-3">
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium text-sm">{status.message}</span>
          </div>
          <button onClick={() => setStatus(null)} className="p-1 hover:bg-black/5 rounded-lg">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center space-x-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const status = getStatus(quiz);
            return (
              <div key={quiz.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${status.color}`}>
                      {status.label}
                    </span>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingQuiz(quiz);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-rahula-blue hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(quiz.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <Link href={`/teacher/quizzes/${quiz.id}`} className="block group/title">
                    <h3 className="text-xl font-bold text-slate-900 group-hover/title:text-rahula-blue transition-colors line-clamp-1">
                      {quiz.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2 min-h-[2.5rem]">
                    {quiz.description || 'No description provided.'}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <Users size={16} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">Grade</span>
                        <span className="text-sm font-bold text-slate-700">{quiz.grade}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <ClipboardList size={16} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">Questions</span>
                        <span className="text-sm font-bold text-slate-700">{quiz._count?.questions || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                    <Calendar size={14} />
                    <span>{new Date(quiz.startTime).toLocaleDateString()}</span>
                  </div>
                  <Link 
                    href={`/teacher/quizzes/${quiz.id}`}
                    className="text-rahula-blue text-xs font-bold flex items-center space-x-1 hover:underline"
                  >
                    <span>View Attempts</span>
                    <Eye size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No quizzes found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Start by creating your first quiz to monitor student progress.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-rahula-blue text-white px-6 py-3 rounded-xl hover:bg-blue-900 transition-all font-semibold"
          >
            <Plus size={20} />
            <span>Create First Quiz</span>
          </button>
        </div>
      )}

      {isModalOpen && (
        <QuizFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchQuizzes();
          }}
          editingQuiz={editingQuiz}
        />
      )}
    </div>
  );
}
