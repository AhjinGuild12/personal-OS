// === Existing data types (used by Dashboard, TaskManager, BrainView) ===

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  date: string;
  team: string[];
}

// === OS Types ===

export enum AppId {
  PROJECTS = 'projects',
  TASKS = 'tasks',
  BRAIN = 'brain',
  BROWSER = 'browser',
  GAMES = 'games',
  MY_DOCUMENTS = 'my-documents',
  MY_PICTURES = 'my-pictures',
  MY_MUSIC = 'my-music',
  MY_COMPUTER = 'my-computer',
  MY_RECENT_DOCS = 'my-recent-docs',
  MY_GAMES = 'my-games',
  MY_PROJECTS = 'my-projects',
  MY_VIDEOS = 'my-videos',
  MY_APPS = 'my-apps',
  CALCULATOR = 'calculator',
  TODOS = 'todos',
  CURRENCY_CONVERTER = 'currency-converter',
  WORLD_CLOCK = 'world-clock',
  WEATHER = 'weather',
  CAMERA = 'camera',
  TV_RETRO = 'tv-retro',
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'audio' | 'video' | 'app';
  size?: string;
  modifiedDate?: string;
  parentId?: string;
  videoId?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  position: Position;
  size: Size;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  preMaximize?: { position: Position; size: Size };
  initialFolderId?: string;
  videoId?: string;
}

export interface DesktopShortcut {
  appId: AppId;
  label: string;
  iconPath: string;
  iconBg: string;
}

export interface AppConfig {
  title: string;
  defaultSize: Size;
  titleBarColor: string;
  iconPath: string;
  iconBg: string;
}
