import { useState, useCallback, useMemo } from 'react';
import { ROOT_ID, getChildren, getFileById, getAncestorPath } from '../data/fileSystem';
import { FileItem } from '../types';

interface UseFileExplorerNavigationOptions {
  initialFolderId?: string;
}

interface UseFileExplorerNavigationReturn {
  currentFolderId: string;
  children: FileItem[];
  breadcrumbs: { id: string; name: string }[];
  canGoBack: boolean;
  canGoForward: boolean;
  canGoUp: boolean;
  navigateTo: (id: string) => void;
  goBack: () => void;
  goForward: () => void;
  goUp: () => void;
}

const useFileExplorerNavigation = (
  options: UseFileExplorerNavigationOptions = {}
): UseFileExplorerNavigationReturn => {
  const startId = options.initialFolderId ?? ROOT_ID;

  const [history, setHistory] = useState<string[]>([startId]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentFolderId = history[historyIndex];

  const children = useMemo(() => getChildren(currentFolderId), [currentFolderId]);

  const breadcrumbs = useMemo(() => {
    if (currentFolderId === ROOT_ID) {
      return [{ id: ROOT_ID, name: 'My Computer' }];
    }
    return getAncestorPath(currentFolderId);
  }, [currentFolderId]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const canGoUp = useMemo(() => {
    if (currentFolderId === ROOT_ID) return false;
    const current = getFileById(currentFolderId);
    return !!current?.parentId;
  }, [currentFolderId]);

  const navigateTo = useCallback((id: string) => {
    setHistory((prev) => {
      // Trim forward history and append new entry
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, id];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  }, [historyIndex, history.length]);

  const goUp = useCallback(() => {
    if (currentFolderId === ROOT_ID) return;
    const current = getFileById(currentFolderId);
    if (current?.parentId) {
      navigateTo(current.parentId);
    }
  }, [currentFolderId, navigateTo]);

  return {
    currentFolderId,
    children,
    breadcrumbs,
    canGoBack,
    canGoForward,
    canGoUp,
    navigateTo,
    goBack,
    goForward,
    goUp,
  };
};

export default useFileExplorerNavigation;
