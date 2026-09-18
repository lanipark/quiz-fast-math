import type { MathOperator, QuizItem } from "@/types/quiz";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(id: number, questionNumber: number): QuizItem {
  const operators: MathOperator[] = ["+", "-", "×", "÷"];
  const operator = operators[getRandomInt(0, operators.length - 1)];

  let operand1 = 0;
  let operand2 = 0;
  let answer = 0;

  switch (operator) {
    case "+": {
      // Elementary addition: 2-digit + 1-digit or 2-digit + 2-digit (sum <= 100)
      operand1 = getRandomInt(8, 49);
      operand2 = getRandomInt(5, 49);
      answer = operand1 + operand2;
      break;
    }
    case "-": {
      // Elementary subtraction: ensure positive answer
      operand1 = getRandomInt(15, 80);
      operand2 = getRandomInt(6, operand1 - 1);
      answer = operand1 - operand2;
      break;
    }
    case "×": {
      // Single-digit multiplication (tables 2-9)
      operand1 = getRandomInt(2, 9);
      operand2 = getRandomInt(3, 9);
      answer = operand1 * operand2;
      break;
    }
    case "÷": {
      // Clean integer division
      const divisor = getRandomInt(2, 9);
      const quotient = getRandomInt(2, 9);
      operand1 = divisor * quotient;
      operand2 = divisor;
      answer = quotient;
      break;
    }
  }

  return {
    id,
    questionNumber,
    operand1,
    operand2,
    operator,
    equation: `${operand1} ${operator} ${operand2}`,
    answer,
  };
}

export function generateQuizSet(count: number = 10): QuizItem[] {
  const items: QuizItem[] = [];
  for (let i = 1; i <= count; i++) {
    items.push(generateQuestion(i, i));
  }
  return items;
}
