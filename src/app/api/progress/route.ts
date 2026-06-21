import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { formatPercent } from "@/lib/utils";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = session!.user!.id;

  const [totalWords, wordProgress, quizAttempts] = await Promise.all([
    db.word.count(),
    db.userWordProgress.findMany({
      where: { userId },
      select: { status: true },
    }),
    db.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      include: {
        quiz: { select: { title: true, level: true } },
      },
    }),
  ]);

  const learning = wordProgress.filter((p) => p.status === "LEARNING").length;
  const known = wordProgress.filter((p) => p.status === "KNOWN").length;
  const studied = learning + known;

  const averageQuizScore =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((sum, a) => sum + formatPercent(a.score, a.total), 0) /
            quizAttempts.length
        )
      : 0;

  return NextResponse.json({
    vocabulary: {
      totalWords,
      studied,
      learning,
      known,
      completionPercent: formatPercent(studied, totalWords),
    },
    quizzes: {
      attemptsCount: quizAttempts.length,
      averageScorePercent: averageQuizScore,
      recentAttempts: quizAttempts.slice(0, 10).map((attempt) => ({
        id: attempt.id,
        quizTitle: attempt.quiz.title,
        quizLevel: attempt.quiz.level,
        score: attempt.score,
        total: attempt.total,
        percent: formatPercent(attempt.score, attempt.total),
        completedAt: attempt.completedAt,
      })),
    },
  });
}
