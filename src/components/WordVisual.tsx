"use client";

import Image from "next/image";
import { getWordEmoji, getWordImageUrl } from "@/lib/word-images";
import { cn } from "@/lib/utils";

interface WordVisualProps {
  term: string;
  imageUrl?: string | null;
  className?: string;
}

export function WordVisual({ term, imageUrl, className }: WordVisualProps) {
  const url = getWordImageUrl(term, imageUrl);
  const emoji = getWordEmoji(term);

  if (url) {
    return (
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted",
          className
        )}
      >
        <Image
          src={url}
          alt={`Picture for the word ${term}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized={url.includes("wikimedia")}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg border bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-sky-950/40 dark:to-indigo-950/40",
        className
      )}
      aria-label={`Visual hint for ${term}`}
    >
      <span className="text-7xl leading-none" role="img" aria-hidden>
        {emoji}
      </span>
      <span className="text-xs font-medium capitalize text-muted-foreground">{term}</span>
    </div>
  );
}
