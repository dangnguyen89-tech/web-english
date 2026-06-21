import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPercent } from "@/lib/utils";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [totalWords, wordProgress, quizAttemptsCount, recentAttempts] = await Promise.all([
    db.word.count(),
    db.userWordProgress.findMany({
      where: { userId },
      select: { status: true },
    }),
    db.quizAttempt.count({ where: { userId } }),
    db.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 3,
      include: { quiz: { select: { title: true } } },
    }),
  ]);

  const known = wordProgress.filter((p) => p.status === "KNOWN").length;
  const learning = wordProgress.filter((p) => p.status === "LEARNING").length;
  const studied = known + learning;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session.user.name ?? "Learner"}</h1>
        <p className="mt-2 text-muted-foreground">
          Continue building your English vocabulary and test your knowledge.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Words studied</CardDescription>
            <CardTitle className="text-3xl">{studied}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Words known</CardDescription>
            <CardTitle className="text-3xl">{known}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Currently learning</CardDescription>
            <CardTitle className="text-3xl">{learning}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Quizzes taken</CardDescription>
            <CardTitle className="text-3xl">{quizAttemptsCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vocabulary progress</CardTitle>
          <CardDescription>
            {studied} of {totalWords} words studied ({formatPercent(studied, totalWords)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar value={studied} total={totalWords} />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/vocabulary">Study vocabulary</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/quizzes">Take a quiz</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {recentAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent quiz results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between rounded-md border px-4 py-3"
              >
                <span className="font-medium">{attempt.quiz.title}</span>
                <span className="text-sm text-muted-foreground">
                  {attempt.score}/{attempt.total} ({formatPercent(attempt.score, attempt.total)}%)
                </span>
              </div>
            ))}
            <Button asChild variant="link" className="px-0">
              <Link href="/progress">View all progress</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
