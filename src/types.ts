export interface Question {
  id: string;
  questionNumber: number;
  questionText: string; // The mathematical question (e.g. "x^2 - 5x + 6 = 0")
  instruction?: string; // Optional specific instruction
  isExample: boolean; // Is it an example question?
  scaffoldingTemplate?: string; // If it's an example or scaffolding question, e.g. "x = [   ] atau x = [   ]"
  placeholder?: string; // Input placeholder
  answer: string; // Correct answer or expected format
  explanation?: string; // Step-by-step pengerjaan/clue for scaffolding
}

export interface Worksheet {
  id: string;
  level: string;
  topic: string;
  sctMinutes: string; // Standard Completion Time
  instruction: string;
  questions: Question[];
  createdAt: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
}

export interface WorksheetHistory {
  id: string;
  worksheet: Worksheet;
  timeSpentSeconds: number;
  answers: { [questionId: string]: string };
  score: number; // e.g. out of 100
  completedAt: string;
}

export interface CurriculumTopic {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface CurriculumLevel {
  id: string;
  name: string;
  category: "Arithmetic" | "Algebra" | "Advanced";
  description: string;
  topics: CurriculumTopic[];
}
