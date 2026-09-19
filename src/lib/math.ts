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
    categoryLabel: "5 × 3자리 덧셈/뺄셈",
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
    categoryLabel: "5 × 4자리 덧셈/뺄셈",
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
  let a = 0;
  let b = 0;

  do {
    a = getRandomInt(11, 99);
  } while (a % 10 === 0);

  do {
    b = getRandomInt(11, 99);
  } while (b % 10 === 0);

  const answer = a * b;

  return {
    id,
    questionNumber,
    equation: `${a} × ${b}`,
    answer,
    category: "two-digit-mul",
    categoryLabel: "두 자리 × 두 자리 곱셈",
  };
}

/**
 * Questions 7~8:
 * Form: a ÷ b
 * Constraints:
 * - a must be 3-digit (100..999)
 * - b must be 2-digit in [11, 49]
 * - remnant is 0 (a % b === 0)
 * - avoid "XX0 ÷ Y0" patterns (both ending in 0, which reduces to XX ÷ Y)
 * - avoid quotient === 10
 */
export function generateDivision(id: number, questionNumber: number): QuizItem {
  let a = 0;
  let b = 0;
  let quotient = 0;

  do {
    // b must be 2-digit: choose in [11, 49] so that division is challenging and quotient is varied
    b = getRandomInt(11, 49);

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
    categoryLabel: "세 자리 ÷ 두 자리 나눗셈",
  };
}

export interface ArithmeticEvalResult {
  value: number;
  divisions: { a: number; b: number; remainder: number }[];
  multiplications: { a: number; b: number }[];
}

export function isValidMultiplicationFactors(a: number, b: number): boolean {
  const da = Math.abs(a).toString().length;
  const db = Math.abs(b).toString().length;

  // 4-digit x 1-digit (or 1-digit x 4-digit)
  if ((da === 4 && db === 1) || (da === 1 && db === 4)) {
    return (da === 1 ? a : b) >= 2;
  }
  // 3-digit x 1-digit (or 1-digit x 3-digit)
  if ((da === 3 && db === 1) || (da === 1 && db === 3)) {
    return (da === 1 ? a : b) >= 2;
  }
  // 2-digit x 2-digit
  if (da === 2 && db === 2) {
    return a >= 10 && b >= 10;
  }
  return false;
}

export function evaluateArithmetic(expr: string): ArithmeticEvalResult {
  const normalized = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\s+/g, "");

  const tokens: (number | string)[] = [];
  let i = 0;
  while (i < normalized.length) {
    const ch = normalized[i];
    if (ch >= "0" && ch <= "9") {
      let numStr = "";
      while (
        i < normalized.length &&
        normalized[i] >= "0" &&
        normalized[i] <= "9"
      ) {
        numStr += normalized[i];
        i++;
      }
      tokens.push(Number(numStr));
    } else if ("+-*/()".includes(ch)) {
      tokens.push(ch);
      i++;
    } else {
      throw new Error(`Unexpected character in expression: ${ch}`);
    }
  }

  let pos = 0;
  const divisions: { a: number; b: number; remainder: number }[] = [];
  const multiplications: { a: number; b: number }[] = [];

  function parseExpression(): number {
    let result = parseTerm();
    while (
      pos < tokens.length &&
      (tokens[pos] === "+" || tokens[pos] === "-")
    ) {
      const op = tokens[pos++];
      const nextTerm = parseTerm();
      if (op === "+") {
        result += nextTerm;
      } else {
        result -= nextTerm;
        if (result < 0) {
          throw new Error(`Intermediate result negative: ${result}`);
        }
      }
    }
    return result;
  }

  function parseTerm(): number {
    let result = parseFactor();
    while (
      pos < tokens.length &&
      (tokens[pos] === "*" || tokens[pos] === "/")
    ) {
      const op = tokens[pos++];
      const nextFactor = parseFactor();
      if (op === "*") {
        multiplications.push({ a: result, b: nextFactor });
        result *= nextFactor;
      } else {
        if (nextFactor === 0) {
          throw new Error("Division by zero");
        }
        const rem = result % nextFactor;
        divisions.push({ a: result, b: nextFactor, remainder: rem });
        if (rem !== 0) {
          throw new Error(
            `Division has non-zero remainder: ${result} / ${nextFactor}`,
          );
        }
        result = Math.floor(result / nextFactor);
      }
    }
    return result;
  }

  function parseFactor(): number {
    if (pos >= tokens.length) {
      throw new Error("Unexpected end of expression");
    }
    const token = tokens[pos++];
    if (typeof token === "number") {
      return token;
    }
    if (token === "(") {
      const val = parseExpression();
      if (pos >= tokens.length || tokens[pos++] !== ")") {
        throw new Error("Missing closing parenthesis");
      }
      return val;
    }
    throw new Error(`Unexpected token: ${token}`);
  }

  const finalValue = parseExpression();
  if (pos !== tokens.length) {
    throw new Error(`Extra tokens remaining at pos ${pos}`);
  }

  return {
    value: finalValue,
    divisions,
    multiplications,
  };
}

function generateSumSequence(target: number, count: number): string {
  if (count === 1) return `${target}`;
  if (count === 2) {
    if (target >= 1000) {
      const minA = Math.max(10, target - 999);
      const maxA = Math.min(999, target - 10);
      const a = getRandomInt(minA, maxA);
      const b = target - a;
      return `${a} + ${b}`;
    }
    if (Math.random() < 0.6 && target >= 20) {
      const a = getRandomInt(
        Math.max(5, Math.floor(target * 0.2)),
        Math.min(target - 5, Math.floor(target * 0.8)),
      );
      const b = target - a;
      return `${a} + ${b}`;
    } else {
      const b = getRandomInt(
        10,
        Math.max(20, Math.min(300, Math.floor(target * 0.8))),
      );
      const a = target + b;
      return `${a} - ${b}`;
    }
  }

  for (let attempt = 0; attempt < 300; attempt++) {
    const numbers: number[] = [];
    const operators: ("+" | "-")[] = [];

    // When count >= 3, at least one number in the series must be 2-digit (10..99).
    const twoDigitIdx = getRandomInt(1, count - 2);

    let minFirst = 15;
    let maxFirst = 999;
    if (target < 1000) {
      minFirst = Math.max(15, Math.floor(target * 0.4));
      maxFirst = Math.min(999, Math.max(30, Math.floor(target * 1.3)));
    } else {
      const avg = Math.floor(target / count);
      minFirst = Math.max(100, Math.floor(avg * 0.7));
      maxFirst = Math.min(950, Math.ceil(avg * 1.3));
    }
    let runningTotal = getRandomInt(minFirst, maxFirst);
    numbers.push(runningTotal);

    for (let i = 1; i < count - 1; i++) {
      const mustBe2Digit = i === twoDigitIdx;
      let op: "+" | "-" = "+";

      const canSubtract =
        runningTotal > 100 && (target < 1000 || runningTotal > target * 0.6);
      if (canSubtract) {
        if (runningTotal < target * 0.6) op = "+";
        else if (runningTotal > target * 1.4) op = "-";
        else op = Math.random() < 0.4 ? "+" : "-";
      } else {
        op = "+";
      }

      let val = 0;
      if (mustBe2Digit) {
        if (op === "-") {
          const maxSub = Math.min(99, runningTotal - 10);
          if (maxSub >= 10) {
            val = getRandomInt(10, maxSub);
          } else {
            op = "+";
            val = getRandomInt(10, 99);
          }
        } else {
          val = getRandomInt(10, 99);
        }
      } else {
        if (op === "-") {
          const maxSub = Math.min(
            999,
            Math.min(runningTotal - 10, Math.max(20, Math.floor(target * 0.6))),
          );
          val = getRandomInt(10, Math.max(10, maxSub));
        } else {
          const remainingTerms = count - i;
          const needed = target - runningTotal;
          const estPerTerm = Math.max(20, Math.floor(needed / remainingTerms));
          const maxAdd = Math.min(
            999,
            Math.max(50, Math.ceil(estPerTerm * 1.4)),
          );
          const minAdd = Math.min(
            maxAdd,
            Math.max(10, Math.floor(estPerTerm * 0.6)),
          );
          val = getRandomInt(minAdd, maxAdd);
        }
      }

      if (op === "-") {
        runningTotal -= val;
      } else {
        runningTotal += val;
      }
      operators.push(op);
      numbers.push(val);
    }

    const diff = target - runningTotal;
    if (diff > 0) {
      operators.push("+");
      numbers.push(diff);
    } else if (diff < 0) {
      operators.push("-");
      numbers.push(-diff);
    } else {
      const lastOp = operators[operators.length - 1];
      const lastVal = numbers[numbers.length - 1];
      if (lastOp === "+") {
        numbers[numbers.length - 1] = lastVal + 15;
        operators.push("-");
        numbers.push(15);
      } else {
        numbers[numbers.length - 1] = lastVal + 15;
        operators.push("+");
        numbers.push(15);
      }
    }

    // Verify all numbers > 0 and <= 999 (NO 4-digit numbers in add/sub)
    if (numbers.some((n) => n <= 0 || n >= 1000)) continue;

    // Verify intermediate totals >= 0
    let ok = true;
    let r = numbers[0];
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === "+") r += numbers[i + 1];
      else r -= numbers[i + 1];
      if (r < 0) {
        ok = false;
        break;
      }
    }
    if (!ok || r !== target) continue;

    // Verify at least one number in the series has 2 digits (10..99)
    if (!numbers.some((n) => n >= 10 && n <= 99)) continue;

    let expr = `${numbers[0]}`;
    for (let i = 0; i < operators.length; i++) {
      expr += ` ${operators[i]} ${numbers[i + 1]}`;
    }
    return expr;
  }

  throw new Error(
    `Failed to generate sum sequence for target ${target}, count ${count}`,
  );
}

function getMaxBracketTarget(count: number): number {
  if (count <= 2) return 1800;
  return Math.min(4800, (count - 1) * 900 + 80);
}

function pickMulFactorsForCount(count: number): [number, number] {
  const mode = getRandomInt(1, 3);
  if (mode === 1) {
    // 3-digit x 1-digit
    const a = getRandomInt(100, 999);
    const b = getRandomInt(2, 9);
    return Math.random() < 0.5 ? [a, b] : [b, a];
  } else if (mode === 2) {
    // 2-digit x 2-digit
    const a = getRandomInt(10, 99);
    const b = getRandomInt(10, 99);
    return [a, b];
  } else {
    // 4-digit x 1-digit: bracket sum can grow up to 4 digits (1000..maxTarget)
    const maxTarget = getMaxBracketTarget(count);
    const a = getRandomInt(1000, Math.max(1000, maxTarget));
    const b = getRandomInt(2, 9);
    return [a, b];
  }
}

function tryGenerateComplexBracket(totalNumbers: number): string {
  const archetype = getRandomInt(1, 5);

  if (archetype === 1) {
    // (Seq_K) x factor or factor x (Seq_K)
    const kSeq = totalNumbers - 1;
    const [bracketTarget, factor] = pickMulFactorsForCount(kSeq);
    const seq = generateSumSequence(bracketTarget, kSeq);
    return Math.random() < 0.5
      ? `(${seq}) × ${factor}`
      : `${factor} × (${seq})`;
  }

  if (archetype === 2) {
    // (Seq_K1) x factor + rest
    const k1 = Math.max(2, totalNumbers - 2);
    const k2 = totalNumbers - 1 - k1;
    const [bracketTarget, factor] = pickMulFactorsForCount(k1);
    const seq1 = generateSumSequence(bracketTarget, k1);
    const mulResult = bracketTarget * factor;
    const restTarget = getRandomInt(
      10,
      Math.min(500, Math.floor(mulResult * 0.5)),
    );
    const seq2 = generateSumSequence(restTarget, k2);
    const op = Math.random() < 0.5 ? "+" : "-";
    return op === "+"
      ? `(${seq1}) × ${factor} + ${seq2}`
      : `(${seq1}) × ${factor} - ${seq2}`;
  }

  if (archetype === 3) {
    // (Seq_K1) ÷ divisor (+ rest)
    const k1 =
      totalNumbers >= 5 && Math.random() < 0.5
        ? totalNumbers - 2
        : totalNumbers - 1;
    const k2 = totalNumbers - k1 - 1;
    const maxDiv = getMaxBracketTarget(k1);
    const divisor = getRandomInt(2, 25);
    const maxQuotient = Math.floor(maxDiv / divisor);
    const quotient = getRandomInt(15, Math.max(15, maxQuotient));
    const dividend = divisor * quotient;
    const seq1 = generateSumSequence(dividend, k1);
    if (k2 === 0) {
      return `(${seq1}) ÷ ${divisor}`;
    } else {
      const restTarget = getRandomInt(10, 200);
      const seq2 = generateSumSequence(restTarget, k2);
      const op = Math.random() < 0.5 ? "+" : "-";
      if (op === "-" && quotient < restTarget) {
        return `(${seq1}) ÷ ${divisor} + ${seq2}`;
      }
      return `(${seq1}) ÷ ${divisor} ${op} ${seq2}`;
    }
  }

  if (archetype === 4) {
    // (Seq_K1) x (Seq_K2)
    // 2-digit x 2-digit
    const fa = getRandomInt(10, 99);
    const fb = getRandomInt(10, 99);
    const k1 = Math.floor(totalNumbers / 2);
    const k2 = totalNumbers - k1;
    const seq1 = generateSumSequence(fa, k1);
    const seq2 = generateSumSequence(fb, k2);
    return `(${seq1}) × (${seq2})`;
  }

  // archetype === 5: (a x b + Seq_K) + rest
  const [fa, fb] =
    Math.random() < 0.5
      ? [getRandomInt(100, 999), getRandomInt(2, 9)]
      : [getRandomInt(10, 99), getRandomInt(10, 99)];
  const kInner = Math.max(1, totalNumbers - 3);
  const kOuter = totalNumbers - 2 - kInner;
  const innerRest = getRandomInt(10, 300);
  const seqInner = generateSumSequence(innerRest, kInner);
  const opInner = Math.random() < 0.5 ? "+" : "-";
  const innerVal = opInner === "+" ? fa * fb + innerRest : fa * fb - innerRest;
  if (innerVal < 0) {
    return `(${fa} × ${fb} + ${seqInner})`;
  }
  if (kOuter === 0) {
    return `(${fa} × ${fb} ${opInner} ${seqInner})`;
  } else {
    const outerVal = getRandomInt(10, 200);
    const opOuter = Math.random() < 0.5 ? "+" : "-";
    if (opOuter === "-" && innerVal < outerVal) {
      return `(${fa} × ${fb} ${opInner} ${seqInner}) + ${outerVal}`;
    }
    return `(${fa} × ${fb} ${opInner} ${seqInner}) ${opOuter} ${outerVal}`;
  }
}

/**
 * Checks if parenthesized add/subtract sequences of length > 2 have at least one 2-digit number (10..99).
 */
export function checkBracketAddSubTwoDigitRule(equation: string): boolean {
  const matches = equation.match(/\(([^()]+)\)/g);
  if (!matches) return true;

  for (const m of matches) {
    const inner = m.slice(1, -1).trim();

    // If inner contains no multiplication or division, it's a pure add/subtract series
    if (
      !inner.includes("×") &&
      !inner.includes("÷") &&
      !inner.includes("*") &&
      !inner.includes("/")
    ) {
      const nums = inner.match(/\b\d+\b/g)?.map(Number) || [];
      if (nums.length > 2) {
        const has2Digit = nums.some((n) => n >= 10 && n <= 99);
        if (!has2Digit) return false;
      }
    } else {
      // If inner contains multiplication/division (e.g. archetype 5: a × b ± seq)
      // Find any pure addition/subtraction sub-series of numbers with length > 2
      const parts = inner
        .split(/(?=[+-])|(?<=[+-])/)
        .map((s) => s.trim())
        .filter(Boolean);

      let currentAddSubNums: number[] = [];
      for (const part of parts) {
        if (part === "+" || part === "-") continue;
        if (/^\d+$/.test(part)) {
          currentAddSubNums.push(Number(part));
        } else {
          // Term has × or ÷ (e.g. "12 × 5")
          if (currentAddSubNums.length > 2) {
            if (!currentAddSubNums.some((n) => n >= 10 && n <= 99))
              return false;
          }
          currentAddSubNums = [];
        }
      }
      if (currentAddSubNums.length > 2) {
        if (!currentAddSubNums.some((n) => n >= 10 && n <= 99)) return false;
      }
    }
  }

  return true;
}

/**
 * Checks that no number in any addition/subtraction sequence is 4-digit (>= 1000).
 * Standalone factors in multiplication (e.g. 1200 x 3) or evaluated sums are allowed to be 4-digit.
 */
export function checkNoFourDigitInAddSub(equation: string): boolean {
  // Check inside all parentheses
  const matches = equation.match(/\(([^()]+)\)/g) || [];
  for (const m of matches) {
    const inner = m.slice(1, -1).trim();
    const terms = inner
      .split(/[+-]/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const term of terms) {
      if (/^\d+$/.test(term)) {
        if (Number(term) >= 1000) return false;
      }
    }
  }

  // Also check outside parentheses
  const outer = equation.replace(/\([^()]+\)/g, "P");
  const outerTerms = outer
    .split(/[+-]/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const term of outerTerms) {
    if (/^\d+$/.test(term)) {
      if (Number(term) >= 1000) return false;
    }
  }

  return true;
}

function generateComplexBracket(totalNumbers: number): {
  equation: string;
  answer: number;
} {
  let attempts = 0;
  while (attempts++ < 100) {
    try {
      const eq = tryGenerateComplexBracket(totalNumbers);
      const res = evaluateArithmetic(eq);

      // Verify number count
      const numMatches = eq.match(/\b\d+\b/g) || [];
      if (numMatches.length !== totalNumbers) continue;

      // Verify has parenthesis
      if (!eq.includes("(") || !eq.includes(")")) continue;

      // Verify bracket add/sub 2-digit rule
      if (!checkBracketAddSubTwoDigitRule(eq)) continue;

      // Verify no 4-digit numbers in add/sub sequence
      if (!checkNoFourDigitInAddSub(eq)) continue;

      // Verify answer is positive integer
      if (res.value <= 0 || !Number.isInteger(res.value) || res.value > 50000) {
        continue;
      }

      // Verify all divisions have remainder 0 and divisor >= 2
      let divOk = true;
      for (const d of res.divisions) {
        if (d.b <= 1 || d.remainder !== 0) {
          divOk = false;
          break;
        }
      }
      if (!divOk) continue;

      // Verify all multiplications
      let mulOk = true;
      for (const m of res.multiplications) {
        if (!isValidMultiplicationFactors(m.a, m.b)) {
          mulOk = false;
          break;
        }
      }
      if (!mulOk) continue;

      return { equation: eq, answer: res.value };
    } catch {
      // Retry on invalid intermediate result
    }
  }
  throw new Error(
    `Failed to generate valid equation for length ${totalNumbers}`,
  );
}

/**
 * Questions 9~10:
 * Complex arithmetic expressions with parentheses:
 * - 4 to 7 numbers
 * - At least one parenthesis
 * - May include multiply (4x1, 3x1, or 2x2) and divide (remainder 0)
 * - Non-negative intermediate operations
 */
export function generateBracketMul(
  id: number,
  questionNumber: number,
): QuizItem {
  const totalNumbers = getRandomInt(4, 7);
  const { equation, answer } = generateComplexBracket(totalNumbers);

  return {
    id,
    questionNumber,
    equation,
    answer,
    category: "bracket-mul",
    categoryLabel: "괄호 혼합 계산",
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
    const res = evaluateArithmetic(item.equation);
    return res.value;
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

  if (item.category === "bracket-mul") {
    const numMatches = item.equation.match(/\b\d+\b/g) || [];
    if (numMatches.length < 4 || numMatches.length > 7) {
      throw new Error(
        `Expected 4 to 7 numbers in bracket-mul, got ${numMatches.length}: ${item.equation}`,
      );
    }
    if (!item.equation.includes("(") || !item.equation.includes(")")) {
      throw new Error(
        `Expected at least one parenthesis in bracket-mul: ${item.equation}`,
      );
    }
    const res = evaluateArithmetic(item.equation);
    for (const d of res.divisions) {
      if (d.b <= 1 || d.remainder !== 0) {
        throw new Error(
          `Division constraint violated in bracket-mul: ${d.a} ÷ ${d.b} (remainder: ${d.remainder})`,
        );
      }
    }
    for (const m of res.multiplications) {
      if (!isValidMultiplicationFactors(m.a, m.b)) {
        throw new Error(
          `Multiplication constraint violated in bracket-mul: ${m.a} × ${m.b}`,
        );
      }
    }
    if (!checkBracketAddSubTwoDigitRule(item.equation)) {
      throw new Error(
        `Bracket-mul equation violates 2-digit rule in add/sub series: ${item.equation}`,
      );
    }
    if (!checkNoFourDigitInAddSub(item.equation)) {
      throw new Error(
        `Bracket-mul equation has 4-digit number in add/sub sequence: ${item.equation}`,
      );
    }
  }

  if (item.category === "two-digit-mul") {
    const match = item.equation.match(/^(\d+)\s*×\s*(\d+)$/);
    if (!match) {
      throw new Error(`Invalid format for two-digit-mul: ${item.equation}`);
    }
    const a = Number(match[1]);
    const b = Number(match[2]);
    if (a < 10 || a > 99 || b < 10 || b > 99 || a % 10 === 0 || b % 10 === 0) {
      throw new Error(
        `Invalid factors in two-digit-mul (no X0 allowed): ${item.equation}`,
      );
    }
  }

  if (item.category === "division") {
    const match = item.equation.match(/^(\d+)\s*÷\s*(\d+)$/);
    if (!match) {
      throw new Error(`Invalid format for division: ${item.equation}`);
    }
    const a = Number(match[1]);
    const b = Number(match[2]);
    if (
      a < 100 ||
      a > 999 ||
      b < 11 ||
      b > 49 ||
      b % 10 === 0 ||
      a % b !== 0 ||
      a / b === 10
    ) {
      throw new Error(`Invalid division question: ${item.equation}`);
    }
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
