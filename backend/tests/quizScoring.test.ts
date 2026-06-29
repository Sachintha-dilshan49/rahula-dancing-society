import { describe, it, expect } from "vitest";
import { scoreAttempt, ScorableQuestion } from "../src/utils/quizScoring";

const questions: ScorableQuestion[] = [
  { id: "q1", correctAnswer: "A" },
  { id: "q2", correctAnswer: "B" },
  { id: "q3", correctAnswer: "C" },
  { id: "q4", correctAnswer: "D" },
];

describe("scoreAttempt", () => {
  it("scores a fully correct attempt as 100", () => {
    const result = scoreAttempt(questions, { q1: "A", q2: "B", q3: "C", q4: "D" });
    expect(result).toEqual({ correct: 4, total: 4, score: 100 });
  });

  it("scores a fully wrong attempt as 0", () => {
    const result = scoreAttempt(questions, { q1: "B", q2: "C", q3: "D", q4: "A" });
    expect(result.correct).toBe(0);
    expect(result.score).toBe(0);
  });

  it("scores partial answers correctly and rounds to 2 decimals", () => {
    // 1 of 3 correct => 33.33%
    const threeQ = questions.slice(0, 3);
    const result = scoreAttempt(threeQ, { q1: "A", q2: "Z", q3: "Z" });
    expect(result.correct).toBe(1);
    expect(result.score).toBe(33.33);
  });

  it("treats missing answers as wrong", () => {
    const result = scoreAttempt(questions, { q1: "A" });
    expect(result.correct).toBe(1);
    expect(result.score).toBe(25);
  });

  it("ignores answers for unknown question ids", () => {
    const result = scoreAttempt(questions, { q1: "A", bogus: "A" });
    expect(result.correct).toBe(1);
  });

  it("returns score 0 for a quiz with no questions (no divide-by-zero)", () => {
    const result = scoreAttempt([], { q1: "A" });
    expect(result).toEqual({ correct: 0, total: 0, score: 0 });
  });

  it("does not throw when answers is null/undefined", () => {
    // submitAttempt can receive a malformed body
    const result = scoreAttempt(questions, undefined as unknown as Record<string, string>);
    expect(result.correct).toBe(0);
  });
});
