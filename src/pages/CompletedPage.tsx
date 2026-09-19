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
import { RotateCcw, Home, Eye, PencilLine, Award } from "lucide-react";

export function CompletedPage() {
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
      <Card className="w-full max-w-lg shadow-xl border-border/80 text-center">
        <CardHeader className="space-y-3 pb-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-1 animate-in zoom-in-50 duration-300">
            <Award className="size-9" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            퀴즈 완료!
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            총 {questions.length}문제를 모두 마쳤습니다! 종이에 남은 계산을
            편하게 마무리해 보세요.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl border bg-muted/40 p-4 text-left space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <PencilLine className="size-4 text-primary" />
              계산 마무리하기
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              스포일러를 방지하기 위해 정답을 숨겨두었습니다. 종이에 계산을 마친
              후 아래 버튼을 눌러 정답을 확인하세요.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2 pb-6 px-6">
          <Button
            asChild
            size="lg"
            className="w-full py-6 text-lg font-semibold shadow-md cursor-pointer gap-2"
          >
            <Link to="/results" state={{ questions }}>
              <Eye className="size-5" />
              정답 확인하기
            </Link>
          </Button>

          <div className="flex w-full items-center justify-center gap-3 pt-2">
            <Button variant="outline" asChild size="sm" className="gap-1.5">
              <Link to="/quiz">
                <RotateCcw className="size-3.5" /> 새 퀴즈 시작
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="gap-1.5">
              <Link to="/">
                <Home className="size-3.5" /> 홈으로
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
