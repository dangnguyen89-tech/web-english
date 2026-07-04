"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { WordCard, type WordCardData, type WordStatus } from "@/components/WordCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VocabularyPage() {
  const [words, setWords] = useState<WordCardData[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (level !== "ALL") params.set("level", level);

    try {
      const res = await fetch(`/api/words?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load words");
      const data = await res.json();
      setWords(data.words);
    } catch {
      setError("Could not load vocabulary. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, level]);

  useEffect(() => {
    const timer = setTimeout(fetchWords, 300);
    return () => clearTimeout(timer);
  }, [fetchWords]);

  async function handleStatusChange(wordId: string, status: WordStatus) {
    setUpdatingId(wordId);
    try {
      const res = await fetch(`/api/words/${wordId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setWords((prev) =>
        prev.map((word) => (word.id === wordId ? { ...word, status } : word))
      );
    } catch {
      setError("Failed to update word status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vocabulary</h1>
          <p className="mt-2 text-muted-foreground">
            Browse words, read definitions, and mark your learning progress.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/add-content">Add new word</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search words or definitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Loading vocabulary...</p>
      ) : words.length === 0 ? (
        <p className="text-muted-foreground">No words found. Try a different search or filter.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onStatusChange={handleStatusChange}
              loading={updatingId === word.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
