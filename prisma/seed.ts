import { PrismaClient, WordLevel, QuestionType } from "@prisma/client";

const db = new PrismaClient();

const words: Array<{
  term: string;
  definition: string;
  example: string;
  level: WordLevel;
}> = [
  { term: "hello", definition: "A greeting used when meeting someone", example: "Hello, how are you today?", level: "BEGINNER" },
  { term: "goodbye", definition: "A word said when leaving", example: "She waved and said goodbye.", level: "BEGINNER" },
  { term: "please", definition: "Used to make a request polite", example: "Could you help me, please?", level: "BEGINNER" },
  { term: "thank you", definition: "An expression of gratitude", example: "Thank you for your help.", level: "BEGINNER" },
  { term: "water", definition: "A clear liquid essential for life", example: "I drink water every morning.", level: "BEGINNER" },
  { term: "food", definition: "Something people eat", example: "The food at this restaurant is delicious.", level: "BEGINNER" },
  { term: "house", definition: "A building where people live", example: "They bought a new house last year.", level: "BEGINNER" },
  { term: "family", definition: "A group of related people", example: "My family lives in London.", level: "BEGINNER" },
  { term: "friend", definition: "A person you know well and like", example: "She is my best friend.", level: "BEGINNER" },
  { term: "school", definition: "A place where students learn", example: "The children walk to school.", level: "BEGINNER" },
  { term: "book", definition: "Pages bound together for reading", example: "I read a book before bed.", level: "BEGINNER" },
  { term: "work", definition: "Activity done to earn money", example: "He goes to work at eight o'clock.", level: "BEGINNER" },
  { term: "time", definition: "The ongoing sequence of events", example: "What time is the meeting?", level: "BEGINNER" },
  { term: "day", definition: "A period of 24 hours", example: "It was a sunny day.", level: "BEGINNER" },
  { term: "night", definition: "The dark part of the day", example: "The stars shine at night.", level: "BEGINNER" },
  { term: "happy", definition: "Feeling pleasure or contentment", example: "She felt happy after the good news.", level: "BEGINNER" },
  { term: "sad", definition: "Feeling unhappy or sorrowful", example: "He was sad to leave his hometown.", level: "BEGINNER" },
  { term: "big", definition: "Large in size", example: "They live in a big city.", level: "BEGINNER" },
  { term: "small", definition: "Little in size", example: "The room is too small for a desk.", level: "BEGINNER" },
  { term: "fast", definition: "Moving or happening quickly", example: "The train is very fast.", level: "BEGINNER" },
  { term: "slow", definition: "Not moving quickly", example: "Traffic was slow this morning.", level: "BEGINNER" },
  { term: "hot", definition: "Having a high temperature", example: "The coffee is too hot to drink.", level: "BEGINNER" },
  { term: "cold", definition: "Having a low temperature", example: "It is cold outside in winter.", level: "BEGINNER" },
  { term: "new", definition: "Recently made or discovered", example: "She bought a new phone.", level: "BEGINNER" },
  { term: "old", definition: "Having existed for a long time", example: "This is an old building.", level: "BEGINNER" },
  { term: "learn", definition: "To gain knowledge or skill", example: "Children learn languages quickly.", level: "BEGINNER" },
  { term: "speak", definition: "To say words aloud", example: "Can you speak English?", level: "BEGINNER" },
  { term: "listen", definition: "To pay attention to sounds", example: "Please listen to the teacher.", level: "BEGINNER" },
  { term: "read", definition: "To look at and understand written words", example: "I read the news every morning.", level: "BEGINNER" },
  { term: "write", definition: "To form letters or words on paper", example: "She likes to write stories.", level: "BEGINNER" },
  { term: "travel", definition: "To go from one place to another", example: "They love to travel abroad.", level: "INTERMEDIATE" },
  { term: "experience", definition: "Knowledge gained from doing something", example: "She has years of teaching experience.", level: "INTERMEDIATE" },
  { term: "achieve", definition: "To successfully reach a goal", example: "He worked hard to achieve his dream.", level: "INTERMEDIATE" },
  { term: "improve", definition: "To make or become better", example: "Practice will improve your pronunciation.", level: "INTERMEDIATE" },
  { term: "challenge", definition: "Something difficult that tests ability", example: "Learning a language is a fun challenge.", level: "INTERMEDIATE" },
  { term: "opportunity", definition: "A chance to do something", example: "This job is a great opportunity.", level: "INTERMEDIATE" },
  { term: "decision", definition: "A choice made after thinking", example: "Making a decision can be hard.", level: "INTERMEDIATE" },
  { term: "environment", definition: "The natural world around us", example: "We must protect the environment.", level: "INTERMEDIATE" },
  { term: "community", definition: "A group of people living in one area", example: "The community organized a festival.", level: "INTERMEDIATE" },
  { term: "culture", definition: "The customs and beliefs of a group", example: "Travel helps you learn about other cultures.", level: "INTERMEDIATE" },
  { term: "communicate", definition: "To share information with others", example: "Good leaders communicate clearly.", level: "INTERMEDIATE" },
  { term: "confident", definition: "Feeling sure about your abilities", example: "She became more confident after practice.", level: "INTERMEDIATE" },
  { term: "creative", definition: "Able to produce original ideas", example: "He is a very creative designer.", level: "INTERMEDIATE" },
  { term: "efficient", definition: "Working well without wasting time", example: "The new system is more efficient.", level: "INTERMEDIATE" },
  { term: "generous", definition: "Willing to give more than expected", example: "Our neighbor is very generous.", level: "INTERMEDIATE" },
  { term: "patient", definition: "Able to wait calmly", example: "Be patient while learning new skills.", level: "INTERMEDIATE" },
  { term: "reliable", definition: "Able to be trusted", example: "She is a reliable team member.", level: "INTERMEDIATE" },
  { term: "responsible", definition: "Having a duty to deal with something", example: "He is responsible for the project.", level: "INTERMEDIATE" },
  { term: "curious", definition: "Eager to know or learn", example: "Curious students ask many questions.", level: "INTERMEDIATE" },
  { term: "grateful", definition: "Feeling thankful", example: "I am grateful for your support.", level: "INTERMEDIATE" },
];

async function main() {
  console.log("Seeding database...");

  for (const word of words) {
    await db.word.upsert({
      where: { term: word.term },
      update: word,
      create: word,
    });
  }

  const beginnerWords = await db.word.findMany({
    where: { level: "BEGINNER" },
    take: 10,
  });

  const intermediateWords = await db.word.findMany({
    where: { level: "INTERMEDIATE" },
    take: 8,
  });

  const beginnerQuiz = await db.quiz.upsert({
    where: { id: "seed-beginner-quiz" },
    update: {
      title: "Beginner Vocabulary Quiz",
      level: "BEGINNER",
    },
    create: {
      id: "seed-beginner-quiz",
      title: "Beginner Vocabulary Quiz",
      level: "BEGINNER",
    },
  });

  await db.quizQuestion.deleteMany({ where: { quizId: beginnerQuiz.id } });

  const beginnerQuestions = [
    {
      quizId: beginnerQuiz.id,
      type: QuestionType.MULTIPLE_CHOICE,
      content: {
        prompt: "What does 'hello' mean?",
        options: ["A greeting", "A farewell", "A question", "A number"],
        correctIndex: 0,
      },
    },
    {
      quizId: beginnerQuiz.id,
      type: QuestionType.FILL_BLANK,
      content: {
        prompt: "Complete the sentence:",
        sentence: "I drink _____ every morning.",
        answer: "water",
      },
    },
    {
      quizId: beginnerQuiz.id,
      type: QuestionType.MULTIPLE_CHOICE,
      content: {
        prompt: `What is the definition of '${beginnerWords[5]?.term ?? "food"}'?`,
        options: [
          beginnerWords[5]?.definition ?? "Something people eat",
          "A place to sleep",
          "A type of vehicle",
          "A color",
        ],
        correctIndex: 0,
      },
    },
    {
      quizId: beginnerQuiz.id,
      type: QuestionType.FILL_BLANK,
      content: {
        prompt: "Complete the sentence:",
        sentence: "The children walk to _____.",
        answer: "school",
      },
    },
    {
      quizId: beginnerQuiz.id,
      type: QuestionType.MULTIPLE_CHOICE,
      content: {
        prompt: "Which word means 'large in size'?",
        options: ["small", "big", "slow", "cold"],
        correctIndex: 1,
      },
    },
  ];

  await db.quizQuestion.createMany({ data: beginnerQuestions });

  const intermediateQuiz = await db.quiz.upsert({
    where: { id: "seed-intermediate-quiz" },
    update: {
      title: "Intermediate Vocabulary Quiz",
      level: "INTERMEDIATE",
    },
    create: {
      id: "seed-intermediate-quiz",
      title: "Intermediate Vocabulary Quiz",
      level: "INTERMEDIATE",
    },
  });

  await db.quizQuestion.deleteMany({ where: { quizId: intermediateQuiz.id } });

  const intermediateQuestions = [
    {
      quizId: intermediateQuiz.id,
      type: QuestionType.MULTIPLE_CHOICE,
      content: {
        prompt: "What does 'achieve' mean?",
        options: [
          "To successfully reach a goal",
          "To forget something",
          "To sleep late",
          "To run quickly",
        ],
        correctIndex: 0,
      },
    },
    {
      quizId: intermediateQuiz.id,
      type: QuestionType.FILL_BLANK,
      content: {
        prompt: "Complete the sentence:",
        sentence: "Practice will _____ your pronunciation.",
        answer: "improve",
      },
    },
    {
      quizId: intermediateQuiz.id,
      type: QuestionType.MULTIPLE_CHOICE,
      content: {
        prompt: `What is the definition of '${intermediateWords[0]?.term ?? "travel"}'?`,
        options: [
          intermediateWords[0]?.definition ?? "To go from one place to another",
          "To cook food",
          "To build a house",
          "To write a letter",
        ],
        correctIndex: 0,
      },
    },
    {
      quizId: intermediateQuiz.id,
      type: QuestionType.FILL_BLANK,
      content: {
        prompt: "Complete the sentence:",
        sentence: "We must protect the _____.",
        answer: "environment",
      },
    },
  ];

  await db.quizQuestion.createMany({ data: intermediateQuestions });

  const mixedQuiz = await db.quiz.upsert({
    where: { id: "seed-mixed-quiz" },
    update: {
      title: "Mixed Skills Quiz",
      level: "BEGINNER",
    },
    create: {
      id: "seed-mixed-quiz",
      title: "Mixed Skills Quiz",
      level: "BEGINNER",
    },
  });

  await db.quizQuestion.deleteMany({ where: { quizId: mixedQuiz.id } });

  await db.quizQuestion.createMany({
    data: [
      {
        quizId: mixedQuiz.id,
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word is a polite request word?",
          options: ["please", "angry", "table", "window"],
          correctIndex: 0,
        },
      },
      {
        quizId: mixedQuiz.id,
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Thank you for your _____.",
          answer: "help",
        },
      },
      {
        quizId: mixedQuiz.id,
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'listen' mean?",
          options: [
            "To pay attention to sounds",
            "To eat quickly",
            "To drive a car",
            "To paint a picture",
          ],
          correctIndex: 0,
        },
      },
    ],
  });

  console.log(`Seeded ${words.length} words and 3 quizzes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
