// Pure quiz-scoring logic, deliberately free of any database/Prisma imports so
// it can be unit-tested in isolation and reused.

export interface ScorableQuestion {
  id: string;
  correctAnswer: string; // "A" | "B" | "C" | "D"
}

export interface QuizScore {
  correct: number;
  total: number;
  score: number; // percentage, 0–100, rounded to 2 decimals
}

/**
 * Scores a set of answers against the quiz's questions.
 * `answers` maps questionId -> chosen option ("A"|"B"|"C"|"D").
 * Unanswered or wrong questions simply don't count toward `correct`.
 */
export const scoreAttempt = (
  questions: ScorableQuestion[],
  answers: Record<string, string>
): QuizScore => {
  const safeAnswers = answers ?? {};
  let correct = 0;

  for (const q of questions) {
    if (safeAnswers[q.id] === q.correctAnswer) correct++;
  }

  const total = questions.length;
  const score = total > 0 ? parseFloat(((correct / total) * 100).toFixed(2)) : 0;

  return { correct, total, score };
};
