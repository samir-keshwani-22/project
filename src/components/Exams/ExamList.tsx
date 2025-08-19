import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    if (!window.confirm(t('examList.deleteConfirm'))) {
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
          <h1 className="text-2xl font-bold text-gray-900">{t('examList.title')}</h1>
          <p className="text-gray-600">{t('examList.subtitle')}</p>
        </div>
        <Button onClick={onCreateExam} className="w-full sm:w-auto">
          <Plus size={20} className="mr-2 rtl:ml-2 rtl:mr-0" />
          {t('examList.createExam')}
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('examList.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button type="submit">
            {t('examList.search')}
          </Button>
        </form>
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            {t('examList.loading')}
          </div>
        ) : exams.items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('examList.noExams')}</h3>
            <p>{t('examList.getStarted')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('examList.table.title')}
                    </th>
                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('examList.table.startDate')}
                    </th>
                    <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('examList.table.endDate')}
                    </th>
                    <th className="px-6 py-3 text-right rtl:text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('examList.table.actions')}
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
                      <td className="px-6 py-4 whitespace-nowrap text-right rtl:text-left text-sm font-medium">
                        <div className="flex justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => onEditExam(exam)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('common.edit')}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(exam.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('common.delete')}
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
                  {t('examList.pagination.showing')} {((currentPage - 1) * exams.pageSize) + 1} {t('examList.pagination.to')}{' '}
                  {Math.min(currentPage * exams.pageSize, exams.totalCount)} {t('examList.pagination.of')}{' '}
                  {exams.totalCount} {t('examList.pagination.results')}
                </div>
                <div className="flex space-x-1 rtl:space-x-reverse">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadExams(currentPage - 1, searchTerm || undefined)}
                    disabled={currentPage === 1}
                  >
                    {t('examList.pagination.previous')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadExams(currentPage + 1, searchTerm || undefined)}
                    disabled={currentPage === exams.totalPages}
                  >
                    {t('examList.pagination.next')}
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