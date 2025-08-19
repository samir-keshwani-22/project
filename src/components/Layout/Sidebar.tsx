import React from 'react';
import { FileText, HelpCircle, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface SidebarProps {
  currentPage: 'exams' | 'questions';
  onPageChange: (page: 'exams' | 'questions') => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  isOpen,
  onToggle
}) => {
  const { t } = useTranslation();

  const navigation = [
    {
      id: 'exams' as const,
      name: t('sidebar.exams'),
      icon: FileText,
      description: t('sidebar.examsDescription')
    },
    {
      id: 'questions' as const,
      name: t('sidebar.questions'),
      icon: HelpCircle,
      description: t('sidebar.questionsDescription')
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 min-h-screen w-72 bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('sidebar.title')}</h1>
                <p className="text-sm text-gray-500">{t('sidebar.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    // Close mobile menu when item is selected
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`
                    w-full p-3 rounded-lg text-left rtl:text-right transition-all duration-200
                    flex items-center space-x-3 rtl:space-x-reverse group
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`
                      transition-colors duration-200
                      ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    `}
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${isActive ? 'text-blue-900' : ''}`}>
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Language Switcher */}
          <div className="p-4 border-t border-gray-200">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
};