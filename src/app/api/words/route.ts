import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { wordQuerySchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

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
    level: word.level,
    status: word.progress[0]?.status ?? "NEW",
  }));

  return NextResponse.json({ words: result });
}
