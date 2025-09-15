# ExamPal QMS - Coding Agent Guidelines

This document provides essential knowledge to help you be productive in the ExamPal Question Management System (QMS) codebase.

## Project Overview

ExamPal QMS is a React application built with TypeScript and Tailwind CSS for managing educational examination questions. It's structured to support different exam types, subjects, topics, and questions.

### Core Technologies

- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **React Router v7** for navigation
- **Axios** for API communication
- **Context API** for state management

## Architecture & Data Flow

### Component Structure

1. **Layout Components** (`src/layout/`):
   - `AppLayout.tsx` - Main layout wrapper
   - `AppHeader.tsx` - Top navigation
   - `AppSidebar.tsx` - Side navigation menu

2. **Page Components** (`src/pages/`):
   - Follow a hierarchical structure matching URL routes
   - Example: `SubjectQuestions/index.tsx` for `/:examType/:subject/questions`

3. **Context Providers** (`src/context/`):
   - `SidebarContext.tsx` - Controls sidebar visibility state
   - `ThemeContext.tsx` - Manages light/dark mode

### API Integration

API calls are organized in domain-specific files in `src/api/`:

```typescript
// Example API usage
import { fetchExamYears, fetchSubjects, fetchTopics } from '../api';

// Fetch exam years
const examYears = await fetchExamYears();

// Fetch subjects for an exam type
const subjects = await fetchSubjects('BECE');

// Fetch topics for a specific subject
const topics = await fetchTopics('BECE', 'Mathematics');
```

The base API configuration in `api.ts` handles:
- Setting the base URL (`https://api.exampalgh.com/api/v1`)
- Adding authentication tokens
- Global error handling

## Key Development Patterns

### Custom Hooks for Data Management

Pages like `SubjectQuestions` use custom hooks to organize logic:

```typescript
// From SubjectQuestions/index.tsx
const { years, subjects, topics } = useQuestionsApi({
  examType: examType as ExamType,
  subject: currentSubject
});

const { 
  selectedYears,
  filteredQuestions, 
  toggleSelection
} = useQuestionFilters({ allQuestions });

const { currentPage, totalPages, paginate } = usePagination({
  initialItemsPerPage: 10
});
```

### Component Composition Pattern

Components are broken down into smaller, reusable pieces:

```jsx
// Parent component handles state and passes to children
<FilterSection 
  years={years}
  topics={topics}
  selectedYears={selectedYears}
  toggleSelection={toggleSelection}
  applyFilters={applyFilters}
  resetFilters={resetFilters}
/>

<QuestionsTable 
  questions={paginatedQuestions}
  onEdit={handleEditQuestion}
  onView={handleViewQuestion}
  onDelete={handleDeleteQuestion}
/>
```

## Development Workflow

### Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Key URL Patterns

- `/exam-types` - View all exam types
- `/exam-years` - View all exam years
- `/:examType/:subject` - View a specific subject
- `/:examType/:subject/questions` - View questions for a subject
- `/:examType/:subject/questions/add/:section` - Add a question to a section

## Best Practices

1. Use custom hooks to organize complex component logic  
2. Follow the established project pattern for API calls with proper error handling  
3. Use TypeScript types for all API data models  
4. Use the context providers for global state management  
5. Follow the component composition pattern for UI elements  
6. Co-locate **page-specific hooks** under `src/pages/<Page>/hooks` and keep **shared hooks** in `src/hooks`.  
7. **Normalize API shapes at the boundary** (DTO → UI types) and never leak raw backend payloads to components.  
8. Use the **central Axios instance** (interceptors for auth/errors); surface **user-friendly errors** (toast), never raw exceptions.  
9. Add **runtime guards** for uncertain responses (e.g., narrow types, fallback to empty arrays) to avoid `undefined` crashes.  
10. Prefer **controlled inputs**; debounce expensive handlers (search/filter) with `setTimeout`/`useDebounce`.  
11. **Lazy-load heavy routes/modals** with `React.lazy` + `Suspense`; show **skeletons** instead of spinners.  
12. **Memoize** expensive derived state (`useMemo`) and **stabilize callbacks** (`useCallback`) when passed to children.  
13. **Lift state only when shared**; avoid prop drilling by composing components and using context sparingly.  
14. **Accessibility first**: semantic elements, `aria-*`, visible focus, modals trap focus, `Esc`/overlay closes, buttons not `<div>`.  
15. **Responsive by default**: mobile-first Tailwind utilities, test key breakpoints, use `container`/`max-w-*` and CSS grid.  
16. Tailwind v4: **extract repeat class groups** to small components/utilities; avoid inline styles and ad-hoc CSS.  
17. **Tables**: make headers sticky, enable horizontal scroll at small widths, **virtualize** if rows > ~200.  
18. **Images**: constrain via `aspect-*` + `object-contain`; **lazy-load offscreen** assets; show loading placeholders.  
19. **Forms/uploads**: client-side validate size/type, show **preview + progress**, disable submit while pending, optimistic UI where safe.  
20. **Single source of truth**: don’t duplicate the same data in multiple contexts; derive UI from fetched state.  
21. **Filtering before pagination**; reset to page 1 when filters change; keep page size in state and URL (query param) if shareable.  
22. **Caching & invalidation**: cache per route/param key; invalidate on create/update/delete to prevent stale views.  
23. **Error handling**: always render loading/error/empty states; include **retry** actions; log with endpoint, params, status.  
24. **Security**: never log tokens; avoid `dangerouslySetInnerHTML`; sanitize any HTML from the server.  
25. **Routing**: type route params; guard invalid params; persist filter/pagination in URL for **shareable deep links**.  
26. **Performance**: code-split by route groups; prefetch likely next route on hover; avoid large bundle regressions.  
27. **Theming**: respect `ThemeContext`; ensure **dark mode** meets WCAG AA contrast; test both themes.  
28. **State cleanup**: cancel in-flight requests on unmount; guard against **stale updates** in async effects.  
29. **Testing (if present)**: cover critical paths (fetch → filter → paginate → edit); prefer resilient queries over brittle selectors.  
30. **DX & Git hygiene**: ESLint/Prettier clean, **Conventional Commits**, small PRs with screenshots/GIFs; add stories for reusable components.  
31. **Docs**: add JSDoc for complex props and hooks; update `copilot-instruction.md` whenever patterns or directories change.  




## Common Pitfalls
1. ❌ Forgetting to normalize nested API responses (e.g., `{ data: { data: [] } }`).  
2. ❌ Leaving `console.log` in production code; prefer `console.warn/error` only for debugging critical flows.  
3. ❌ Using `any` instead of defining clear TypeScript interfaces.  
4. ❌ Skipping loading/error/empty states in API-driven components.  
5. ❌ Duplicating state across contexts/components instead of deriving from a single source of truth.  
6. ❌ Mixing page-specific hooks into `src/hooks/` instead of colocating them under `src/pages/<Page>/hooks/`.  
7. ❌ Blocking the main thread with heavy computations instead of using `useMemo` or async workers.  
8. ❌ Not cancelling in-flight API requests on unmount, leading to stale updates or memory leaks.  
9. ❌ Forgetting to debounce or throttle input-heavy interactions (search, filters, resize).  
10. ❌ Breaking sidebar/theme context state by overriding locally instead of using `Context`.  
11. ❌ Using inline styles or custom CSS when Tailwind utilities exist.  
12. ❌ Forgetting accessibility basics: missing `aria-*`, no focus trap in modals, or invisible focus states.  
13. ❌ Ignoring responsive design — fixed widths that break on smaller screens.  
14. ❌ Allowing images to overflow containers by omitting `object-contain` or `aspect-*`.  
15. ❌ Handling pagination after filtering instead of filtering first, leading to wrong item counts.  
16. ❌ Hardcoding values (API URLs, page sizes) instead of using config/constants.  
17. ❌ Not persisting filters or pagination in the URL, breaking deep-linking.  
18. ❌ Forgetting to invalidate caches after create/update/delete operations.  
19. ❌ Using `<div>` for buttons/links instead of semantic HTML (`<button>`, `<a>`).  
20. ❌ Failing to sanitize HTML content when using `dangerouslySetInnerHTML`.  
21. ❌ Missing retry logic in API calls, leaving users stuck on transient failures.  
22. ❌ Upload forms without client-side validation, previews, or progress indicators.  
23. ❌ Large bundles caused by not code-splitting heavy routes/modals.  
24. ❌ Poor dark mode support — ignoring contrast ratios or testing only in light theme.  
25. ❌ Commits not following Conventional Commits, making changelogs harder to generate.  
26. ❌ PRs too large and unreviewable — always break work into smaller, typed units.  
27. ❌ Neglecting unit/component tests for critical paths (filtering, pagination, editing).  
28. ❌ Forgetting to update documentation (`copilot-instruction.md`, best practices) when patterns or directories change.  
