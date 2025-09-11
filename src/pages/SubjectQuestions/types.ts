// types.ts
export type AnswerKey = "A" | "B" | "C" | "D" | "E";

export interface OptionItem {
  label: AnswerKey;
  imageFile?: File | null;
  previewUrl?: string | null;
}

export interface SolutionsBlock {
  imageFile?: File | null;
  imagePreview?: string | null;
  markingSchemeFile?: File | null;
  markingSchemePreview?: string | null;
  teachersNoteFile?: File | null;
  teachersNotePreview?: string | null;
  solutionHint: string;
  videoUrl: string;
}

// Define TypeScript interface for question data
export interface QuestionData {
  id: number;

  // core meta
  year: string;
  section: string;
  questionType: string;
  topic: string;
  difficulty: string;
  difficultyLevel: number;
  questionNumber: number;

  // flags
  isMock: boolean;

  // IMAGE FIELDS
  preambleEnabled: boolean;
  preambleImage?: File | null;
  preamblePreview?: string | null;

  // allow up to 2 images for the question body
  questionImages: (File | null)[];
  questionPreviews: (string | null)[];

  // options (A–E) images only
  options: OptionItem[];
  correctAnswer: AnswerKey;

  // tags + solutions
  tags: string[];
  solutions: SolutionsBlock;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  isDangerous?: boolean;
}

export interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}
