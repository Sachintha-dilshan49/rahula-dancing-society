import { describe, it, expect } from "vitest";
import { checkStudentQuizAccess } from "../src/utils/quizAccess";

const HOUR = 60 * 60 * 1000;

describe("checkStudentQuizAccess", () => {
  const now = new Date("2026-06-29T12:00:00Z");

  it("allows a published quiz that has already started", () => {
    const quiz = { isPublished: true, startTime: new Date(now.getTime() - HOUR) };
    expect(checkStudentQuizAccess(quiz, now)).toEqual({ allowed: true });
  });

  it("hides an unpublished quiz as 404 (does not reveal existence)", () => {
    const quiz = { isPublished: false, startTime: new Date(now.getTime() - HOUR) };
    const result = checkStudentQuizAccess(quiz, now);
    expect(result).toEqual({ allowed: false, status: 404, message: "Quiz not found" });
  });

  it("blocks a published quiz before its start time with 403", () => {
    const quiz = { isPublished: true, startTime: new Date(now.getTime() + HOUR) };
    const result = checkStudentQuizAccess(quiz, now);
    expect(result).toEqual({
      allowed: false,
      status: 403,
      message: "This quiz hasn't started yet.",
    });
  });

  it("prioritises the published check over the start-time check", () => {
    // Unpublished AND not started -> still a 404, never leaks the start time.
    const quiz = { isPublished: false, startTime: new Date(now.getTime() + HOUR) };
    expect(checkStudentQuizAccess(quiz, now).allowed).toBe(false);
    expect((checkStudentQuizAccess(quiz, now) as any).status).toBe(404);
  });

  it("accepts ISO string start times", () => {
    const quiz = { isPublished: true, startTime: new Date(now.getTime() - HOUR).toISOString() };
    expect(checkStudentQuizAccess(quiz, now)).toEqual({ allowed: true });
  });
});
