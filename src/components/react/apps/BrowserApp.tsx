import React, { useState } from 'react';
import { playClick } from '../../../utils/sounds';

interface Bookmark {
  title: string;
  url: string;
  color: string;
}

const BOOKMARKS: Bookmark[] = [
  { title: 'GitHub', url: 'github.com', color: '#81b29a' },
  { title: 'Stack Overflow', url: 'stackoverflow.com', color: '#f2cc8f' },
  { title: 'MDN Docs', url: 'developer.mozilla.org', color: '#e07a5f' },
  { title: 'Hacker News', url: 'news.ycombinator.com', color: '#81b29a' },
];

const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('neo://home');
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page: string, urlStr: string) => {
    setCurrentPage(page);
    setUrl(urlStr);
  };

  return (
    <div className="flex flex-col h-full">
      {/* URL bar */}
      <div className="flex items-center gap-2 p-2 bg-white border-b-[3px] border-black shrink-0">
        <button
          onClick={() => { playClick(); navigate('home', 'neo://home'); }}
          className="w-8 h-8 border-[2px] border-black bg-[#fdf6e3] flex items-center justify-center shrink-0 hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all duration-75"
        >
          <svg className="w-4 h-4" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <div className="flex-1 flex items-center px-3 py-1.5 border-[2px] border-black bg-[#fdf6e3] font-mono text-sm">
          <span className="text-gray-400 mr-1">https://</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate('page', url);
            }}
            className="flex-1 bg-transparent outline-none font-bold"
          />
        </div>
      </div>

      {/* Bookmarks bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[#fdf6e3] border-b-[2px] border-black shrink-0">
        {BOOKMARKS.map((bm) => (
          <button
            key={bm.url}
            onClick={() => { playClick(); navigate(bm.title.toLowerCase(), bm.url); }}
            className="px-2 py-0.5 text-[11px] font-bold border-[1.5px] border-black bg-white hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all duration-75"
          >
            {bm.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        {currentPage === 'home' ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <div className="w-20 h-20 border-[3px] border-black bg-[#81b29a] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-10 h-10" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h1 className="font-heading font-black text-3xl">NeoSurf</h1>
            <p className="text-gray-500 font-bold text-sm max-w-xs">
              Your brutalist gateway to the web. Click a bookmark or enter a URL above.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
              {BOOKMARKS.map((bm) => (
                <button
                  key={bm.url}
                  onClick={() => { playClick(); navigate(bm.title.toLowerCase(), bm.url); }}
                  className="p-4 border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
                >
                  <div
                    className="w-8 h-8 border-[2px] border-black mx-auto mb-2"
                    style={{ backgroundColor: bm.color }}
                  />
                  <span className="font-bold text-xs">{bm.title}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="w-16 h-16 border-[3px] border-black bg-[#f2cc8f] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-8 h-8" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="font-heading font-black text-xl">Browsing: {url}</h2>
            <p className="text-gray-500 font-bold text-sm">
              This is a simulated browser. Real navigation coming soon.
            </p>
            <button
              onClick={() => { playClick(); navigate('home', 'neo://home'); }}
              className="px-6 py-2 border-[3px] border-black bg-[#81b29a] font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserApp;
