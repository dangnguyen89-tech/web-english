"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playTextPronunciation } from "@/lib/pronunciation";

interface PronounceButtonProps {
  text: string;
  /** @deprecated Use `text` instead */
  term?: string;
  mode?: "word" | "sentence";
  className?: string;
  size?: "sm" | "default";
  label?: string;
}

export function PronounceButton({
  text,
  term,
  mode = "word",
  className,
  size = "sm",
  label,
}: PronounceButtonProps) {
  const [playing, setPlaying] = useState(false);
  const spokenText = text || term || "";
  const ariaLabel =
    label ??
    (mode === "sentence"
      ? `Listen to example sentence`
      : `Listen to pronunciation of ${spokenText}`);

  async function handleClick() {
    setPlaying(true);
    try {
      await playTextPronunciation(spokenText, mode);
    } finally {
      setTimeout(() => setPlaying(false), mode === "sentence" ? 1200 : 600);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={size === "sm" ? "icon" : "default"}
      className={cn(
        size === "sm" && "h-8 w-8 shrink-0",
        playing && "border-primary text-primary",
        className
      )}
      onClick={handleClick}
      aria-label={ariaLabel}
      title={mode === "sentence" ? "Listen to example" : "Listen to pronunciation"}
    >
      <Volume2 className={cn("h-4 w-4", playing && "animate-pulse")} />
    </Button>
  );
}
