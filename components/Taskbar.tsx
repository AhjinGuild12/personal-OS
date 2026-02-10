import React, { useState, useEffect } from 'react';
import { WindowState, AppId, AppConfig } from '../types';
import { playClick } from '../utils/sounds';

interface TaskbarProps {
  windows: WindowState[];
  appConfigs: Record<AppId, AppConfig>;
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onWindowClick: (id: string) => void;
  focusedWindowId: string | null;
}

const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  appConfigs,
  isStartMenuOpen,
  onToggleStartMenu,
  onWindowClick,
  focusedWindowId,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-white border-t-[3px] border-black flex items-stretch z-[9999]">
      {/* START button */}
      <button
        onClick={() => { playClick(); onToggleStartMenu(); }}
        className={`px-5 h-full border-r-[3px] border-black font-heading font-black text-sm tracking-tight flex items-center gap-2 transition-all duration-75 ${
          isStartMenuOpen
            ? 'bg-black text-white'
            : 'bg-[#81b29a] hover:bg-[#6fa088] active:bg-black active:text-white'
        }`}
      >
        <div className="w-4 h-4 border-[2px] border-current grid grid-cols-2 grid-rows-2 gap-px p-px">
          <div className="bg-current" />
          <div className="bg-current" />
          <div className="bg-current" />
          <div className="bg-current" />
        </div>
        START
      </button>

      {/* Window tabs */}
      <div className="flex-1 flex items-stretch gap-0.5 px-1 overflow-x-auto">
        {windows.map((win) => {
          const config = appConfigs[win.appId];
          const isFocused = win.id === focusedWindowId && !win.isMinimized;
          return (
            <button
              key={win.id}
              onClick={() => { playClick(); onWindowClick(win.id); }}
              className={`px-3 my-1 border-[2px] border-black text-xs font-bold truncate max-w-[180px] min-w-[100px] flex items-center gap-2 transition-all duration-75 ${
                isFocused
                  ? 'bg-black text-white translate-x-0 translate-y-0 shadow-none'
                  : 'bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
              } ${win.isMinimized ? 'opacity-60' : ''}`}
            >
              <div
                className="w-3 h-3 border-[1.5px] border-black shrink-0"
                style={{ backgroundColor: config?.titleBarColor ?? '#f2cc8f' }}
              />
              <span className="truncate">{win.title}</span>
            </button>
          );
        })}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-3 px-4 border-l-[3px] border-black bg-[#fdf6e3]">
        <div className="text-right">
          <div className="text-xs font-black font-heading leading-none">{formattedTime}</div>
          <div className="text-[10px] font-bold text-gray-600 leading-none mt-0.5">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
