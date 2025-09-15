// utils/questionUtils.ts
import { QuestionData, SolutionsBlock } from '../types';

// Create empty solution block
export const createEmptySolutionsBlock = (): SolutionsBlock => ({
  imageFile: null,
  imagePreview: null,
  markingSchemeFile: null,
  markingSchemePreview: null,
  teachersNoteFile: null,
  teachersNotePreview: null,
  solutionHint: "",
  videoUrl: ""
});

// Create empty question with required fields
export const createBaseQuestion = (
  id: number,
  year: string,
  section: string,
  questionType: string,
  topic: string,
  difficulty: string,
  questionNumber: number
): QuestionData => ({
  id,
  year,
  section,
  questionType,
  topic,
  difficulty,
  difficultyLevel: difficulty === "Easy" ? 1 : 2,
  questionNumber,
  isMock: false,
  preambleEnabled: false,
  preambleImage: null,
  preamblePreview: null,
  questionImages: [null, null],
  questionPreviews: [null, null],
  options: [
    { label: "A", imageFile: null, previewUrl: null },
    { label: "B", imageFile: null, previewUrl: null },
    { label: "C", imageFile: null, previewUrl: null },
    { label: "D", imageFile: null, previewUrl: null },
    { label: "E", imageFile: null, previewUrl: null }
  ],
  correctAnswer: "A",
  tags: [],
  solutions: createEmptySolutionsBlock()
});

// Convert API question format to QuestionData format
export const convertApiQuestionToQuestionData = (apiQuestion: any, index: number): QuestionData => {
  // Map difficulty level number to string (1=Easy, 2=Hard/Difficult)
  const difficultyMap: Record<number, string> = {
    1: "Easy",
    2: "Hard"
  };
  
  const difficulty = difficultyMap[apiQuestion.difficultyLevel] || "Easy";
  
  // Get section from examSection (e.g., "Section-A" -> "Section A")
  const section = apiQuestion.examSection?.replace('-', ' ') || "";
  
  // Use the uppercase ID field from API response
  const questionId = apiQuestion.ID !== undefined ? apiQuestion.ID : (apiQuestion.id || index);
  
  // Add console log to help debug ID issues
  console.log('Converting API question to QuestionData:', {
    apiID: apiQuestion.ID,
    apiId: apiQuestion.id, 
    usingId: questionId
  });
  
  return {
    id: questionId,
    year: apiQuestion.examYear || "",
    section: section,
    questionType: apiQuestion.questionType || "",
    topic: apiQuestion.topic || "",
    difficulty: difficulty,
    difficultyLevel: apiQuestion.difficultyLevel || 1,
    questionNumber: apiQuestion.questionNumber || index,
    isMock: false,
    preambleEnabled: !!apiQuestion.preambleUrl,
    preambleImage: null,
    preamblePreview: apiQuestion.preambleUrl || null,
    questionImages: [null, null],
    questionPreviews: [apiQuestion.questionUrl || null, null],
    options: [
      { label: "A", imageFile: null, previewUrl: apiQuestion.answers?.optionA || null },
      { label: "B", imageFile: null, previewUrl: apiQuestion.answers?.optionB || null },
      { label: "C", imageFile: null, previewUrl: apiQuestion.answers?.optionC || null },
      { label: "D", imageFile: null, previewUrl: apiQuestion.answers?.optionD || null },
      { label: "E", imageFile: null, previewUrl: apiQuestion.answers?.optionE || null }
    ],
    correctAnswer: (apiQuestion.answers?.correctAnswer || "A").toUpperCase() as "A" | "B" | "C" | "D" | "E",
    tags: apiQuestion.relatedTopics?.topics || [],
    solutions: {
      imageFile: null,
      imagePreview: apiQuestion.solution?.imageUrl || null,
      markingSchemeFile: null,
      markingSchemePreview: apiQuestion.solution?.markingSchemeUrl || null,
      teachersNoteFile: null,
      teachersNotePreview: apiQuestion.solution?.teachersNoteUrl || null,
      solutionHint: apiQuestion.solution?.solutionHintUrl || "",
      videoUrl: apiQuestion.solution?.videoUrl || ""
    }
  };
};
