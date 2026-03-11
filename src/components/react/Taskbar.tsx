import React, { useState, useEffect } from 'react';
import { AppId } from '../../types';
import type { AppConfig, WindowState } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { playClick } from '../../utils/sounds';

interface AquaDockItem {
  id: string;
  appId: AppId;
  label: string;
}

interface TaskbarProps {
  windows: WindowState[];
  appConfigs: Record<AppId, AppConfig>;
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onWindowClick: (id: string) => void;
  aquaDockItems: AquaDockItem[];
  onAquaDockAppClick: (appId: AppId) => void;
  onAquaWindowClick: (id: string) => void;
  focusedWindowId: string | null;
}

const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  appConfigs,
  isStartMenuOpen,
  onToggleStartMenu,
  onWindowClick,
  aquaDockItems,
  onAquaDockAppClick,
  onAquaWindowClick,
  focusedWindowId,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const { theme } = useTheme();
  const isAqua = theme.id === 'aqua';
  const tb = theme.taskbar;
  const sb = tb.startButton;
  const wt = tb.windowTab;
  const st = tb.systemTray;
  const aquaPinnedAppIds = new Set(aquaDockItems.map((item) => item.appId));
  const aquaTransientWindows = windows.filter((win) => !aquaPinnedAppIds.has(win.appId));

  const startIcon =
    sb.iconType === 'flag' ? (
      // XP-style flag
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" fill="#FF0000" />
        <rect x="9" y="1" width="6" height="6" rx="1" fill="#00A2E8" />
        <rect x="1" y="9" width="6" height="6" rx="1" fill="#22B14C" />
        <rect x="9" y="9" width="6" height="6" rx="1" fill="#FFC90E" />
      </svg>
    ) : sb.iconType === 'apple' ? (
      // Apple logo
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.2 8.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.7.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 2-1 2.7-2.1.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.7-3.3zM10 2.7c.6-.7 1-1.7.9-2.7-1 0-2 .7-2.7 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2.1-.5 2.8-1.4z" />
      </svg>
    ) : (
      // Neo grid
      <div className="w-4 h-4 border-[2px] border-current grid grid-cols-2 grid-rows-2 gap-px p-px">
        <div className="bg-current" />
        <div className="bg-current" />
        <div className="bg-current" />
        <div className="bg-current" />
      </div>
    );

  const renderDockIcon = (appId: AppId, label: string, options?: { running?: boolean; focused?: boolean; minimized?: boolean; dockId?: string; windowId?: string; kind: 'pinned' | 'transient' }) => {
    const config = appConfigs[appId];
    if (!config) return null;

    const running = options?.running ?? false;
    const focused = options?.focused ?? false;
    const minimized = options?.minimized ?? false;
    const dockId = options?.dockId ?? appId;
    const kind = options?.kind ?? 'pinned';
    const onClick = kind === 'pinned'
      ? () => { playClick(); onAquaDockAppClick(appId); }
      : () => {
        if (!options?.windowId) return;
        playClick();
        onAquaWindowClick(options.windowId);
      };

    return (
      <button
        key={dockId}
        onClick={onClick}
        className="group relative h-11 w-11 shrink-0 rounded-[12px] border transition-all duration-100"
        title={label}
        data-testid="dock-item"
        data-dock-id={dockId}
        data-dock-kind={kind}
        data-dock-label={label}
        data-app-id={appId}
        data-window-id={options?.windowId ?? ''}
        data-running={running ? 'true' : 'false'}
        data-focused={focused ? 'true' : 'false'}
        data-minimized={minimized ? 'true' : 'false'}
        style={{
          background: focused
            ? 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.78) 100%)'
            : running
              ? 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.38) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.18) 100%)',
          borderColor: focused ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.48)',
          boxShadow: focused
            ? '0 10px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.95)'
            : 'inset 0 1px 0 rgba(255,255,255,0.78)',
          opacity: minimized ? 0.78 : 1,
          transform: focused ? 'translateY(-1px)' : 'none',
        }}
      >
        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[rgba(34,34,34,0.92)] px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-100 group-hover:opacity-100">
          {label}
        </span>
        <div
          className="mx-auto mt-1.5 flex h-7 w-7 items-center justify-center rounded-[9px]"
          style={{
            backgroundColor: config.iconBg,
            border: '1px solid rgba(0,0,0,0.14)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={config.iconPath} />
          </svg>
        </div>
        {running && (
          <span
            className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            data-testid="dock-running-indicator"
            style={{
              backgroundColor: focused ? '#2563eb' : '#0f172a',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.6)',
            }}
          />
        )}
        <span className="sr-only">{label}</span>
      </button>
    );
  };

  const taskbarShell = (
    <div
      className={isAqua ? 'flex h-14 max-w-[calc(100vw-1rem)] items-center gap-1 overflow-visible px-2' : 'h-12 flex items-stretch'}
      data-testid="taskbar"
      data-theme-id={theme.id}
      style={{
        background: tb.bg,
        borderTop: isAqua ? 'none' : tb.borderTop,
        border: isAqua ? '1px solid rgba(255,255,255,0.55)' : undefined,
        borderRadius: isAqua ? '18px' : undefined,
        boxShadow: isAqua ? '0 12px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.7)' : undefined,
        backdropFilter: isAqua ? 'blur(20px)' : undefined,
        WebkitBackdropFilter: isAqua ? 'blur(20px)' : undefined,
      }}
    >
      {/* START button */}
      <button
        onClick={() => { playClick(); onToggleStartMenu(); }}
        className={`${isAqua ? 'px-4 h-10 self-center mx-1 rounded-[12px]' : 'px-5 h-full'} font-heading font-black text-sm tracking-tight flex items-center gap-2 transition-all duration-75`}
        data-testid="start-button"
        data-theme-id={theme.id}
        style={{
          background: isStartMenuOpen ? (theme.id === 'neo' ? 'black' : sb.bg) : sb.bg,
          color: isStartMenuOpen && theme.id === 'neo' ? 'white' : sb.text,
          borderRadius: sb.borderRadius,
          borderRight: theme.id === 'neo' ? '3px solid black' : 'none',
          border: isAqua ? '1px solid rgba(255,255,255,0.6)' : 'none',
          boxShadow: isAqua ? 'inset 0 1px 0 rgba(255,255,255,0.75)' : 'none',
          filter: isStartMenuOpen && theme.id !== 'neo' ? 'brightness(0.85)' : 'none',
        }}
      >
        {startIcon}
        {theme.id === 'aqua' ? 'Finder' : 'START'}
      </button>

      {isAqua ? (
        <div className="flex items-center gap-1 px-1">
          <div className="flex items-center gap-1">
            {aquaDockItems.map((dockItem) => {
              const relatedWindows = windows.filter((win) => win.appId === dockItem.appId);
              const isRunning = relatedWindows.length > 0;
              const isFocused = relatedWindows.some((win) => win.id === focusedWindowId && !win.isMinimized);
              const isMinimized = isRunning && relatedWindows.every((win) => win.isMinimized);

              return renderDockIcon(dockItem.appId, dockItem.label, {
                dockId: dockItem.id,
                focused: isFocused,
                kind: 'pinned',
                minimized: isMinimized,
                running: isRunning,
              });
            })}
          </div>

          {aquaTransientWindows.length > 0 && (
            <>
              <div className="mx-1 h-8 w-px bg-[rgba(0,0,0,0.15)]" />
              <div className="flex items-center gap-1">
                {aquaTransientWindows.map((win) => renderDockIcon(win.appId, win.title, {
                  dockId: `window-${win.id}`,
                  focused: win.id === focusedWindowId && !win.isMinimized,
                  kind: 'transient',
                  minimized: win.isMinimized,
                  running: true,
                  windowId: win.id,
                }))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-stretch gap-0.5 px-1 overflow-x-auto">
          {windows.map((win) => {
            const config = appConfigs[win.appId];
            const isFocused = win.id === focusedWindowId && !win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => { playClick(); onWindowClick(win.id); }}
                className={`px-3 my-1 text-xs font-bold truncate max-w-[180px] min-w-[100px] flex items-center gap-2 transition-all duration-75 ${
                  win.isMinimized ? 'opacity-60' : ''
                }`}
                data-testid="taskbar-tab"
                data-window-id={win.id}
                data-window-title={win.title}
                data-window-focused={isFocused ? 'true' : 'false'}
                data-window-minimized={win.isMinimized ? 'true' : 'false'}
                style={{
                  border: wt.border,
                  borderRadius: wt.borderRadius,
                  background: isFocused ? wt.activeBg : wt.inactiveBg,
                  color: isFocused ? wt.activeText : wt.inactiveText,
                  boxShadow: isFocused ? wt.activeShadow : wt.inactiveShadow,
                }}
              >
                {theme.id === 'neo' && (
                  <div
                    className="w-3 h-3 border-[1.5px] border-black shrink-0"
                    style={{ backgroundColor: config?.titleBarColor ?? '#f2cc8f' }}
                  />
                )}
                <span className="truncate">{win.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* System tray */}
      <div
        className={`${isAqua ? 'h-10 self-center flex items-center gap-2 px-3 mx-1 rounded-[12px]' : 'flex items-center gap-3 px-4'}`}
        data-testid="system-tray"
        style={{
          background: st.bg,
          borderLeft: isAqua ? 'none' : `3px solid ${st.borderColor}`,
          border: isAqua ? '1px solid rgba(255,255,255,0.45)' : undefined,
          boxShadow: isAqua ? 'inset 0 1px 0 rgba(255,255,255,0.75)' : undefined,
          ...(theme.id !== 'neo' && !isAqua ? { borderLeftWidth: '1px' } : {}),
        }}
      >
        <div className="text-right">
          <div className="text-xs font-black font-heading leading-none" style={{ color: st.textColor }}>{formattedTime}</div>
          <div className="text-[10px] font-bold leading-none mt-0.5" style={{ color: st.subTextColor }}>{formattedDate}</div>
        </div>
      </div>
    </div>
  );

  if (isAqua) {
    return (
      <div className="h-20 shrink-0 relative z-[9999]">
        <div className="absolute inset-x-0 bottom-2 flex justify-center px-2">
          {taskbarShell}
        </div>
      </div>
    );
  }

  return (
    <div className="h-12 shrink-0 z-[9999]">
      {taskbarShell}
    </div>
  );
};

export default Taskbar;
