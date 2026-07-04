import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { createWordsBodySchema, wordQuerySchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";
import { getIpaForTerm } from "@/lib/ipa-map";
import { getDefaultWordImageUrl, getWordImageUrl } from "@/lib/word-images";

export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = wordQuerySchema.safeParse(params);
  const search = parsed.success ? parsed.data.search : undefined;
  const level = parsed.success ? parsed.data.level : undefined;

  const where: Prisma.WordWhereInput = {};
  if (search) {
    where.OR = [
      { term: { contains: search, mode: "insensitive" } },
      { definition: { contains: search, mode: "insensitive" } },
    ];
  }
  if (level && level !== "ALL") {
    where.level = level;
  }

  const words = await db.word.findMany({
    where,
    orderBy: { term: "asc" },
    include: {
      progress: {
        where: { userId: session!.user!.id },
        take: 1,
      },
    },
  });

  const result = words.map((word) => ({
    id: word.id,
    term: word.term,
    definition: word.definition,
    example: word.example,
    ipa: word.ipa ?? getIpaForTerm(word.term),
    imageUrl: getWordImageUrl(word.term, word.imageUrl),
    level: word.level,
    status: word.progress[0]?.status ?? "NEW",
  }));

  return NextResponse.json({ words: result });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = createWordsBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid word data" },
        { status: 400 }
      );
    }

    const wordsToCreate =
      "words" in parsed.data ? parsed.data.words : [parsed.data];

    const created = [];
    const skipped = [];

    for (const word of wordsToCreate) {
      const normalizedTerm = word.term.trim().toLowerCase();
      const existing = await db.word.findUnique({
        where: { term: normalizedTerm },
      });

      if (existing) {
        skipped.push({ term: word.term, reason: "Word already exists" });
        continue;
      }

      const record = await db.word.create({
        data: {
          term: normalizedTerm,
          definition: word.definition.trim(),
          example: word.example.trim(),
          ipa: word.ipa?.trim() || getIpaForTerm(normalizedTerm),
          imageUrl:
            word.imageUrl?.trim() ||
            getDefaultWordImageUrl(normalizedTerm) ||
            null,
          level: word.level,
        },
      });

      created.push(record);
    }

    return NextResponse.json(
      {
        created: created.map((w) => ({
          id: w.id,
          term: w.term,
          definition: w.definition,
          example: w.example,
          ipa: w.ipa,
          imageUrl: w.imageUrl,
          level: w.level,
        })),
        skipped,
        message:
          created.length > 0
            ? `Added ${created.length} word(s) to vocabulary`
            : "No new words were added",
      },
      { status: created.length > 0 ? 201 : 200 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to add vocabulary" }, { status: 500 });
  }
}
