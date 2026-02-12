import React, { useState, useCallback, useEffect, useRef } from 'react';
import Desktop from './components/Desktop';
import WindowManager from './components/WindowManager';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import BrainView from './components/BrainView';
import BrowserApp from './components/apps/BrowserApp';
import GamesApp from './components/apps/GamesApp';
import FileExplorerApp from './components/apps/FileExplorerApp';
import MyAppsApp from './components/apps/MyAppsApp';
import CalculatorApp from './components/apps/CalculatorApp';
import TodosApp from './components/apps/TodosApp';
import CurrencyConverterApp from './components/apps/CurrencyConverterApp';
import WorldClockApp from './components/apps/WorldClockApp';
import WeatherApp from './components/apps/WeatherApp';
import CameraApp from './components/apps/CameraApp';
import TVRetroApp from './components/apps/TVRetroApp';
import PortfolioPage from './components/PortfolioPage';
import { FOLDER_IDS, getChildren } from './data/fileSystem';
import {
  AppId,
  AppConfig,
  WindowState,
  Position,
  Size,
  Task,
  Project,
  DesktopShortcut,
} from './types';

// --- App registry: defines each app's config ---
const APP_CONFIGS: Record<AppId, AppConfig> = {
  [AppId.PROJECTS]: {
    title: 'Projects',
    defaultSize: { width: 900, height: 600 },
    titleBarColor: '#f2cc8f',
    iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    iconBg: '#f2cc8f',
  },
  [AppId.TASKS]: {
    title: 'Tasks',
    defaultSize: { width: 700, height: 500 },
    titleBarColor: '#81b29a',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    iconBg: '#81b29a',
  },
  [AppId.BRAIN]: {
    title: 'Brain',
    defaultSize: { width: 700, height: 550 },
    titleBarColor: '#e07a5f',
    iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.959-.46-2.59-1.177l-.547-.547z',
    iconBg: '#e07a5f',
  },
  [AppId.BROWSER]: {
    title: 'Browser',
    defaultSize: { width: 850, height: 600 },
    titleBarColor: '#fdf6e3',
    iconPath: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    iconBg: '#fdf6e3',
  },
  [AppId.GAMES]: {
    title: 'Games',
    defaultSize: { width: 500, height: 550 },
    titleBarColor: '#81b29a',
    iconPath: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#81b29a',
  },
  [AppId.MY_DOCUMENTS]: {
    title: 'My Documents',
    defaultSize: { width: 650, height: 450 },
    titleBarColor: '#f2cc8f',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    iconBg: '#f2cc8f',
  },
  [AppId.MY_PICTURES]: {
    title: 'My Pictures',
    defaultSize: { width: 650, height: 450 },
    titleBarColor: '#e07a5f',
    iconPath: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    iconBg: '#e07a5f',
  },
  [AppId.MY_MUSIC]: {
    title: 'My Music',
    defaultSize: { width: 600, height: 400 },
    titleBarColor: '#81b29a',
    iconPath: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    iconBg: '#81b29a',
  },
  [AppId.MY_COMPUTER]: {
    title: 'My Computer',
    defaultSize: { width: 650, height: 450 },
    titleBarColor: '#81b29a',
    iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconBg: '#81b29a',
  },
  [AppId.MY_VIDEOS]: {
    title: 'My Videos',
    defaultSize: { width: 650, height: 450 },
    titleBarColor: '#e07a5f',
    iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    iconBg: '#e07a5f',
  },
  [AppId.MY_RECENT_DOCS]: {
    title: 'My Recent Documents',
    defaultSize: { width: 650, height: 450 },
    titleBarColor: '#fdf6e3',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#fdf6e3',
  },
  [AppId.MY_GAMES]: {
    title: 'My Games',
    defaultSize: { width: 650, height: 450 },
    titleBarColor: '#81b29a',
    iconPath: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#81b29a',
  },
  [AppId.MY_PROJECTS]: {
    title: 'My Projects',
    defaultSize: { width: 650, height: 450 },
    titleBarColor: '#f2cc8f',
    iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    iconBg: '#f2cc8f',
  },
  [AppId.MY_APPS]: {
    title: 'My Apps',
    defaultSize: { width: 700, height: 500 },
    titleBarColor: '#f2cc8f',
    iconPath: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v12a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z',
    iconBg: '#f2cc8f',
  },
  [AppId.CALCULATOR]: {
    title: 'Calculator',
    defaultSize: { width: 400, height: 550 },
    titleBarColor: '#e07a5f',
    iconPath: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    iconBg: '#e07a5f',
  },
  [AppId.TODOS]: {
    title: 'To-dos',
    defaultSize: { width: 500, height: 550 },
    titleBarColor: '#e07a5f',
    iconPath: 'M5 13l4 4L19 7',
    iconBg: '#e07a5f',
  },
  [AppId.CURRENCY_CONVERTER]: {
    title: 'Currency Converter',
    defaultSize: { width: 450, height: 500 },
    titleBarColor: '#f2cc8f',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#f2cc8f',
  },
  [AppId.WORLD_CLOCK]: {
    title: 'World Clock',
    defaultSize: { width: 600, height: 550 },
    titleBarColor: '#81b29a',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: '#81b29a',
  },
  [AppId.WEATHER]: {
    title: 'Weather',
    defaultSize: { width: 500, height: 400 },
    titleBarColor: '#7eb8d0',
    iconPath: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    iconBg: '#7eb8d0',
  },
  [AppId.CAMERA]: {
    title: 'Life in Polaroid',
    defaultSize: { width: 600, height: 500 },
    titleBarColor: '#fdf6e3',
    iconPath: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
    iconBg: '#fdf6e3',
  },
  [AppId.TV_RETRO]: {
    title: 'Retro TV',
    defaultSize: { width: 640, height: 520 },
    titleBarColor: '#3d3024',
    iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    iconBg: '#3d3024',
  },
};

// --- Desktop shortcuts (what appears on the desktop) ---
const DESKTOP_SHORTCUTS: DesktopShortcut[] = [];

// Map shortcut AppIds to their folder IDs inside My Computer
const FOLDER_APP_MAP: Partial<Record<AppId, string>> = {
  [AppId.MY_DOCUMENTS]: FOLDER_IDS.MY_DOCUMENTS,
  [AppId.MY_PICTURES]: FOLDER_IDS.MY_PICTURES,
  [AppId.MY_MUSIC]: FOLDER_IDS.MY_MUSIC,
  [AppId.MY_VIDEOS]: FOLDER_IDS.MY_VIDEOS,
};

// --- Cascade offset for new windows ---
let windowCount = 0;
const cascadePosition = (): Position => {
  const offset = (windowCount % 6) * 30;
  windowCount++;
  return { x: 120 + offset, y: 40 + offset };
};

const App: React.FC = () => {
  // Portfolio & light-switch state
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(true);
  const [portfolioKey, setPortfolioKey] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Window state
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Clean up flash timer on unmount
  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  // Enter OS: flash + switch off portfolio
  const handleEnterOS = useCallback(() => {
    setShowFlash(true);
    flashTimerRef.current = setTimeout(() => {
      setShowFlash(false);
    }, 200);
    setIsPortfolioVisible(false);
  }, []);

  // Shut Down: return to portfolio with typewriter reset
  const handleShutDown = useCallback(() => {
    setIsPortfolioVisible(true);
    setPortfolioKey((k) => k + 1);
    setIsStartMenuOpen(false);
    setWindows([]);
  }, []);

  // App data (shared across windows)
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Budget and contract', dueDate: '04 Aug 22', completed: true },
    { id: '2', title: 'Website design', dueDate: '18 Aug 22', completed: true },
    { id: '3', title: 'Design new dashboard', dueDate: '19 Aug 2022', completed: true },
    { id: '4', title: 'Design search page', dueDate: '22 Aug 2022', completed: false },
  ]);

  const [activeProject] = useState<Project>({
    id: 'p1',
    name: 'Mobile app design',
    progress: 48,
    date: '04 Oct 2022',
    team: ['https://picsum.photos/seed/p1/32', 'https://picsum.photos/seed/p2/32', 'https://picsum.photos/seed/p3/32'],
  });

  const handleToggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      dueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // --- Window management handlers ---

  const openApp = useCallback((appId: AppId, initialFolderId?: string, videoId?: string) => {
    setIsStartMenuOpen(false);

    // Redirect folder shortcuts to My Computer with target folder
    const folderTarget = FOLDER_APP_MAP[appId];
    const resolvedAppId = folderTarget ? AppId.MY_COMPUTER : appId;
    const resolvedFolderId = folderTarget ?? initialFolderId;

    // For TV_RETRO, always open a new window (don't reuse)
    if (resolvedAppId === AppId.TV_RETRO) {
      setWindows((prev) => {
        const config = APP_CONFIGS[resolvedAppId];
        const newWindow: WindowState = {
          id: `${resolvedAppId}-${Date.now()}`,
          appId: resolvedAppId,
          title: config.title,
          position: cascadePosition(),
          size: config.defaultSize,
          zIndex: nextZIndex,
          isMinimized: false,
          isMaximized: false,
          ...(videoId ? { videoId } : {}),
        };
        return [...prev, newWindow];
      });
      setNextZIndex((z) => z + 1);
      return;
    }

    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === resolvedAppId);
      if (existing) {
        // Focus, un-minimize, and update target folder if applicable
        return prev.map((w) =>
          w.id === existing.id
            ? {
              ...w,
              isMinimized: false,
              zIndex: nextZIndex,
              ...(resolvedFolderId ? { initialFolderId: resolvedFolderId } : {}),
            }
            : w
        );
      }
      const config = APP_CONFIGS[resolvedAppId];
      const newWindow: WindowState = {
        id: `${resolvedAppId}-${Date.now()}`,
        appId: resolvedAppId,
        title: config.title,
        position: cascadePosition(),
        size: config.defaultSize,
        zIndex: nextZIndex,
        isMinimized: false,
        isMaximized: false,
        ...(resolvedFolderId ? { initialFolderId: resolvedFolderId } : {}),
      };
      return [...prev, newWindow];
    });
    setNextZIndex((z) => z + 1);
  }, [nextZIndex]);

  const openVideoApp = useCallback((videoId: string) => {
    openApp(AppId.TV_RETRO, undefined, videoId);
  }, [openApp]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            position: w.preMaximize?.position ?? w.position,
            size: w.preMaximize?.size ?? w.size,
            preMaximize: undefined,
          };
        }
        // Maximize
        return {
          ...w,
          isMaximized: true,
          preMaximize: { position: w.position, size: w.size },
        };
      })
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex((z) => z + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((id: string, position: Position) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  }, []);

  const updateWindowSize = useCallback((id: string, size: Size) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  }, []);

  const handleTaskbarWindowClick = useCallback((id: string) => {
    setWindows((prev) => {
      const win = prev.find((w) => w.id === id);
      if (!win) return prev;

      if (win.isMinimized) {
        // Restore and focus
        return prev.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
        );
      }

      // Find the highest zIndex window
      const topWindow = prev.reduce((top, w) =>
        !w.isMinimized && w.zIndex > top.zIndex ? w : top
        , prev[0]);

      if (topWindow.id === id) {
        // Already focused — minimize
        return prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w));
      }

      // Focus it
      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      );
    });
    setNextZIndex((z) => z + 1);
  }, [nextZIndex]);

  // Figure out which window is currently focused (highest z, not minimized)
  const focusedWindowId = windows
    .filter((w) => !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null;

  const updateWindowTitle = useCallback((windowId: string, title: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, title } : w))
    );
  }, []);

  // --- Render app content inside windows ---
  const renderApp = (appId: AppId, windowState: WindowState): React.ReactNode => {
    switch (appId) {
      case AppId.PROJECTS:
        return (
          <div className="p-4 md:p-6">
            <Dashboard
              activeProject={activeProject}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
            />
          </div>
        );
      case AppId.TASKS:
        return (
          <div className="p-4 md:p-6">
            <TaskManager
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
            />
          </div>
        );
      case AppId.BRAIN:
        return (
          <div className="p-4 h-full">
            <BrainView tasks={tasks} />
          </div>
        );
      case AppId.BROWSER:
        return <BrowserApp />;
      case AppId.GAMES:
        return <GamesApp />;
      case AppId.MY_APPS:
        return <MyAppsApp onOpenApp={openApp} />;
      case AppId.CALCULATOR:
        return <CalculatorApp />;
      case AppId.TODOS:
        return <TodosApp />;
      case AppId.CURRENCY_CONVERTER:
        return <CurrencyConverterApp />;
      case AppId.WORLD_CLOCK:
        return <WorldClockApp />;
      case AppId.WEATHER:
        return <WeatherApp />;
      case AppId.CAMERA:
        return <CameraApp />;
      case AppId.TV_RETRO:
        return (
          <TVRetroApp
            initialVideoId={windowState.videoId}
          />
        );
      case AppId.MY_COMPUTER:
        return (
          <FileExplorerApp
            initialFolderId={windowState.initialFolderId}
            onTitleChange={(title) => updateWindowTitle(windowState.id, title)}
            onOpenVideo={openVideoApp}
          />
        );
      case AppId.MY_RECENT_DOCS:
      case AppId.MY_GAMES:
      case AppId.MY_PROJECTS:
        return (
          <FileExplorerApp
            folderName={APP_CONFIGS[appId].title}
          />
        );
      default:
        return <div className="p-8 font-bold">App not found</div>;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative select-none">
      {/* OS Layer — always rendered underneath */}
      <div className={`absolute inset-0 os-layer${!isPortfolioVisible ? ' switched-on' : ''}`}>
        {/* Desktop layer */}
        <Desktop
          shortcuts={DESKTOP_SHORTCUTS}
          onOpenApp={openApp}
          onClickBackground={() => setIsStartMenuOpen(false)}
        />

        {/* Window layer */}
        <WindowManager
          windows={windows}
          appConfigs={APP_CONFIGS}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updateWindowPosition}
          onUpdateSize={updateWindowSize}
          renderApp={renderApp}
        />

        {/* Start menu (above taskbar) */}
        {isStartMenuOpen && (
          <StartMenu
            appConfigs={APP_CONFIGS}
            onOpenApp={openApp}
            onClose={() => setIsStartMenuOpen(false)}
            onShutDown={handleShutDown}
          />
        )}

        {/* Taskbar */}
        <Taskbar
          windows={windows}
          appConfigs={APP_CONFIGS}
          isStartMenuOpen={isStartMenuOpen}
          onToggleStartMenu={() => setIsStartMenuOpen((prev) => !prev)}
          onWindowClick={handleTaskbarWindowClick}
          focusedWindowId={focusedWindowId}
        />
      </div>

      {/* Light flash overlay */}
      <div className={`light-flash${showFlash ? ' active' : ''}`} />

      {/* Portfolio Layer — switches off to reveal OS */}
      <div
        className={`absolute inset-0 z-[10000] portfolio-layer${!isPortfolioVisible ? ' switched-off' : ''}`}
      >
        <PortfolioPage key={portfolioKey} onEnter={handleEnterOS} />
      </div>
    </div>
  );
};

export default App;
