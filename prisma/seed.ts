import { PrismaClient } from "@prisma/client";
import { getIpaForTerm } from "../src/lib/ipa-map";
import { getDefaultWordImageUrl } from "../src/lib/word-images";
import { seedWords } from "./seed-data/words";
import { seedQuizzes } from "./seed-data/quizzes";

const db = new PrismaClient();

async function seedWordsData() {
  let created = 0;
  let updated = 0;

  for (const word of seedWords) {
    const ipa = getIpaForTerm(word.term);
    const imageUrl = getDefaultWordImageUrl(word.term);
    const data = { ...word, ipa, imageUrl };

    const existing = await db.word.findUnique({ where: { term: word.term } });
    if (existing) {
      await db.word.update({ where: { term: word.term }, data });
      updated++;
    } else {
      await db.word.create({ data });
      created++;
    }
  }

  return { created, updated, total: seedWords.length };
}

async function seedQuizzesData() {
  let quizCount = 0;
  let questionCount = 0;

  for (const quiz of seedQuizzes) {
    await db.quiz.upsert({
      where: { id: quiz.id },
      update: { title: quiz.title, level: quiz.level },
      create: { id: quiz.id, title: quiz.title, level: quiz.level },
    });

    await db.quizQuestion.deleteMany({ where: { quizId: quiz.id } });

    await db.quizQuestion.createMany({
      data: quiz.questions.map((q) => ({
        quizId: quiz.id,
        type: q.type,
        content: q.content,
      })),
    });

    quizCount++;
    questionCount += quiz.questions.length;
  }

  return { quizCount, questionCount };
}

async function main() {
  console.log("Seeding database with vocabulary and quizzes...\n");

  const wordsResult = await seedWordsData();
  console.log(
    `Words: ${wordsResult.total} total (${wordsResult.created} new, ${wordsResult.updated} updated)`
  );

  const beginnerCount = seedWords.filter((w) => w.level === "BEGINNER").length;
  const intermediateCount = seedWords.filter((w) => w.level === "INTERMEDIATE").length;
  console.log(`  - Beginner: ${beginnerCount}`);
  console.log(`  - Intermediate: ${intermediateCount}`);

  const quizResult = await seedQuizzesData();
  console.log(
    `\nQuizzes: ${quizResult.quizCount} quizzes, ${quizResult.questionCount} questions total`
  );

  seedQuizzes.forEach((q) => {
    console.log(`  - ${q.title} (${q.questions.length} questions)`);
  });

  console.log("\nDatabase seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
