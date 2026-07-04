export interface MultipleChoiceContent {
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface FillBlankContent {
  prompt: string;
  sentence: string;
  answer: string;
}

export type QuizQuestionContent = MultipleChoiceContent | FillBlankContent;
