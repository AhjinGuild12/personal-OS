import React from 'react';
import Window from './Window';
import { WindowState, Position, Size, AppId, AppConfig } from '../types';

interface WindowManagerProps {
  windows: WindowState[];
  appConfigs: Record<AppId, AppConfig>;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, pos: Position) => void;
  onUpdateSize: (id: string, size: Size) => void;
  renderApp: (appId: AppId) => React.ReactNode;
}

const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  appConfigs,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
  renderApp,
}) => {
  return (
    <>
      {windows
        .filter((w) => !w.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((win) => (
          <Window
            key={win.id}
            window={win}
            titleBarColor={appConfigs[win.appId]?.titleBarColor ?? '#f2cc8f'}
            onClose={onClose}
            onMinimize={onMinimize}
            onMaximize={onMaximize}
            onFocus={onFocus}
            onUpdatePosition={onUpdatePosition}
            onUpdateSize={onUpdateSize}
          >
            {renderApp(win.appId)}
          </Window>
        ))}
    </>
  );
};

export default WindowManager;
