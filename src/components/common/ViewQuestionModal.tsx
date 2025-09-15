import { useState } from "react";

interface ViewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  question: QuestionData | null;
  examType?: string;
}

// Define TypeScript interface for question data - matching the structure in SubjectQuestions.tsx
interface OptionItem {
  label: AnswerKey;
  imageFile?: File | null;
  previewUrl?: string | null;
}

type AnswerKey = "A" | "B" | "C" | "D" | "E";

interface SolutionsBlock {
  imageFile?: File | null;
  imagePreview?: string | null;
  markingSchemeFile?: File | null;
  markingSchemePreview?: string | null;
  teachersNoteFile?: File | null;
  teachersNotePreview?: string | null;
  solutionHint: string;
  videoUrl: string;
}

interface QuestionData {
  id: number;
  
  // core meta
  year: string;
  section: string;
  questionType: string;
  topic: string;
  difficulty: string;
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

export default function ViewQuestionModal({ isOpen, onClose, onEdit, question, examType = "BECE" }: ViewQuestionModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'solutions'>('details');

  if (!isOpen || !question) return null;
  
  // Determine if this is an essay-type question (either "Essay" type or "Section B")
  const isEssayQuestion = question.questionType === "Essay" || question.section === "Section B";

  // Function to get the appropriate color classes for a difficulty badge
  const getDifficultyColorClasses = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30";
      case 'medium':
        return "bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30";
      case 'hard':
        return "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    }
  };

  // Function to render options with highlighting for the correct answer
  const renderOptions = () => {
    return question.options.map((option) => {
      const isCorrectAnswer = option.label === question.correctAnswer;

      return (
        <div 
          key={option.label}
          className={`p-3 rounded-lg mb-2 border ${
            isCorrectAnswer 
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
              : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full mr-3 text-sm font-medium ${
              isCorrectAnswer
                ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {option.label}
            </div>
            <div className={`font-medium ${isCorrectAnswer ? 'text-green-800 dark:text-green-300' : ''}`}>
              {option.previewUrl ? (
                <img src={option.previewUrl} alt={`Option ${option.label}`} className="max-h-32" />
              ) : (
                `[Option ${option.label} text would appear here]`
              )}
            </div>
            {isCorrectAnswer && (
              <div className="ml-auto flex items-center text-green-700 dark:text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Correct Answer</span>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ paddingTop: '5vh', paddingBottom: '5vh' }}>
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full my-auto max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Question {question.questionNumber}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors"
            >
              Close
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Question
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Tabs */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <button
                className={`pb-4 font-medium text-sm ${activeTab === 'details' 
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                onClick={() => setActiveTab('details')}
              >
                Question Details
              </button>
              <button
                className={`pb-4 font-medium text-sm ${activeTab === 'solutions' 
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                onClick={() => setActiveTab('solutions')}
              >
                Solutions
              </button>
            </div>
          </div>

          {activeTab === 'details' && (
            <div className="px-6 py-6">
              {/* Question content */}
              <div className="mb-8">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Question</div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                  {question.preambleEnabled && question.preamblePreview && (
                    <div className="mb-4">
                      <img src={question.preamblePreview} alt="Preamble" className="max-w-full" />
                    </div>
                  )}
                  
                  <div className="prose dark:prose-invert max-w-none">
                    {/* Display question images if available */}
                    {question.questionPreviews?.filter(Boolean).map((preview, i) => (
                      <img key={i} src={preview || ''} alt={`Question ${i+1}`} className="my-4 max-w-full" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Options - only show for MCQ questions */}
              {!isEssayQuestion && (
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Options</div>
                  <div className="space-y-1">
                    {renderOptions()}
                  </div>
                </div>
              )}
              
              {/* Essay question specific content */}
              {isEssayQuestion && (
                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Essay Question</div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300">
                      This is an essay question that requires a written response. Students are expected to provide 
                      a comprehensive answer with proper structure and reasoning.
                    </p>
                  </div>
                </div>
              )}

              {/* Question metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Exam Details</div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-gray-600 dark:text-gray-400">Exam Type:</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30">
                          {examType}
                        </span>
                      </div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Subject:</div>
                      <div className="font-medium text-gray-900 dark:text-white">English Language</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Exam Year:</div>
                      <div className="font-medium text-gray-900 dark:text-white">{question.year}</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Section:</div>
                      <div className="font-medium text-gray-900 dark:text-white">{question.section}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Question Properties</div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-gray-600 dark:text-gray-400">Question Type:</div>
                      <div className="font-medium text-gray-900 dark:text-white">{question.questionType}</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Topic:</div>
                      <div className="font-medium text-gray-900 dark:text-white">{question.topic}</div>
                      
                      <div className="text-gray-600 dark:text-gray-400">Difficulty:</div>
                      <div className="font-medium">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColorClasses(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>

                      {/* Only show correct answer for MCQ questions */}
                      {!isEssayQuestion && (
                        <>
                          <div className="text-gray-600 dark:text-gray-400">Correct Answer:</div>
                          <div className="font-medium text-green-700 dark:text-green-400">
                            {question.correctAnswer}
                          </div>
                        </>
                      )}
                      
                      {/* Essay-specific properties */}
                      {isEssayQuestion && (
                        <>
                          <div className="text-gray-600 dark:text-gray-400">Format:</div>
                          <div className="font-medium text-gray-900 dark:text-white">Extended Response</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {question.tags && question.tags.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tags</div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30"
                          >
                            {tag}
                          </span>
                        ))}
                        {question.tags.length === 0 && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">No tags</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'solutions' && (
            <div className="px-6 py-6">
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {isEssayQuestion ? "Answer Guidelines" : "Solution Hint"}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  {question.solutions.solutionHint ? (
                    <p className="text-gray-800 dark:text-gray-200">{question.solutions.solutionHint}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      {isEssayQuestion ? "No answer guidelines available" : "No solution hint available"}
                    </p>
                  )}
                </div>
              </div>
              
              {question.solutions.imagePreview && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Solution Image</div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <img src={question.solutions.imagePreview} alt="Solution" className="max-w-full" />
                  </div>
                </div>
              )}
              
              {question.solutions.markingSchemePreview && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {isEssayQuestion ? "Marking Criteria" : "Marking Scheme"}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <img src={question.solutions.markingSchemePreview} alt="Marking Scheme" className="max-w-full" />
                  </div>
                </div>
              )}
              
              
              
              {question.solutions.videoUrl && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Solution Video</div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    {/* Video embed would go here in a real implementation */}
                    <div className="bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center h-60">
                      <div className="text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Video URL: {question.solutions.videoUrl}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
