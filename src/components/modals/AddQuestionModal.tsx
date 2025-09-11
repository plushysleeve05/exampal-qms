// AddQuestionModal.tsx
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import ImagePicker from "../common/ImagePicker";
import Lightbox from "../common/Lightbox";
import CustomSelect from "../form/CustomSelect";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string;
  onSave: (question: QuestionData) => void;
  years?: string[];
  topics?: string[];
  difficulties?: string[];
}

type AnswerKey = "A" | "B" | "C" | "D" | "E";

interface OptionItem {
  label: AnswerKey;
  imageFile?: File | null;
  previewUrl?: string | null;
}

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

export interface QuestionData {
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

  // tags + solutions (unchanged)
  tags: string[];
  solutions: SolutionsBlock;
}

export default function AddQuestionModal({
  isOpen,
  onClose,
  section,
  onSave,
  years = ["2025", "2024", "2023", "2022", "2021"],
  topics = ["Grammar", "Comprehension", "Essay", "Literature"],
  difficulties = ["Easy", "Medium", "Hard"],
}: AddQuestionModalProps) {
  const { examType, subject } = useParams<{ examType: string; subject: string }>();
  const [tagInput, setTagInput] = useState("");
  const [lightbox, setLightbox] = useState<{open: boolean; src: string; alt?: string; isPdf?: boolean}>({
    open: false, 
    src: "",
    alt: ""
  });
  
  // Define a new question with default values
  const createDefaultQuestion = (): QuestionData => ({
    id: Math.floor(Math.random() * 10000), // Temporary ID for new question
    year: years[0], // Default to first year in list
    section: section,
    questionType: section === "Section A" ? "Multiple Choice" : "Essay",
    topic: "",
    difficulty: "Easy",
    questionNumber: 1,
    isMock: false,
    preambleEnabled: false,
    preambleImage: null,
    preamblePreview: null,
    questionImages: [null, null],
    questionPreviews: [null, null],
    options: [
      { label: "A" as const, imageFile: null, previewUrl: null },
      { label: "B" as const, imageFile: null, previewUrl: null },
      { label: "C" as const, imageFile: null, previewUrl: null },
      { label: "D" as const, imageFile: null, previewUrl: null },
      { label: "E" as const, imageFile: null, previewUrl: null },
    ],
    correctAnswer: "A",
    tags: [],
    solutions: {
      imageFile: null,
      imagePreview: null,
      markingSchemeFile: null,
      markingSchemePreview: null,
      teachersNoteFile: null,
      teachersNotePreview: null,
      solutionHint: "",
      videoUrl: "",
    },
  });

  const [newQuestion, setNewQuestion] = useState<QuestionData>(createDefaultQuestion());

  // Reset form when opening modal
  useEffect(() => {
    if (isOpen) {
      setNewQuestion(createDefaultQuestion());
      setTagInput("");
    }
  }, [isOpen, section]);

  // Clean up ObjectURLs when unmounting or when modal closes
  useEffect(() => {
    return () => {
      if (!newQuestion) return;
      newQuestion.questionPreviews?.forEach((u) => u && URL.revokeObjectURL(u));
      newQuestion.options?.forEach((o) => o.previewUrl && URL.revokeObjectURL(o.previewUrl));
      if (newQuestion.preamblePreview) URL.revokeObjectURL(newQuestion.preamblePreview);
      if (newQuestion.solutions.imagePreview) URL.revokeObjectURL(newQuestion.solutions.imagePreview);
      if (newQuestion.solutions.markingSchemePreview) URL.revokeObjectURL(newQuestion.solutions.markingSchemePreview);
      if (newQuestion.solutions.teachersNotePreview) URL.revokeObjectURL(newQuestion.solutions.teachersNotePreview);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const setField = <K extends keyof QuestionData>(k: K, v: QuestionData[K]) =>
    setNewQuestion((q) => ({ ...q, [k]: v }));

  const handleMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name === "questionNumber") return setField("questionNumber", Number(value));
    // @ts-ignore
    setField(name as keyof QuestionData, type === "checkbox" ? checked : value);
  };

  // Handle preamble toggle
  const togglePreamble = () => {
    setField("preambleEnabled", !newQuestion.preambleEnabled);
  };

  // Handle uploading preamble image
  const handlePreambleImage = (file: File | null) => {
    if (!file) {
      setField("preambleImage", null);
      setField("preamblePreview", null);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setField("preambleImage", file);
    setField("preamblePreview", previewUrl);
  };

  // Handle uploading question images
  const handleQuestionImage = (index: number, file: File | null) => {
    const images = [...newQuestion.questionImages];
    const previews = [...newQuestion.questionPreviews];

    // Clean up previous preview URL if exists
    if (previews[index]) URL.revokeObjectURL(previews[index]!);

    images[index] = file;
    previews[index] = file ? URL.createObjectURL(file) : null;

    setField("questionImages", images);
    setField("questionPreviews", previews);
  };

  // Handle uploading option images
  const handleOptionImage = (index: number, file: File | null) => {
    const options = [...newQuestion.options];
    
    // Clean up previous preview URL if exists
    if (options[index].previewUrl) URL.revokeObjectURL(options[index].previewUrl!);
    
    options[index] = {
      ...options[index],
      imageFile: file,
      previewUrl: file ? URL.createObjectURL(file) : null
    };
    
    setField("options", options);
  };

  // Handle tag input
  const handleAddTag = () => {
    if (!tagInput.trim() || newQuestion.tags.includes(tagInput.trim())) {
      setTagInput("");
      return;
    }

    setField("tags", [...newQuestion.tags, tagInput.trim()]);
    setTagInput("");
  };

  // Handle removing tag
  const handleRemoveTag = (tag: string) => {
    setField("tags", newQuestion.tags.filter(t => t !== tag));
  };

  // Handle solution files
  const handleSolutionImage = (file: File | null) => {
    const solutions = { ...newQuestion.solutions };
    
    // Clean up previous preview URL if exists
    if (solutions.imagePreview) URL.revokeObjectURL(solutions.imagePreview);
    
    solutions.imageFile = file;
    solutions.imagePreview = file ? URL.createObjectURL(file) : null;
    
    setField("solutions", solutions);
  };

  const handleMarkingScheme = (file: File | null) => {
    const solutions = { ...newQuestion.solutions };
    
    // Clean up previous preview URL if exists
    if (solutions.markingSchemePreview) URL.revokeObjectURL(solutions.markingSchemePreview);
    
    solutions.markingSchemeFile = file;
    solutions.markingSchemePreview = file ? URL.createObjectURL(file) : null;
    
    setField("solutions", solutions);
  };

  const handleTeachersNote = (file: File | null) => {
    const solutions = { ...newQuestion.solutions };
    
    // Clean up previous preview URL if exists
    if (solutions.teachersNotePreview) URL.revokeObjectURL(solutions.teachersNotePreview);
    
    solutions.teachersNoteFile = file;
    solutions.teachersNotePreview = file ? URL.createObjectURL(file) : null;
    
    setField("solutions", solutions);
  };

  const handleSolutionHint = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const solutions = { ...newQuestion.solutions };
    solutions.solutionHint = e.target.value;
    setField("solutions", solutions);
  };

  const handleVideoUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const solutions = { ...newQuestion.solutions };
    solutions.videoUrl = e.target.value;
    setField("solutions", solutions);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add examType and subject from the route params
    const formData = {
      ...newQuestion,
      examType,
      subject
    };
    
    // Submit the question
    onSave(formData);
    
    // Close modal
    onClose();
  };

  // Handle opening image previews in lightbox
  const openLightbox = (src: string, alt?: string, isPdf?: boolean) => {
    setLightbox({
      open: true,
      src,
      alt,
      isPdf
    });
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ paddingTop: '2vh', paddingBottom: '2vh' }}>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full my-auto max-h-[96vh] overflow-y-auto">
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
          
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-8">
              {/* Metadata section */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                  Question Metadata
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question Type*
                    </label>
                    <select
                      name="questionType"
                      value={newQuestion.questionType}
                      onChange={handleMetaChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="Multiple Choice">Multiple Choice</option>
                      <option value="Essay">Essay</option>
                      <option value="Structured">Structured</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exam Year*
                    </label>
                    <select
                      name="year"
                      value={newQuestion.year}
                      onChange={handleMetaChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select exam year</option>
                      <option value="all">All Years</option>
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
                      name="topic"
                      value={newQuestion.topic}
                      onChange={handleMetaChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select topic</option>
                      <option value="all">All Topics</option>
                      {topics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Difficulty*
                    </label>
                    <select
                      name="difficulty"
                      value={newQuestion.difficulty}
                      onChange={handleMetaChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select difficulty</option>
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question Number*
                    </label>
                    <input
                      type="number"
                      name="questionNumber"
                      value={newQuestion.questionNumber}
                      onChange={handleMetaChange}
                      min="1"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isMock"
                      name="isMock"
                      checked={newQuestion.isMock}
                      onChange={handleMetaChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isMock" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Mock Exam Question
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Question content section */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                  Question Content
                </h3>
                
                {/* Preamble toggle and image */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preambleEnabled"
                      checked={newQuestion.preambleEnabled}
                      onChange={togglePreamble}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="preambleEnabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      This question has a preamble (introductory text/image)
                    </label>
                  </div>
                  
                  {newQuestion.preambleEnabled && (
                    <div className="pl-6 border-l-2 border-blue-200 dark:border-blue-800 space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Preamble Image
                      </label>
                      <ImagePicker
                        previewUrl={newQuestion.preamblePreview}
                        onChange={handlePreambleImage}
                        onThumbClick={newQuestion.preamblePreview ? 
                            () => openLightbox(newQuestion.preamblePreview!, "Preamble") : undefined}
                      />
                    </div>
                  )}
                </div>
                
                {/* Question images */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Question Images (up to 2)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImagePicker
                      previewUrl={newQuestion.questionPreviews[0]}
                      onChange={(file: File | null) => handleQuestionImage(0, file)}
                      onThumbClick={newQuestion.questionPreviews[0] ? 
                        (): void => openLightbox(newQuestion.questionPreviews[0]!, "Question Image 1") : undefined}
                    />
                    <ImagePicker
                      previewUrl={newQuestion.questionPreviews[1]}
                      onChange={(file: File | null) => handleQuestionImage(1, file)}
                      onThumbClick={newQuestion.questionPreviews[1] ? 
                        (): void => openLightbox(newQuestion.questionPreviews[1]!, "Question Image 2") : undefined}
                    />
                  </div>
                </div>
                
                {/* Answer options (for Multiple Choice) */}
                {newQuestion.questionType === "Multiple Choice" && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Answer Options (Images Only)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {newQuestion.options.map((option, index) => (
                        <div key={option.label} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                              <span className="font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                            </div>
                            <input
                              type="radio"
                              id={`option-${option.label}`}
                              name="correctAnswer"
                              value={option.label}
                              checked={newQuestion.correctAnswer === option.label}
                              onChange={() => setField("correctAnswer", option.label)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor={`option-${option.label}`} className="text-sm text-gray-700 dark:text-gray-300">
                              Correct Answer
                            </label>
                          </div>
                          <ImagePicker
                            previewUrl={option.previewUrl}
                            onChange={(file) => handleOptionImage(index, file)}
                            onThumbClick={option.previewUrl ? 
                              () => openLightbox(option.previewUrl!, `Option ${option.label}`) : undefined}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Tags section */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                  Tags
                </h3>
                
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-grow rounded-l-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md"
                  >
                    Add
                  </button>
                </div>
                
                {newQuestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newQuestion.tags.map(tag => (
                      <div key={tag} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Solutions section */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                  Solutions & Materials
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Solution Image
                    </label>
                    <ImagePicker
                      previewUrl={newQuestion.solutions.imagePreview}
                      onChange={handleSolutionImage}
                      onThumbClick={newQuestion.solutions.imagePreview ? 
                        () => openLightbox(newQuestion.solutions.imagePreview!, "Solution Image") : undefined}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Marking Scheme (PDF)
                    </label>
                    <ImagePicker
                      previewUrl={newQuestion.solutions.markingSchemePreview}
                      onChange={handleMarkingScheme}
                      accept="application/pdf"
                      onThumbClick={newQuestion.solutions.markingSchemePreview ? 
                        () => openLightbox(newQuestion.solutions.markingSchemePreview!, "Marking Scheme", true) : undefined}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teacher's Notes (PDF)
                    </label>
                    <ImagePicker
                      previewUrl={newQuestion.solutions.teachersNotePreview}
                      onChange={handleTeachersNote}
                      accept="application/pdf"
                      onThumbClick={newQuestion.solutions.teachersNotePreview ? 
                        () => openLightbox(newQuestion.solutions.teachersNotePreview!, "Teacher's Notes", true) : undefined}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Video Solution URL
                    </label>
                    <input
                      type="url"
                      value={newQuestion.solutions.videoUrl}
                      onChange={handleVideoUrl}
                      placeholder="https://..."
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Solution Hint/Notes
                  </label>
                  <textarea
                    value={newQuestion.solutions.solutionHint}
                    onChange={handleSolutionHint}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Add any additional notes or hints for solving this question..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Image Lightbox */}
      <Lightbox
        isOpen={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        isPdf={lightbox.isPdf}
        onClose={() => setLightbox({...lightbox, open: false})}
      />
    </>
  );
}
