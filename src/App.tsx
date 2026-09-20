import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router";
import { Calculator } from "lucide-react";
import { HomePage } from "@/pages/HomePage";
import { QuizPage } from "@/pages/QuizPage";
import { CompletedPage } from "@/pages/CompletedPage";
import { ResultsPage } from "@/pages/ResultsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/20 selection:text-primary">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold tracking-tight hover:opacity-80 transition-opacity"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calculator className="size-4" />
              </div>
              <span>패스트 매스</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                홈
              </Link>
              <Link
                to="/quiz"
                className="hover:text-foreground transition-colors"
              >
                퀴즈
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 container mx-auto max-w-5xl flex items-center justify-center py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/completed" element={<CompletedPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t py-4 text-center text-xs text-muted-foreground">
          패스트 매스 • 초등 빠른 연산 연습
        </footer>
      </div>
    </BrowserRouter>
  );
}
