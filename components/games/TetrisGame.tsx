'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw } from 'lucide-react';

type Theme = {
  background: string;
  player: (x: number, y: number) => JSX.Element;
  obstacle: (x: number, y: number) => JSX.Element;
};

const THEMES: Theme[] = [
  {
    // Matrix + Pixel Dino theme
    background: 'bg-gradient-to-br from-black to-gray-900',
    player: () => (
      <div className="w-6 h-6 bg-green-500 rounded-sm" />
    ),
    obstacle: () => (
      <div className="w-4 h-8 bg-green-700 rounded-sm" />
    )
  },
  {
    // Minimal / Emoji style
    background: 'bg-neutral-950',
    player: () => (
      <span className="text-3xl select-none">🦖</span>
    ),
    obstacle: () => (
      <div className="w-4 h-8 bg-neutral-400 rounded-sm" />
    )
  },
  {
    // Matrix Glyph (ASCII blocks)
    background: 'bg-black',
    player: () => <span className="text-green-400 text-2xl">█</span>,
    obstacle: () => <span className="text-green-600 text-2xl">▐</span>
  }
];

const GRAVITY = 0.3;

export default function TetrisGame() {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const [themeIndex, setThemeIndex] = useState(0);

  const playerY = useRef(0);
  const velocity = useRef(0);
  const obstacles = useRef<{ x: number }[]>([]);
  const speed = useRef(4);
  const lastTime = useRef(0);
  const lastThemeSwitch = useRef(0);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setRunning(false);
    playerY.current = 0;
    velocity.current = 0;
    obstacles.current = [];
    speed.current = 4;
    lastThemeSwitch.current = 0;
    setThemeIndex(0);
  };

  // Jump handler
  const jump = () => {
    if (gameOver || !running) return;
    velocity.current = -6;
  };

  // Key / Click controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [running, gameOver]);

  // Game loop
  useEffect(() => {
    let animationId: number;
    const loop = (time: number) => {
      if (!running || gameOver) return;

      const delta = (time - lastTime.current) / 1000;
      lastTime.current = time;

      // Theme switching
      if (time - lastThemeSwitch.current > 15000) {
        setThemeIndex(i => (i + 1) % THEMES.length);
        lastThemeSwitch.current = time;
      }

      // Player physics
      velocity.current += GRAVITY;
      playerY.current += velocity.current * delta * 60;
      if (playerY.current > 0) playerY.current = 0;

      // Obstacle logic
      if (Math.random() < 0.015) {
        obstacles.current.push({ x: 100 });
      }
      obstacles.current = obstacles.current.map(o => ({ x: o.x - speed.current }));
      obstacles.current = obstacles.current.filter(o => o.x > -10);

      // Collision
      const hit = obstacles.current.some(o => o.x < 8 && o.x > 0 && playerY.current >= -4);
      if (hit) {
        setGameOver(true);
        setRunning(false);
      }

      // Score & speed
      setScore(s => s + Math.floor(delta * 100));
      speed.current += delta * 0.05;

      animationId = requestAnimationFrame(loop);
    };

    if (running) {
      lastTime.current = performance.now();
      animationId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationId);
  }, [running, gameOver]);

  const activeTheme = THEMES[themeIndex];

  return (
    <Card className={`w-full max-w-2xl mx-auto ${activeTheme.background} border-white/20`}>
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">Dino Runner</CardTitle>
        <div className="flex justify-center items-center space-x-4">
          <span className="text-white">Score: {score}</span>
          <Button
            onClick={() => setRunning(r => !r)}
            disabled={gameOver}
            className="bg-green-600 hover:bg-green-700"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent onClick={jump}>
        <div className="relative h-64 overflow-hidden rounded-lg border border-white/20 flex items-end justify-start px-4">
          {/* Player */}
          <div style={{ transform: `translateY(${playerY.current}px)` }}>
            {activeTheme.player(0, 0)}
          </div>

          {/* Obstacles */}
          {obstacles.current.map((obs, idx) => (
            <div
              key={idx}
              style={{ transform: `translateX(${obs.x}px)` }}
              className="absolute bottom-0"
            >
              {activeTheme.obstacle(0, 0)}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h3 className="text-white text-2xl mb-2">Game Over!</h3>
              <p className="text-white mb-3">Final Score: {score}</p>
              <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                Play Again
              </Button>
            </div>
          </div>
        )}

        <p className="text-center text-white/70 text-sm mt-4">
          Space/ArrowUp or Click to jump — survive as long as possible
        </p>
      </CardContent>
    </Card>
  );
}
