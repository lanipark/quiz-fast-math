export type QuizCategory =
  | "five-3digit-add-sub"
  | "five-4digit-add-sub"
  | "two-digit-mul"
  | "bracket-mul"
  | "division";

export interface ColumnTerm {
  operator?: "+" | "-";
  value: number;
}

export interface QuizItem {
  id: number;
  questionNumber: number;
  equation: string;
  answer: number;
  category: QuizCategory;
  categoryLabel: string;
  columnTerms?: ColumnTerm[];
}

export type QuizPhase = "question" | "wait";

export interface QuizConfig {
  totalQuestions: number;
  questionDurationSeconds: number;
  waitDurationSeconds: number;
}

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  totalQuestions: 10,
  questionDurationSeconds: 10,
  waitDurationSeconds: 10,
};

export function getQuestionDurationSeconds(
  question?: QuizItem,
  defaultDuration: number = DEFAULT_QUIZ_CONFIG.questionDurationSeconds,
): number {
  if (!question) return defaultDuration;
  if (
    question.category === "five-3digit-add-sub" ||
    question.category === "five-4digit-add-sub"
  ) {
    const termCount = question.columnTerms?.length ?? 5;
    // 1.4s visible + 0.1s clean = 1.5s per number (7.5s for 5 numbers)
    return termCount * 1.5;
  }
  return defaultDuration;
}
