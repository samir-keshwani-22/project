import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, HelpCircle } from 'lucide-react';
import { Question, PagedResponse } from '../../types/question';
import { apiService } from '../../services/api';
import { Button } from '../UI/Button';

interface QuestionListProps {
  onCreateQuestion: () => void;
  onEditQuestion: (question: Question) => void;
  refresh: number;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  onCreateQuestion,
  onEditQuestion,
  refresh
}) => {
  const [questions, setQuestions] = useState<PagedResponse<Question>>({
    data: [],
    totalCount: 0,
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadQuestions = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await apiService.getQuestions(page, 10);
      setQuestions(response);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await apiService.deleteQuestion(id);
      loadQuestions(currentPage);
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MultipleChoice':
        return 'bg-blue-100 text-blue-800';
      case 'TrueFalse':
        return 'bg-green-100 text-green-800';
      case 'Essay':
        return 'bg-purple-100 text-purple-800';
      case 'ShortAnswer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'MultipleChoice':
        return 'Multiple Choice';
      case 'TrueFalse':
        return 'True/False';
      case 'Essay':
        return 'Essay';
      case 'ShortAnswer':
        return 'Short Answer';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-600">Create and manage exam questions</p>
        </div>
        <Button onClick={onCreateQuestion} className="w-full sm:w-auto">
          <Plus size={20} className="mr-2" />
          Create Question
        </Button>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading questions...
          </div>
        ) : questions.data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p>Get started by creating your first question.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {questions.data.map((question) => (
                <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuestionTypeColor(question.type)}`}>
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {question.text}
                      </p>
                      {question.options && question.options.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <div className="font-medium mb-1">Options:</div>
                          <ul className="list-disc list-inside space-y-0.5 ml-2">
                            {question.options.map((option, index) => (
                              <li key={index} className={`${option === question.correctAnswer ? 'font-medium text-green-700' : ''}`}>
                                {option} {option === question.correctAnswer && '✓'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {question.correctAnswer && question.type !== 'MultipleChoice' && (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Correct Answer:</span> {question.correctAnswer}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => onEditQuestion(question)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {questions.totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * questions.pageSize) + 1} to{' '}
                  {Math.min(currentPage * questions.pageSize, questions.totalCount)} of{' '}
                  {questions.totalCount} results
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadQuestions(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadQuestions(currentPage + 1)}
                    disabled={currentPage === questions.totalPages}
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