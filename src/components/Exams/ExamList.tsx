import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, Calendar } from 'lucide-react';
import { Exam, PagedResponse } from '../../types/exam';
import { apiService } from '../../services/api';
import { Button } from '../UI/Button';

interface ExamListProps {
  onCreateExam: () => void;
  onEditExam: (exam: Exam) => void;
  refresh: number;
}

export const ExamList: React.FC<ExamListProps> = ({
  onCreateExam,
  onEditExam,
  refresh
}) => {
  const [exams, setExams] = useState<PagedResponse<Exam>>({
    items: [],
    totalCount: 0,
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadExams = async (page = 1, title?: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.getExams(page, 10, title);
      setExams(response);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load exams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [refresh]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadExams(1, searchTerm || undefined);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    try {
      await apiService.deleteExam(id);
      loadExams(currentPage);
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600">Manage your exams and assessments</p>
        </div>
        <Button onClick={onCreateExam} className="w-full sm:w-auto">
          <Plus size={20} className="mr-2" />
          Create Exam
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search exams by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button type="submit">
            Search
          </Button>
        </form>
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading exams...
          </div>
        ) : exams.items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p>Get started by creating your first exam.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {exams.items.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {exam.title}
                          </div>
                          {exam.description && (
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {exam.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(exam.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(exam.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onEditExam(exam)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(exam.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {exams.totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * exams.pageSize) + 1} to{' '}
                  {Math.min(currentPage * exams.pageSize, exams.totalCount)} of{' '}
                  {exams.totalCount} results
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadExams(currentPage - 1, searchTerm || undefined)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadExams(currentPage + 1, searchTerm || undefined)}
                    disabled={currentPage === exams.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};