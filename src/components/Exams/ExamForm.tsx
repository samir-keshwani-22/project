import React, { useState } from 'react';
import { ExamCreate, ExamUpdate } from '../../types/exam';
import { Button } from '../UI/Button';
import { useTranslation } from 'react-i18next';

interface ExamFormProps {
  initialData?: Partial<ExamCreate>;
  onSubmit: (data: ExamCreate | ExamUpdate) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export const ExamForm: React.FC<ExamFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const { t } = useTranslation();
  const formatDateTimeLocal = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: formatDateTimeLocal(initialData?.startDate),
    endDate: formatDateTimeLocal(initialData?.endDate),
    durationMinutes: initialData?.durationMinutes || 0,
    totalMarks: initialData?.totalMarks,
    createdBy: initialData?.createdBy || 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('examForm.validation.titleRequired')
    }

    if (!formData.startDate) {
      newErrors.startDate = t('examForm.validation.startRequired');
    }

    if (!formData.endDate) {
      newErrors.endDate = t('examForm.validation.endRequired');
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = t('examForm.validation.endAfterStart');
    }
    if (!formData.durationMinutes || formData.durationMinutes <= 0) {
      newErrors.durationMinutes = t('examForm.validation.durationRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          {t('examForm.title')}
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
          placeholder={t('examForm.titlePlaceholder')}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          {t('examForm.description')}
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder={t('examForm.descriptionPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            {t('examForm.startDate')}
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.startDate ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            {t('examForm.endDate')}
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.endDate ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">
            {t('examForm.duration')}
          </label>
          <input
            type="number"
            id="durationMinutes"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({ ...formData, durationMinutes: Number(e.target.value) })
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.durationMinutes ? 'border-red-300' : 'border-gray-300'
              }`}
            min={1}
            placeholder={t('examForm.durationPlaceholder')}

          />
          {errors.durationMinutes && (
            <p className="mt-1 text-sm text-red-600">{errors.durationMinutes}</p>
          )}
        </div>

        <div>
          <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-1">
            {t('examForm.totalMarks')}
          </label>
          <input
            type="number"
            id="totalMarks"
            value={formData.totalMarks ?? ''}
            onChange={(e) =>
              setFormData({ ...formData, totalMarks: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={t('examForm.totalMarksPlaceholder')}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          {t('examForm.cancel')}
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {isEdit ? t('examForm.updateExam') : t('examForm.createExam')}
        </Button>
      </div>
    </form>
  );
};