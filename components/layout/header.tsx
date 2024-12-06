"use client";

import React from 'react';
import { Globe } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

const Header = () => {
  const { locale, setLocale } = useLocale();

  const toggleLocale = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="flex justify-between items-center w-full px-4">
      <div className="flex items-center space-x-2">
      </div>
      <div className="ml-4 flex-1">
        <div className="max-w-2xl">
          <div className="flex items-center h-8 px-3 bg-gray-100 rounded-lg text-sm text-gray-600">
            TODO
          </div>
        </div>
      </div>
      <button
        onClick={toggleLocale}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
      >
        <Globe className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Header;
