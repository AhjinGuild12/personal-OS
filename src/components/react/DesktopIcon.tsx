import React, { useState } from 'react';
import { AppId } from '../../types';
import { playClick } from '../../utils/sounds';

interface DesktopIconProps {
  appId: AppId;
  label: string;
  iconPath: string;
  iconBg: string;
  onOpen: (appId: AppId) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ appId, label, iconPath, iconBg, onOpen }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleDoubleClick = () => {
    playClick();
    onOpen(appId);
    setIsSelected(false);
  };

  return (
    <button
      className={`flex flex-col items-center gap-1.5 p-2 w-20 group outline-none ${
        isSelected ? 'bg-black/10' : ''
      }`}
      onClick={() => { playClick(); setIsSelected(true); }}
      onDoubleClick={handleDoubleClick}
      onBlur={() => setIsSelected(false)}
    >
      <div
        className="w-14 h-14 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-active:translate-x-[1px] group-active:translate-y-[1px] group-active:shadow-none transition-all duration-75"
        style={{ backgroundColor: iconBg }}
      >
        <svg className="w-7 h-7" fill="none" stroke="black" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <span className="text-xs font-bold text-black text-center leading-tight drop-shadow-[1px_1px_0px_rgba(255,255,255,0.8)]">
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;
