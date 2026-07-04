import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { createQuizQuestionSchema } from "@/lib/validators";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id: quizId } = await params;

  try {
    const quiz = await db.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createQuizQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid question data" },
        { status: 400 }
      );
    }

    const question = await db.quizQuestion.create({
      data: {
        quizId,
        type: parsed.data.type,
        content: parsed.data.content,
      },
      select: { id: true, type: true, content: true },
    });

    return NextResponse.json(
      { question, message: "Question added to quiz" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
  }
}
