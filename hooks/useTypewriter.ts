import { useState, useEffect, useRef, useCallback } from 'react';

interface TypewriterSection {
  id: string;
  text: string;
  speed?: number;
  pauseAfter?: number;
}

interface TypewriterState {
  displayedText: Record<string, string>;
  currentSectionIndex: number;
  isComplete: boolean;
  skipToEnd: () => void;
}

const TICK_MS = 15;

const useTypewriter = (sections: TypewriterSection[]): TypewriterState => {
  const [charCount, setCharCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skippedRef = useRef(false);

  const maxLength = sections.reduce(
    (max, s) => Math.max(max, s.text.length),
    0,
  );

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const skipToEnd = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    clearTimer();
    setCharCount(maxLength);
    setIsComplete(true);
  }, [maxLength, clearTimer]);

  // Derive displayedText from charCount
  const displayedText: Record<string, string> = {};
  for (const section of sections) {
    displayedText[section.id] = section.text.slice(0, charCount);
  }

  useEffect(() => {
    if (isComplete || skippedRef.current || sections.length === 0) return;

    if (charCount >= maxLength) {
      setIsComplete(true);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setCharCount((c) => c + 1);
    }, TICK_MS);

    return clearTimer;
  }, [charCount, maxLength, isComplete, sections.length, clearTimer]);

  return {
    displayedText,
    currentSectionIndex: sections.length - 1,
    isComplete,
    skipToEnd,
  };
};

export default useTypewriter;
