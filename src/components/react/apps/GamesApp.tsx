import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playClick } from '../../../utils/sounds';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Coord = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 150;

// TODO(human): Implement getSpeed(score) — returns interval in ms.
// As the player scores higher, the snake should get faster.
// Return a number (milliseconds between ticks).
// score=0 → INITIAL_SPEED (150ms), but how fast should it get? Your call.
const getSpeed = (score: number): number => {
  return INITIAL_SPEED;
};

const GamesApp: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [snake, setSnake] = useState<Coord[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Coord>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const dirRef = useRef<Direction>('RIGHT');
  const gameRef = useRef<number | null>(null);

  const spawnFood = useCallback((currentSnake: Coord[]): Coord => {
    let pos: Coord;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const startGame = () => {
    playClick();
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(spawnFood(initialSnake));
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setScore(0);
    setGameState('playing');
  };

  const tick = useCallback(() => {
    setSnake((prev) => {
      const head = prev[0];
      const dir = dirRef.current;
      const newHead: Coord = {
        x: head.x + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0),
        y: head.y + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0),
      };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameState('gameover');
        setHighScore((hs) => Math.max(hs, score));
        return prev;
      }

      // Self collision
      if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setGameState('gameover');
        setHighScore((hs) => Math.max(hs, score));
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(spawnFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, score, spawnFood]);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameRef.current) clearInterval(gameRef.current);
      return;
    }
    gameRef.current = window.setInterval(tick, getSpeed(score));
    return () => {
      if (gameRef.current) clearInterval(gameRef.current);
    };
  }, [gameState, tick, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const cur = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (cur !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); }
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (cur !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); }
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (cur !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); }
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (cur !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); }
          e.preventDefault();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#81b29a] border-b-[3px] border-black shrink-0">
        <h2 className="font-heading font-black text-sm">SNAKE</h2>
        <div className="flex gap-4">
          <span className="text-xs font-bold">Score: {score}</span>
          <span className="text-xs font-bold">Best: {highScore}</span>
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center bg-[#fdf6e3] p-4">
        {gameState === 'menu' && (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-16 h-16 border-[3px] border-black bg-[#81b29a] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">🐍</span>
            </div>
            <h1 className="font-heading font-black text-2xl">Neo Snake</h1>
            <p className="text-sm font-bold text-gray-600 max-w-xs">
              Use arrow keys to move. Eat the food. Don't hit the walls or yourself.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 border-[3px] border-black bg-[#81b29a] font-heading font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
            >
              PLAY
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div
            className="border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
            style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
          >
            {/* Grid lines */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
                `,
                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
              }}
            />

            {/* Snake */}
            {snake.map((seg, i) => (
              <div
                key={i}
                className="absolute border-[1.5px] border-black"
                style={{
                  left: seg.x * CELL_SIZE,
                  top: seg.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: i === 0 ? '#3d5a47' : '#81b29a',
                }}
              />
            ))}

            {/* Food */}
            <div
              className="absolute border-[1.5px] border-black bg-[#e07a5f]"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 border-[3px] border-black bg-[#e07a5f] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">💀</span>
            </div>
            <h2 className="font-heading font-black text-2xl">GAME OVER</h2>
            <p className="font-bold text-lg">Score: {score}</p>
            {score >= highScore && score > 0 && (
              <p className="text-xs font-bold text-[#81b29a]">NEW HIGH SCORE!</p>
            )}
            <button
              onClick={startGame}
              className="px-8 py-3 border-[3px] border-black bg-[#f2cc8f] font-heading font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-75"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      {gameState === 'playing' && (
        <div className="flex justify-center gap-1 py-2 bg-white border-t-[3px] border-black shrink-0">
          {['↑', '↓', '←', '→'].map((arrow) => (
            <div
              key={arrow}
              className="w-7 h-7 border-[2px] border-black flex items-center justify-center text-xs font-black bg-[#fdf6e3]"
            >
              {arrow}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesApp;
