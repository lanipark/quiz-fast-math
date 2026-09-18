import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Sparkles, Timer, FileCheck } from "lucide-react";

export function HomePage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg border-border/80">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
            <Sparkles className="size-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Fast Math Quiz
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Elementary-level flash math training. Get your paper and pencil
            ready!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl bg-muted/50 p-4 border border-border/50 text-left space-y-3">
            <div className="font-semibold text-sm tracking-wide text-foreground">
              Quiz Flow & Problem Formats
            </div>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-5">1.</span>
                <span>
                  <strong>10s equation display</strong>, then{" "}
                  <strong>10s writing countdown</strong> per question.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-5">
                  Q1–5:
                </span>
                <span>
                  <strong>5 × 4-digit addition/subtraction</strong> (e.g.{" "}
                  <em>1420 + 3810 - 2150...</em>, intermediate values always ≥
                  0).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-5">
                  Q6–8:
                </span>
                <span>
                  <strong>(a + b - c) × d</strong> with 2-digit <em>d</em> and
                  3-digit <em>(a + b - c)</em>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-5">
                  Q9–10:
                </span>
                <span>
                  <strong>a ÷ b</strong> with 3-digit <em>a</em>, 2-digit{" "}
                  <em>b</em>, and 0 remainder.
                </span>
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            asChild
            size="lg"
            className="w-full py-6 text-lg font-semibold shadow-sm cursor-pointer"
          >
            <Link to="/quiz">
              <Play className="size-5 fill-current" />
              Start Quiz
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Timer className="size-3.5" /> 10s per question
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <FileCheck className="size-3.5" /> 10 questions total
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
