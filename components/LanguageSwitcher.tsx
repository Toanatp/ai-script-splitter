
import React, { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import type { Language } from '../contexts/I18nContext';
import GlobeIcon from './icons/GlobeIcon';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string }[] = [
    { code: 'vi', name: t('lang_vi') },
    { code: 'en', name: t('lang_en') },
    { code: 'zh', name: t('lang_zh') },
    { code: 'ja', name: t('lang_ja') },
    { code: 'ko', name: t('lang_ko') },
  ];

  const handleSelectLanguage = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguageName = languages.find(l => l.code === language)?.name || 'Language';

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <GlobeIcon className="w-5 h-5 mr-2" />
          {currentLanguageName}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {languages.map((lang) => (
              <a
                key={lang.code}
                href="#"
                className={`block px-4 py-2 text-sm ${language === lang.code ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectLanguage(lang.code);
                }}
              >
                {lang.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
