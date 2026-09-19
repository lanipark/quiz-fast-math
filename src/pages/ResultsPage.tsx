import { useLocation, Link } from "react-router";
import type { QuizItem } from "@/types/quiz";
import { generateQuizSet } from "@/lib/math";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw, Home, Sparkles } from "lucide-react";

export function ResultsPage() {
  const location = useLocation();

  // Retrieve questions from navigation state or sessionStorage
  const getQuestions = (): QuizItem[] => {
    const stateQuestions = (location.state as { questions?: QuizItem[] })
      ?.questions;
    if (stateQuestions && stateQuestions.length > 0) {
      return stateQuestions;
    }

    try {
      const stored = sessionStorage.getItem("lastQuizSession");
      if (stored) {
        const parsed = JSON.parse(stored) as QuizItem[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    return generateQuizSet(10);
  };

  const questions = getQuestions();

  return (
    <div className="flex w-full min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-border/80">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="size-8" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight">
            퀴즈 정답
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            종이에 적은 답안과 아래 정답을 비교해 보세요!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>전체 10문제</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3.5" /> 정답표
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border bg-muted/30 p-3.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background text-xs font-semibold text-muted-foreground border">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                    <span className="font-mono text-sm sm:text-base font-medium text-foreground break-words">
                      {item.equation}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground/80 sm:border-l sm:pl-3">
                      {item.categoryLabel}
                    </span>
                  </div>
                </div>
                <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 shrink-0 self-end sm:self-center pl-8 sm:pl-2">
                  = {item.answer}
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-3 border-t bg-muted/10 p-6">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto font-semibold shadow-sm"
          >
            <Link to="/quiz">
              <RotateCcw className="size-4" /> 새 퀴즈 시작
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link to="/completed" state={{ questions }}>
              정답 숨기기
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link to="/">
              <Home className="size-4" /> 홈으로
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
