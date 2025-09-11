# SubjectQuestions.tsx API Integration

Here's how you can integrate the API modules into the SubjectQuestions.tsx component:

```tsx
// At the top of your file, import the API modules
import { fetchExamYears, fetchSubjects, fetchTopics, ExamType, ExamYear, Subject, Topic } from '../api';

export default function SubjectQuestions() {
    // Existing state...
    
    // New state for API data
    const [examYears, setExamYears] = useState<ExamYear[]>([]);
    const [subjectsList, setSubjectsList] = useState<Subject[]>([]);
    const [topicsList, setTopicsList] = useState<Topic[]>([]);
    const [apiLoading, setApiLoading] = useState({
        years: false,
        subjects: false,
        topics: false
    });
    const [apiError, setApiError] = useState<string | null>(null);
    
    // Fetch exam years when component mounts
    useEffect(() => {
        const loadExamYears = async () => {
            try {
                setApiLoading(prev => ({ ...prev, years: true }));
                const data = await fetchExamYears();
                setExamYears(data);
                setApiError(null);
            } catch (err) {
                console.error('Failed to load exam years:', err);
                setApiError('Failed to load exam years. Please try again later.');
            } finally {
                setApiLoading(prev => ({ ...prev, years: false }));
            }
        };
        
        loadExamYears();
    }, []);
    
    // Fetch subjects when exam type changes
    useEffect(() => {
        if (!examType) return;
        
        const loadSubjects = async () => {
            try {
                setApiLoading(prev => ({ ...prev, subjects: true }));
                const data = await fetchSubjects(examType as ExamType);
                setSubjectsList(data);
                setApiError(null);
            } catch (err) {
                console.error(`Failed to load ${examType} subjects:`, err);
                setApiError(`Failed to load ${examType} subjects. Please try again later.`);
            } finally {
                setApiLoading(prev => ({ ...prev, subjects: false }));
            }
        };
        
        loadSubjects();
    }, [examType]);
    
    // Fetch topics when subject changes
    useEffect(() => {
        if (!examType || !currentSubject) return;
        
        const loadTopics = async () => {
            try {
                setApiLoading(prev => ({ ...prev, topics: true }));
                const data = await fetchTopics(examType as ExamType, currentSubject);
                setTopicsList(data);
                setApiError(null);
            } catch (err) {
                console.error(`Failed to load topics for ${currentSubject}:`, err);
                setApiError(`Failed to load topics for ${currentSubject}. Please try again later.`);
            } finally {
                setApiLoading(prev => ({ ...prev, topics: false }));
            }
        };
        
        loadTopics();
    }, [examType, currentSubject]);
    
    // Replace your hardcoded data with API data
    // Instead of:
    // const years = ["2025", "2024", "2023", "2022", "2021"];
    // Use:
    const years = examYears.map(year => year.year.toString());
    
    // Instead of:
    // const topics = ["Grammar", "Comprehension", "Essay", "Literature"];
    // Use:
    const topics = topicsList.map(topic => topic.name);
    
    // Instead of:
    // const subjects = ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Economics", "Literature"];
    // Use:
    const subjects = subjectsList.map(subject => subject.name);
    
    // The rest of your component remains the same...
}
```

## Error Handling

Add error handling UI in your component:

```tsx
{apiError && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">{apiError}</span>
        <button
            onClick={() => setApiError(null)}
            className="absolute top-0 right-0 px-4 py-3"
        >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    </div>
)}
```

## Loading States

Show loading states for API requests:

```tsx
{apiLoading.years && (
    <div className="text-center py-4">
        <span className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></span>
        <span className="ml-2">Loading exam years...</span>
    </div>
)}
```

Apply similar loading indicators for subjects and topics as needed.
