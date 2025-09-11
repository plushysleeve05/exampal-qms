import { useState, useEffect } from "react";
import { useParams } from "react-router";

type QuestionType = "mcq" | "essay" | "structured";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string;
  onSave?: (formData: any) => void; // Optional callback to pass data back
}

export default function QuestionModal({ isOpen, onClose, section, onSave }: QuestionModalProps) {
  const { examType, subject } = useParams<{ examType: string; subject: string }>();
  // We'll use the subject directly instead of formatting it
  
  const [questionType, setQuestionType] = useState<QuestionType>("mcq");
  const [year, setYear] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  
  // These would come from API in a real application
  const years = ["2025", "2024", "2023", "2022", "2021"];
  const topics = ["Grammar", "Comprehension", "Essay", "Literature"];
  const difficulties = ["Easy", "Medium", "Hard"];
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleAddOption = () => {
    setOptions([...options, ""]);
  };
  
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit the question to an API
    const formData = {
      examType,
      subject,
      section,
      questionType,
      // Handle "all" values appropriately
      year: year === "all" ? "All Years" : year,
      topic: topic === "all" ? "All Topics" : topic,
      difficulty: difficulty === "all" ? "All Difficulties" : difficulty,
      questionText,
      options: questionType === "mcq" ? options : [],
      correctAnswer,
      explanation
    };
    
    console.log("Form submitted:", formData);
    
    // If onSave callback exists, pass the form data to parent component
    if (onSave) {
      onSave(formData);
    }
    
    // Reset form and close modal
    resetForm();
    onClose();
  };
  
  // Apply custom styles to select elements for better UX
  useEffect(() => {
    const enhanceSelectElements = () => {
      const selectElements = document.querySelectorAll('select');
      selectElements.forEach(select => {
        // Add focus styles for better visibility
        select.addEventListener('focus', () => {
          select.classList.add('ring-2', 'ring-blue-300', 'dark:ring-blue-700');
        });
        
        select.addEventListener('blur', () => {
          select.classList.remove('ring-2', 'ring-blue-300', 'dark:ring-blue-700');
        });
      });
    };
    
    if (isOpen) {
      enhanceSelectElements();
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [isOpen]);
  
  const resetForm = () => {
    setQuestionType("mcq");
    setYear("");
    setTopic("");
    setDifficulty("");
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setExplanation("");
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ paddingTop: '5vh', paddingBottom: '5vh' }}>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full my-auto max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Add New {section} Question
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Question Type*
                </label>
                <div className="relative">
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                    required
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="essay">Essay</option>
                    <option value="structured">Structured</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exam Year*
                </label>
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                    required
                  >
                    <option value="">Select exam year</option>
                    <option value="all">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Topic*
                </label>
                <div className="relative">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                    required
                  >
                    <option value="">Select topic</option>
                    <option value="all">All Topics</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty Level*
                </label>
                <div className="relative">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                    required
                  >
                    <option value="">Select difficulty level</option>
                    <option value="all">All Difficulties</option>
                    {difficulties.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question Text*
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
                placeholder="Enter the question text..."
                required
              />
            </div>
            
            {questionType === "mcq" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Answer Options*
                </label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="flex-grow flex items-center">
                      <div className="mr-2 text-gray-700 dark:text-gray-300 w-6 text-center">
                        {String.fromCharCode(65 + index)}.
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        className="flex-grow rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Option
                </button>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correct Answer*
              </label>
              {questionType === "mcq" ? (
                <div className="relative">
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                    required
                  >
                    <option value="">Select correct answer</option>
                    {options.map((option, index) => (
                      <option key={index} value={String.fromCharCode(65 + index)}>
                        {String.fromCharCode(65 + index)} - {option.length > 20 ? option.substring(0, 20) + '...' : option || `Option ${String.fromCharCode(65 + index)}`}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ) : (
                <textarea
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
                  placeholder="Enter the correct answer..."
                  required
                />
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Explanation
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
                placeholder="Enter an explanation for the answer..."
              />
            </div>
            
            <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-800 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 pb-4 px-4">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
