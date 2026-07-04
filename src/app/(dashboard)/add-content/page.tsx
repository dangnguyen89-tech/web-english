"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tab = "word" | "quiz";

interface DraftQuestion {
  type: "MULTIPLE_CHOICE" | "FILL_BLANK";
  prompt: string;
  options: string[];
  correctIndex: number;
  sentence: string;
  answer: string;
}

const emptyQuestion = (): DraftQuestion => ({
  type: "MULTIPLE_CHOICE",
  prompt: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  sentence: "",
  answer: "",
});

export default function AddContentPage() {
  const [tab, setTab] = useState<Tab>("word");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Word form
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [ipa, setIpa] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [wordLevel, setWordLevel] = useState<"BEGINNER" | "INTERMEDIATE">("BEGINNER");

  // Quiz form
  const [quizTitle, setQuizTitle] = useState("");
  const [quizLevel, setQuizLevel] = useState<"BEGINNER" | "INTERMEDIATE">("BEGINNER");
  const [questions, setQuestions] = useState<DraftQuestion[]>([emptyQuestion()]);

  function updateQuestion(index: number, patch: Partial<DraftQuestion>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q))
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleAddWord(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term,
          definition,
          example,
          ipa: ipa.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          level: wordLevel,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to add word");
        return;
      }

      setMessage(data.message ?? "Word added successfully");
      setTerm("");
      setDefinition("");
      setExample("");
      setIpa("");
      setImageUrl("");
    } catch {
      setError("Failed to add word. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateQuiz(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const payload = {
      title: quizTitle,
      level: quizLevel,
      questions: questions.map((q) => {
        if (q.type === "MULTIPLE_CHOICE") {
          return {
            type: q.type,
            content: {
              prompt: q.prompt,
              options: q.options.filter((o) => o.trim()),
              correctIndex: q.correctIndex,
            },
          };
        }
        return {
          type: q.type,
          content: {
            prompt: q.prompt,
            sentence: q.sentence,
            answer: q.answer,
          },
        };
      }),
    };

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create quiz");
        return;
      }

      setMessage(data.message ?? "Quiz created successfully");
      setQuizTitle("");
      setQuestions([emptyQuestion()]);
    } catch {
      setError("Failed to create quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add learning content</h1>
        <p className="mt-2 text-muted-foreground">
          Add new vocabulary words or create quiz games for everyone to learn from.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={tab === "word" ? "default" : "outline"}
          onClick={() => {
            setTab("word");
            setError("");
            setMessage("");
          }}
        >
          Add word
        </Button>
        <Button
          variant={tab === "quiz" ? "default" : "outline"}
          onClick={() => {
            setTab("quiz");
            setError("");
            setMessage("");
          }}
        >
          Create quiz
        </Button>
      </div>

      {message && (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}{" "}
          {tab === "word" ? (
            <Link href="/vocabulary" className="font-medium underline">
              View vocabulary
            </Link>
          ) : (
            <Link href="/quizzes" className="font-medium underline">
              View quizzes
            </Link>
          )}
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {tab === "word" ? (
        <Card>
          <CardHeader>
            <CardTitle>New vocabulary word</CardTitle>
            <CardDescription>
              Add a word with its definition and example sentence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddWord} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="term">Word</Label>
                  <Input
                    id="term"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="e.g. accomplish"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={wordLevel}
                    onValueChange={(v) => setWordLevel(v as "BEGINNER" | "INTERMEDIATE")}
                  >
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="definition">Definition</Label>
                <Input
                  id="definition"
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  placeholder="What does this word mean?"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="example">Example sentence</Label>
                <Input
                  id="example"
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="Use the word in a sentence"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Picture URL (optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/apple.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Link to a kid-friendly photo. If empty, a fun emoji hint is shown instead.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipa">IPA pronunciation (optional)</Label>
                <Input
                  id="ipa"
                  value={ipa}
                  onChange={(e) => setIpa(e.target.value)}
                  placeholder="e.g. həˈloʊ"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to auto-detect when available.
                </p>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add word"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>New quiz game</CardTitle>
            <CardDescription>
              Create a quiz with multiple choice or fill-in-the-blank questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateQuiz} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quizTitle">Quiz title</Label>
                  <Input
                    id="quizTitle"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g. Daily vocabulary challenge"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quizLevel">Level</Label>
                  <Select
                    value={quizLevel}
                    onValueChange={(v) => setQuizLevel(v as "BEGINNER" | "INTERMEDIATE")}
                  >
                    <SelectTrigger id="quizLevel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={index} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">Question {index + 1}</span>
                      {questions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={q.type}
                        onValueChange={(v) =>
                          updateQuestion(index, {
                            type: v as "MULTIPLE_CHOICE" | "FILL_BLANK",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MULTIPLE_CHOICE">Multiple choice</SelectItem>
                          <SelectItem value="FILL_BLANK">Fill in the blank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prompt</Label>
                      <Input
                        value={q.prompt}
                        onChange={(e) => updateQuestion(index, { prompt: e.target.value })}
                        placeholder="Question text"
                        required
                      />
                    </div>

                    {q.type === "MULTIPLE_CHOICE" ? (
                      <>
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="space-y-2">
                            <Label>Option {optIndex + 1}</Label>
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const options = [...q.options];
                                options[optIndex] = e.target.value;
                                updateQuestion(index, { options });
                              }}
                              required={optIndex < 2}
                            />
                          </div>
                        ))}
                        <div className="space-y-2">
                          <Label>Correct option (1–4)</Label>
                          <Select
                            value={String(q.correctIndex)}
                            onValueChange={(v) =>
                              updateQuestion(index, { correctIndex: Number(v) })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3].map((i) => (
                                <SelectItem key={i} value={String(i)}>
                                  Option {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Sentence (with blank)</Label>
                          <Input
                            value={q.sentence}
                            onChange={(e) => updateQuestion(index, { sentence: e.target.value })}
                            placeholder="e.g. She felt _____ after the good news."
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Correct answer</Label>
                          <Input
                            value={q.answer}
                            onChange={(e) => updateQuestion(index, { answer: e.target.value })}
                            placeholder="e.g. happy"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={addQuestion}>
                  Add another question
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create quiz"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API reference</CardTitle>
          <CardDescription>Use these endpoints programmatically (requires login session)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <code className="rounded bg-muted px-1.5 py-0.5">POST /api/words</code>
            <p className="mt-1 text-muted-foreground">
              Body: {"{ term, definition, example, level }"} or {"{ words: [...] }"} for bulk insert
            </p>
          </div>
          <div>
            <code className="rounded bg-muted px-1.5 py-0.5">POST /api/quizzes</code>
            <p className="mt-1 text-muted-foreground">
              Body: {"{ title, level, questions: [{ type, content }] }"}
            </p>
          </div>
          <div>
            <code className="rounded bg-muted px-1.5 py-0.5">POST /api/quizzes/[id]/questions</code>
            <p className="mt-1 text-muted-foreground">
              Add a single question to an existing quiz
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
