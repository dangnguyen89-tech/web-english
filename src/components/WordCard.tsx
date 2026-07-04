"use client";

import { BookOpen, CheckCircle2, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PronounceButton } from "@/components/PronounceButton";
import { WordVisual } from "@/components/WordVisual";
import { formatIpa } from "@/lib/pronunciation";
import { cn } from "@/lib/utils";

export type WordStatus = "NEW" | "LEARNING" | "KNOWN";

export interface WordCardData {
  id: string;
  term: string;
  definition: string;
  example: string;
  ipa?: string | null;
  imageUrl?: string | null;
  level: "BEGINNER" | "INTERMEDIATE";
  status?: WordStatus;
}

interface WordCardProps {
  word: WordCardData;
  onStatusChange?: (wordId: string, status: WordStatus) => void;
  loading?: boolean;
}

const statusConfig: Record<WordStatus, { label: string; icon: typeof CircleDashed; className: string }> = {
  NEW: { label: "New", icon: CircleDashed, className: "text-muted-foreground" },
  LEARNING: { label: "Learning", icon: BookOpen, className: "text-amber-600" },
  KNOWN: { label: "Known", icon: CheckCircle2, className: "text-green-600" },
};

export function WordCard({ word, onStatusChange, loading }: WordCardProps) {
  const status = word.status ?? "NEW";
  const StatusIcon = statusConfig[status].icon;
  const ipaDisplay = formatIpa(word.ipa);

  return (
    <Card className="overflow-hidden">
      <WordVisual term={word.term} imageUrl={word.imageUrl} className="rounded-none border-0 border-b" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl capitalize">{word.term}</CardTitle>
              <PronounceButton text={word.term} mode="word" />
            </div>
            {ipaDisplay && (
              <p className="mt-1 font-mono text-sm text-primary">{ipaDisplay}</p>
            )}
            <CardDescription className="mt-1 capitalize">
              {word.level.toLowerCase()} level
            </CardDescription>
          </div>
          <span className={cn("flex shrink-0 items-center gap-1 text-xs font-medium", statusConfig[status].className)}>
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig[status].label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Definition</p>
          <p className="mt-1">{word.definition}</p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">Example</p>
            <PronounceButton text={word.example} mode="sentence" size="sm" />
          </div>
          <p className="mt-1 italic text-foreground/90">&ldquo;{word.example}&rdquo;</p>
        </div>
        {onStatusChange && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              variant={status === "LEARNING" ? "default" : "outline"}
              disabled={loading}
              onClick={() => onStatusChange(word.id, "LEARNING")}
            >
              Mark Learning
            </Button>
            <Button
              size="sm"
              variant={status === "KNOWN" ? "default" : "outline"}
              disabled={loading}
              onClick={() => onStatusChange(word.id, "KNOWN")}
            >
              Mark Known
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
