export type MathOperator = "+" | "-" | "×" | "÷";

export interface QuizItem {
  id: number;
  questionNumber: number;
  operand1: number;
  operand2: number;
  operator: MathOperator;
  equation: string;
  answer: number;
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
