"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizListItem {
  id: string;
  title: string;
  level: string;
  questionCount: number;
  lastAttempt: {
    score: number;
    total: number;
    completedAt: string;
  } | null;
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/quizzes");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setQuizzes(data.quizzes);
      } catch {
        setError("Could not load quizzes.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="mt-2 text-muted-foreground">
          Test your English with multiple choice and fill-in-the-blank questions.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Loading quizzes...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription className="capitalize">
                  {quiz.level.toLowerCase()} · {quiz.questionCount} questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quiz.lastAttempt && (
                  <p className="text-sm text-muted-foreground">
                    Last score: {quiz.lastAttempt.score}/{quiz.lastAttempt.total} on{" "}
                    {formatDate(quiz.lastAttempt.completedAt)}
                  </p>
                )}
                <Button asChild className="w-full">
                  <Link href={`/quizzes/${quiz.id}`}>
                    {quiz.lastAttempt ? "Retake quiz" : "Start quiz"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
