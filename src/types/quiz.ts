export type QuizCategory = "five-4digit-add-sub" | "bracket-mul" | "division";

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
