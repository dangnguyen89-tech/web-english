"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface ProgressData {
  vocabulary: {
    totalWords: number;
    studied: number;
    learning: number;
    known: number;
    completionPercent: number;
  };
  quizzes: {
    attemptsCount: number;
    averageScorePercent: number;
    recentAttempts: Array<{
      id: string;
      quizTitle: string;
      quizLevel: string;
      score: number;
      total: number;
      percent: number;
      completedAt: string;
    }>;
  };
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error("Failed");
        setData(await res.json());
      } catch {
        setError("Could not load progress data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading progress...</p>;
  }

  if (error || !data) {
    return <p className="text-destructive">{error || "No data available."}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Your progress</h1>
        <p className="mt-2 text-muted-foreground">
          Track vocabulary mastery and quiz performance over time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Words studied</CardDescription>
            <CardTitle className="text-3xl">{data.vocabulary.studied}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Words known</CardDescription>
            <CardTitle className="text-3xl">{data.vocabulary.known}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Quizzes taken</CardDescription>
            <CardTitle className="text-3xl">{data.quizzes.attemptsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average quiz score</CardDescription>
            <CardTitle className="text-3xl">{data.quizzes.averageScorePercent}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vocabulary completion</CardTitle>
          <CardDescription>
            {data.vocabulary.studied} of {data.vocabulary.totalWords} words marked as learning or known
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={data.vocabulary.studied}
            total={data.vocabulary.totalWords}
            label="Overall completion"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quiz history</CardTitle>
          <CardDescription>Your recent quiz attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {data.quizzes.recentAttempts.length === 0 ? (
            <p className="text-muted-foreground">
              No quizzes taken yet. Head to Quizzes to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {data.quizzes.recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex flex-col gap-1 rounded-md border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{attempt.quizTitle}</p>
                    <p className="text-sm capitalize text-muted-foreground">
                      {attempt.quizLevel.toLowerCase()} · {formatDate(attempt.completedAt)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {attempt.score}/{attempt.total} ({attempt.percent}%)
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
