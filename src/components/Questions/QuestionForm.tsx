import React, { useState, useEffect } from 'react';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import { Exam } from '../../types/exam';
import { apiService } from '../../services/api';
import { Button } from '../UI/Button';
import { Plus, X } from 'lucide-react';

interface QuestionFormProps {
  initialData?: Partial<QuestionCreate>;
  onSubmit: (data: QuestionCreate | QuestionUpdate) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [formData, setFormData] = useState({
    examId: initialData?.examId || 0,
    text: initialData?.text || '',
    type: initialData?.type || 'MultipleChoice' as const,
    options: initialData?.options || ['', '', '', ''],
    correctAnswer: initialData?.correctAnswer || '',
    points: initialData?.points || 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await apiService.getExams(1, 100);
      setExams(response.data);
    } catch (error) {
      console.error('Failed to load exams:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.examId) {
      newErrors.examId = 'Please select an exam';
    }

    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required';
    }

    if (formData.points <= 0) {
      newErrors.points = 'Points must be greater than 0';
    }

    if (formData.type === 'MultipleChoice') {
      const validOptions = formData.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        newErrors.options = 'At least 2 options are required for multiple choice';
      }
      if (!formData.correctAnswer.trim()) {
        newErrors.correctAnswer = 'Correct answer is required';
      }
    }

    if (formData.type === 'TrueFalse' && !formData.correctAnswer) {
      newErrors.correctAnswer = 'Correct answer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        options: formData.type === 'MultipleChoice' ? formData.options.filter(opt => opt.trim()) : undefined,
      };
      await onSubmit(submitData);
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="examId" className="block text-sm font-medium text-gray-700 mb-1">
          Exam *
        </label>
        <select
          id="examId"
          value={formData.examId}
          onChange={(e) => setFormData({ ...formData, examId: Number(e.target.value) })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.examId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value={0}>Select an exam</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
        {errors.examId && (
          <p className="mt-1 text-sm text-red-600">{errors.examId}</p>
        )}
      </div>

      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
          Question Text *
        </label>
        <textarea
          id="text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
            errors.text ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your question"
        />
        {errors.text && (
          <p className="mt-1 text-sm text-red-600">{errors.text}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Question Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ 
              ...formData, 
              type: e.target.value as any,
              options: e.target.value === 'MultipleChoice' ? ['', '', '', ''] : [],
              correctAnswer: ''
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="TrueFalse">True/False</option>
            <option value="Essay">Essay</option>
            <option value="ShortAnswer">Short Answer</option>
          </select>
        </div>

        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
            Points *
          </label>
          <input
            type="number"
            id="points"
            min="1"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.points ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.points && (
            <p className="mt-1 text-sm text-red-600">{errors.points}</p>
          )}
        </div>
      </div>

      {/* Multiple Choice Options */}
      {formData.type === 'MultipleChoice' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Answer Options *
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addOption}
            >
              <Plus size={16} className="mr-1" />
              Add Option
            </Button>
          </div>
          <div className="space-y-2">
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.options && (
            <p className="mt-1 text-sm text-red-600">{errors.options}</p>
          )}
        </div>
      )}

      {/* Correct Answer */}
      <div>
        <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
          Correct Answer *
        </label>
        {formData.type === 'TrueFalse' ? (
          <select
            id="correctAnswer"
            value={formData.correctAnswer}
            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.correctAnswer ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select answer</option>
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
        ) : formData.type === 'MultipleChoice' ? (
          <select
            id="correctAnswer"
            value={formData.correctAnswer}
            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.correctAnswer ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select correct option</option>
            {formData.options.filter(opt => opt.trim()).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id="correctAnswer"
            value={formData.correctAnswer}
            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.correctAnswer ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter the correct answer"
          />
        )}
        {errors.correctAnswer && (
          <p className="mt-1 text-sm text-red-600">{errors.correctAnswer}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {isEdit ? 'Update Question' : 'Create Question'}
        </Button>
      </div>
    </form>
  );
};