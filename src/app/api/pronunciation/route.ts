import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getIpaForTerm } from "@/lib/ipa-map";

async function fetchFromDictionary(term: string) {
  const slug = encodeURIComponent(term.trim().toLowerCase());
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${slug}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) return null;

  const entries = (await res.json()) as Array<{
    phonetics?: Array<{ text?: string; audio?: string }>;
  }>;

  let ipa: string | null = null;
  let audioUrl: string | null = null;

  for (const entry of entries) {
    for (const phonetic of entry.phonetics ?? []) {
      if (!audioUrl && phonetic.audio) audioUrl = phonetic.audio;
      if (!ipa && phonetic.text) ipa = phonetic.text.replace(/^\//, "").replace(/\/$/, "");
    }
  }

  return { ipa, audioUrl };
}

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const term = request.nextUrl.searchParams.get("term");
  if (!term?.trim()) {
    return NextResponse.json({ error: "term query parameter is required" }, { status: 400 });
  }

  const normalized = term.trim().toLowerCase();
  const localIpa = getIpaForTerm(normalized);

  try {
    const dictionary = await fetchFromDictionary(normalized);

    return NextResponse.json({
      term: normalized,
      ipa: dictionary?.ipa ?? localIpa,
      audioUrl: dictionary?.audioUrl ?? null,
    });
  } catch {
    return NextResponse.json({
      term: normalized,
      ipa: localIpa,
      audioUrl: null,
    });
  }
}
