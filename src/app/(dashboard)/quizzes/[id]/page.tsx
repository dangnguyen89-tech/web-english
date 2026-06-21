"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizQuestion, type QuizQuestionData } from "@/components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizData {
  id: string;
  title: string;
  level: string;
  questions: QuizQuestionData[];
}

export default function QuizPlayerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/quizzes/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setQuiz(data.quiz);
      } catch {
        setError("Quiz not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  function handleAnswerChange(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quiz) return;

    const unanswered = quiz.questions.filter((q) => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submit failed");
      setResult({ score: data.attempt.score, total: data.attempt.total });
    } catch {
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading quiz...</p>;
  }

  if (!quiz) {
    return <p className="text-destructive">{error || "Quiz not found."}</p>;
  }

  if (result) {
    const percent = Math.round((result.score / result.total) * 100);
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Quiz complete!</CardTitle>
          <CardDescription>{quiz.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-4xl font-bold text-primary">
            {result.score}/{result.total}
          </p>
          <p className="text-muted-foreground">You scored {percent}%</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => router.push("/quizzes")}>Back to quizzes</Button>
            <Button variant="outline" onClick={() => router.push("/progress")}>
              View progress
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <p className="mt-2 capitalize text-muted-foreground">
          {quiz.level.toLowerCase()} · {quiz.questions.length} questions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {quiz.questions.map((question, index) => (
          <QuizQuestion
            key={question.id}
            question={question}
            index={index}
            value={answers[question.id] ?? ""}
            onChange={handleAnswerChange}
          />
        ))}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Submitting..." : "Submit quiz"}
        </Button>
      </form>
    </div>
  );
}
