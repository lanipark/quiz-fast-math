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
import { RotateCcw, CheckCircle2 } from "lucide-react";

export function ResultsPage() {
  const sampleAnswers = [
    { question: "7 + 8", answer: "15" },
    { question: "12 - 5", answer: "7" },
    { question: "6 × 4", answer: "24" },
    { question: "18 ÷ 3", answer: "6" },
  ];

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-lg border-border/80">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-1">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Quiz Completed!
          </CardTitle>
          <CardDescription>
            Check your written answers against the answer sheet below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {sampleAnswers.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm"
              >
                <span className="font-mono text-muted-foreground">
                  Q{idx + 1}. {item.question}
                </span>
                <span className="font-mono font-bold text-foreground">
                  = {item.answer}
                </span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-3 border-t pt-4">
          <Button asChild size="lg">
            <Link to="/quiz">
              <RotateCcw className="size-4" /> Try Again
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
