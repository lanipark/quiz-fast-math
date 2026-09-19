import type { QuizItem } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";
import { Eye, Timer } from "lucide-react";

interface QuizDisplayProps {
  question: QuizItem;
  totalQuestions: number;
  remainingSeconds: number;
  totalSeconds: number;
}

export function QuizDisplay({
  question,
  totalQuestions,
  remainingSeconds,
  totalSeconds,
}: QuizDisplayProps) {
  // Progress value from 100% down to 0% (countdown)
  const progressPercent = Math.max(
    0,
    Math.min(100, (remainingSeconds / totalSeconds) * 100),
  );

  const columnTerms =
    question.columnTerms ??
    (question.category === "five-3digit-add-sub" ||
    question.category === "five-4digit-add-sub"
      ? (() => {
          const tokens = question.equation.split(" ");
          if (tokens.length >= 3) {
            const terms: { operator?: "+" | "-"; value: number }[] = [
              { value: Number(tokens[0]) },
            ];
            for (let i = 1; i < tokens.length; i += 2) {
              terms.push({
                operator: tokens[i] as "+" | "-",
                value: Number(tokens[i + 1]),
              });
            }
            return terms;
          }
          return undefined;
        })()
      : undefined);

  // Sequential flash timing calculations for 5x3-digit questions
  // 1.4s visible, 0.1s clean (hidden/blank) -> 1.5s per term
  const totalTerms = columnTerms?.length ?? 0;
  const isFlashQuiz =
    question.category === "five-3digit-add-sub" ||
    question.category === "five-4digit-add-sub";

  const visibleSeconds = isFlashQuiz ? 1.4 : 1.7;
  const hideGapSeconds = isFlashQuiz ? 0.1 : 0.3;
  const secondsPerTerm =
    totalTerms > 0
      ? totalSeconds / totalTerms
      : visibleSeconds + hideGapSeconds;
  const elapsed = Math.max(0, totalSeconds - remainingSeconds);
  const currentTermIndex =
    totalTerms > 0
      ? Math.min(totalTerms - 1, Math.floor(elapsed / secondsPerTerm))
      : 0;
  const timeInTerm = elapsed - currentTermIndex * secondsPerTerm;
  const isVisible = timeInTerm < visibleSeconds;
  const currentTerm = columnTerms ? columnTerms[currentTermIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-4">
      {/* Question Header & Phase Pill */}
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          문제 {question.questionNumber} / {totalQuestions}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Eye className="size-3.5" />
          {columnTerms
            ? `플래시 (${currentTermIndex + 1}/${totalTerms})`
            : "문제 확인 및 암산"}
        </span>
      </div>

      {/* Main Flash Math Equation Display */}
      <div className="flex flex-col items-center justify-center min-h-[220px] w-full rounded-2xl bg-muted/30 border border-border/60 py-6 px-4 sm:px-6 transition-all space-y-3">
        <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {question.categoryLabel}
        </div>

        {columnTerms && currentTerm ? (
          <div className="flex flex-col items-center justify-center w-full space-y-3 py-2">
            {/* Step progress pills and indicator */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                {columnTerms.map((_, idx) => {
                  const isPast = idx < currentTermIndex;
                  const isCurrent = idx === currentTermIndex;
                  return (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        isCurrent
                          ? "w-8 bg-primary"
                          : isPast
                            ? "w-4 bg-primary/40"
                            : "w-4 bg-muted-foreground/25"
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                {currentTermIndex + 1}번째 숫자 / 총 {totalTerms}개
              </span>
            </div>

            {/* Flash Number Display with fixed height to prevent layout shift */}
            <div className="h-28 sm:h-32 flex items-center justify-center w-full">
              <div
                className={`flex items-center justify-center font-mono font-bold select-none tabular-nums text-6xl sm:text-7xl md:text-8xl tracking-wider ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <span
                  className={`inline-block w-12 sm:w-16 md:w-20 text-center font-bold mr-1 sm:mr-2 ${
                    currentTerm.operator === "-"
                      ? "text-rose-500 dark:text-rose-400"
                      : currentTerm.operator === "+"
                        ? "text-primary"
                        : "opacity-0 pointer-events-none"
                  }`}
                  aria-hidden={!currentTerm.operator}
                >
                  {currentTerm.operator ?? "+"}
                </span>
                <span className="text-foreground">{currentTerm.value}</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`font-mono font-bold tracking-normal sm:tracking-wide text-foreground select-none tabular-nums text-center break-words max-w-full leading-snug ${
              question.category === "bracket-mul"
                ? "text-3xl sm:text-4xl md:text-5xl"
                : "text-5xl sm:text-6xl md:text-7xl"
            }`}
          >
            {question.equation} = ?
          </div>
        )}
      </div>

      {/* Countdown Progress Bar & Timer */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Timer className="size-3.5" />{" "}
            {columnTerms ? "플래시 연산" : "문제 화면"}
          </span>
          <span className="font-mono font-semibold text-foreground text-sm tabular-nums">
            {remainingSeconds.toFixed(1)}s
          </span>
        </div>
        <Progress value={progressPercent} className="h-3.5" />
      </div>
    </div>
  );
}
