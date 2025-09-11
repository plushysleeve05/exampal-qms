import { useEffect, useState } from 'react';
import { fetchSubjects, fetchTopics, Subject, Topic, ExamType } from '../../api';

/**
 * Example component demonstrating how to use the API in a component
 */
const SubjectQuestionsAPIExample = ({ examType = 'BECE' }: { examType?: ExamType }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState({
    subjects: false,
    topics: false
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects when component mounts
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(prev => ({ ...prev, subjects: true }));
        const data = await fetchSubjects(examType);
        setSubjects(data);
        // Automatically select the first subject
        if (data.length > 0) {
          setSelectedSubject(data[0]);
        }
      } catch (err) {
        setError(`Failed to load subjects: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(prev => ({ ...prev, subjects: false }));
      }
    };

    loadSubjects();
  }, [examType]);

  // Fetch topics when selected subject changes
  useEffect(() => {
    if (!selectedSubject) return;

    const loadTopics = async () => {
      try {
        setLoading(prev => ({ ...prev, topics: true }));
        const data = await fetchTopics(examType, selectedSubject.name);
        setTopics(data);
      } catch (err) {
        setError(`Failed to load topics: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(prev => ({ ...prev, topics: false }));
      }
    };

    loadTopics();
  }, [selectedSubject, examType]);

  // Handle subject change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = parseInt(e.target.value);
    const subject = subjects.find(s => s.id === subjectId) || null;
    setSelectedSubject(subject);
  };

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Subject and Topics Example</h2>
      
      {/* Subject Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Subject:</label>
        <select
          value={selectedSubject?.id || ''}
          onChange={handleSubjectChange}
          disabled={loading.subjects}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {loading.subjects ? (
            <option>Loading subjects...</option>
          ) : (
            subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))
          )}
        </select>
      </div>
      
      {/* Topics List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Topics</h3>
        {loading.topics ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mb-2.5"></div>
          </div>
        ) : topics.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {topics.map(topic => (
              <li key={topic.id} className="text-gray-700">{topic.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No topics available for this subject.</p>
        )}
      </div>
    </div>
  );
};

export default SubjectQuestionsAPIExample;
