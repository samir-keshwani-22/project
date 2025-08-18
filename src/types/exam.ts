export interface Exam {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  durationMinutes: number;
  totalMarks?: number;
  endDate: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamCreate {
  title: string;
  description?: string;
  startDate: string;
  durationMinutes: number;
  totalMarks?: number;
  endDate: string;
  createdBy: number;

}

export interface ExamUpdate {
  title?: string;
  durationMinutes?: number;
  totalMarks?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
}