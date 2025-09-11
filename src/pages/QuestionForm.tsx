import { useState } from "react";
import { useParams, Link } from "react-router";
import PageMeta from "../components/common/PageMeta";
import ExamNavigation from "../components/common/ExamNavigation";

type QuestionType = "mcq" | "essay" | "structured";

export default function QuestionForm() {
  const { examType, subject, section } = useParams<{ examType: string; subject: string, section: string }>();
  const formattedSubject = subject?.replace(/-/g, ' ');
  
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
      year,
      topic,
      difficulty,
      questionText,
      options: questionType === "mcq" ? options : [],
      correctAnswer,
      explanation
    };
    
    console.log("Form submitted:", formData);
    
    // Reset form or navigate back to questions list
  };
  
  return (
    <>
      <PageMeta
        title={`Add ${section} Question | ${formattedSubject} | ${examType} | ExamPal QMS`}
        description={`Add a new ${section} question for ${formattedSubject} in ${examType}`}
      />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation sidebar */}
          <div className="md:col-span-1">
            <ExamNavigation />
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Link 
                  to={`/${examType}/${subject}/questions`}
                  className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-5 h-5 mr-2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Back to Questions
                </Link>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New {section} Question
              </h1>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question Type*
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="mcq">Multiple Choice Question</option>
                <option value="essay">Essay Question</option>
                <option value="structured">Structured Question</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exam Year*
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select exam year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic*
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select topic</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty Level*
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select difficulty level</option>
                {difficulties.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
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
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select correct answer</option>
                {options.map((_, index) => (
                  <option key={index} value={String.fromCharCode(65 + index)}>
                    Option {String.fromCharCode(65 + index)}
                  </option>
                ))}
              </select>
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
          
          <div className="flex justify-end gap-4">
            <Link
              to={`/${examType}/${subject}/questions`}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Save Question
            </button>
          </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
