import type { QuizItem } from "@/types/quiz";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Questions 1~5:
 * Add / subtract five 4-digit numbers.
 * Constraint: Mid-result cannot be negative at any intermediate step.
 */
export function generateFive4DigitAddSub(
  id: number,
  questionNumber: number,
): QuizItem {
  // First number: 4-digit (1000..9999)
  const firstNum = getRandomInt(1000, 9999);
  const numbers: number[] = [firstNum];
  const operators: ("+" | "-")[] = [];

  let runningTotal = firstNum;

  for (let i = 1; i < 5; i++) {
    // Determine whether subtraction is permitted without intermediate result going negative.
    // Since any 4-digit number is >= 1000, we can subtract only if runningTotal >= 1000.
    const canSubtract = runningTotal >= 1000;

    // Decide operator:
    // If running total is low (< 2000), favor addition to keep buffer.
    // If running total is large (> 25000), favor subtraction to keep numbers reasonable.
    let op: "+" | "-" = "+";
    if (canSubtract) {
      if (runningTotal < 2000) {
        op = "+";
      } else if (runningTotal > 25000) {
        op = "-";
      } else {
        op = Math.random() < 0.5 ? "+" : "-";
      }
    } else {
      op = "+";
    }

    let nextNum = 0;
    if (op === "-") {
      // Must be 4-digit (>= 1000) and <= runningTotal to ensure non-negative mid-result
      const maxSub = Math.min(9999, runningTotal);
      nextNum = getRandomInt(1000, maxSub);
      runningTotal -= nextNum;
    } else {
      // 4-digit addition
      nextNum = getRandomInt(1000, 9999);
      runningTotal += nextNum;
    }

    operators.push(op);
    numbers.push(nextNum);
  }

  // Construct equation string: "N1 + N2 - N3 + N4 - N5"
  let equation = `${numbers[0]}`;
  for (let i = 0; i < operators.length; i++) {
    equation += ` ${operators[i]} ${numbers[i + 1]}`;
  }

  const columnTerms = [
    { value: numbers[0] },
    { operator: operators[0], value: numbers[1] },
    { operator: operators[1], value: numbers[2] },
    { operator: operators[2], value: numbers[3] },
    { operator: operators[3], value: numbers[4] },
  ];

  return {
    id,
    questionNumber,
    equation,
    answer: runningTotal,
    category: "five-4digit-add-sub",
    categoryLabel: "5 × 4-Digit Addition / Subtraction",
    columnTerms,
  };
}

/**
 * Questions 6~8:
 * Form: (a + b - c) * d
 * Constraints:
 * - d must be 2-digit (10..99)
 * - a + b - c must be 3-digit (100..999)
 */
export function generateBracketMul(
  id: number,
  questionNumber: number,
): QuizItem {
  // Target 3-digit inner result: S in [100, 999]
  const targetSum = getRandomInt(100, 999);

  // Choose c such that c is positive (e.g. 20..400)
  const c = getRandomInt(20, 400);

  // a + b = targetSum + c
  const totalAB = targetSum + c;

  // Split totalAB into two positive numbers a and b
  const minA = Math.max(10, Math.floor(totalAB * 0.25));
  const maxA = Math.min(totalAB - 10, Math.floor(totalAB * 0.75));
  const a = getRandomInt(minA, maxA);
  const b = totalAB - a;

  // d must be 2-digit (10..99)
  const d = getRandomInt(10, 99);

  const innerResult = a + b - c; // guaranteed equal to targetSum (3-digit)
  const answer = innerResult * d;

  return {
    id,
    questionNumber,
    equation: `(${a} + ${b} - ${c}) × ${d}`,
    answer,
    category: "bracket-mul",
    categoryLabel: "(a + b - c) × d",
  };
}

/**
 * Questions 9~10:
 * Form: a / b
 * Constraints:
 * - a must be 3-digit (100..999)
 * - b must be 2-digit (10..99)
 * - remnant is 0 (a % b === 0)
 */
export function generateDivision(id: number, questionNumber: number): QuizItem {
  // b must be 2-digit: choose in [11, 89] so that at least one 3-digit multiple exists
  const b = getRandomInt(11, 89);

  // a = b * quotient
  // 100 <= b * q <= 999
  const minQuotient = Math.ceil(100 / b);
  const maxQuotient = Math.floor(999 / b);

  const quotient = getRandomInt(minQuotient, maxQuotient);
  const a = b * quotient;

  return {
    id,
    questionNumber,
    equation: `${a} ÷ ${b}`,
    answer: quotient,
    category: "division",
    categoryLabel: "3-Digit ÷ 2-Digit Division",
  };
}

/**
 * Generate 10-quiz set following strict specification:
 * 1~5: Add/subtract five 4-digit numbers (no negative mid-results)
 * 6~8: (a + b - c) * d with 2-digit d and 3-digit (a + b - c)
 * 9~10: a / b with 3-digit a, 2-digit b, remainder 0
 */
export function generateQuizSet(count: number = 10): QuizItem[] {
  const items: QuizItem[] = [];

  for (let i = 1; i <= count; i++) {
    if (i <= 5) {
      items.push(generateFive4DigitAddSub(i, i));
    } else if (i <= 8) {
      items.push(generateBracketMul(i, i));
    } else {
      items.push(generateDivision(i, i));
    }
  }

  return items;
}
