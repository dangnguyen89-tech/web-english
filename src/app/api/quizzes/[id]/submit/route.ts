import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { quizSubmitSchema } from "@/lib/validators";
import type { FillBlankContent, MultipleChoiceContent } from "@/lib/quiz-types";

function gradeAnswer(
  type: "MULTIPLE_CHOICE" | "FILL_BLANK",
  content: unknown,
  answer: string
): boolean {
  if (type === "MULTIPLE_CHOICE") {
    const mc = content as MultipleChoiceContent;
    return answer === String(mc.correctIndex);
  }
  const fb = content as FillBlankContent;
  return answer.trim().toLowerCase() === fb.answer.trim().toLowerCase();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id: quizId } = await params;

  try {
    const body = await request.json();
    const parsed = quizSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    let score = 0;
    const results = quiz.questions.map((question) => {
      const userAnswer = parsed.data.answers[question.id] ?? "";
      const correct = gradeAnswer(question.type, question.content, userAnswer);
      if (correct) score += 1;
      return {
        questionId: question.id,
        correct,
        userAnswer,
      };
    });

    const attempt = await db.quizAttempt.create({
      data: {
        userId: session!.user!.id,
        quizId,
        score,
        total: quiz.questions.length,
      },
    });

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        score: attempt.score,
        total: attempt.total,
        completedAt: attempt.completedAt,
      },
      results,
    });
  } catch {
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
