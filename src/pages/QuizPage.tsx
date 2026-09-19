import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import { generateQuizSet } from "@/lib/math";
import {
  DEFAULT_QUIZ_CONFIG,
  getQuestionDurationSeconds,
  type QuizItem,
  type QuizPhase,
} from "@/types/quiz";
import { QuizDisplay } from "@/components/quiz/QuizDisplay";
import { WaitProgress } from "@/components/quiz/WaitProgress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pause, Play, SkipForward } from "lucide-react";

export function QuizPage() {
  const navigate = useNavigate();
  const config = DEFAULT_QUIZ_CONFIG;

  const [questions] = useState<QuizItem[]>(() =>
    generateQuizSet(config.totalQuestions),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>("question");
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getQuestionDurationSeconds(questions[0], config.questionDurationSeconds),
  );
  const [isPaused, setIsPaused] = useState(false);

  // Timer loop
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (questions.length === 0 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const tickMs = 25;
    const tickSec = tickMs / 1000;

    timerRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - tickSec;
        if (next > 0) {
          return next;
        }

        // Timer reached zero - handle phase transitions
        if (phase === "question") {
          // Question timer ended -> transition to wait / write phase for 10s
          setPhase("wait");
          return config.waitDurationSeconds;
        } else {
          // Wait timer ended -> move to next question or end quiz
          if (currentIndex + 1 < questions.length) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setPhase("question");
            return getQuestionDurationSeconds(
              questions[nextIdx],
              config.questionDurationSeconds,
            );
          } else {
            // All questions finished! Save to sessionStorage and navigate to results
            if (timerRef.current) clearInterval(timerRef.current);
            try {
              sessionStorage.setItem(
                "lastQuizSession",
                JSON.stringify(questions),
              );
            } catch {
              // ignore storage errors
            }
            navigate("/results", { state: { questions } });
            return 0;
          }
        }
      });
    }, tickMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questions, phase, currentIndex, isPaused, config, navigate]);

  const handleSkip = useCallback(() => {
    if (phase === "question") {
      // Skip question directly to wait phase
      setPhase("wait");
      setRemainingSeconds(config.waitDurationSeconds);
    } else {
      // Skip wait phase directly to next question or results
      if (currentIndex + 1 < questions.length) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setPhase("question");
        setRemainingSeconds(
          getQuestionDurationSeconds(
            questions[nextIdx],
            config.questionDurationSeconds,
          ),
        );
      } else {
        try {
          sessionStorage.setItem("lastQuizSession", JSON.stringify(questions));
        } catch {
          // ignore storage errors
        }
        navigate("/results", { state: { questions } });
      }
    }
  }, [phase, currentIndex, questions, config, navigate]);

  // Spacebar keyboard event listener to skip in both question and wait/progress screens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSkip]);

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Preparing quiz...
        </div>
      </div>
    );
  }

  const currentQuestionDuration = getQuestionDurationSeconds(
    currentQuestion,
    config.questionDurationSeconds,
  );

  return (
    <div className="flex w-full min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-border/80">
        <CardContent className="pt-6 px-6 sm:px-8">
          {phase === "question" ? (
            <QuizDisplay
              question={currentQuestion}
              totalQuestions={config.totalQuestions}
              remainingSeconds={remainingSeconds}
              totalSeconds={currentQuestionDuration}
            />
          ) : (
            <WaitProgress
              questionNumber={currentQuestion.questionNumber}
              totalQuestions={config.totalQuestions}
              remainingSeconds={remainingSeconds}
              totalSeconds={config.waitDurationSeconds}
              categoryLabel={currentQuestion.categoryLabel}
            />
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="size-4" /> Exit
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused((prev) => !prev)}
              className="gap-1.5"
            >
              {isPaused ? (
                <>
                  <Play className="size-4 fill-current" /> Resume
                </>
              ) : (
                <>
                  <Pause className="size-4" /> Pause
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleSkip}
              className="gap-1.5"
            >
              <SkipForward className="size-4" /> Skip
              <kbd className="ml-1 hidden sm:inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground border">
                Space
              </kbd>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
