import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ExamTypes from "./pages/ExamTypes";
import ExamSections from "./pages/ExamSections";
import ExamYears from "./pages/ExamYears";
import QuestionTypes from "./pages/QuestionTypes";
import SubjectQuestionsPage from "./pages/SubjectQuestionsPage";
import SubjectsListPage from "./pages/SubjectsListPage";
import QuestionForm from "./pages/QuestionForm";

// User Management Pages
import UsersList from "./pages/UserManagement/UsersList";
import UserRoles from "./pages/UserManagement/UserRoles";
import UserActivity from "./pages/UserManagement/UserActivity";

// Statistics Pages
import Dashboard from "./pages/Statistics/Dashboard";
import Analytics from "./pages/Statistics/Analytics";
import Reports from "./pages/Statistics/Reports";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ExamPal QMS Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* ExamPal QMS Pages */}
            <Route path="/exam-types" element={<ExamTypes />} />
            <Route path="/exam-sections" element={<ExamSections />} />
            <Route path="/exam-years" element={<ExamYears />} />
            <Route path="/question-types" element={<QuestionTypes />} />
            <Route path="/subjects" element={<SubjectsListPage />} />
            
            {/* Subject and Question Routes */}
            <Route path="/:examType/:subject" element={<SubjectQuestionsPage />} />
            <Route path="/:examType/:subject/questions" element={<SubjectQuestionsPage />} />
            <Route path="/:examType/:subject/questions/add/:section" element={<QuestionForm />} />
            
            {/* User Management Routes */}
            <Route path="/user-management/users" element={<UsersList />} />
            <Route path="/user-management/roles" element={<UserRoles />} />
            <Route path="/user-management/activity" element={<UserActivity />} />
            
            {/* Statistics Routes */}
            <Route path="/statistics/dashboard" element={<Dashboard />} />
            <Route path="/statistics/analytics" element={<Analytics />} />
            <Route path="/statistics/reports" element={<Reports />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
