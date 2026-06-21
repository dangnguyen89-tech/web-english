import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  const quiz = await db.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          type: true,
          content: true,
        },
      },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      level: quiz.level,
      questions: quiz.questions,
    },
  });
}
