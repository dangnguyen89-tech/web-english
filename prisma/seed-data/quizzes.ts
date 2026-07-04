import { QuestionType, WordLevel } from "@prisma/client";

export type SeedQuizQuestion = {
  type: QuestionType;
  content: Record<string, unknown>;
};

export type SeedQuiz = {
  id: string;
  title: string;
  level: WordLevel;
  questions: SeedQuizQuestion[];
};

export const seedQuizzes: SeedQuiz[] = [
  {
    id: "seed-beginner-greetings",
    title: "Beginner: Greetings & Politeness",
    level: "BEGINNER",
    questions: [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'hello' mean?",
          options: ["A greeting", "A farewell", "A question", "A number"],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word do you use to say thank you?",
          options: ["sorry", "please", "thank you", "goodbye"],
          correctIndex: 2,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Could you help me, _____?",
          answer: "please",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What do you say when you arrive at someone's home?",
          options: ["goodbye", "welcome", "sorry", "no"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "I am _____ for being late.",
          answer: "sorry",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word means you agree?",
          options: ["no", "yes", "sorry", "goodbye"],
          correctIndex: 1,
        },
      },
    ],
  },
  {
    id: "seed-beginner-daily-life",
    title: "Beginner: Daily Life",
    level: "BEGINNER",
    questions: [
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "I drink _____ every morning.",
          answer: "water",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is the definition of 'food'?",
          options: ["Something people eat", "A place to sleep", "A type of vehicle", "A color"],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "The children walk to _____.",
          answer: "school",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Where do sick people go for treatment?",
          options: ["shop", "hospital", "school", "city"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "He goes to _____ at eight o'clock.",
          answer: "work",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What do you read before bed?",
          options: ["a car", "a book", "a door", "a city"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "I need to _____ groceries.",
          answer: "buy",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which device do you use to call people?",
          options: ["tree", "phone", "bread", "rain"],
          correctIndex: 1,
        },
      },
    ],
  },
  {
    id: "seed-beginner-feelings",
    title: "Beginner: Feelings & Adjectives",
    level: "BEGINNER",
    questions: [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word means 'large in size'?",
          options: ["small", "big", "slow", "cold"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "How do you feel when something good happens?",
          options: ["sad", "happy", "cold", "slow"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "The coffee is too _____ to drink.",
          answer: "hot",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word means 'not difficult'?",
          options: ["hard", "easy", "old", "fast"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "The sunset was _____.",
          answer: "beautiful",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word is the opposite of 'fast'?",
          options: ["big", "slow", "hot", "new"],
          correctIndex: 1,
        },
      },
    ],
  },
  {
    id: "seed-beginner-verbs",
    title: "Beginner: Action Verbs",
    level: "BEGINNER",
    questions: [
      {
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
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Children _____ languages quickly.",
          answer: "learn",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which verb means to move quickly on foot?",
          options: ["walk", "sleep", "run", "write"],
          correctIndex: 2,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Can you _____ me with this?",
          answer: "help",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What do you do with your eyes closed at night?",
          options: ["run", "sleep", "buy", "speak"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "She likes to _____ stories.",
          answer: "write",
        },
      },
    ],
  },
  {
    id: "seed-beginner-nature",
    title: "Beginner: Nature & Animals",
    level: "BEGINNER",
    questions: [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What shines in the sky during the day?",
          options: ["rain", "sun", "tree", "door"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Take an umbrella; it might _____.",
          answer: "rain",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which animal says 'meow'?",
          options: ["dog", "bird", "cat", "fish"],
          correctIndex: 2,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Birds nest in the _____.",
          answer: "tree",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What color is grass?",
          options: ["red", "blue", "green", "black"],
          correctIndex: 2,
        },
      },
    ],
  },
  {
    id: "seed-intermediate-work",
    title: "Intermediate: Work & Career",
    level: "INTERMEDIATE",
    questions: [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'deadline' mean?",
          options: [
            "The latest time something must be finished",
            "A type of job interview",
            "Money paid for work",
            "A person you work with",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "He has a job _____ tomorrow.",
          answer: "interview",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is a 'colleague'?",
          options: [
            "A person you work with",
            "A final exam",
            "A business strategy",
            "A type of research",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "She built a successful _____ in medicine.",
          answer: "career",
        },
      },
      {
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
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Practice will _____ your pronunciation.",
          answer: "improve",
        },
      },
    ],
  },
  {
    id: "seed-intermediate-communication",
    title: "Intermediate: Communication Skills",
    level: "INTERMEDIATE",
    questions: [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'persuade' mean?",
          options: [
            "To convince someone to do or believe something",
            "To say sorry",
            "To wait calmly",
            "To give money",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Good leaders _____ clearly.",
          answer: "communicate",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word means 'feeling sure about your abilities'?",
          options: ["patient", "confident", "generous", "curious"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Teachers _____ students to try.",
          answer: "encourage",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'negotiate' mean?",
          options: [
            "To discuss to reach an agreement",
            "To travel abroad",
            "To recycle materials",
            "To analyze data",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "He _____ for the delay.",
          answer: "apologized",
        },
      },
    ],
  },
  {
    id: "seed-intermediate-environment",
    title: "Intermediate: Environment & Society",
    level: "INTERMEDIATE",
    questions: [
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "We must protect the _____.",
          answer: "environment",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is 'pollution'?",
          options: [
            "Harmful substances in the environment",
            "A local festival",
            "A voting system",
            "A type of salary",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Please _____ plastic bottles.",
          answer: "recycle",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'volunteer' mean?",
          options: [
            "To offer help without being paid",
            "To make a decision",
            "To reach a goal",
            "To examine in detail",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Travel helps you learn about other _____.",
          answer: "cultures",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is a 'tradition'?",
          options: [
            "A custom passed through generations",
            "A scientific theory",
            "A job deadline",
            "A marketing plan",
          ],
          correctIndex: 0,
        },
      },
    ],
  },
  {
    id: "seed-intermediate-academic",
    title: "Intermediate: Academic Words",
    level: "INTERMEDIATE",
    questions: [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'analyze' mean?",
          options: [
            "To examine in detail",
            "To say thank you",
            "To run quickly",
            "To sleep at night",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Scientists _____ data carefully.",
          answer: "analyze",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is 'evidence'?",
          options: [
            "Facts that support a belief",
            "A type of food",
            "A greeting word",
            "A pet animal",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Every choice has a _____.",
          answer: "consequence",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word means 'important or large enough to matter'?",
          options: ["small", "significant", "slow", "sad"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "We need a clear marketing _____.",
          answer: "strategy",
        },
      },
    ],
  },
  {
    id: "seed-mixed-challenge",
    title: "Mixed Challenge: Beginner to Intermediate",
    level: "INTERMEDIATE",
    questions: [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word is a polite request word?",
          options: ["please", "angry", "table", "window"],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "I am _____ for your support.",
          answer: "grateful",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'opportunity' mean?",
          options: ["A chance to do something", "A type of food", "A color", "A pet"],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "They love to _____ abroad.",
          answer: "travel",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which word means 'able to be trusted'?",
          options: ["reliable", "hot", "big", "fast"],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "_____ drives business growth.",
          answer: "Innovation",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What does 'efficient' mean?",
          options: [
            "Working well without wasting time",
            "Feeling unhappy",
            "Very large in size",
            "Moving quickly",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Health should be your top _____.",
          answer: "priority",
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What is 'technology'?",
          options: [
            "Scientific knowledge applied practically",
            "A family member",
            "A morning drink",
            "A school building",
          ],
          correctIndex: 0,
        },
      },
      {
        type: QuestionType.FILL_BLANK,
        content: {
          prompt: "Complete the sentence:",
          sentence: "Learning a language is a fun _____.",
          answer: "challenge",
        },
      },
    ],
  },
  {
    id: "seed-beginner-speed-round",
    title: "Beginner Speed Round",
    level: "BEGINNER",
    questions: [
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "What do you say when leaving?",
          options: ["hello", "goodbye", "please", "welcome"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Which is a drink?",
          options: ["bread", "tea", "book", "door"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Opposite of 'hot'?",
          options: ["big", "cold", "fast", "new"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "You do this with a book:",
          options: ["eat", "read", "run", "sleep"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "A common pet that barks:",
          options: ["cat", "bird", "dog", "fish"],
          correctIndex: 2,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "The day after today is:",
          options: ["yesterday", "tomorrow", "week", "night"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "You use this to call people:",
          options: ["tree", "phone", "flower", "rain"],
          correctIndex: 1,
        },
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        content: {
          prompt: "Color of the sky:",
          options: ["red", "green", "blue", "black"],
          correctIndex: 2,
        },
      },
    ],
  },
];
