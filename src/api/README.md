# API Module for ExamPal QMS

This directory contains API clients for interacting with the ExamPal API.

## Structure

- `api.ts` - Base API configuration with Axios and interceptors
- `types.ts` - TypeScript interfaces for API data models
- `examYearsApi.ts` - API client for exam years endpoints
- `subjectsApi.ts` - API client for subjects endpoints
- `topicsApi.ts` - API client for topics endpoints
- `index.ts` - Exports all API modules for easy import
- `ApiTester.tsx` - Helper hooks for testing API calls
- `ApiTestPage.tsx` - Component for visualizing API test results

## Available APIs

### Exam Years API
```typescript
// Fetch all exam years
const examYears = await fetchExamYears();

// Fetch a specific exam year by ID
const examYear = await fetchExamYearById(1);

// Create a new exam year
const newExamYear = await createExamYear({ name: '2025', year: 2025 });

// Update an exam year
const updatedExamYear = await updateExamYear(1, { name: '2026', year: 2026 });

// Delete an exam year
await deleteExamYear(1);
```

### Subjects API
```typescript
// Fetch all subjects for an exam type (BECE or WASSCE)
const subjects = await fetchSubjects('BECE');

// Fetch a specific subject by ID
const subject = await fetchSubjectById('BECE', 1);

// Create a new subject
const newSubject = await createSubject('BECE', { 
  name: 'Mathematics', 
  slug: 'mathematics' 
});

// Update a subject
const updatedSubject = await updateSubject('BECE', 1, { 
  name: 'Advanced Mathematics' 
});

// Delete a subject
await deleteSubject('BECE', 1);
```

### Topics API
```typescript
// Fetch all topics for a specific subject
const topics = await fetchTopics('BECE', 'Integrated Science');

// Fetch a specific topic by ID
const topic = await fetchTopicById('BECE', 'Integrated Science', 1);

// Create a new topic
const newTopic = await createTopic('BECE', 'Integrated Science', { 
  name: 'Photosynthesis' 
});

// Update a topic
const updatedTopic = await updateTopic('BECE', 'Integrated Science', 1, { 
  name: 'Advanced Photosynthesis' 
});

// Delete a topic
await deleteTopic('BECE', 'Integrated Science', 1);
```

## Testing

To test the API modules, you can use the provided `ApiTester` hook or the `ApiTestPage` component:

```tsx
import { ApiTester } from '../api/ApiTester';

function MyComponent() {
  const { 
    testExamYears, 
    examYears, 
    loading 
  } = ApiTester();

  useEffect(() => {
    // Test the API when component mounts
    testExamYears();
  }, []);

  return (
    <div>
      {loading.years ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {examYears.map(year => (
            <li key={year.id}>{year.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Integration Example

To see a full example of how to integrate these API calls into a component, refer to the `SubjectQuestionsAPIExample.tsx` in the examples folder.

## Error Handling

All API functions include error handling. When an error occurs, the promise will be rejected with the appropriate error object. You should wrap your API calls in try-catch blocks to handle potential errors.
