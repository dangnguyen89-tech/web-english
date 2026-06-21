import Link from "next/link";
import { BookOpen, Brain, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="text-xl font-bold text-primary">EnglishLearn</span>
        <div className="flex gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Learn English with vocabulary, quizzes, and progress tracking
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Master everyday English words, test yourself with interactive quizzes, and watch your
            skills grow — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">Create free account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <BookOpen className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Vocabulary Lists</CardTitle>
              <CardDescription>
                Browse beginner and intermediate words with definitions and example sentences.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Brain className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Interactive Quizzes</CardTitle>
              <CardDescription>
                Practice with multiple choice and fill-in-the-blank questions.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <LineChart className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                See words learned, quiz scores, and your overall completion rate.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="mt-16 rounded-xl border bg-card p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to start learning?</h2>
          <p className="mt-2 text-muted-foreground">
            Join today and begin with 50+ curated English words and starter quizzes.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/register">Sign up now</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
