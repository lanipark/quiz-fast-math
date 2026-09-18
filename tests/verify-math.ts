import {
  generateQuizSet,
  evaluateEquation,
  validateQuestion,
} from "../src/lib/math.ts";

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
        const match = q.equation.match(
          /^\((\d+)\s*\+\s*(\d+)\s*-\s*(\d+)\)\s*×\s*(\d+)$/,
        );
        if (!match)
          throw new Error(
            `Invalid format for bracket-mul in Q${qNum}: ${q.equation}`,
          );
        const a = Number(match[1]);
        const b = Number(match[2]);
        const c = Number(match[3]);
        const d = Number(match[4]);
        const inner = a + b - c;
        if (inner < 100 || inner > 999 || d < 10 || d > 99) {
          throw new Error(
            `Constraints violated in bracket-mul Q${qNum}: (${a}+${b}-${c}) × ${d}`,
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
