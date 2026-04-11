'use client';

import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Check, 
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { QuizQuestion } from '@/services/quiz.service';

interface QuizQuestionEditorProps {
  questions: Partial<QuizQuestion>[];
  setQuestions: (questions: Partial<QuizQuestion>[]) => void;
}

export function QuizQuestionEditor({ questions, setQuestions }: QuizQuestionEditorProps) {
  
  const addQuestion = () => {
    const newQuestion: Partial<QuizQuestion> = {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      orderIndex: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    // Update orderIndex
    const reordered = newQuestions.map((q, i) => ({ ...q, orderIndex: i }));
    setQuestions(reordered);
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Questions ({questions.length})</h3>
        <button 
          type="button"
          onClick={addQuestion}
          className="flex items-center space-x-2 text-rahula-blue hover:text-blue-900 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Question</span>
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
            <ClipboardList size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No questions added yet.</p>
          <p className="text-slate-400 text-xs mt-1">Add them manually or use the extraction tool.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-900/5 text-rahula-blue rounded-lg flex items-center justify-center font-bold text-sm border border-blue-900/10">
                    {index + 1}
                  </div>
                  <GripVertical className="text-slate-300 cursor-move group-hover:text-slate-400" size={20} />
                </div>
                <button 
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question Text</label>
                  <textarea 
                    value={q.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    placeholder="Enter the question here..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rahula-blue/20 bg-slate-50/50 focus:bg-white transition-all min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                    <div key={opt} className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Option {opt}</label>
                      <div className="relative group/opt">
                        <input 
                          type="text"
                          value={q[`option${opt}` as keyof QuizQuestion] as string}
                          onChange={(e) => updateQuestion(index, `option${opt}` as any, e.target.value)}
                          placeholder={`Enter option ${opt}...`}
                          className={`w-full pl-4 pr-12 py-3 rounded-xl border transition-all ${
                            q.correctAnswer === opt 
                              ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/30' 
                              : 'border-slate-200 bg-slate-50/50 group-hover/opt:border-slate-300'
                          } focus:outline-none focus:ring-2 focus:ring-rahula-blue/20`}
                        />
                        <button 
                          type="button"
                          onClick={() => updateQuestion(index, 'correctAnswer', opt)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                            q.correctAnswer === opt
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white text-slate-300 border border-slate-200 hover:border-emerald-300 hover:text-emerald-500 shadow-sm'
                          }`}
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <button 
          type="button"
          onClick={addQuestion}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-rahula-blue hover:text-rahula-blue hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 group"
        >
          <div className="p-1 bg-slate-100 rounded-lg group-hover:bg-rahula-blue group-hover:text-white transition-colors">
            <Plus size={16} />
          </div>
          <span>Add Another Question</span>
        </button>
      )}
    </div>
  );
}

import { ClipboardList } from 'lucide-react';
