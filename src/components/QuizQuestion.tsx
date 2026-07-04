"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FillBlankContent, MultipleChoiceContent } from "@/lib/quiz-types";

export type { FillBlankContent, MultipleChoiceContent } from "@/lib/quiz-types";

export interface QuizQuestionData {
  id: string;
  type: "MULTIPLE_CHOICE" | "FILL_BLANK";
  content: MultipleChoiceContent | FillBlankContent;
}

interface QuizQuestionProps {
  question: QuizQuestionData;
  index: number;
  value: string;
  onChange: (questionId: string, value: string) => void;
}

export function QuizQuestion({ question, index, value, onChange }: QuizQuestionProps) {
  if (question.type === "MULTIPLE_CHOICE") {
    const content = question.content as MultipleChoiceContent;
    return (
      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-medium">
          Question {index + 1}: {content.prompt}
        </legend>
        <div className="space-y-2">
          {content.options.map((option, optionIndex) => (
            <label
              key={optionIndex}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-accent",
                value === String(optionIndex) && "border-primary bg-primary/5"
              )}
            >
              <input
                type="radio"
                name={question.id}
                value={String(optionIndex)}
                checked={value === String(optionIndex)}
                onChange={() => onChange(question.id, String(optionIndex))}
                className="h-4 w-4"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  const content = question.content as FillBlankContent;
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <Label className="text-sm font-medium">
        Question {index + 1}: {content.prompt}
      </Label>
      <p className="text-muted-foreground">{content.sentence}</p>
      <Input
        value={value}
        onChange={(e) => onChange(question.id, e.target.value)}
        placeholder="Type your answer"
        autoComplete="off"
      />
    </div>
  );
}
