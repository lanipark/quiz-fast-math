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
  for (const q of set) {
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
    } catch (err) {
      console.error(`Validation error in Q${q.questionNumber}:`, err);
      errors++;
    }
  }
}

if (errors === 0) {
  console.log(
    `✓ Verification SUCCESS: All ${totalQuestionsTested.toLocaleString()} questions have 100% exact equation-to-answer equivalence.`,
  );
} else {
  console.error(`✗ Verification FAILED: Found ${errors} mismatches.`);
  process.exit(1);
}
