// api/questionCountApi.ts
import { ExamType } from './types';
import { fetchFilteredQuestions, QuestionFilterParams } from './questionsApi';

// Interface for section counts
export interface SectionCounts {
  total: number;
  sectionA: number;
  sectionB: number;
}

// Interface for topic counts
export interface TopicCount {
  name: string;
  count: number;
}

// Interface for question count response
export interface QuestionCountsResponse {
  sectionCounts: SectionCounts;
  topicCounts: TopicCount[];
}

/**
 * Fetch question counts for a specific subject and exam type
 * @param examType The type of exam (BECE or WASSCE)
 * @param subject The subject name
 * @returns Promise with question counts by section and topic
 */
export const fetchQuestionCounts = async (
  examType: ExamType,
  subject: string
): Promise<QuestionCountsResponse> => {
  try {
    // Base filter parameters for this subject
    const baseParams: QuestionFilterParams = {
      examtype: examType,
      subject: subject,
      // Set a high limit to get as many questions as possible in one request
      limit: 1000
    };

    // Fetch all questions for this subject
    const allQuestionsResponse = await fetchFilteredQuestions(baseParams);
    
    // Initialize counts
    let totalQuestions = 0;
    let sectionAQuestions = 0;
    let sectionBQuestions = 0;
    const topicCounts = new Map<string, number>();

    // Process all questions to count by section and topic
    allQuestionsResponse.questions.forEach(question => {
      totalQuestions++;
      
      // Count by section
      if (question.examSection.toLowerCase().includes('section a')) {
        sectionAQuestions++;
      } else if (question.examSection.toLowerCase().includes('section b')) {
        sectionBQuestions++;
      }
      
      // Count by topic
      const topic = question.topic;
      const currentCount = topicCounts.get(topic) || 0;
      topicCounts.set(topic, currentCount + 1);
    });

    // Create topic count array and sort by count (descending)
    const topicCountsArray: TopicCount[] = Array.from(topicCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      sectionCounts: {
        total: totalQuestions,
        sectionA: sectionAQuestions,
        sectionB: sectionBQuestions
      },
      topicCounts: topicCountsArray
    };
  } catch (error) {
    console.error('Error fetching question counts:', error);
    throw error;
  }
};