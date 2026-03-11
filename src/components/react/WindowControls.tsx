import React from 'react';
import { playClick } from '../../utils/sounds';

interface ControlProps {
  windowId: string;
  isMaximized: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
}

/** Neo-brutalist square buttons — right side */
export const NeoControls: React.FC<ControlProps> = ({ windowId, isMaximized, onClose, onMinimize, onMaximize }) => (
  <div
    className="flex gap-1.5 shrink-0"
    data-testid="window-controls"
    data-control-style="neo-squares"
    onMouseDown={(e) => e.stopPropagation()}
  >
    <button
      onClick={() => { playClick(); onMinimize(windowId); }}
      className="w-7 h-7 border-[2px] border-black bg-white hover:bg-gray-200 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
      data-testid="window-control-minimize"
    >
      <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
        <rect width="10" height="2" fill="black" />
      </svg>
    </button>
    <button
      onClick={() => { playClick(); onMaximize(windowId); }}
      className="w-7 h-7 border-[2px] border-black bg-white hover:bg-gray-200 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
      data-testid="window-control-maximize"
    >
      {isMaximized ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="2" y="0" width="8" height="8" stroke="black" strokeWidth="1.5" fill="none" />
          <rect x="0" y="2" width="8" height="8" stroke="black" strokeWidth="1.5" fill="white" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="0.5" y="0.5" width="9" height="9" stroke="black" strokeWidth="1.5" fill="none" />
        </svg>
      )}
    </button>
    <button
      onClick={() => { playClick(); onClose(windowId); }}
      className="w-7 h-7 border-[2px] border-black bg-[#e07a5f] hover:bg-[#c9604a] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
      data-testid="window-control-close"
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 1L7 7M7 1L1 7" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  </div>
);

/** XP-style buttons — right side */
export const XPControls: React.FC<ControlProps> = ({ windowId, isMaximized, onClose, onMinimize, onMaximize }) => (
  <div
    className="flex gap-[2px] shrink-0"
    data-testid="window-controls"
    data-control-style="xp-icons"
    onMouseDown={(e) => e.stopPropagation()}
  >
    <button
      onClick={() => { playClick(); onMinimize(windowId); }}
      className="w-[22px] h-[22px] rounded-[3px] flex items-center justify-center transition-all duration-75"
      data-testid="window-control-minimize"
      style={{
        background: 'linear-gradient(180deg, #3d7bce 0%, #245dab 40%, #1a4c95 100%)',
        border: '1px solid rgba(0,0,0,0.35)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
      }}
    >
      <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
        <rect width="8" height="2" fill="white" />
      </svg>
    </button>
    <button
      onClick={() => { playClick(); onMaximize(windowId); }}
      className="w-[22px] h-[22px] rounded-[3px] flex items-center justify-center transition-all duration-75"
      data-testid="window-control-maximize"
      style={{
        background: 'linear-gradient(180deg, #3d7bce 0%, #245dab 40%, #1a4c95 100%)',
        border: '1px solid rgba(0,0,0,0.35)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
      }}
    >
      {isMaximized ? (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <rect x="2" y="0" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
          <rect x="0" y="2" width="6" height="6" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      ) : (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <rect x="0.5" y="0.5" width="7" height="7" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      )}
    </button>
    <button
      onClick={() => { playClick(); onClose(windowId); }}
      className="w-[22px] h-[22px] rounded-[3px] flex items-center justify-center transition-all duration-75"
      data-testid="window-control-close"
      style={{
        background: 'linear-gradient(180deg, #e08356 0%, #c94a2a 40%, #b73620 100%)',
        border: '1px solid rgba(0,0,0,0.35)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
      }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 1L7 7M7 1L1 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  </div>
);

/** macOS traffic light circles — left side */
export const TrafficLightControls: React.FC<ControlProps> = ({ windowId, onClose, onMinimize, onMaximize }) => (
  <div
    className="flex gap-2 shrink-0 items-center"
    data-testid="window-controls"
    data-control-style="traffic-lights"
    onMouseDown={(e) => e.stopPropagation()}
  >
    <button
      onClick={() => { playClick(); onClose(windowId); }}
      className="w-[13px] h-[13px] rounded-full flex items-center justify-center transition-all duration-75 group hover:brightness-110"
      data-testid="window-control-close"
      style={{
        background: 'linear-gradient(180deg, #ff6058 0%, #e04942 100%)',
        border: '1px solid rgba(0,0,0,0.15)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
      }}
    >
      <svg width="6" height="6" viewBox="0 0 6 6" fill="none" className="opacity-0 group-hover:opacity-100">
        <path d="M1 1L5 5M5 1L1 5" stroke="rgba(0,0,0,0.6)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </button>
    <button
      onClick={() => { playClick(); onMinimize(windowId); }}
      className="w-[13px] h-[13px] rounded-full flex items-center justify-center transition-all duration-75 group hover:brightness-110"
      data-testid="window-control-minimize"
      style={{
        background: 'linear-gradient(180deg, #ffbe2e 0%, #d9a020 100%)',
        border: '1px solid rgba(0,0,0,0.15)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
      }}
    >
      <svg width="7" height="2" viewBox="0 0 7 2" fill="none" className="opacity-0 group-hover:opacity-100">
        <rect y="0" width="7" height="1.5" rx="0.5" fill="rgba(0,0,0,0.6)" />
      </svg>
    </button>
    <button
      onClick={() => { playClick(); onMaximize(windowId); }}
      className="w-[13px] h-[13px] rounded-full flex items-center justify-center transition-all duration-75 group hover:brightness-110"
      data-testid="window-control-maximize"
      style={{
        background: 'linear-gradient(180deg, #2bc840 0%, #1aab30 100%)',
        border: '1px solid rgba(0,0,0,0.15)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
      }}
    >
      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" className="opacity-0 group-hover:opacity-100">
        <path d="M1 3L3.5 0.5L6 3M1 4L3.5 6.5L6 4" stroke="rgba(0,0,0,0.6)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
);
