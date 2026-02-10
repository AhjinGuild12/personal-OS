import React, { useState } from 'react';
import { FileItem } from '../../types';
import { playClick } from '../../utils/sounds';

interface FileExplorerAppProps {
  folderName: string;
  files: FileItem[];
}

const FILE_TYPE_COLORS: Record<FileItem['type'], string> = {
  folder: '#f2cc8f',
  document: '#fdf6e3',
  image: '#e07a5f',
  audio: '#81b29a',
  video: '#e07a5f',
  app: '#81b29a',
};

const FILE_TYPE_ICONS: Record<FileItem['type'], string> = {
  folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  audio: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  app: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
};

const FileExplorerApp: React.FC<FileExplorerAppProps> = ({ folderName, files }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // TODO(human): Implement getFileExtension and add an extension badge to the grid view icons.
  // The function below extracts the extension — modify it to return just the uppercase
  // extension without the dot (e.g., "PDF", "JPG"). Then in the grid view's icon <div>,
  // add a small absolutely-positioned badge showing this extension.
  // Hint: you'll need to add `relative` to the icon's parent div className.
  const getFileExtension = (name: string): string => {
    const parts = name.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-[#fdf6e3] border-b-[2px] border-black shrink-0">
        {/* Navigation buttons */}
        <button className="w-7 h-7 border-[2px] border-black bg-white flex items-center justify-center hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all duration-75 opacity-40 cursor-default">
          <svg className="w-3.5 h-3.5" fill="none" stroke="black" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="w-7 h-7 border-[2px] border-black bg-white flex items-center justify-center hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all duration-75 opacity-40 cursor-default">
          <svg className="w-3.5 h-3.5" fill="none" stroke="black" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="w-[1px] h-5 bg-black/20 mx-1" />

        {/* View mode toggles */}
        <button
          onClick={() => { playClick(); setViewMode('grid'); }}
          className={`w-7 h-7 border-[2px] border-black flex items-center justify-center transition-all duration-75 ${
            viewMode === 'grid'
              ? 'bg-[#81b29a] shadow-none translate-x-[1px] translate-y-[1px]'
              : 'bg-white hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => { playClick(); setViewMode('list'); }}
          className={`w-7 h-7 border-[2px] border-black flex items-center justify-center transition-all duration-75 ${
            viewMode === 'list'
              ? 'bg-[#81b29a] shadow-none translate-x-[1px] translate-y-[1px]'
              : 'bg-white hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-b-[2px] border-black shrink-0">
        <div className="w-5 h-5 border-[1.5px] border-black bg-[#f2cc8f] flex items-center justify-center shrink-0">
          <svg className="w-3 h-3" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div className="flex-1 flex items-center px-2 py-1 border-[2px] border-black bg-[#fdf6e3] font-mono text-xs">
          <span className="text-gray-400 mr-1">C:\</span>
          <span className="font-bold">{folderName}</span>
        </div>
      </div>

      {/* File area */}
      <div
        className="flex-1 overflow-y-auto p-3 bg-white"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedFile(null);
        }}
      >
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-50">
            <svg className="w-12 h-12" fill="none" stroke="black" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="font-bold text-sm">This folder is empty</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-4 gap-1">
            {files.map((file) => (
              <button
                key={file.id}
                onClick={(e) => {
                  playClick();
                  e.stopPropagation();
                  setSelectedFile(file.id === selectedFile ? null : file.id);
                }}
                onDoubleClick={(e) => e.stopPropagation()}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-none transition-all duration-75 ${
                  selectedFile === file.id
                    ? 'bg-[#81b29a]/30 border-[2px] border-black'
                    : 'border-[2px] border-transparent hover:bg-[#fdf6e3]'
                }`}
              >
                <div
                  className="w-10 h-10 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: FILE_TYPE_COLORS[file.type] }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="black" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={FILE_TYPE_ICONS[file.type]} />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-center leading-tight w-full truncate">
                  {file.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="border-[2px] border-black">
            {/* List header */}
            <div className="flex items-center bg-[#fdf6e3] border-b-[2px] border-black px-2 py-1">
              <span className="flex-1 text-[10px] font-black uppercase tracking-wider">Name</span>
              <span className="w-20 text-[10px] font-black uppercase tracking-wider text-right">Size</span>
              <span className="w-24 text-[10px] font-black uppercase tracking-wider text-right">Modified</span>
            </div>
            {files.map((file, i) => (
              <button
                key={file.id}
                onClick={(e) => {
                  playClick();
                  e.stopPropagation();
                  setSelectedFile(file.id === selectedFile ? null : file.id);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 transition-all duration-75 ${
                  i < files.length - 1 ? 'border-b border-black/10' : ''
                } ${
                  selectedFile === file.id
                    ? 'bg-[#81b29a]/30'
                    : 'hover:bg-[#fdf6e3]'
                }`}
              >
                <div
                  className="w-5 h-5 border-[1.5px] border-black flex items-center justify-center shrink-0"
                  style={{ backgroundColor: FILE_TYPE_COLORS[file.type] }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={FILE_TYPE_ICONS[file.type]} />
                  </svg>
                </div>
                <span className="flex-1 text-xs font-bold text-left truncate">{file.name}</span>
                <span className="w-20 text-[11px] text-gray-500 font-bold text-right">{file.size || '—'}</span>
                <span className="w-24 text-[11px] text-gray-500 font-bold text-right">{file.modifiedDate || '—'}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#fdf6e3] border-t-[2px] border-black shrink-0">
        <span className="text-[11px] font-bold text-gray-600">
          {files.length} item{files.length !== 1 ? 's' : ''}
        </span>
        {selectedFile && (
          <span className="text-[11px] font-bold text-gray-600">
            {files.find((f) => f.id === selectedFile)?.name}
            {' — '}
            {files.find((f) => f.id === selectedFile)?.size || 'unknown size'}
          </span>
        )}
      </div>
    </div>
  );
};

export default FileExplorerApp;
