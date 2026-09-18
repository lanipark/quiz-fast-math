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

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-4">
      {/* Question Header & Phase Pill */}
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Question {question.questionNumber} of {totalQuestions}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Eye className="size-3.5" />
          Look & Calculate
        </span>
      </div>

      {/* Main Flash Math Equation Display */}
      <div className="flex flex-col items-center justify-center min-h-[220px] w-full rounded-2xl bg-muted/30 border border-border/60 py-6 px-4 sm:px-6 transition-all space-y-3">
        <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {question.categoryLabel}
        </div>

        {columnTerms ? (
          <div className="flex flex-col items-center justify-center w-full py-1">
            <div className="inline-flex flex-col font-mono text-3xl sm:text-4xl md:text-5xl font-bold select-none">
              {columnTerms.map((term, index) => (
                <div
                  key={index}
                  className="flex items-center justify-end gap-3 sm:gap-4 tabular-nums leading-snug py-0.5"
                >
                  <span className="w-6 sm:w-8 text-center text-muted-foreground font-semibold text-2xl sm:text-3xl md:text-4xl">
                    {term.operator ?? ""}
                  </span>
                  <span className="text-right tracking-widest font-mono">
                    {term.value}
                  </span>
                </div>
              ))}
              <div className="border-b-2 border-foreground/40 w-full mt-2" />
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
            <Timer className="size-3.5" /> Equation Screen
          </span>
          <span className="font-mono font-semibold text-foreground text-sm tabular-nums">
            {remainingSeconds.toFixed(1)}s
          </span>
        </div>
        <Progress value={progressPercent} className="h-3.5 transition-all" />
      </div>
    </div>
  );
}
