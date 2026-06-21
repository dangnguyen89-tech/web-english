import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { wordProgressSchema } from "@/lib/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id: wordId } = await params;

  try {
    const body = await request.json();
    const parsed = wordProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid status" },
        { status: 400 }
      );
    }

    const word = await db.word.findUnique({ where: { id: wordId } });
    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    const progress = await db.userWordProgress.upsert({
      where: {
        userId_wordId: {
          userId: session!.user!.id,
          wordId,
        },
      },
      create: {
        userId: session!.user!.id,
        wordId,
        status: parsed.data.status,
      },
      update: {
        status: parsed.data.status,
        lastReviewed: new Date(),
      },
    });

    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
