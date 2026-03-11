import React, { useState } from 'react';
import { AppId } from '../../types';
import type { AppConfig } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeId } from '../../types/theme';
import { playClick } from '../../utils/sounds';

interface StartMenuProps {
  appConfigs: Record<AppId, AppConfig>;
  onOpenApp: (appId: AppId, initialFolderId?: string) => void;
  onClose: () => void;
  onShutDown: () => void;
}

// Left column: programs (existing apps)
const PROGRAM_ITEMS: AppId[] = [
  AppId.PROJECTS,
  AppId.TASKS,
  AppId.BRAIN,
  AppId.BROWSER,
  AppId.GAMES,
];

// Right column: system places (only top-level — folders live inside My Computer now)
const PLACES_ITEMS: { appId: AppId; label: string; iconPath: string; iconBg: string }[] = [
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

const THEME_OPTIONS: { id: ThemeId; label: string; dot: string }[] = [
  { id: 'neo', label: 'Neo OS', dot: '#fdf6e3' },
  { id: 'xp', label: 'Windows XP', dot: '#3168d5' },
  { id: 'aqua', label: 'Mac OS X', dot: '#5ac8fa' },
];

const StartMenu: React.FC<StartMenuProps> = ({ appConfigs, onOpenApp, onClose, onShutDown }) => {
  const { themeId, theme, setTheme } = useTheme();
  const isAqua = themeId === 'aqua';
  const [showThemePicker, setShowThemePicker] = useState(false);
  const sm = theme.startMenu;
  const myComputerConfig = appConfigs[AppId.MY_COMPUTER];

  const osLabel =
    themeId === 'xp' ? 'Windows XP' :
    themeId === 'aqua' ? 'Mac OS X' :
    'NEO OS';

  const renderIconTile = (iconPath: string, backgroundColor: string, sizeClassName = 'w-8 h-8', iconClassName = 'w-4 h-4') => (
    <div
      className={`${sizeClassName} flex items-center justify-center shrink-0`}
      style={{
        backgroundColor,
        border: sm.iconBorder,
        boxShadow: sm.iconShadow,
        borderRadius: sm.iconRadius,
      }}
    >
      <svg className={iconClassName} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
    </div>
  );

  if (isAqua) {
    return (
      <>
        <div className="absolute inset-0 z-[9998]" onClick={onClose} />

        <div
          className="absolute bottom-0 left-1/2 z-[9999] w-[320px] max-w-[calc(100vw-1rem)] -translate-x-1/2"
          data-testid="start-menu"
          data-theme-id={themeId}
          style={{
            background: sm.bg,
            border: sm.border,
            boxShadow: sm.shadow,
            borderRadius: sm.borderRadius,
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: sm.headerBg,
              borderBottom: `1px solid ${sm.dividerColor}`,
              borderRadius: `${parseInt(sm.borderRadius, 10) - 2}px ${parseInt(sm.borderRadius, 10) - 2}px 0 0`,
            }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0"
              style={{
                border: sm.iconBorder,
                boxShadow: sm.iconShadow,
                borderRadius: sm.iconRadius,
                backgroundColor: '#e8e8e8',
              }}
            >
              <span className="font-heading font-black text-sm" style={{ color: sm.headerTextColor }}>JM</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-black text-sm tracking-tight leading-tight" style={{ color: sm.headerTextColor }}>Finder</h2>
              <p className="text-[10px] font-bold opacity-70" style={{ color: sm.headerTextColor }}>System & navigation</p>
            </div>
          </div>

          <div className="px-3 py-2">
            <span className="px-1 text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: sm.sectionLabelColor }}>System</span>

            <div className="mt-2 flex flex-col gap-1">
              <button
                onClick={() => { playClick(); onOpenApp(AppId.MY_COMPUTER); onClose(); }}
                className="w-full rounded-[8px] px-3 py-2 flex items-center gap-3 text-left transition-colors duration-75"
                data-testid="start-place-my-computer"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sm.programsHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {renderIconTile(myComputerConfig.iconPath, myComputerConfig.iconBg)}
                <span className="font-bold text-sm">My Computer</span>
              </button>

              <button
                onClick={() => { playClick(); setShowThemePicker((prev) => !prev); }}
                className="w-full rounded-[8px] px-3 py-2 flex items-center gap-3 text-left transition-colors duration-75"
                data-testid="change-theme-button"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sm.programsHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {renderIconTile('M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', '#c4b5fd')}
                <span className="font-bold text-sm flex-1">Change Theme</span>
                <svg className={`w-3 h-3 transition-transform ${showThemePicker ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {showThemePicker && (
                <div
                  className="mx-2 overflow-hidden rounded-[8px]"
                  style={{ border: sm.iconBorder, background: sm.programsBg }}
                >
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { playClick(); setTheme(opt.id); }}
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-left transition-colors duration-75"
                      data-testid={`theme-option-${opt.id}`}
                      data-selected={themeId === opt.id ? 'true' : 'false'}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sm.programsHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: opt.dot, border: '2px solid rgba(0,0,0,0.2)' }}
                      />
                      <span className="font-bold text-xs flex-1">{opt.label}</span>
                      {themeId === opt.id && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="flex items-center justify-between gap-3 px-3 py-2"
            style={{ borderTop: `1px solid ${sm.dividerColor}`, background: sm.footerBg }}
          >
            <button
              onClick={() => { playClick(); onShutDown(); }}
              className="flex items-center gap-2 rounded-[8px] px-3 py-1.5 transition-colors duration-75"
              data-testid="start-shutdown"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(224,122,95,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {renderIconTile('M5.636 5.636a9 9 0 1012.728 0M12 3v9', '#e07a5f', 'w-6 h-6', 'w-3 h-3')}
              <span className="text-xs font-black">Shut Down</span>
            </button>
            <span className="text-[9px] font-bold" style={{ color: sm.sectionLabelColor }}>{osLabel}</span>
            <span className="sr-only" data-testid="start-menu-os-label">{osLabel}</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 z-[9998]" onClick={onClose} />

      {/* Menu */}
      <div
        className={`absolute bottom-0 z-[9999] w-[420px] max-w-[calc(100vw-1rem)] ${isAqua ? 'left-1/2 -translate-x-1/2' : 'left-0'}`}
        data-testid="start-menu"
        data-theme-id={themeId}
        style={{
          background: sm.bg,
          border: sm.border,
          boxShadow: sm.shadow,
          borderRadius: sm.borderRadius,
        }}
      >
        {/* User Header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: sm.headerBg,
            borderBottom: sm.footerBorder,
            borderRadius: sm.borderRadius !== '0' ? `${parseInt(sm.borderRadius) - 2}px ${parseInt(sm.borderRadius) - 2}px 0 0` : '0',
          }}
        >
          <div
            className="w-11 h-11 flex items-center justify-center shrink-0"
            style={{
              border: sm.iconBorder,
              boxShadow: sm.iconShadow,
              borderRadius: sm.iconRadius,
              backgroundColor: themeId === 'neo' ? '#f2cc8f' : themeId === 'xp' ? '#d3e5fa' : '#e8e8e8',
            }}
          >
            <span className="font-heading font-black text-sm" style={{ color: sm.headerTextColor }}>JM</span>
          </div>
          <div>
            <h2 className="font-heading font-black text-sm tracking-tight leading-tight" style={{ color: sm.headerTextColor }}>Jan M</h2>
            <p className="text-[10px] font-bold opacity-70" style={{ color: sm.headerTextColor }}>Personal OS v2.0</p>
          </div>
        </div>

        {/* Two-Column Body */}
        <div className="flex">
          {/* Left Column — Programs */}
          <div className="flex-1" style={{ borderRight: `2px solid ${sm.dividerColor}`, background: sm.programsBg }}>
            <div className="px-3 py-1.5" style={{ borderBottom: `1px solid ${sm.dividerColor}` }}>
              <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: sm.sectionLabelColor }}>Programs</span>
            </div>
            <div className="py-0.5">
              {PROGRAM_ITEMS.map((appId) => {
                const config = appConfigs[appId];
                if (!config) return null;
                return (
                  <button
                    key={appId}
                    onClick={() => { playClick(); onOpenApp(appId); onClose(); }}
                    className="w-full px-3 py-2 flex items-center gap-3 active:bg-black active:text-white transition-colors duration-75 group"
                    data-testid={`start-program-${appId}`}
                    style={{ ['--hover-bg' as string]: sm.programsHover }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sm.programsHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center group-active:shadow-none group-active:translate-x-[1px] group-active:translate-y-[1px] shrink-0"
                      style={{
                        backgroundColor: config.iconBg,
                        border: sm.iconBorder,
                        boxShadow: sm.iconShadow,
                        borderRadius: sm.iconRadius,
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={config.iconPath} />
                      </svg>
                    </div>
                    <span className="font-bold text-sm">{config.title}</span>
                  </button>
                );
              })}

              {/* Change Theme button */}
              <button
                onClick={() => { playClick(); setShowThemePicker((p) => !p); }}
                className="w-full px-3 py-2 flex items-center gap-3 active:bg-black active:text-white transition-colors duration-75 group"
                data-testid="change-theme-button"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sm.programsHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center group-active:shadow-none group-active:translate-x-[1px] group-active:translate-y-[1px] shrink-0"
                  style={{
                    backgroundColor: '#c4b5fd',
                    border: sm.iconBorder,
                    boxShadow: sm.iconShadow,
                    borderRadius: sm.iconRadius,
                  }}
                >
                  {/* Palette icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <span className="font-bold text-sm">Change Theme</span>
                <svg className={`w-3 h-3 ml-auto transition-transform ${showThemePicker ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Theme picker submenu */}
              {showThemePicker && (
                <div className="mx-3 mb-1 overflow-hidden" style={{ border: sm.iconBorder, borderRadius: sm.iconRadius }}>
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { playClick(); setTheme(opt.id); }}
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-left transition-colors duration-75"
                      data-testid={`theme-option-${opt.id}`}
                      data-selected={themeId === opt.id ? 'true' : 'false'}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sm.programsHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: opt.dot, border: '2px solid rgba(0,0,0,0.2)' }}
                      />
                      <span className="font-bold text-xs flex-1">{opt.label}</span>
                      {themeId === opt.id && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Places */}
          <div className="flex-1" style={{ background: sm.placesBg }}>
            <div className="px-3 py-1.5" style={{ borderBottom: `1px solid ${sm.dividerColor}` }}>
              <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: sm.sectionLabelColor }}>Places</span>
            </div>
            <div className="py-0.5">
              {PLACES_ITEMS.map((item) => (
                <button
                  key={item.appId}
                  onClick={() => { playClick(); onOpenApp(item.appId); onClose(); }}
                  className="w-full px-3 py-2 flex items-center gap-3 active:bg-black active:text-white transition-colors duration-75 group"
                  data-testid={`start-place-${item.appId}`}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sm.placesHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center group-active:shadow-none group-active:translate-x-[1px] group-active:translate-y-[1px] shrink-0"
                    style={{
                      backgroundColor: item.iconBg,
                      border: sm.iconBorder,
                      boxShadow: sm.iconShadow,
                      borderRadius: sm.iconRadius,
                    }}
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

        {/* Footer — Shut Down */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderTop: sm.footerBorder, background: sm.footerBg }}
        >
          <button
            onClick={() => { playClick(); onShutDown(); }}
            className="flex items-center gap-2 px-3 py-1.5 active:bg-black active:text-white transition-colors duration-75 group"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(224,122,95,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div
              className="w-6 h-6 bg-[#e07a5f] flex items-center justify-center group-active:shadow-none shrink-0"
              style={{ border: sm.iconBorder, borderRadius: sm.iconRadius }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
            </div>
            <span className="text-xs font-black">Shut Down</span>
          </button>
          <span className="text-[9px] font-bold" style={{ color: sm.sectionLabelColor }}>{osLabel}</span>
          <span className="sr-only" data-testid="start-menu-os-label">{osLabel}</span>
        </div>
      </div>
    </>
  );
};

export default StartMenu;
