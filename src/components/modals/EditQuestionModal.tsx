// EditQuestionModal.tsx
import { useState, useEffect } from "react";
import ImagePicker from "../common/ImagePicker";
import Lightbox from "../common/Lightbox";
import CustomSelect from "../form/CustomSelect";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: QuestionData) => void;
  onViewClick?: () => void; // New prop for viewing the question
  question: QuestionData | null;
  years: string[];
  topics: string[];
  difficulties: string[];
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

  // tags + solutions (unchanged)
  tags: string[];
  solutions: SolutionsBlock;
}

/* --------------------------------- Modal --------------------------------- */

/* --------------------------------- Modal --------------------------------- */
export default function EditQuestionModal({
  isOpen,
  onClose,
  onSave,
  onViewClick,
  question,
  years,
  topics,
  difficulties,
}: EditQuestionModalProps) {
  const [editedQuestion, setEditedQuestion] = useState<QuestionData | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lightbox, setLightbox] = useState<{open: boolean; src: string; alt?: string; isPdf?: boolean}>({
    open: false, 
    src: "",
    alt: ""
  });

  // revoke ObjectURLs on unmount or when replaced
  useEffect(() => {
    return () => {
      if (!editedQuestion) return;
      editedQuestion.questionPreviews?.forEach((u) => u && URL.revokeObjectURL(u));
      editedQuestion.options?.forEach((o) => o.previewUrl && URL.revokeObjectURL(o.previewUrl));
      if (editedQuestion.preamblePreview) URL.revokeObjectURL(editedQuestion.preamblePreview);
      if (editedQuestion.solutions.imagePreview) URL.revokeObjectURL(editedQuestion.solutions.imagePreview);
      if (editedQuestion.solutions.markingSchemePreview) URL.revokeObjectURL(editedQuestion.solutions.markingSchemePreview);
      if (editedQuestion.solutions.teachersNotePreview) URL.revokeObjectURL(editedQuestion.solutions.teachersNotePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

useEffect(() => {
  if (!question) return;

  // 1) Define hard defaults ONCE
  const defaults: QuestionData = {
    id: question.id,
    year: "",
    section: "Section A",
    questionType: "Multiple Choice",
    topic: "",
    difficulty: "Easy",
    difficultyLevel: 1,
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
      imageFile: undefined,
      imagePreview: null,
      markingSchemeFile: undefined,
      markingSchemePreview: null,
      teachersNoteFile: undefined,
      teachersNotePreview: null,
      solutionHint: "",
      videoUrl: "",
    },
  };

  // 2) Merge shallow fields via spread
  //    DO NOT include nested/array fields here (we’ll handle those below)
  const {
    options: incomingOptions,
    questionImages: incomingQImgs,
    questionPreviews: incomingQPrev,
    solutions: incomingSolutions,
    ...shallow
  } = question as Partial<QuestionData>;

  // 3) Compose the final value with explicit fallbacks for nested fields
  const merged: QuestionData = {
    ...defaults,
    ...shallow, // year/section/topic/etc.

    questionImages: incomingQImgs ?? defaults.questionImages,
    questionPreviews: incomingQPrev ?? defaults.questionPreviews,

    options: incomingOptions && incomingOptions.length
      ? (incomingOptions as QuestionData["options"]).map((opt, i) => ({
          label: (opt?.label ?? defaults.options[i].label) as QuestionData["options"][number]["label"],
          imageFile: opt?.imageFile ?? defaults.options[i].imageFile,
          previewUrl: opt?.previewUrl ?? defaults.options[i].previewUrl,
        }))
      : defaults.options,

    solutions: {
      ...defaults.solutions,
      ...(incomingSolutions ?? {}),
      imagePreview:
        incomingSolutions?.imagePreview ?? defaults.solutions.imagePreview,
      markingSchemePreview:
        incomingSolutions?.markingSchemePreview ?? defaults.solutions.markingSchemePreview,
      teachersNotePreview:
        incomingSolutions?.teachersNotePreview ?? defaults.solutions.teachersNotePreview,
    },
  };

  setEditedQuestion(merged);
}, [question]);


  if (!isOpen || !editedQuestion) return null;

  const setField = <K extends keyof QuestionData>(k: K, v: QuestionData[K]) =>
    setEditedQuestion((q) => (q ? { ...q, [k]: v } : q));

  const handleMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name === "questionNumber") return setField("questionNumber", Number(value));
    // @ts-ignore
    setField(name as keyof QuestionData, type === "checkbox" ? checked : value);
  };

  // preamble img
  const handlePreambleImg = (file: File | null, preview?: string | null) => {
    // revoke old
    if (editedQuestion.preamblePreview) URL.revokeObjectURL(editedQuestion.preamblePreview);
    setField("preambleImage", file);
    setField("preamblePreview", preview ?? null);
  };

  // question images (two slots)
  const handleQImg = (idx: number, file: File | null, preview?: string | null) => {
    const files = [...editedQuestion.questionImages];
    const prevs = [...editedQuestion.questionPreviews];

    if (prevs[idx]) URL.revokeObjectURL(prevs[idx] as string);

    files[idx] = file;
    prevs[idx] = preview ?? null;

    setField("questionImages", files);
    setField("questionPreviews", prevs);
  };

  // option image updates
  const setOptionImage = (label: AnswerKey, file: File | null, preview?: string | null) => {
    const next = editedQuestion.options.map((o) => {
      if (o.label !== label) return o;
      if (o.previewUrl) URL.revokeObjectURL(o.previewUrl);
      return { ...o, imageFile: file || undefined, previewUrl: preview ?? null };
    });
    setField("options", next);
  };
  
  // solutions file handling
  const handleSolutionFile = (
    type: 'imageFile' | 'markingSchemeFile' | 'teachersNoteFile',
    previewType: 'imagePreview' | 'markingSchemePreview' | 'teachersNotePreview',
    file: File | null,
    preview?: string | null
  ) => {
    const oldPreview = editedQuestion.solutions[previewType];
    if (oldPreview) URL.revokeObjectURL(oldPreview as string);
    
    setField("solutions", {
      ...editedQuestion.solutions,
      [type]: file,
      [previewType]: preview ?? null
    });
  };
  
  // tags
  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!editedQuestion.tags.includes(t)) setField("tags", [...editedQuestion.tags, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setField("tags", editedQuestion.tags.filter((x) => x !== t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSave(editedQuestion);
    } catch (error) {
      console.error('Error saving question:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-md dark:bg-gray-900/80">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-[1300px] w-[98vw] max-h-[96vh] overflow-y-auto border-2 border-gray-300 dark:border-gray-600">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Question</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-10 h-10 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        
        {/* Lightbox for image previews */}
        <Lightbox 
          isOpen={lightbox.open}
          src={lightbox.src}
          alt={lightbox.alt}
          isPdf={lightbox.isPdf}
          onClose={() => setLightbox({...lightbox, open: false})}
        />

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-12">
          {/* Mock toggle */}
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-100 dark:border-amber-800/30">
            <input
              type="checkbox"
              name="isMock"
              id="isMock"
              checked={editedQuestion.isMock}
              onChange={handleMetaChange}
              className="h-5 w-5 accent-amber-500"
            />
            <label htmlFor="isMock" className="text-lg font-medium text-amber-800 dark:text-amber-300">
              This is a Mock Question
            </label>
          </div>

          {/* Meta grid */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Question Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              {/* Question Number */}
              <div>
                <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Question Number</label>
                <input
                  type="number"
                  name="questionNumber"
                  value={editedQuestion.questionNumber}
                  onChange={handleMetaChange}
                  className="w-full rounded-md border border-gray-300 p-3 text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
                  min={1}
                  required
                />
              </div>
              {/* Year */}
              <div>
                <CustomSelect
                  name="year"
                  label="Year"
                  value={editedQuestion.year}
                  onChange={(value) => setField("year", value)}
                  options={years.map(y => ({ value: y, label: y }))}
                  placeholder="Select year"
                  required
                />
              </div>
              {/* Topic */}
              <div>
                <CustomSelect
                  name="topic"
                  label="Topic"
                  value={editedQuestion.topic}
                  onChange={(value) => setField("topic", value)}
                  options={topics.map(t => ({ value: t, label: t }))}
                  placeholder="Select topic"
                  required
                />
              </div>
              {/* Question Type */}
              <div>
                <CustomSelect
                  name="questionType"
                  label="Question Type"
                  value={editedQuestion.questionType}
                  onChange={(value) => setField("questionType", value)}
                  options={[
                    { value: "Multiple Choice", label: "Multiple Choice" },
                    { value: "Essay", label: "Essay" }
                  ]}
                  placeholder="Select question type"
                  required
                />
              </div>
              {/* Section */}
              <div>
                <CustomSelect
                  name="section"
                  label="Exam Section"
                  value={editedQuestion.section}
                  onChange={(value) => setField("section", value)}
                  options={[
                    { value: "Section A", label: "Section A" },
                    { value: "Section B", label: "Section B" }
                  ]}
                  placeholder="Select section"
                  required
                />
              </div>
              {/* Difficulty */}
              <div>
                <CustomSelect
                  name="difficulty"
                  label="Difficulty Level"
                  value={editedQuestion.difficulty}
                  onChange={(value) => setField("difficulty", value)}
                  options={difficulties.map(d => ({ value: d, label: d }))}
                  placeholder="Select difficulty"
                  required
                />
              </div>
            </div>
          </div>

          {/* Preamble and Solution */}
          <div className="bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-lg border border-purple-100 dark:border-purple-800/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preamble Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="preambleEnabled"
                    name="preambleEnabled"
                    checked={editedQuestion.preambleEnabled}
                    onChange={handleMetaChange}
                    className="h-5 w-5 accent-purple-600"
                  />
                  <label 
                    htmlFor="preambleEnabled" 
                    className="text-xl font-semibold text-purple-900 dark:text-purple-300"
                  >
                    Include Preamble
                  </label>
                </div>
                {editedQuestion.preambleEnabled && (
                  <div className="mt-3 p-4 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                    <ImagePicker
                      label="Preamble Image"
                      file={editedQuestion.preambleImage || null}
                      previewUrl={editedQuestion.preamblePreview || null}
                      onChange={handlePreambleImg}
                      variant="tall"
                      onThumbClick={() => editedQuestion.preamblePreview && 
                        setLightbox({
                          open: true, 
                          src: editedQuestion.preamblePreview, 
                          alt: "Preamble Image"
                        })
                      }
                    />
                  </div>
                )}
              </div>
              
              {/* Solution Image Section */}
              <div>
                <h4 className="text-xl font-semibold mb-4 text-purple-900 dark:text-purple-300">Solution Image</h4>
                <div className="p-4 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                  <ImagePicker
                    label="Upload solution image/PDF"
                    file={editedQuestion.solutions.imageFile || null}
                    previewUrl={editedQuestion.solutions.imagePreview || null}
                    onChange={(f, u) => handleSolutionFile('imageFile', 'imagePreview', f, u)}
                    variant="tall"
                    accept="image/*,application/pdf"
                    onThumbClick={() => editedQuestion.solutions.imagePreview && 
                      setLightbox({
                        open: true, 
                        src: editedQuestion.solutions.imagePreview, 
                        alt: "Solution Image",
                        isPdf: editedQuestion.solutions.imageFile?.type === "application/pdf"
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question Images (two slots) */}
          <div className="bg-green-50/50 dark:bg-green-900/10 p-5 rounded-lg border border-green-100 dark:border-green-800/30">
            <h4 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-300">Question Images</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1].map((idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                  <ImagePicker
                    label={`Question Image ${idx + 1}`}
                    file={editedQuestion.questionImages[idx]}
                    previewUrl={editedQuestion.questionPreviews[idx] || null}
                    onChange={(f, u) => handleQImg(idx, f, u ?? null)}
                    variant="tall"
                    onThumbClick={() => editedQuestion.questionPreviews[idx] && 
                      setLightbox({
                        open: true, 
                        src: editedQuestion.questionPreviews[idx] as string, 
                        alt: `Question Image ${idx + 1}`
                      })
                    }
                  />
                  <p className="text-sm text-green-700 dark:text-green-400 mt-2 italic">
                    Tip: Click on the image after upload to view it in full size
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Options A–E (image only) */}
          <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <h4 className="text-xl font-semibold mb-4 text-indigo-900 dark:text-indigo-300">Possible Answers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {editedQuestion.options.map((opt) => (
                <div key={opt.label} className="p-4 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full border-2 
                      ${opt.label === editedQuestion.correctAnswer 
                        ? 'border-green-500 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' 
                        : 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700/30'} 
                      text-lg font-bold`}>
                      {opt.label}
                    </span>
                    <span className="text-base text-indigo-700 dark:text-indigo-300 font-medium">Option {opt.label}</span>
                    {opt.label === editedQuestion.correctAnswer && (
                      <span className="ml-auto text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded">
                        Correct
                      </span>
                    )}
                  </div>
                  <ImagePicker
                    file={opt.imageFile || null}
                    previewUrl={opt.previewUrl || null}
                    onChange={(f, u) => setOptionImage(opt.label, f, u ?? null)}
                    variant="medium"
                    onThumbClick={() => opt.previewUrl && 
                      setLightbox({
                        open: true, 
                        src: opt.previewUrl, 
                        alt: `Option ${opt.label}`
                      })
                    }
                  />
                </div>
              ))}
            </div>

            {/* Correct answer */}
            <div className="mt-6 max-w-xs p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-700/30">
              <CustomSelect
                label="Select Correct Answer"
                value={editedQuestion.correctAnswer}
                onChange={(value) => setField("correctAnswer", value as AnswerKey)}
                options={(["A", "B", "C", "D", "E"] as AnswerKey[]).map(k => ({ 
                  value: k, 
                  label: `Option ${k}` 
                }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-rose-50/50 dark:bg-rose-900/10 p-5 rounded-lg border border-rose-100 dark:border-rose-800/30">
            <h4 className="text-xl font-semibold mb-4 text-rose-900 dark:text-rose-300">Question Tags</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag and press Add"
                className="flex-1 rounded-md border border-rose-200 dark:border-rose-700/50 p-3 text-lg dark:bg-gray-700 dark:text-white shadow-sm focus:border-rose-400 focus:ring focus:ring-rose-200 dark:focus:ring-rose-800/30"
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-5 py-3 rounded-md text-lg font-medium bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-700 dark:hover:bg-rose-600 shadow-sm transition-colors"
              >
                Add Tag
              </button>
            </div>
            {!!editedQuestion.tags.length && (
              <div className="mt-5 flex flex-wrap gap-2 p-3 bg-white dark:bg-gray-700 rounded-md">
                {editedQuestion.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-700/50 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 text-base font-medium text-rose-800 dark:text-rose-200">
                    {t}
                    <button 
                      type="button" 
                      onClick={() => removeTag(t)} 
                      className="ml-1 text-rose-600 hover:text-rose-800 dark:text-rose-300 dark:hover:text-rose-100 focus:outline-none"
                      aria-label={`Remove tag ${t}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Solutions */}
          <div className="bg-cyan-50/50 dark:bg-cyan-900/10 p-5 rounded-lg border border-cyan-100 dark:border-cyan-800/30">
            <h4 className="text-xl font-semibold mb-4 text-cyan-900 dark:text-cyan-300">Solutions & Additional Resources</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">              
              <div className="p-4 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                <h5 className="text-lg font-semibold text-cyan-800 dark:text-cyan-300 mb-3">Marking Scheme</h5>
                <ImagePicker
                  label="Upload marking scheme"
                  file={editedQuestion.solutions.markingSchemeFile || null}
                  previewUrl={editedQuestion.solutions.markingSchemePreview || null}
                  onChange={(f, u) => handleSolutionFile('markingSchemeFile', 'markingSchemePreview', f, u)}
                  variant="compact"
                  accept="image/*,application/pdf"
                  onThumbClick={() => editedQuestion.solutions.markingSchemePreview && 
                    setLightbox({
                      open: true, 
                      src: editedQuestion.solutions.markingSchemePreview, 
                      alt: "Marking Scheme",
                      isPdf: editedQuestion.solutions.markingSchemeFile?.type === "application/pdf"
                    })
                  }
                />
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                <h5 className="text-lg font-semibold text-cyan-800 dark:text-cyan-300 mb-3">Teacher's Notes</h5>
                <ImagePicker
                  label="Upload teacher's notes"
                  file={editedQuestion.solutions.teachersNoteFile || null}
                  previewUrl={editedQuestion.solutions.teachersNotePreview || null}
                  onChange={(f, u) => handleSolutionFile('teachersNoteFile', 'teachersNotePreview', f, u)}
                  variant="compact"
                  accept="image/*,application/pdf"
                  onThumbClick={() => editedQuestion.solutions.teachersNotePreview && 
                    setLightbox({
                      open: true, 
                      src: editedQuestion.solutions.teachersNotePreview, 
                      alt: "Teacher's Note",
                      isPdf: editedQuestion.solutions.teachersNoteFile?.type === "application/pdf"
                    })
                  }
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm mb-5">
              <label className="block mb-2 text-lg font-medium text-cyan-800 dark:text-cyan-200">Solution Hint</label>
              <textarea
                value={editedQuestion.solutions.solutionHint}
                onChange={(e) =>
                  setField("solutions", { ...editedQuestion.solutions, solutionHint: e.target.value })
                }
                className="w-full min-h-[100px] rounded-md border border-cyan-200 dark:border-cyan-700/50 p-3 text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-cyan-400 focus:ring focus:ring-cyan-200 dark:focus:ring-cyan-800/30"
                placeholder="Type solution hint here to help students understand the answer"
              />
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
              <label className="block mb-2 text-lg font-medium text-cyan-800 dark:text-cyan-200">Video Tutorial URL</label>
              <div className="flex items-center">
                <span className="bg-gray-100 dark:bg-gray-600 p-3 rounded-l-md border border-r-0 border-cyan-200 dark:border-cyan-700/50">
                  <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="url"
                  value={editedQuestion.solutions.videoUrl}
                  onChange={(e) =>
                    setField("solutions", { ...editedQuestion.solutions, videoUrl: e.target.value })
                  }
                  className="flex-1 rounded-r-md border border-cyan-200 dark:border-cyan-700/50 p-3 text-lg dark:bg-gray-700 dark:text-white focus:border-cyan-400 focus:ring focus:ring-cyan-200 dark:focus:ring-cyan-800/30"
                  placeholder="https://www.youtube.com/watch?v=example"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Add a YouTube or Vimeo URL for additional video explanations
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 md:p-6 -mx-5 md:-mx-7 mt-8 flex items-center justify-between shadow-lg">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              <span className="font-medium">Question ID:</span> <span className="text-base">#{editedQuestion.id}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-lg px-6 py-3 transition-colors dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 shadow-sm disabled:opacity-50"
              >
                Cancel
              </button>
              {onViewClick && (
                <button
                  type="button"
                  onClick={onViewClick}
                  disabled={isSaving}
                  className="text-indigo-700 bg-indigo-100 hover:bg-indigo-200 font-medium rounded-lg text-lg px-6 py-3 transition-colors dark:text-indigo-200 dark:bg-indigo-800/50 dark:hover:bg-indigo-700/50 shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Question
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-lg px-8 py-3 transition-colors shadow-sm flex items-center gap-2 disabled:bg-blue-400"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
