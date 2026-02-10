import React from 'react';
import DesktopIcon from './DesktopIcon';
import { AppId, DesktopShortcut } from '../types';

interface DesktopProps {
  shortcuts: DesktopShortcut[];
  onOpenApp: (appId: AppId) => void;
  onClickBackground: () => void;
}

const Desktop: React.FC<DesktopProps> = ({ shortcuts, onOpenApp, onClickBackground }) => {
  return (
    <div
      className="absolute inset-0 bottom-12"
      style={{
        backgroundColor: '#fdf6e3',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(129,178,154,0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(242,204,143,0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(224,122,95,0.08) 0%, transparent 60%)
        `,
      }}
      onClick={onClickBackground}
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

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
