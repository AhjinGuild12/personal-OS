import { FileItem } from '../types';

export const ROOT_ID = 'my-computer-root';

// Folder IDs matching the AppId values for easy mapping
export const FOLDER_IDS = {
  MY_DOCUMENTS: 'folder-my-documents',
  MY_PICTURES: 'folder-my-pictures',
  MY_MUSIC: 'folder-my-music',
  MY_VIDEOS: 'folder-my-videos',
} as const;

const FILE_SYSTEM: Record<string, FileItem> = {
  // Root-level folders (children of My Computer)
  [FOLDER_IDS.MY_DOCUMENTS]: {
    id: FOLDER_IDS.MY_DOCUMENTS,
    name: 'My Documents',
    type: 'folder',
    parentId: ROOT_ID,
    modifiedDate: '01/15/2026',
  },
  [FOLDER_IDS.MY_PICTURES]: {
    id: FOLDER_IDS.MY_PICTURES,
    name: 'My Pictures',
    type: 'folder',
    parentId: ROOT_ID,
    modifiedDate: '01/20/2026',
  },
  [FOLDER_IDS.MY_MUSIC]: {
    id: FOLDER_IDS.MY_MUSIC,
    name: 'My Music',
    type: 'folder',
    parentId: ROOT_ID,
    modifiedDate: '01/18/2026',
  },
  [FOLDER_IDS.MY_VIDEOS]: {
    id: FOLDER_IDS.MY_VIDEOS,
    name: 'My Videos',
    type: 'folder',
    parentId: ROOT_ID,
    modifiedDate: '02/01/2026',
  },

  // My Documents files
  'doc-resume': {
    id: 'doc-resume',
    name: 'resume.pdf',
    type: 'document',
    size: '245 KB',
    parentId: FOLDER_IDS.MY_DOCUMENTS,
    modifiedDate: '01/10/2026',
  },
  'doc-meeting-notes': {
    id: 'doc-meeting-notes',
    name: 'meeting-notes.txt',
    type: 'document',
    size: '12 KB',
    parentId: FOLDER_IDS.MY_DOCUMENTS,
    modifiedDate: '01/14/2026',
  },
  'doc-project-proposal': {
    id: 'doc-project-proposal',
    name: 'project-proposal.docx',
    type: 'document',
    size: '890 KB',
    parentId: FOLDER_IDS.MY_DOCUMENTS,
    modifiedDate: '01/08/2026',
  },
  'doc-budget': {
    id: 'doc-budget',
    name: 'budget-2026.xlsx',
    type: 'document',
    size: '156 KB',
    parentId: FOLDER_IDS.MY_DOCUMENTS,
    modifiedDate: '01/02/2026',
  },
  'doc-readme': {
    id: 'doc-readme',
    name: 'README.md',
    type: 'document',
    size: '4 KB',
    parentId: FOLDER_IDS.MY_DOCUMENTS,
    modifiedDate: '12/28/2025',
  },

  // My Pictures files
  'pic-vacation': {
    id: 'pic-vacation',
    name: 'vacation-photo.jpg',
    type: 'image',
    size: '3.2 MB',
    parentId: FOLDER_IDS.MY_PICTURES,
    modifiedDate: '01/15/2026',
  },
  'pic-profile': {
    id: 'pic-profile',
    name: 'profile-pic.png',
    type: 'image',
    size: '1.8 MB',
    parentId: FOLDER_IDS.MY_PICTURES,
    modifiedDate: '01/12/2026',
  },
  'pic-screenshot': {
    id: 'pic-screenshot',
    name: 'screenshot-2026.png',
    type: 'image',
    size: '540 KB',
    parentId: FOLDER_IDS.MY_PICTURES,
    modifiedDate: '01/20/2026',
  },
  'pic-wallpaper': {
    id: 'pic-wallpaper',
    name: 'wallpaper.jpg',
    type: 'image',
    size: '4.1 MB',
    parentId: FOLDER_IDS.MY_PICTURES,
    modifiedDate: '12/30/2025',
  },

  // My Music files
  'music-lofi': {
    id: 'music-lofi',
    name: 'lofi-beats.mp3',
    type: 'audio',
    size: '8.4 MB',
    parentId: FOLDER_IDS.MY_MUSIC,
    modifiedDate: '01/05/2026',
  },
  'music-morning': {
    id: 'music-morning',
    name: 'morning-playlist.mp3',
    type: 'audio',
    size: '6.2 MB',
    parentId: FOLDER_IDS.MY_MUSIC,
    modifiedDate: '01/10/2026',
  },
  'music-podcast': {
    id: 'music-podcast',
    name: 'podcast-ep42.mp3',
    type: 'audio',
    size: '45 MB',
    parentId: FOLDER_IDS.MY_MUSIC,
    modifiedDate: '01/18/2026',
  },
  'music-ambient': {
    id: 'music-ambient',
    name: 'ambient-work.mp3',
    type: 'audio',
    size: '12 MB',
    parentId: FOLDER_IDS.MY_MUSIC,
    modifiedDate: '01/03/2026',
  },

  // My Videos
  'video-lofi-girl': {
    id: 'video-lofi-girl',
    name: 'Lofi Girl Radio.mp4',
    type: 'video',
    size: '∞',
    parentId: FOLDER_IDS.MY_VIDEOS,
    modifiedDate: '02/01/2026',
    videoId: 'jfKfPfyJRdk',
  },
  'video-synthwave': {
    id: 'video-synthwave',
    name: 'Synthwave Retro Mix.mp4',
    type: 'video',
    size: '∞',
    parentId: FOLDER_IDS.MY_VIDEOS,
    modifiedDate: '02/03/2026',
    videoId: '4xDzrJKXOOY',
  },
  'video-fireplace': {
    id: 'video-fireplace',
    name: 'Cozy Fireplace.mp4',
    type: 'video',
    size: '∞',
    parentId: FOLDER_IDS.MY_VIDEOS,
    modifiedDate: '01/28/2026',
    videoId: 'UgHKb_7884o',
  },
  'video-jazz': {
    id: 'video-jazz',
    name: 'Late Night Jazz.mp4',
    type: 'video',
    size: '∞',
    parentId: FOLDER_IDS.MY_VIDEOS,
    modifiedDate: '02/05/2026',
    videoId: 'neV3EPgvZ3g',
  },
};

export const getChildren = (parentId: string): FileItem[] => {
  return Object.values(FILE_SYSTEM).filter((item) => item.parentId === parentId);
};

export const getFileById = (id: string): FileItem | undefined => {
  return FILE_SYSTEM[id];
};

export const getAncestorPath = (fileId: string): { id: string; name: string }[] => {
  const path: { id: string; name: string }[] = [];
  let currentId: string | undefined = fileId;

  while (currentId && currentId !== ROOT_ID) {
    const file = FILE_SYSTEM[currentId];
    if (!file) break;
    path.unshift({ id: file.id, name: file.name });
    currentId = file.parentId;
  }

  // Always start with My Computer root
  path.unshift({ id: ROOT_ID, name: 'My Computer' });
  return path;
};
