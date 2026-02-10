import React, { useCallback, useRef, useEffect, useState } from 'react';
import { WindowState, Position, Size } from '../types';
import { playClick } from '../utils/sounds';

interface WindowProps {
  window: WindowState;
  titleBarColor: string;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, pos: Position) => void;
  onUpdateSize: (id: string, size: Size) => void;
  children: React.ReactNode;
}

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const TASKBAR_HEIGHT = 48;

const Window: React.FC<WindowProps> = ({
  window: win,
  titleBarColor,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  // Drag handlers
  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.preventDefault();
    onFocus(win.id);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: win.position.x,
      startPosY: win.position.y,
    };
  }, [win.id, win.isMaximized, win.position, onFocus]);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const maxX = globalThis.innerWidth - 100;
      const maxY = globalThis.innerHeight - TASKBAR_HEIGHT - 40;
      onUpdatePosition(win.id, {
        x: Math.max(-(win.size.width - 100), Math.min(dragRef.current.startPosX + dx, maxX)),
        y: Math.max(0, Math.min(dragRef.current.startPosY + dy, maxY)),
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, win.id, win.size.width, onUpdatePosition]);

  // Resize handlers
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus(win.id);
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: win.size.width,
      startH: win.size.height,
    };
  }, [win.id, win.isMaximized, win.size, onFocus]);

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const dx = e.clientX - resizeRef.current.startX;
      const dy = e.clientY - resizeRef.current.startY;
      onUpdateSize(win.id, {
        width: Math.max(MIN_WIDTH, resizeRef.current.startW + dx),
        height: Math.max(MIN_HEIGHT, resizeRef.current.startH + dy),
      });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, win.id, onUpdateSize]);

  if (win.isMinimized) return null;

  const displayPos = win.isMaximized ? { x: 0, y: 0 } : win.position;
  const displaySize = win.isMaximized
    ? { width: globalThis.innerWidth, height: globalThis.innerHeight - TASKBAR_HEIGHT }
    : win.size;

  return (
    <div
      className="absolute flex flex-col select-none"
      style={{
        left: displayPos.x,
        top: displayPos.y,
        width: displaySize.width,
        height: displaySize.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Window frame with neo-brutalist shadow */}
      <div
        className={`flex flex-col h-full border-[3px] border-black bg-white ${
          win.isMaximized ? '' : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
        }`}
      >
        {/* Title bar */}
        <div
          className={`flex items-center gap-2 px-3 py-2 border-b-[3px] border-black shrink-0 ${
            win.isMaximized ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ backgroundColor: titleBarColor }}
          onMouseDown={handleTitleBarMouseDown}
          onDoubleClick={() => onMaximize(win.id)}
        >
          {/* App icon dot */}
          <div
            className="w-4 h-4 border-[2px] border-black shrink-0"
            style={{ backgroundColor: titleBarColor }}
          />

          {/* Title */}
          <span className="font-heading font-black text-sm tracking-tight truncate flex-1 select-none">
            {win.title}
          </span>

          {/* Window control buttons */}
          <div className="flex gap-1.5 shrink-0" onMouseDown={(e) => e.stopPropagation()}>
            {/* Minimize */}
            <button
              onClick={() => { playClick(); onMinimize(win.id); }}
              className="w-7 h-7 border-[2px] border-black bg-white hover:bg-gray-200 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
            >
              <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                <rect width="10" height="2" fill="black" />
              </svg>
            </button>

            {/* Maximize / Restore */}
            <button
              onClick={() => { playClick(); onMaximize(win.id); }}
              className="w-7 h-7 border-[2px] border-black bg-white hover:bg-gray-200 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
            >
              {win.isMaximized ? (
                // Restore icon (two overlapping squares)
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="2" y="0" width="8" height="8" stroke="black" strokeWidth="1.5" fill="none" />
                  <rect x="0" y="2" width="8" height="8" stroke="black" strokeWidth="1.5" fill="white" />
                </svg>
              ) : (
                // Maximize icon (single square)
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0.5" y="0.5" width="9" height="9" stroke="black" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </button>

            {/* Close */}
            <button
              onClick={() => { playClick(); onClose(win.id); }}
              className="w-7 h-7 border-[2px] border-black bg-[#e07a5f] hover:bg-[#c9604a] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1L7 7M7 1L1 7" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#fdf6e3]">
          {children}
        </div>
      </div>

      {/* Resize handle (bottom-right corner) */}
      {!win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10"
          onMouseDown={handleResizeMouseDown}
        >
          {/* Diagonal grip lines */}
          <svg width="16" height="16" viewBox="0 0 16 16" className="absolute bottom-0 right-0">
            <line x1="14" y1="4" x2="4" y2="14" stroke="black" strokeWidth="1.5" />
            <line x1="14" y1="8" x2="8" y2="14" stroke="black" strokeWidth="1.5" />
            <line x1="14" y1="12" x2="12" y2="14" stroke="black" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Window;
