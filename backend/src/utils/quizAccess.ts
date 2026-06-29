// Pure authorization rules for student quiz access, kept free of Prisma/HTTP so
// the exam-integrity logic can be unit-tested in isolation.

export interface QuizAccessInfo {
  isPublished: boolean;
  startTime: Date | string;
}

export type QuizAccessResult =
  | { allowed: true }
  | { allowed: false; status: 404 | 403; message: string };

/**
 * Decides whether a STUDENT may read a quiz (including its questions).
 * Students may only access a quiz that is published and has already started —
 * this prevents pulling questions from the API before a quiz opens.
 * Teachers/admins bypass this check entirely.
 */
export const checkStudentQuizAccess = (
  quiz: QuizAccessInfo,
  now: Date = new Date()
): QuizAccessResult => {
  if (!quiz.isPublished) {
    // Don't reveal that an unpublished quiz exists.
    return { allowed: false, status: 404, message: "Quiz not found" };
  }

  if (now < new Date(quiz.startTime)) {
    return { allowed: false, status: 403, message: "This quiz hasn't started yet." };
  }

  return { allowed: true };
};
