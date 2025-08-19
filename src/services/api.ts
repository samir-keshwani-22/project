import { Exam, ExamCreate, ExamUpdate, PagedResponse } from '../types/exam';
import { Question, QuestionCreate, QuestionUpdate } from '../types/question';

const API_BASE_URL = 'https://localhost:5001/api';  

class ApiService {

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      
      const response = await fetch(url, config);


      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
      }

    
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Exam API methods
  async getExams(
    pageIndex = 1,
    pageSize = 10,
    title?: string,
    startDateFrom?: string,
    startDateTo?: string,
    endDateFrom?: string,
    endDateTo?: string,
    createdBy?: number
  ): Promise<PagedResponse<Exam>> {
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    });

    if (title) params.append('title', title);
    if (startDateFrom) params.append('startDateFrom', startDateFrom);
    if (startDateTo) params.append('startDateTo', startDateTo);
    if (endDateFrom) params.append('endDateFrom', endDateFrom);
    if (endDateTo) params.append('endDateTo', endDateTo);
    if (createdBy) params.append('createdBy', createdBy.toString());


    return this.request<PagedResponse<Exam>>(`/exams?${params}`);
  }

  async getExamById(id: number): Promise<Exam> {
    
    return this.request<Exam>(`/exams/${id}`);
  }

  async createExam(exam: ExamCreate): Promise<void> {
    return this.request<void>('/exams', {
      method: 'POST',
      body: JSON.stringify(exam),
    });
  }

  async updateExam(id: number, exam: ExamUpdate): Promise<void> {
     
    return this.request<void>(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exam),
    });
  }

  async deleteExam(id: number): Promise<void> {
    return this.request<void>(`/exams/${id}`, {
      method: 'DELETE',
    });
  }

  // Question API methods
  async getQuestions(pageIndex = 1, pageSize = 10): Promise<PagedResponse<Question>> {
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    });

    return this.request<PagedResponse<Question>>(`/questions?${params}`);
  }

  async getQuestionById(id: number): Promise<Question> {


    return this.request<Question>(`/questions/${id}`);
  }

  async createQuestion(question: QuestionCreate): Promise<void> {
    return this.request<void>('/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  }

  async updateQuestion(id: number, question: QuestionUpdate): Promise<void> {
     
    return this.request<void>(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    });
  }

  async deleteQuestion(id: number): Promise<void> {
    return this.request<void>(`/questions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();