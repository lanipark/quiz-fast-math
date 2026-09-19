import { Progress } from "@/components/ui/progress";
import { Pencil, Timer } from "lucide-react";

interface WaitProgressProps {
  questionNumber: number;
  totalQuestions: number;
  remainingSeconds: number;
  totalSeconds: number;
  categoryLabel?: string;
}

export function WaitProgress({
  questionNumber,
  totalQuestions,
  remainingSeconds,
  totalSeconds,
  categoryLabel,
}: WaitProgressProps) {
  // Progress value counting down from 100% to 0%
  const progressPercent = Math.max(
    0,
    Math.min(100, (remainingSeconds / totalSeconds) * 100),
  );

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-4">
      {/* Question Header & Phase Pill */}
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          문제 {questionNumber} / {totalQuestions}
          {categoryLabel && (
            <span className="hidden sm:inline text-muted-foreground/70">
              {" "}
              • {categoryLabel}
            </span>
          )}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-3 py-1 text-xs font-semibold animate-pulse">
          <Pencil className="size-3.5" />
          정답 작성 시간
        </span>
      </div>

      {/* Write Down Answer Center Box */}
      <div className="flex flex-col items-center justify-center min-h-[160px] w-full rounded-2xl bg-amber-500/5 border border-amber-500/30 py-8 px-4 text-center space-y-3">
        <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Pencil className="size-7 animate-bounce" />
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          정답을 적으세요
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          지금 종이에 정답을 적어보세요! 잠시 후 다음 문제가 시작됩니다.
        </p>
      </div>

      {/* Countdown Progress Bar for Writing */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Timer className="size-3.5" /> 작성 남은 시간
          </span>
          <span className="font-mono font-semibold text-foreground text-sm tabular-nums">
            {remainingSeconds.toFixed(1)}s
          </span>
        </div>
        <Progress
          value={progressPercent}
          className="h-3.5 [&>[data-slot=progress-indicator]]:bg-amber-500"
        />
      </div>
    </div>
  );
}
