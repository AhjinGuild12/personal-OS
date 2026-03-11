import React from 'react';
import DesktopIcon from './DesktopIcon';
import { useTheme } from '../../context/ThemeContext';
import { AppId } from '../../types';
import type { DesktopShortcut } from '../../types';

interface DesktopProps {
  shortcuts: DesktopShortcut[];
  onOpenApp: (appId: AppId) => void;
  onClickBackground: () => void;
}

const Desktop: React.FC<DesktopProps> = ({ shortcuts, onOpenApp, onClickBackground }) => {
  const { theme, themeId } = useTheme();
  const dt = theme.desktop;

  return (
    <div
      className="absolute inset-0"
      data-testid="desktop"
      data-theme-id={themeId}
      style={{
        backgroundColor: dt.backgroundColor,
        backgroundImage: dt.backgroundImage,
      }}
      onClick={onClickBackground}
    >
      {/* Subtle grid pattern overlay (Neo only) */}
      {dt.showGrid && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          data-testid="desktop-grid"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Desktop icons — left column */}
      <div
        className="absolute left-4 top-4 flex flex-col gap-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {shortcuts.map((shortcut) => (
          <DesktopIcon
            key={shortcut.appId}
            appId={shortcut.appId}
            label={shortcut.label}
            iconPath={shortcut.iconPath}
            iconBg={shortcut.iconBg}
            onOpen={onOpenApp}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;
