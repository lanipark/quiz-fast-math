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
            패스트 매스 연산 퀴즈
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            초등 수준의 빠른 플래시 연산 연습. 종이와 연필을 준비해 주세요!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl bg-muted/50 p-4 border border-border/50 text-left space-y-3">
            <div className="font-semibold text-sm tracking-wide text-foreground">
              퀴즈 진행 방식 및 문제 유형
            </div>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-5">1.</span>
                <span>
                  <strong>문제별 플래시/화면 표시</strong> 후{" "}
                  <strong>5초간 정답 작성 카운트다운</strong> 진행.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-5">
                  Q1–4:
                </span>
                <span>
                  <strong>5 × 3자리 덧셈/뺄셈</strong> (숫자가 하나씩 플래시:
                  1.4초 표시, 0.1초 숨김; 중간 계산값 ≥ 0).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-5">
                  Q5–6:
                </span>
                <span>
                  <strong>a × b 곱셈</strong> (5초 표시, 두 자리 수 × 두 자리
                  수, 일의 자리 0 제외, 예: <em>34 × 78</em>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-5">
                  Q7–8:
                </span>
                <span>
                  <strong>a ÷ b 나눗셈</strong> (10초 표시, 세 자리 수 ÷ 두 자리
                  수(11~49), 나누어떨어짐).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-foreground min-w-5">
                  Q9–10:
                </span>
                <span>
                  <strong>괄호 혼합 계산</strong> (15초 표시, 4~7개 숫자, 4×1 /
                  3×1 / 2×2 곱셈 및 나누어떨어지는 나눗셈 포함).
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
              퀴즈 시작하기
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Timer className="size-3.5" /> 문제당 5~15초
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <FileCheck className="size-3.5" /> 총 10문제
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
