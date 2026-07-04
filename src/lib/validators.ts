import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const wordProgressSchema = z.object({
  status: z.enum(["NEW", "LEARNING", "KNOWN"]),
});

export const wordQuerySchema = z.object({
  search: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ALL"]).optional(),
});

export const quizSubmitSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export const createWordSchema = z.object({
  term: z.string().min(1, "Term is required").max(100),
  definition: z.string().min(1, "Definition is required").max(500),
  example: z.string().min(1, "Example sentence is required").max(500),
  ipa: z.string().max(100).optional(),
  imageUrl: z.union([z.string().url("Must be a valid image URL"), z.literal("")]).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE"]).default("BEGINNER"),
});

export const createWordsBodySchema = z.union([
  createWordSchema,
  z.object({
    words: z.array(createWordSchema).min(1, "At least one word is required").max(50),
  }),
]);

const multipleChoiceContentSchema = z
  .object({
    prompt: z.string().min(1, "Question prompt is required"),
    options: z.array(z.string().min(1)).min(2, "At least 2 options required").max(6),
    correctIndex: z.number().int().min(0),
  })
  .refine((data) => data.correctIndex < data.options.length, {
    message: "correctIndex must be a valid option index",
  });

const fillBlankContentSchema = z.object({
  prompt: z.string().min(1, "Question prompt is required"),
  sentence: z.string().min(1, "Sentence is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const createQuizQuestionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("MULTIPLE_CHOICE"),
    content: multipleChoiceContentSchema,
  }),
  z.object({
    type: z.literal("FILL_BLANK"),
    content: fillBlankContentSchema,
  }),
]);

export const createQuizSchema = z.object({
  title: z.string().min(1, "Quiz title is required").max(200),
  level: z.enum(["BEGINNER", "INTERMEDIATE"]).default("BEGINNER"),
  questions: z
    .array(createQuizQuestionSchema)
    .min(1, "At least one question is required")
    .max(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateWordInput = z.infer<typeof createWordSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
