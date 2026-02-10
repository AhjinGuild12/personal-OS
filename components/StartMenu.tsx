import React from 'react';
import { AppId, AppConfig } from '../types';
import { playClick } from '../utils/sounds';

interface StartMenuProps {
  appConfigs: Record<AppId, AppConfig>;
  onOpenApp: (appId: AppId) => void;
  onClose: () => void;
}

// Left column: programs (existing apps)
const PROGRAM_ITEMS: AppId[] = [
  AppId.PROJECTS,
  AppId.TASKS,
  AppId.BRAIN,
  AppId.BROWSER,
  AppId.GAMES,
];

// Right column: system places (XP-style folders)
const PLACES_ITEMS: { appId: AppId; label: string; iconPath: string; iconBg: string }[] = [
  {
    appId: AppId.MY_DOCUMENTS,
    label: 'My Documents',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    iconBg: '#f2cc8f',
  },
  {
    appId: AppId.MY_RECENT_DOCS,
    label: 'My Recent Documents',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#fdf6e3',
  },
  {
    appId: AppId.MY_PICTURES,
    label: 'My Pictures',
    iconPath: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    iconBg: '#e07a5f',
  },
  {
    appId: AppId.MY_MUSIC,
    label: 'My Music',
    iconPath: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    iconBg: '#81b29a',
  },
  {
    appId: AppId.MY_COMPUTER,
    label: 'My Computer',
    iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconBg: '#81b29a',
  },
  {
    appId: AppId.MY_APPS,
    label: 'My Apps',
    iconPath: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z',
    iconBg: '#f2cc8f',
  },
  {
    appId: AppId.MY_GAMES,
    label: 'My Games',
    iconPath: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#81b29a',
  },
  {
    appId: AppId.MY_PROJECTS,
    label: 'My Projects',
    iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    iconBg: '#f2cc8f',
  },
];

const StartMenu: React.FC<StartMenuProps> = ({ appConfigs, onOpenApp, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />

      {/* Menu */}
      <div className="fixed bottom-12 left-0 z-[9999] w-[420px] bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* ─── User Header ─── */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#81b29a] border-b-[3px] border-black">
          <div className="w-11 h-11 border-[3px] border-black bg-[#f2cc8f] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-heading font-black text-sm">JM</span>
          </div>
          <div>
            <h2 className="font-heading font-black text-sm tracking-tight leading-tight">Jan M</h2>
            <p className="text-[10px] font-bold opacity-70">Neo Personal OS v2.0</p>
          </div>
        </div>

        {/* ─── Two-Column Body ─── */}
        <div className="flex">
          {/* Left Column — Programs */}
          <div className="flex-1 border-r-[2px] border-black bg-white">
            <div className="px-3 py-1.5 border-b-[1px] border-black/10">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">Programs</span>
            </div>
            <div className="py-0.5">
              {PROGRAM_ITEMS.map((appId) => {
                const config = appConfigs[appId];
                if (!config) return null;
                return (
                  <button
                    key={appId}
                    onClick={() => {
                      playClick();
                      onOpenApp(appId);
                      onClose();
                    }}
                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#81b29a]/15 active:bg-black active:text-white transition-colors duration-75 group"
                  >
                    <div
                      className="w-8 h-8 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-x-[1px] group-active:translate-y-[1px] shrink-0"
                      style={{ backgroundColor: config.iconBg }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={config.iconPath} />
                      </svg>
                    </div>
                    <span className="font-bold text-sm">{config.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column — Places */}
          <div className="flex-1 bg-[#fdf6e3]">
            <div className="px-3 py-1.5 border-b-[1px] border-black/10">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">Places</span>
            </div>
            <div className="py-0.5">
              {PLACES_ITEMS.map((item) => (
                <button
                  key={item.appId}
                  onClick={() => {
                    playClick();
                    onOpenApp(item.appId);
                    onClose();
                  }}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#f2cc8f]/30 active:bg-black active:text-white transition-colors duration-75 group"
                >
                  <div
                    className="w-7 h-7 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-x-[1px] group-active:translate-y-[1px] shrink-0"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
                    </svg>
                  </div>
                  <span className="font-bold text-[13px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Footer — Shut Down ─── */}
        <div className="flex items-center justify-between px-3 py-2 border-t-[3px] border-black bg-[#fdf6e3]">
          <button
            onClick={() => { playClick(); onClose(); }}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#e07a5f]/20 active:bg-black active:text-white transition-colors duration-75 group"
          >
            <div className="w-6 h-6 border-[2px] border-black bg-[#e07a5f] flex items-center justify-center group-active:shadow-none shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
            </div>
            <span className="text-xs font-black">Shut Down</span>
          </button>
          <span className="text-[9px] font-bold text-gray-400">NEO OS</span>
        </div>
      </div>
    </>
  );
};

export default StartMenu;
