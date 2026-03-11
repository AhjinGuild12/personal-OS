import React, { useState } from 'react';
import { playClick } from '../../../utils/sounds';

const LANGUAGES = ['English', '中文', '日本語', '한국어'];

const CameraApp: React.FC = () => {
  const [language, setLanguage] = useState('English');
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        {/* Camera illustration */}
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-20 h-20 text-gray-700"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Camera body */}
            <rect x="6" y="20" width="52" height="34" rx="4" stroke="currentColor" strokeWidth="3" fill="#f5f5f4" />
            {/* Lens */}
            <circle cx="32" cy="37" r="10" stroke="currentColor" strokeWidth="3" fill="white" />
            <circle cx="32" cy="37" r="6" stroke="currentColor" strokeWidth="2" fill="#e7e5e4" />
            <circle cx="32" cy="37" r="2" fill="currentColor" />
            {/* Viewfinder */}
            <rect x="22" y="14" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="2.5" fill="#f5f5f4" />
            {/* Flash */}
            <circle cx="48" cy="27" r="2.5" fill="currentColor" />
          </svg>
        </div>

        {/* Spacer */}
        <div className="h-6" />

        {/* Language selector */}
        <div className="w-full max-w-md">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              playClick();
            }}
            className="w-full px-4 py-3 border-[3px] border-black bg-white
                       font-bold text-base appearance-none cursor-pointer
                       focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       transition-shadow duration-75"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Start camera button */}
        <div className="w-full max-w-md">
          <button
            onClick={() => {
              setShowMessage(true);
              playClick();
            }}
            className="w-full px-4 py-3 border-[3px] border-black bg-white
                       font-bold text-base
                       shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       hover:bg-[#fdf6e3]
                       active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                       transition-all duration-75"
          >
            start camera
          </button>
        </div>

        {/* Message */}
        {showMessage && (
          <div className="w-full max-w-md border-[3px] border-black bg-[#fdf6e3] p-4
                         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-sm text-center">
              Camera access is not available yet.
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              This feature will be added in a future update.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraApp;
