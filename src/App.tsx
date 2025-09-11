import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ExamTypes from "./pages/ExamTypes";
import ExamSections from "./pages/ExamSections";
import ExamYears from "./pages/ExamYears";
import QuestionTypes from "./pages/QuestionTypes";
import SubjectPage from "./pages/SubjectPage";
import SubjectQuestionsPage from "./pages/SubjectQuestionsPage";
import QuestionForm from "./pages/QuestionForm";
import ApiTestPage from "./api/ApiTestPage";

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
            <Route path="/api-test" element={<ApiTestPage />} />
            
            {/* Subject and Question Routes */}
            <Route path="/:examType/:subject" element={<SubjectPage />} />
            <Route path="/:examType/:subject/questions" element={<SubjectQuestionsPage />} />
            <Route path="/:examType/:subject/questions/add/:section" element={<QuestionForm />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
