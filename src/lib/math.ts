import type { QuizItem } from "@/types/quiz";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Questions 1~4:
 * Add / subtract five 3-digit numbers.
 * Constraint: Mid-result cannot be negative at any intermediate step.
 */
export function generateFive3DigitAddSub(
  id: number,
  questionNumber: number,
): QuizItem {
  // First number: 3-digit (100..999)
  const firstNum = getRandomInt(100, 999);
  const numbers: number[] = [firstNum];
  const operators: ("+" | "-")[] = [];

  let runningTotal = firstNum;

  for (let i = 1; i < 5; i++) {
    // Determine whether subtraction is permitted without intermediate result going negative.
    // Since any 3-digit number is >= 100, we can subtract only if runningTotal >= 100.
    const canSubtract = runningTotal >= 100;

    let op: "+" | "-" = "+";
    if (canSubtract) {
      if (runningTotal < 200) {
        op = "+";
      } else if (runningTotal > 2500) {
        op = "-";
      } else {
        op = Math.random() < 0.5 ? "+" : "-";
      }
    } else {
      op = "+";
    }

    let nextNum = 0;
    if (op === "-") {
      // Must be 3-digit (>= 100) and <= runningTotal to ensure non-negative mid-result
      const maxSub = Math.min(999, runningTotal);
      nextNum = getRandomInt(100, maxSub);
      runningTotal -= nextNum;
    } else {
      // 3-digit addition
      nextNum = getRandomInt(100, 999);
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
    category: "five-3digit-add-sub",
    categoryLabel: "5 × 3-Digit Addition / Subtraction",
    columnTerms,
  };
}

/**
 * Add / subtract five 4-digit numbers (legacy / reference).
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
 * Questions 5~6:
 * Form: a × b
 * Both numbers are 2-digit (10..99)
 */
export function generateTwoDigitMul(
  id: number,
  questionNumber: number,
): QuizItem {
  const a = getRandomInt(10, 99);
  const b = getRandomInt(10, 99);
  const answer = a * b;

  return {
    id,
    questionNumber,
    equation: `${a} × ${b}`,
    answer,
    category: "two-digit-mul",
    categoryLabel: "2-Digit × 2-Digit Multiplication",
  };
}

/**
 * Questions 7~8:
 * Form: a ÷ b
 * Constraints:
 * - a must be 3-digit (100..999)
 * - b must be 2-digit (10..99)
 * - remnant is 0 (a % b === 0)
 * - avoid "XX0 ÷ Y0" patterns (both ending in 0, which reduces to XX ÷ Y)
 * - avoid quotient === 10
 */
export function generateDivision(id: number, questionNumber: number): QuizItem {
  let a = 0;
  let b = 0;
  let quotient = 0;

  do {
    // b must be 2-digit: choose in [11, 89] so that at least one 3-digit multiple exists
    b = getRandomInt(11, 89);

    // a = b * quotient
    // 100 <= b * q <= 999
    const minQuotient = Math.ceil(100 / b);
    const maxQuotient = Math.floor(999 / b);

    quotient = getRandomInt(minQuotient, maxQuotient);
    a = b * quotient;
  } while (b % 10 === 0 || (a % 10 === 0 && b % 10 === 0) || quotient === 10);

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
 * Questions 9~10:
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
 * Independently parses and calculates an equation string to verify its answer.
 */
export function evaluateEquation(item: QuizItem): number {
  if (
    item.category === "five-3digit-add-sub" ||
    item.category === "five-4digit-add-sub"
  ) {
    const tokens = item.equation.split(" ");
    let total = Number(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const val = Number(tokens[i + 1]);
      if (op === "+") total += val;
      else if (op === "-") total -= val;
    }
    return total;
  }

  if (item.category === "two-digit-mul") {
    const match = item.equation.match(/^(\d+)\s*[×*]\s*(\d+)$/);
    if (match) {
      const a = Number(match[1]);
      const b = Number(match[2]);
      return a * b;
    }
  }

  if (item.category === "bracket-mul") {
    const match = item.equation.match(
      /^\((\d+)\s*\+\s*(\d+)\s*-\s*(\d+)\)\s*×\s*(\d+)$/,
    );
    if (match) {
      const a = Number(match[1]);
      const b = Number(match[2]);
      const c = Number(match[3]);
      const d = Number(match[4]);
      return (a + b - c) * d;
    }
  }

  if (item.category === "division") {
    const match = item.equation.match(/^(\d+)\s*÷\s*(\d+)$/);
    if (match) {
      const a = Number(match[1]);
      const b = Number(match[2]);
      return a / b;
    }
  }

  throw new Error(
    `Unknown equation category or invalid format: ${item.equation}`,
  );
}

/**
 * Validates that the generated item matches all strict constraints and its evaluated answer.
 */
export function validateQuestion(item: QuizItem): boolean {
  const computed = evaluateEquation(item);
  if (computed !== item.answer) {
    throw new Error(
      `Math mismatch: equation "${item.equation}" evaluated to ${computed}, but stored answer was ${item.answer}`,
    );
  }
  return true;
}

/**
 * Generate 10-quiz set following strict specification:
 * 1~4: Add/subtract five 3-digit numbers (no negative mid-results)
 * 5~6: a * b multiplication (both 2-digit)
 * 7~8: a / b division with 3-digit a, 2-digit b, remainder 0
 * 9~10: (a + b - c) * d with 2-digit d and 3-digit (a + b - c)
 */
export function generateQuizSet(count: number = 10): QuizItem[] {
  const items: QuizItem[] = [];

  for (let i = 1; i <= count; i++) {
    let item: QuizItem;
    if (i <= 4) {
      item = generateFive3DigitAddSub(i, i);
    } else if (i <= 6) {
      item = generateTwoDigitMul(i, i);
    } else if (i <= 8) {
      item = generateDivision(i, i);
    } else {
      item = generateBracketMul(i, i);
    }
    // Runtime self-check: guarantees equation string and answer are 100% mathematically identical
    validateQuestion(item);
    items.push(item);
  }

  return items;
}
