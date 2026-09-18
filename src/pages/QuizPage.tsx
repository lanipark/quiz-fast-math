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
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock } from "lucide-react";

export function QuizPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-lg border-border/80">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Question 1 of 10</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="size-3.5" /> 10s
            </span>
          </div>
          <CardTitle className="text-5xl font-mono font-bold tracking-wider py-8">
            7 + 8 = ?
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Write down your answer on your paper!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Progress value={65} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Time remaining</span>
              <span className="font-mono">6.5s</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-4 border-t">
          <Button variant="ghost" asChild size="sm">
            <Link to="/">
              <ArrowLeft className="size-4" /> Exit to Home
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/results">Preview Results View</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
