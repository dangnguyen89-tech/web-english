import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { createQuizSchema } from "@/lib/validators";

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

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = createQuizSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid quiz data" },
        { status: 400 }
      );
    }

    const { title, level, questions } = parsed.data;

    const quiz = await db.quiz.create({
      data: {
        title: title.trim(),
        level,
        questions: {
          create: questions.map((q) => ({
            type: q.type,
            content: q.content,
          })),
        },
      },
      include: {
        questions: {
          select: { id: true, type: true, content: true },
        },
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json(
      {
        quiz: {
          id: quiz.id,
          title: quiz.title,
          level: quiz.level,
          questionCount: quiz._count.questions,
          questions: quiz.questions,
        },
        message: `Quiz "${quiz.title}" created with ${quiz._count.questions} question(s)`,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
