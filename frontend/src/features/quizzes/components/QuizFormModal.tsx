'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  FileSearch,
  Wand2,
  Calendar,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { quizService, Quiz, QuizQuestion } from '@/services/quiz.service';
import { QuizQuestionEditor } from './QuizQuestionEditor';

interface QuizFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingQuiz: Quiz | null;
}

export function QuizFormModal({ isOpen, onClose, onSuccess, editingQuiz }: QuizFormModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz Header Info
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    grade: '',
    startTime: '',
    endTime: '',
    duration: '',
    isPublished: false
  });

  // Questions
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([]);
  
  // Extraction
  const [extractedText, setExtractedText] = useState('');
  const [showExtractionPreview, setShowExtractionPreview] = useState(false);

  useEffect(() => {
    if (editingQuiz) {
      setFormData({
        title: editingQuiz.title,
        description: editingQuiz.description || '',
        grade: editingQuiz.grade.toString(),
        startTime: new Date(editingQuiz.startTime).toISOString().slice(0, 16),
        endTime: new Date(editingQuiz.endTime).toISOString().slice(0, 16),
        duration: editingQuiz.duration.toString(),
        isPublished: editingQuiz.isPublished
      });
      if (editingQuiz.questions) {
        setQuestions(editingQuiz.questions);
      }
    } else {
      setFormData({
        title: '',
        description: '',
        grade: '',
        startTime: '',
        endTime: '',
        duration: '30',
        isPublished: false
      });
      setQuestions([]);
    }
    setStep(1);
    setError(null);
  }, [editingQuiz, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsExtracting(true);
      setError(null);
      const result = await quizService.parseFile(file);
      setExtractedText(result.text);
      setShowExtractionPreview(true);
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from file.');
    } finally {
      setIsExtracting(false);
    }
  };

  const autoGenerateQuestions = () => {
    try {
      // Basic logic to find patterns like "1. Question ... A) ... B) ... C) ... D) ... Ans: B"
      const lines = extractedText.split('\n').filter(l => l.trim().length > 0);
      const newQuestions: Partial<QuizQuestion>[] = [];
      
      let currentQ: any = null;

      lines.forEach(line => {
        const questionMatch = line.match(/^(\d+)[.)]\s*(.*)/);
        if (questionMatch) {
          if (currentQ) newQuestions.push(currentQ);
          currentQ = {
            question: questionMatch[2],
            optionA: '', optionB: '', optionC: '', optionD: '',
            correctAnswer: 'A',
            orderIndex: newQuestions.length
          };
        } else if (currentQ) {
          if (line.match(/^A[.)]\s*(.*)/)) currentQ.optionA = line.match(/^A[.)]\s*(.*)/)![1];
          else if (line.match(/^B[.)]\s*(.*)/)) currentQ.optionB = line.match(/^B[.)]\s*(.*)/)![1];
          else if (line.match(/^C[.)]\s*(.*)/)) currentQ.optionC = line.match(/^C[.)]\s*(.*)/)![1];
          else if (line.match(/^D[.)]\s*(.*)/)) currentQ.optionD = line.match(/^D[.)]\s*(.*)/)![1];
          else if (line.toLowerCase().includes('ans') || line.toLowerCase().includes('answer')) {
            const ansMatch = line.match(/[A-D]/i);
            if (ansMatch) currentQ.correctAnswer = ansMatch[0].toUpperCase();
          } else {
            currentQ.question += ' ' + line;
          }
        }
      });
      if (currentQ) newQuestions.push(currentQ);

      if (newQuestions.length > 0) {
        setQuestions([...questions, ...newQuestions]);
        setShowExtractionPreview(false);
        setExtractedText('');
      } else {
        setError('Could not automatically detect question patterns in the text. Please check the text or enter manually.');
      }
    } catch (err) {
      setError('Error while parsing extracted text.');
    }
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      setError('Please add at least one question.');
      setStep(2);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        grade: parseInt(formData.grade),
        duration: parseInt(formData.duration),
        questions
      };

      if (editingQuiz) {
        await quizService.updateQuiz(editingQuiz.id, payload);
      } else {
        await quizService.createQuiz(payload);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-auto flex flex-col overflow-hidden max-h-[95vh] border border-slate-100">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>
              <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
                <span className={step >= 1 ? 'text-rahula-blue font-bold' : ''}>1. Basic Info</span>
                <ChevronRight size={14} />
                <span className={step >= 2 ? 'text-rahula-blue font-bold' : ''}>2. Questions</span>
                <ChevronRight size={14} />
                <span className={step >= 3 ? 'text-rahula-blue font-bold' : ''}>3. Final Review</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {error && (
            <div className="mb-8 p-5 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-start space-x-3 animate-shake">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <LayoutDashboard size={16} />
                    <span>Quiz Title</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    placeholder="e.g., Grade 10 - Term 1 Dance History"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rahula-blue/10 focus:border-rahula-blue transition-all font-medium text-slate-700 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description (Optional)</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Provide some context for the students..."
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rahula-blue/10 focus:border-rahula-blue transition-all font-medium text-slate-700 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white min-h-[120px]"
                  />
                </div>

                <div className="flex gap-6">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-bold text-slate-700">Target Grade</label>
                    <input 
                      type="number"
                      required
                      min="1" max="13"
                      value={formData.grade}
                      onChange={(e) => setFormData(prev => ({...prev, grade: e.target.value}))}
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rahula-blue/10 focus:border-rahula-blue transition-all font-medium text-slate-700 bg-slate-50/50 focus:bg-white text-center"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-bold text-slate-700">Duration (Minutes)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number"
                        required
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rahula-blue/10 focus:border-rahula-blue transition-all font-medium text-slate-700 bg-slate-50/50 focus:bg-white text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>Start Time</span>
                  </label>
                  <input 
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({...prev, startTime: e.target.value}))}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rahula-blue/10 focus:border-rahula-blue transition-all font-medium text-slate-700 bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>End Time</span>
                  </label>
                  <input 
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({...prev, endTime: e.target.value}))}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rahula-blue/10 focus:border-rahula-blue transition-all font-medium text-slate-700 bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 mt-4">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData(prev => ({...prev, isPublished: e.target.checked}))}
                        className="peer sr-only"
                      />
                      <div className="w-12 h-6 bg-slate-200 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
                      <div className="absolute left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-all"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-rahula-blue transition-colors">Publish immediately</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-2 ml-15 leading-relaxed">
                    If enabled, the quiz will be visible to students in the "Upcoming" state as soon as you save.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              {/* Tool - File Import */}
              <div className="bg-rahula-blue rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl shadow-blue-900/20">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <Wand2 size={24} />
                    <span>Smart Question Generator</span>
                  </h3>
                  <p className="text-white/70 text-sm mt-1 max-w-md">
                    Upload a PDF or Photo of your paper. We'll extract the text and try to auto-generate MCQ questions for you!
                  </p>
                </div>
                <div className="relative z-10 w-full md:w-auto">
                  <label className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl border border-white/20 transition-all cursor-pointer group">
                    {isExtracting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Upload size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                    )}
                    <span className="font-bold">Extract from File</span>
                    <input 
                      type="file" 
                      accept="application/pdf,image/*" 
                      onChange={handleFileUpload}
                      className="hidden" 
                      disabled={isExtracting}
                    />
                  </label>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
              </div>

              {showExtractionPreview && (
                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex flex-col gap-4 animate-in slide-in-from-top duration-500">
                  <div className="flex items-center justify-between">
                    <h4 className="text-amber-800 font-bold flex items-center space-x-2">
                      <FileSearch size={18} />
                      <span>Extraction Results (Review & Correct)</span>
                    </h4>
                    <button 
                      onClick={() => setShowExtractionPreview(false)}
                      className="text-amber-400 hover:text-amber-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <textarea 
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="w-full min-h-[300px] p-4 bg-white border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/10 text-sm font-mono text-slate-700"
                  />
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setShowExtractionPreview(false)}
                      className="px-6 py-2 text-amber-600 font-bold hover:bg-white rounded-xl transition-all"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={autoGenerateQuestions}
                      className="px-6 py-2 bg-amber-500 text-white font-bold hover:bg-amber-600 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20"
                    >
                      <CheckCircle2 size={18} />
                      <span>Generate Questions</span>
                    </button>
                  </div>
                </div>
              )}

              <div className={showExtractionPreview ? 'opacity-30 pointer-events-none' : ''}>
                <QuizQuestionEditor questions={questions} setQuestions={setQuestions} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn max-w-2xl mx-auto space-y-8 text-center bg-slate-50/50 p-12 rounded-[3rem] border border-slate-100">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-slate-900">Quiz Ready to Launch!</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Review the summary below. Once confirmed, your quiz will be {formData.isPublished ? 'published immediately' : 'saved as a draft'}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quiz Title</span>
                  <p className="text-slate-700 font-bold truncate mt-1">{formData.title}</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Target Grade</span>
                  <p className="text-slate-700 font-bold mt-1">Grade {formData.grade}</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time Limit</span>
                  <p className="text-slate-700 font-bold mt-1">{formData.duration} Minutes</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Question Count</span>
                  <p className="text-slate-700 font-bold mt-1">{questions.length} Items</p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-2 mt-8">
                <div className="flex items-center space-x-2 text-slate-500 font-bold text-sm">
                  <Calendar size={16} />
                  <span>Available from {new Date(formData.startTime).toLocaleString()} to {new Date(formData.endTime).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-slate-600 transition-all ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-white border border-slate-200'
            }`}
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:text-slate-700 transition-all"
            >
              Cancel
            </button>
            {step < 3 ? (
              <button 
                onClick={() => {
                  if (step === 1 && (!formData.title || !formData.grade || !formData.startTime || !formData.endTime)) {
                    setError('Please fill in all basic information.');
                    return;
                  }
                  setError(null);
                  setStep(prev => prev + 1);
                }}
                className="flex items-center space-x-2 bg-rahula-blue text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                <span>Continue</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-emerald-500 text-white px-10 py-3 rounded-2xl font-extrabold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle2 size={20} />
                )}
                <span>Finalize & Launch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
