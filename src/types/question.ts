export interface Question {
  id: number;
  examId: number;
  text: string;
  type: 'MultipleChoice' | 'TrueFalse' | 'Essay' | 'ShortAnswer';
  options?: string[];
  correctAnswer?: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionCreate {
  examId: number;
  text: string;
  type: 'MultipleChoice' | 'TrueFalse' | 'Essay' | 'ShortAnswer';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface QuestionUpdate {
  examId: number;
  text?: string;
  type?: 'MultipleChoice' | 'TrueFalse' | 'Essay' | 'ShortAnswer';
  options?: string[];
  correctAnswer?: string;
  points?: number;
}