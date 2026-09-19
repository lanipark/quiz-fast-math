import {
  generateQuizSet,
  evaluateEquation,
  validateQuestion,
  evaluateArithmetic,
  isValidMultiplicationFactors,
  checkBracketAddSubTwoDigitRule,
  checkNoFourDigitInAddSub,
} from "../src/lib/math.ts";
import { getQuestionDurationSeconds } from "../src/types/quiz.ts";

console.log(
  "Running math accuracy verification across 10,000 quiz sets (100,000 questions)...",
);

let totalQuestionsTested = 0;
let errors = 0;

for (let setIdx = 0; setIdx < 10000; setIdx++) {
  const set = generateQuizSet(10);
  for (let i = 0; i < set.length; i++) {
    const q = set[i];
    const qNum = i + 1;
    totalQuestionsTested++;
    try {
      validateQuestion(q);
      const computed = evaluateEquation(q);
      if (computed !== q.answer) {
        console.error(
          `Mismatch in Q${q.questionNumber}:`,
          q.equation,
          "computed:",
          computed,
          "stored:",
          q.answer,
        );
        errors++;
      }

      // Verify duration for each category
      const duration = getQuestionDurationSeconds(q);
      const expectedDuration =
        qNum <= 4 ? 7.5 : qNum <= 6 ? 5 : qNum <= 8 ? 10 : 15;
      if (duration !== expectedDuration) {
        throw new Error(
          `Expected duration ${expectedDuration}s for Q${qNum}, got ${duration}s`,
        );
      }

      // Verify category assignments according to spec
      if (qNum >= 1 && qNum <= 4) {
        if (q.category !== "five-3digit-add-sub") {
          throw new Error(
            `Expected five-3digit-add-sub for Q${qNum}, got ${q.category}`,
          );
        }
        if (!q.columnTerms || q.columnTerms.length !== 5) {
          throw new Error(`Expected 5 column terms for Q${qNum}`);
        }
        for (const term of q.columnTerms) {
          if (term.value < 100 || term.value > 999) {
            throw new Error(
              `Expected 3-digit number in Q${qNum}, got ${term.value}`,
            );
          }
        }
      } else if (qNum >= 5 && qNum <= 6) {
        if (q.category !== "two-digit-mul") {
          throw new Error(
            `Expected two-digit-mul for Q${qNum}, got ${q.category}`,
          );
        }
        const match = q.equation.match(/^(\d+)\s*×\s*(\d+)$/);
        if (!match)
          throw new Error(
            `Invalid format for multiplication in Q${qNum}: ${q.equation}`,
          );
        const a = Number(match[1]);
        const b = Number(match[2]);
        if (a < 10 || a > 99 || b < 10 || b > 99) {
          throw new Error(
            `Expected 2-digit factors in Q${qNum}, got ${a} × ${b}`,
          );
        }
      } else if (qNum >= 7 && qNum <= 8) {
        if (q.category !== "division") {
          throw new Error(`Expected division for Q${qNum}, got ${q.category}`);
        }
        const match = q.equation.match(/^(\d+)\s*÷\s*(\d+)$/);
        if (!match)
          throw new Error(
            `Invalid format for division in Q${qNum}: ${q.equation}`,
          );
        const a = Number(match[1]);
        const b = Number(match[2]);
        if (a < 100 || a > 999 || b < 10 || b > 99 || a % b !== 0) {
          throw new Error(
            `Constraints violated in division Q${qNum}: ${a} ÷ ${b}`,
          );
        }
        if (a % 10 === 0 && b % 10 === 0) {
          throw new Error(
            `Division Q${qNum} has trailing zeros in both numbers (XX0 ÷ Y0): ${a} ÷ ${b}`,
          );
        }
        if (b % 10 === 0) {
          throw new Error(`Division Q${qNum} divisor ends in 0: ${a} ÷ ${b}`);
        }
      } else if (qNum >= 9 && qNum <= 10) {
        if (q.category !== "bracket-mul") {
          throw new Error(
            `Expected bracket-mul for Q${qNum}, got ${q.category}`,
          );
        }
        const numMatches = q.equation.match(/\b\d+\b/g) || [];
        if (numMatches.length < 4 || numMatches.length > 7) {
          throw new Error(
            `Expected 4 to 7 numbers in bracket-mul Q${qNum}, got ${numMatches.length}: ${q.equation}`,
          );
        }
        if (!q.equation.includes("(") || !q.equation.includes(")")) {
          throw new Error(
            `Expected parentheses in bracket-mul Q${qNum}: ${q.equation}`,
          );
        }
        const res = evaluateArithmetic(q.equation);
        for (const d of res.divisions) {
          if (d.b <= 1 || d.remainder !== 0) {
            throw new Error(
              `Non-zero remainder in division in Q${qNum}: ${d.a} ÷ ${d.b}`,
            );
          }
        }
        for (const m of res.multiplications) {
          if (!isValidMultiplicationFactors(m.a, m.b)) {
            throw new Error(
              `Invalid multiplication factors in Q${qNum}: ${m.a} × ${m.b}`,
            );
          }
        }
        if (!checkBracketAddSubTwoDigitRule(q.equation)) {
          throw new Error(
            `Bracket-mul Q${qNum} violates 2-digit rule in add/sub series: ${q.equation}`,
          );
        }
        if (!checkNoFourDigitInAddSub(q.equation)) {
          throw new Error(
            `Bracket-mul Q${qNum} has 4-digit number in add/sub sequence: ${q.equation}`,
          );
        }
      }
    } catch (err) {
      console.error(`Validation error in Q${q.questionNumber}:`, err);
      errors++;
    }
  }
}

if (errors === 0) {
  console.log(
    `✓ Verification SUCCESS: All ${totalQuestionsTested.toLocaleString()} questions have 100% exact equation-to-answer equivalence and strictly meet all category constraints.`,
  );
} else {
  console.error(`✗ Verification FAILED: Found ${errors} mismatches.`);
  process.exit(1);
}
