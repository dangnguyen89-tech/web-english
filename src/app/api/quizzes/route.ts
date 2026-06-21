import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const quizzes = await db.quiz.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { questions: true } },
      attempts: {
        where: { userId: session!.user!.id },
        orderBy: { completedAt: "desc" },
        take: 1,
      },
    },
  });

  const result = quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    level: quiz.level,
    questionCount: quiz._count.questions,
    lastAttempt: quiz.attempts[0]
      ? {
          score: quiz.attempts[0].score,
          total: quiz.attempts[0].total,
          completedAt: quiz.attempts[0].completedAt,
        }
      : null,
  }));

  return NextResponse.json({ quizzes: result });
}
