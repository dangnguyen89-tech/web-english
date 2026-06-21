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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
