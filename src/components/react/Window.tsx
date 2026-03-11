import React, { useCallback, useRef, useEffect, useState } from 'react';
import type { Position, Size, WindowState } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { NeoControls, XPControls, TrafficLightControls } from './WindowControls';
import { playClick } from '../../utils/sounds';

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
  const { theme } = useTheme();
  const taskbarHeight = theme.id === 'aqua' ? 80 : 48;

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
      const maxY = globalThis.innerHeight - taskbarHeight - 40;
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
  }, [isDragging, onUpdatePosition, taskbarHeight, win.id, win.size.width]);

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

  const wt = theme.window;
  const cb = wt.controlButtons;

  if (win.isMinimized) return null;

  const displayPos = win.isMaximized ? { x: 0, y: 0 } : win.position;
  const displaySize = win.isMaximized
    ? { width: globalThis.innerWidth, height: globalThis.innerHeight - taskbarHeight }
    : win.size;

  const resolvedTitleBg =
    wt.titleBarMode === 'per-app' ? titleBarColor : wt.titleBarBg;

  const controlProps = {
    windowId: win.id,
    isMaximized: win.isMaximized,
    onClose,
    onMinimize,
    onMaximize,
  };

  const controls =
    cb.style === 'traffic-lights' ? <TrafficLightControls {...controlProps} /> :
    cb.style === 'xp-icons' ? <XPControls {...controlProps} /> :
    <NeoControls {...controlProps} />;

  const gripColor = theme.id === 'neo' ? 'black' : 'rgba(0,0,0,0.3)';

  return (
    <div
      className="absolute flex flex-col select-none"
      data-testid="window"
      data-window-id={win.id}
      data-window-title={win.title}
      data-theme-id={theme.id}
      data-control-style={cb.style}
      data-control-position={cb.position}
      data-title-centered={wt.titleCentered ? 'true' : 'false'}
      data-window-maximized={win.isMaximized ? 'true' : 'false'}
      style={{
        left: displayPos.x,
        top: displayPos.y,
        width: displaySize.width,
        height: displaySize.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Window frame */}
      <div
        className="flex flex-col h-full bg-white"
        style={{
          border: `${wt.borderWidth} solid ${wt.borderColor}`,
          borderRadius: win.isMaximized ? '0' : wt.borderRadius,
          boxShadow: win.isMaximized ? 'none' : wt.shadow,
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div
          className={`flex items-center gap-2 shrink-0 ${
            win.isMaximized ? 'cursor-default' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          data-testid="window-titlebar"
          style={{
            background: resolvedTitleBg,
            borderBottom: wt.titleBarBorderBottom,
            padding: wt.titleBarPadding,
            color: wt.titleBarTextColor,
            flexDirection: cb.position === 'left' ? 'row' : 'row',
          }}
          onMouseDown={handleTitleBarMouseDown}
          onDoubleClick={() => onMaximize(win.id)}
        >
          {/* Controls on left for traffic lights */}
          {cb.position === 'left' && controls}

          {/* App icon dot (Neo only) */}
          {theme.id === 'neo' && (
            <div
              className="w-4 h-4 border-[2px] border-black shrink-0"
              style={{ backgroundColor: titleBarColor }}
            />
          )}

          {/* Title */}
          <span
            className={`font-heading font-black text-sm tracking-tight truncate select-none ${
              wt.titleCentered ? 'flex-1 text-center' : 'flex-1'
            }`}
            data-testid="window-title"
            style={{
              color: wt.titleBarTextColor,
              textShadow: theme.id === 'xp' ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {win.title}
          </span>

          {/* Controls on right for neo/xp */}
          {cb.position === 'right' && controls}
        </div>

        {/* Content area */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          data-testid="window-content"
          style={{ backgroundColor: wt.contentBg }}
        >
          {children}
        </div>
      </div>

      {/* Resize handle (bottom-right corner) */}
      {!win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10"
          data-testid="window-resize-handle"
          onMouseDown={handleResizeMouseDown}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="absolute bottom-0 right-0">
            <line x1="14" y1="4" x2="4" y2="14" stroke={gripColor} strokeWidth="1.5" />
            <line x1="14" y1="8" x2="8" y2="14" stroke={gripColor} strokeWidth="1.5" />
            <line x1="14" y1="12" x2="12" y2="14" stroke={gripColor} strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Window;
