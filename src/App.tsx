import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/Layout/Layout';
import { Modal } from './components/UI/Modal';
import { ExamList } from './components/Exams/ExamList';
import { ExamForm } from './components/Exams/ExamForm';
import { QuestionList } from './components/Questions/QuestionList';
import { QuestionForm } from './components/Questions/QuestionForm';
import { apiService } from './services/api';
import { Exam } from './types/exam';
import { Question } from './types/question';
import './components/i18n/index';

type ModalType = 'create-exam' | 'edit-exam' | 'create-question' | 'edit-question' | null;

function App() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState<'exams' | 'questions'>('exams');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

    
  useEffect(() => {
    const updateDocumentDirection = () => {
      document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = i18n.language;
 
      if (i18n.language === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    };

    updateDocumentDirection();
 
    i18n.on('languageChanged', updateDocumentDirection);

   
    return () => {
      i18n.off('languageChanged', updateDocumentDirection);
    };
  }, [i18n]);

  const closeModal = () => {
    setModalType(null);
    setSelectedExam(null);
    setSelectedQuestion(null);
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateExam = async (data: any) => {
    try {
      await apiService.createExam(data);
      closeModal();
      refreshData();
    } catch (error) {
      console.error('Failed to create exam:', error);
      throw error;
    }
  };

  const handleUpdateExam = async (data: any) => {
    if (!selectedExam) return;

    try {
      await apiService.updateExam(selectedExam.id, data);
      closeModal();
      refreshData();
    } catch (error) {
      console.error('Failed to update exam:', error);
      throw error;
    }
  };

  const handleCreateQuestion = async (data: any) => {
    try {
      await apiService.createQuestion(data);
      closeModal();
      refreshData();
    } catch (error) {
      console.error('Failed to create question:', error);
      throw error;
    }
  };

  const handleUpdateQuestion = async (data: any) => {
    if (!selectedQuestion) return;

    try {
      await apiService.updateQuestion(selectedQuestion.id, data);
      closeModal();
      refreshData();
    } catch (error) {
      console.error('Failed to update question:', error);
      throw error;
    }
  };

  // Translate modal titles based on current language
  const getModalTitle = () => {
    switch (modalType) {
      case 'create-exam':
        return t('modals.createExam');
      case 'edit-exam':
        return t('modals.editExam');
      case 'create-question':
        return t('modals.createQuestion');
      case 'edit-question':
        return t('modals.editQuestion');
      default:
        return '';
    }
  };

  return (
    <Layout  currentPage={currentPage} onPageChange={setCurrentPage}>
      {currentPage === 'exams' ? (
        <ExamList
          onCreateExam={() => setModalType('create-exam')}
          onEditExam={(exam) => {
            setSelectedExam(exam);
            setModalType('edit-exam');
          }}
          refresh={refreshTrigger}
        />
      ) : (
        <QuestionList
          onCreateQuestion={() => setModalType('create-question')}
          onEditQuestion={(question) => {
            setSelectedQuestion(question);
            setModalType('edit-question');
          }}
          refresh={refreshTrigger}
        />
      )}

      <Modal
        isOpen={modalType !== null}
        onClose={closeModal}
        title={getModalTitle()}
        maxWidth="2xl"
      >
        {modalType === 'create-exam' && (
          <ExamForm
            onSubmit={handleCreateExam}
            onCancel={closeModal}
          />
        )}
        {modalType === 'edit-exam' && selectedExam && (
          <ExamForm
            initialData={{
              title: selectedExam.title,
              description: selectedExam.description,
              startDate: selectedExam.startDate,
              endDate: selectedExam.endDate,
              createdBy: selectedExam.createdBy,
              durationMinutes: selectedExam.durationMinutes,
              totalMarks: selectedExam.totalMarks
            }}
            onSubmit={handleUpdateExam}
            onCancel={closeModal}
            isEdit
          />
        )}
        {modalType === 'create-question' && (
          <QuestionForm
            onSubmit={handleCreateQuestion}
            onCancel={closeModal}
          />
        )}
        {modalType === 'edit-question' && selectedQuestion && (
          <QuestionForm
            initialData={{
              examId: selectedQuestion.examId,
              text: selectedQuestion.text,
              type: selectedQuestion.type,
              options: selectedQuestion.options,
              correctAnswer: selectedQuestion.correctAnswer,
              points: selectedQuestion.points
            }}
            onSubmit={handleUpdateQuestion}
            onCancel={closeModal}
            isEdit
          />
        )}
      </Modal>
    </Layout>
  );
}

export default App;