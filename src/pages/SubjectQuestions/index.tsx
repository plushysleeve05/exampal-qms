// index.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';
import EditQuestionModal from '../../components/modals/EditQuestionModal';
import AddQuestionModal from '../../components/modals/AddQuestionModal';
import ViewQuestionModal from '../../components/common/ViewQuestionModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { ExamType } from '../../api/types';
import { QuestionFilterParams } from '../../api/questionsApi';

import { useQuestionsApi } from './hooks/useQuestionsApi';
import { useQuestionFilters } from './hooks/useQuestionFilters';
import { usePagination } from './hooks/usePagination';
import { useNotification } from './hooks/useNotification';
import { QuestionData, ConfirmationModalProps } from './types';

import NotificationToast from './components/NotificationToast';
import FilterSection from './components/FilterSection';
import QuestionsTable from './components/QuestionsTable';
import Pagination from './components/Pagination';
import SubjectSelector from './components/SubjectSelector';

export default function SubjectQuestions() {
  // Get URL parameters
  const { examType, subject } = useParams<{ examType: string; subject: string }>();
  const initialFormattedSubject = subject?.replace(/-/g, ' ');

  // Basic state
  const [currentSubject, setCurrentSubject] = useState<string>(initialFormattedSubject || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);

  // Use the hooks we created
  const {
    years,
    subjects,
    topics,
    isApiLoading,
    fetchMetadata,
    fetchQuestions
  } = useQuestionsApi({
    examType: examType as ExamType,
    subject: currentSubject
  });

  const [allQuestions, setAllQuestions] = useState<QuestionData[]>([]);
  const [paginatedQuestions, setPaginatedQuestions] = useState<QuestionData[]>([]);

  const startFetchUIReset = () => {
    setIsLoading(true);
    setInitialDataLoaded(false);
    setSelectedRows([]);
    setAllQuestions([]);
    setPaginatedQuestions([]);
    setTotalItems(0);
  };

  const endFetchUI = () => setIsLoading(false);


  const {
    selectedYears,
    setSelectedYears,
    selectedSections,
    setSelectedSections,
    selectedTopics,
    setSelectedTopics,
    selectedDifficulties,
    setSelectedDifficulties,
    selectedQuestionType,
    setSelectedQuestionType,
    searchQuery,
    setSearchQuery,
    questionCount,
    setQuestionCount,

    pendingYears,
    setPendingYears,
    pendingSections,
    setPendingSections,
    pendingTopics,
    setPendingTopics,
    pendingDifficulties,
    setPendingDifficulties,
    pendingQuestionType,
    setPendingQuestionType,

    filteredQuestions,
    effectiveFilteredQuestions,

    toggleSelection,
    togglePendingSelection,
    applyFilters: applyFiltersFn,
    clearPendingFilters,
    resetFilters
  } = useQuestionFilters({
    allQuestions
  });

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    setTotalPages,
    totalItems,
    setTotalItems,
    paginate,
    updatePaginationFromBackend
  } = usePagination({
    initialItemsPerPage: 10
  });

  const {
    notification,
    showNotification,
    clearNotification
  } = useNotification();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSectionAModalOpen, setIsAddSectionAModalOpen] = useState(false);
  const [isAddSectionBModalOpen, setIsAddSectionBModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
    isDangerous: false
  });

  // Selected rows for bulk actions
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Sort configuration
  const [sortConfig, setSortConfig] = useState<{
    key: keyof QuestionData;
    direction: 'asc' | 'desc'
  }>({
    key: 'questionNumber',
    direction: 'asc'
  });

  // Fetch metadata when component mounts or subject/exam type changes
  useEffect(() => {
    document.title = `${currentSubject} Questions | ${examType} | ExamPal QMS`;

    const loadMetadata = async () => {
      try {
        await fetchMetadata();
      } catch (error) {
        showNotification("Failed to load metadata", "error");
      }
    };

    loadMetadata();
  }, [examType, currentSubject, fetchMetadata]);

  // Apply filters and fetch questions
  const applyFilters = async () => {
    if (!examType || !currentSubject) {
      showNotification("Missing required parameters for fetching questions", "error");
      return;
    }


    startFetchUIReset(); // << clear immediately

    try {
      // Build filter parameters for API call
      const filterParams: QuestionFilterParams = {
        examtype: examType as ExamType,
        subject: currentSubject,
      };

      // Add optional filters
      if (pendingYears.length > 0) {
        filterParams.examyears = pendingYears;
      }

      if (pendingSections.length > 0) {
        // Convert "Section A" to "Section-A" format
        filterParams.examSections = pendingSections.map(
          section => section.replace(' ', '-')
        );
      }

      if (pendingTopics.length > 0) {
        filterParams.topics = pendingTopics;
      }

      if (pendingDifficulties.length > 0) {
        // Convert difficulty names to levels (1=Easy, 2=Hard/Difficult)
        const difficultyLevelMap: Record<string, string> = {
          "Easy": "1",
          "Hard": "2"
        };

        filterParams.difficultyLevels = pendingDifficulties.map(
          difficulty => difficultyLevelMap[difficulty] || "1"
        );
      }

      // Add question type filter if selected
      if (pendingQuestionType) {
        filterParams.questionType = pendingQuestionType;
      }

      // Fetch questions from API
      // Using 0-indexed pagination (page 0 is the first page)
      const response = await fetchQuestions(filterParams, currentPage, itemsPerPage);

      // Apply filters to questions
      applyFiltersFn();

      // Set questions and update pagination data
      setAllQuestions(response.questions);
      setPaginatedQuestions(response.questions);
      updatePaginationFromBackend(response.pagination);

      // Set initialDataLoaded to true
      setInitialDataLoaded(true);
    } catch (error) {
      console.error("Error applying filters:", error);
      showNotification("Failed to fetch questions. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Load all questions without filters
  const loadAllData = async () => {
    if (!examType || !currentSubject) {
      showNotification("Missing required parameters for fetching questions", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Create minimal filter params (just exam type and subject)
      const filterParams: QuestionFilterParams = {
        examtype: examType as ExamType,
        subject: currentSubject
      };

      // Reset all filters
      resetFilters();

      // Fetch questions from API
      // Using 0-indexed pagination (page 0 is the first page)
      const response = await fetchQuestions(filterParams, 0, itemsPerPage);

      // Set questions and update pagination data
      setAllQuestions(response.questions);
      setPaginatedQuestions(response.questions);
      updatePaginationFromBackend(response.pagination);

      // Set initialDataLoaded to true
      setInitialDataLoaded(true);
    } catch (error) {
      console.error("Error loading all data:", error);
      showNotification("Failed to fetch questions. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle row selection
  const handleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  // Handle select all rows
  const handleSelectAllRows = (checked: boolean) => {
    if (checked && paginatedQuestions && paginatedQuestions.length > 0) {
      const allIds = paginatedQuestions.map((q: QuestionData) => q.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Calculate pagination values based on current page and items per page
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage + 1;

  // Function to fetch data for a specific page
  const fetchPageData = useCallback(async (pageNumber: number) => {
    if (!examType || !currentSubject) {
      showNotification("Missing required parameters for fetching questions", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Build filter parameters for API call
      const filterParams: QuestionFilterParams = {
        examtype: examType as ExamType,
        subject: currentSubject,
      };

      // Add current filters
      if (selectedYears.length > 0) {
        filterParams.examyears = selectedYears;
      }

      if (selectedSections.length > 0) {
        // Convert "Section A" to "Section-A" format
        filterParams.examSections = selectedSections.map(
          section => section.replace(' ', '-')
        );
      }

      if (selectedTopics.length > 0) {
        filterParams.topics = selectedTopics;
      }

      if (selectedDifficulties.length > 0) {
        // Convert difficulty names to levels (1=Easy, 2=Hard/Difficult)
        const difficultyLevelMap: Record<string, string> = {
          "Easy": "1",
          "Hard": "2"
        };

        filterParams.difficultyLevels = selectedDifficulties.map(
          difficulty => difficultyLevelMap[difficulty] || "1"
        );
      }

      // Add question type filter if selected
      if (selectedQuestionType) {
        filterParams.questionType = selectedQuestionType;
      }

      // Fetch questions from API for the requested page
      const response = await fetchQuestions(filterParams, pageNumber, itemsPerPage);

      // Update state with new data
      setPaginatedQuestions(response.questions);
      updatePaginationFromBackend(response.pagination);
    } catch (error) {
      console.error("Error fetching page data:", error);
      showNotification("Failed to fetch questions for this page. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [examType, currentSubject, selectedYears, selectedSections, selectedTopics, selectedDifficulties, selectedQuestionType, itemsPerPage, fetchQuestions]);

  // Handle sort
  const handleSort = (key: keyof QuestionData) => {
    // If sorting the same column, toggle direction
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    // Sort the questions
    const sortedQuestions = [...allQuestions].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      // Special handling for difficulty levels
      if (key === 'difficultyLevel') {
        const aOrderValue = typeof aValue === 'number' ? aValue : 0;
        const bOrderValue = typeof bValue === 'number' ? bValue : 0;
        return direction === 'asc' ? aOrderValue - bOrderValue : bOrderValue - aOrderValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setAllQuestions(sortedQuestions);
  };

  // Handle edit question
  const handleEdit = (question: QuestionData) => {
    console.log('Question before edit:', question);
    setCurrentQuestion(question);
    setIsEditModalOpen(true);
  };

  // Handle view question
  const handleView = (question: QuestionData) => {
    setCurrentQuestion(question);
    setIsViewModalOpen(true);
  };

  // Handle delete question
  const handleDeleteQuestion = (question: QuestionData) => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Question",
      message: `Are you sure you want to delete question ${question.questionNumber} from ${question.year}? This action cannot be undone.`,
      onConfirm: () => {
        // Remove the question from the filtered questions
        setAllQuestions(prevQuestions =>
          prevQuestions.filter(q => q.id !== question.id)
        );

        // Show success notification
        showNotification(`Question ${question.questionNumber} was successfully deleted.`, "success");
      },
      isDangerous: true
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;

    setConfirmationModal({
      isOpen: true,
      title: "Delete Multiple Questions",
      message: `Are you sure you want to delete ${selectedRows.length} selected questions? This action cannot be undone.`,
      onConfirm: () => {
        // Remove the selected questions
        setAllQuestions(prevQuestions =>
          prevQuestions.filter(question => !selectedRows.includes(question.id))
        );

        // Clear selection
        setSelectedRows([]);

        // Show success notification
        showNotification(`${selectedRows.length} questions were successfully deleted.`, "success");
      },
      isDangerous: true
    });
  };

  // Handle saving edited question
  const handleSaveEdit = async (editedQuestion: QuestionData) => {
    setIsLoading(true);
    console.log('Question after edit (before API call):', editedQuestion);
    try {
      // Import the image upload APIs
      const {
        fileToBase64,
        uploadQuestionImage,
        uploadAnswerImage,
        uploadSolutionImage,
        uploadMarkingSchemeImage,
        uploadTeachersNoteImage,
        uploadPreambleImage
      } = await import('../../api/imageUploadApi');

      // Common image upload parameters
      const baseUploadParams = {
        examType: examType as string,
        examYear: editedQuestion.year,
        subject: currentSubject,
        examSection: editedQuestion.section ? editedQuestion.section.replace(' ', '-') : '',
        questionType: editedQuestion.questionType,
        topic: editedQuestion.topic,
        questionNumber: editedQuestion.questionNumber,
        imageByte: ""
      };

      // Process and upload new images if they exist
      let updatedQuestionUrls = [...editedQuestion.questionPreviews];
      let updatedPreambleUrl = editedQuestion.preamblePreview;

      // Upload question images if they exist
      for (let i = 0; i < editedQuestion.questionImages.length; i++) {
        const image = editedQuestion.questionImages[i];
        if (image instanceof File) {
          try {
            const base64 = await fileToBase64(image);
            const imageUrl = await uploadQuestionImage({
              ...baseUploadParams,
              imageByte: base64
            });
            updatedQuestionUrls[i] = imageUrl;
          } catch (err) {
            console.error(`Error uploading question image ${i}:`, err);
          }
        }
      }

      // Upload preamble image if it exists
      if (editedQuestion.preambleEnabled && editedQuestion.preambleImage instanceof File) {
        try {
          const base64 = await fileToBase64(editedQuestion.preambleImage);
          updatedPreambleUrl = await uploadPreambleImage({
            ...baseUploadParams,
            imageByte: base64
          });
        } catch (err) {
          console.error('Error uploading preamble image:', err);
        }
      }

      // Upload answer option images if they exist
      const updatedOptions = [...editedQuestion.options];
      for (let i = 0; i < updatedOptions.length; i++) {
        const option = updatedOptions[i];
        if (option.imageFile instanceof File) {
          try {
            const base64 = await fileToBase64(option.imageFile);
            const imageUrl = await uploadAnswerImage({
              ...baseUploadParams,
              option: option.label,
              imageByte: base64
            });
            updatedOptions[i] = {
              ...option,
              previewUrl: imageUrl
            };
          } catch (err) {
            console.error(`Error uploading option ${option.label} image:`, err);
          }
        }
      }

      // Upload solution images if they exist
      let updatedSolutions = { ...editedQuestion.solutions };

      if (updatedSolutions.imageFile instanceof File) {
        try {
          const base64 = await fileToBase64(updatedSolutions.imageFile);
          updatedSolutions.imagePreview = await uploadSolutionImage({
            ...baseUploadParams,
            imageByte: base64
          });
        } catch (err) {
          console.error('Error uploading solution image:', err);
        }
      }

      if (updatedSolutions.markingSchemeFile instanceof File) {
        try {
          const base64 = await fileToBase64(updatedSolutions.markingSchemeFile);
          updatedSolutions.markingSchemePreview = await uploadMarkingSchemeImage({
            ...baseUploadParams,
            imageByte: base64
          });
        } catch (err) {
          console.error('Error uploading marking scheme image:', err);
        }
      }

      if (updatedSolutions.teachersNoteFile instanceof File) {
        try {
          const base64 = await fileToBase64(updatedSolutions.teachersNoteFile);
          updatedSolutions.teachersNotePreview = await uploadTeachersNoteImage({
            ...baseUploadParams,
            imageByte: base64
          });
        } catch (err) {
          console.error('Error uploading teachers note image:', err);
        }
      }

      // The updatedQuestion fields will be used directly in finalEditedQuestion

      // Use the updated question with all new image URLs
      const finalEditedQuestion = {
        ...editedQuestion,
        questionPreviews: updatedQuestionUrls,
        preamblePreview: updatedPreambleUrl,
        options: updatedOptions,
        solutions: updatedSolutions
      };

      // Map UI QuestionData to API UpdateQuestionPayload format with updated URLs
      const apiPayload = {
        ID: finalEditedQuestion.id, // This is the critical field - must match the number in the API URL
        CreatedAt: new Date().toISOString(), // This will be overwritten by the server
        UpdatedAt: new Date().toISOString(), // This will be overwritten by the server
        DeletedAt: null,
        examType: examType as string,
        examYear: finalEditedQuestion.year,
        subject: currentSubject,
        examSection: finalEditedQuestion.section ? finalEditedQuestion.section.replace(' ', '-') : '', // Convert "Section A" to "Section-A" for API
        questionType: finalEditedQuestion.questionType,
        topic: finalEditedQuestion.topic,
        questionNumber: finalEditedQuestion.questionNumber,
        difficultyLevel: finalEditedQuestion.difficultyLevel,
        preambleUrl: finalEditedQuestion.preamblePreview || '',
        questionUrl: finalEditedQuestion.questionPreviews[0] || '',
        answers: {
          optionA: finalEditedQuestion.options[0]?.previewUrl || '',
          optionB: finalEditedQuestion.options[1]?.previewUrl || '',
          optionC: finalEditedQuestion.options[2]?.previewUrl || '',
          optionD: finalEditedQuestion.options[3]?.previewUrl || '',
          optionE: finalEditedQuestion.options[4]?.previewUrl || '',
          correctAnswer: finalEditedQuestion.correctAnswer.toLowerCase()
        },
        solution: {
          videoUrl: finalEditedQuestion.solutions.videoUrl || '',
          imageUrl: finalEditedQuestion.solutions.imagePreview || '',
          markingSchemeUrl: finalEditedQuestion.solutions.markingSchemePreview || '',
          teachersNoteUrl: finalEditedQuestion.solutions.teachersNotePreview || '',
          solutionHintUrl: finalEditedQuestion.solutions.solutionHint || ''
        },
        relatedTopics: {
          topics: editedQuestion.tags && editedQuestion.tags.length > 0 ? editedQuestion.tags : null
        }
      };

      // Call the API to update the question using the question ID
      console.log('API payload for update:', apiPayload);
      await import('../../api/questionsApi').then(({ updateQuestion }) => {
        console.log('Calling updateQuestion with ID:', finalEditedQuestion.id);
        return updateQuestion(finalEditedQuestion.id, apiPayload);
      }).then(response => {
        console.log('API update response:', response);
      });

      // Refetch data to ensure UI shows the latest server state
      try {
        // Check if filters are applied
        if (selectedYears.length > 0 || selectedSections.length > 0 ||
          selectedTopics.length > 0 || selectedDifficulties.length > 0) {
          // If filters are applied, use them to fetch
          const filterParams: QuestionFilterParams = {
            examtype: examType as ExamType,
            subject: currentSubject,
          };

          if (selectedYears.length > 0) {
            filterParams.examyears = selectedYears;
          }

          if (selectedSections.length > 0) {
            filterParams.examSections = selectedSections.map(
              section => section.replace(' ', '-')
            );
          }

          if (selectedTopics.length > 0) {
            filterParams.topics = selectedTopics;
          }

          if (selectedDifficulties.length > 0) {
            const difficultyLevelMap: Record<string, string> = {
              "Easy": "1",
              "Hard": "2"
            };

            filterParams.difficultyLevels = selectedDifficulties.map(
              difficulty => difficultyLevelMap[difficulty] || "1"
            );
          }

          console.log("Refetching questions with filters:", filterParams);
          const response = await fetchQuestions(filterParams, currentPage, itemsPerPage);

          // Update state with fresh data
          setAllQuestions(response.questions);
          setPaginatedQuestions(response.questions);
          updatePaginationFromBackend(response.pagination);
        } else {
          // If no filters are applied, fetch all questions
          console.log("Refetching all questions");
          await loadAllData();
        }
      } catch (refetchError) {
        console.error("Error refetching questions after update:", refetchError);
        // Fall back to local update if refetch fails
        const updatedQuestions = allQuestions.map((q) =>
          q.id === finalEditedQuestion.id ? finalEditedQuestion : q
        );
        setAllQuestions(updatedQuestions);
      }

      setIsEditModalOpen(false);
      setCurrentQuestion(null);

      // Show success notification
      showNotification("Question updated successfully!", "success");
      // logging the edit to the console:
      console.log("Edited question:", editedQuestion);
      console.log("Edited question ID:", editedQuestion.id);

    } catch (error) {
      console.error("Error updating question:", error);
      showNotification(`Error updating question: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving a new question
  const handleSaveNewQuestion = (questionData: any) => {
    // Make sure the question has a unique ID
    const newId = Math.max(...allQuestions.map(q => q.id), 0) + 1;
    const newQuestion = {
      ...questionData,
      id: newId,
      questionNumber: allQuestions.length + 1
    };

    // Add the new question to our list
    setAllQuestions(prevQuestions => [...prevQuestions, newQuestion]);

    // Show a success notification
    showNotification(`New ${questionData.section} question added successfully!`, "success");
  };

  // Function to handle changing subjects
  const handleSubjectChange = async (newSubject: string) => {
    // Update the current subject and set loading state
    setCurrentSubject(newSubject);
    
    // Call startFetchUIReset to properly clear all data
    startFetchUIReset();

    // Hide the dropdown after selection
    document.getElementById('subject-dropdown')?.classList.add('hidden');

    try {
      // Fetch topics for the newly selected subject
      if (examType) {
        await fetchMetadata();
      }

      // Reset all filters
      resetFilters();
      setCurrentPage(0);

      // Reset initialDataLoaded flag to show the initial message
      setInitialDataLoaded(false);

      // Explicitly clear both question arrays to ensure old questions don't remain
      setAllQuestions([]);
      setPaginatedQuestions([]);

      // Update URL without page reload using history API
      const formattedForUrl = newSubject.toLowerCase().replace(/\s+/g, '-');
      window.history.pushState(
        {},
        `${newSubject} Questions | ${examType}`,
        `/${examType}/${formattedForUrl}/questions`
      );
    } catch (error) {
      console.error("Error loading subject data:", error);
      showNotification("Failed to load subject data. Please try again later.", "error");
    } finally {
      // End loading state
      setIsLoading(false);
    }
  };

  // Sections are application specific, not from API
  const sections = ["Section A", "Section B"];

  // Question types to match database values
  const questionTypes = ["MCQ", "Essay"];

  // Difficulty levels - updated to match backend (1=Easy, 2=Hard/Difficult)
  const difficulties = ["Easy", "Hard"];

  return (
    <>
      <PageMeta
        title={`${currentSubject} Questions | ${examType} | ExamPal QMS`}
        description={`Manage ${currentSubject} questions for ${examType}`}
      />

      {/* Notification with animation */}
      {notification && (
        <NotificationToast
          notification={notification}
          onClose={clearNotification}
        />
      )}

      {/* Edit Question Modal */}
      <EditQuestionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        onViewClick={() => {
          // Close the edit modal and open the view modal with the same question
          setIsEditModalOpen(false);
          setIsViewModalOpen(true);
        }}
        question={currentQuestion}
        years={years}
        topics={topics}
        difficulties={difficulties}
      />

      {/* Add Section A Question Modal */}
      <AddQuestionModal
        isOpen={isAddSectionAModalOpen}
        onClose={() => setIsAddSectionAModalOpen(false)}
        section="Section A"
        onSave={handleSaveNewQuestion}
        years={years}
        topics={topics}
        difficulties={difficulties}
      />

      {/* Add Section B Question Modal */}
      <AddQuestionModal
        isOpen={isAddSectionBModalOpen}
        onClose={() => setIsAddSectionBModalOpen(false)}
        section="Section B"
        onSave={handleSaveNewQuestion}
        years={years}
        topics={topics}
        difficulties={difficulties}
      />

      {/* View Question Modal */}
      <ViewQuestionModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setCurrentQuestion(null);
        }}
        onEdit={() => {
          setIsViewModalOpen(false);
          handleEdit(currentQuestion as QuestionData);
        }}
        question={currentQuestion}
        examType={examType || "BECE"}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        isDangerous={confirmationModal.isDangerous}
      />

      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {/* Main content - full width without side navigation */}
        <div className="w-full">
          {/* Header with title */}
          <div className="mb-6 flex flex-wrap justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Uploaded Questions
            </h1>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => setIsAddSectionAModalOpen(true)}
                className="py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-md flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Section-A Question
              </button>
              <button
                onClick={() => setIsAddSectionBModalOpen(true)}
                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Section-B Question
              </button>
            </div>
          </div>

          {/* Section heading with subject selector */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {currentSubject} Questions
              </h2>

              {/* Subject Selector Component */}
              <SubjectSelector
                subjects={subjects}
                currentSubject={currentSubject}
                handleSubjectChange={handleSubjectChange}
                isLoading={isApiLoading}
              />
            </div>
          </div>

          {/* Filter Section Component */}
          <FilterSection
            years={years}
            topics={topics}
            difficulties={difficulties}
            questionTypes={questionTypes}
            sections={sections}
            pendingYears={pendingYears}
            setPendingYears={setPendingYears}
            pendingQuestionTypes={pendingQuestionType ? [pendingQuestionType] : []}
            setPendingQuestionTypes={(types) => {
              const newTypes = typeof types === 'function' ? types([pendingQuestionType || '']) : types;
              setPendingQuestionType(newTypes.length ? newTypes[0] : '');
            }}
            pendingTopics={pendingTopics}
            setPendingTopics={setPendingTopics}
            pendingDifficulties={pendingDifficulties}
            setPendingDifficulties={setPendingDifficulties}
            selectedYears={selectedYears}
            selectedTopics={selectedTopics}
            selectedDifficulties={selectedDifficulties}
            applyFilters={applyFilters}
            clearPendingFilters={clearPendingFilters}
            loadAllData={loadAllData}
            togglePendingSelection={(value, currentSelections, setSelections) => {
              // Check if this is the question type filter

              if (Array.isArray(currentSelections) &&
                currentSelections.length <= 1 &&
                questionTypes.includes(value)) {
                // Special handling for question types - we only allow one selection
                if (pendingQuestionType === value) {
                  setPendingQuestionType('');
                } else {
                  setPendingQuestionType(value);
                }
              } else {
                // Normal multi-select behavior for other filters
                togglePendingSelection(value, currentSelections, setSelections);
              }
            }}
            isLoading={isLoading}
            initialDataLoaded={initialDataLoaded}
          />

          {/* Questions Data Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Table Toolbar */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Search Input */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-grow max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Search questions, topics, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                          onClick={() => setSearchQuery("")}
                          title="Clear search"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bulk action buttons */}
                  {selectedRows.length > 0 && (
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-2.5 rounded-lg text-sm font-medium inline-flex items-center bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-all duration-200"
                        title="Export selected questions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export
                      </button>

                      <button
                        className="px-3 py-2.5 rounded-lg text-sm font-medium inline-flex items-center bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40 transition-all duration-200"
                        onClick={handleBulkDelete}
                        title="Delete selected questions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete ({selectedRows.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table Component */}
            <QuestionsTable
              paginatedQuestions={paginatedQuestions}
              sortConfig={sortConfig}
              handleSort={handleSort}
              selectedRows={selectedRows}
              handleSelectRow={handleSelectRow}
              handleSelectAllRows={handleSelectAllRows}
              handleEdit={handleEdit}
              handleView={handleView}
              handleDeleteQuestion={handleDeleteQuestion}
              isLoading={isLoading}
              initialDataLoaded={initialDataLoaded}
            />

            {/* Pagination Component */}
            {initialDataLoaded && !isLoading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={(pageNumber) => {
                  fetchPageData(pageNumber);
                }}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={(newItemsPerPage) => {
                  setItemsPerPage(newItemsPerPage);
                  fetchPageData(0); // Reset to first page when changing items per page
                }}
                totalItems={totalItems}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={Math.min(indexOfLastItem, totalItems)}
              />
            )}

            {/* Empty State */}
            {!isLoading && !initialDataLoaded && (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No questions loaded</h3>
                <p className="mb-6 text-gray-500 dark:text-gray-400 max-w-md">
                  Use the filter options above to load specific questions or click "Load All Data" to view all questions for this subject.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Apply Current Filters
                  </button>
                  <button
                    onClick={loadAllData}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors duration-200 inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Load All Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
