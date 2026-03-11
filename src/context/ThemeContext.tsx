import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeId, ThemeDefinition } from '../types/theme';
import { THEMES } from '../data/themes';

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeDefinition;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>('xp');

  useEffect(() => {
    document.body.dataset.osThemeId = themeId;
    return () => {
      delete document.body.dataset.osThemeId;
    };
  }, [themeId]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId,
      theme: THEMES[themeId],
      setTheme: setThemeId,
    }),
    [themeId],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
