'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // useRef so speed & lastTime persist across renders
  const speed = useRef(4); // 4 moves/sec
  const lastTime = useRef(0);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setRunning(false);
    speed.current = 4;
    lastTime.current = 0;
  }, []);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setRunning(false);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        setRunning(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
        speed.current += 0.25; // Small speed bump
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood]);

  // Direction handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!running) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction, running]);

  // Game loop using requestAnimationFrame
  useEffect(() => {
    let animationId: number;

    const loop = (time: number) => {
      if (!running || gameOver) return;

      const delta = (time - lastTime.current) / 1000;
      if (delta >= 1 / speed.current) {
        moveSnake();
        lastTime.current = time;
      }

      animationId = requestAnimationFrame(loop);
    };

    if (running) {
      animationId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationId);
  }, [running, gameOver, moveSnake]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">Snake Game</CardTitle>

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

      <CardContent>
        <div className="relative bg-black/50 rounded-lg p-4">
          <div
            className="grid mx-auto"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: 400,
              height: 400,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);

              const isHead = snake[0].x === x && snake[0].y === y;
              const isSnake = snake.some(seg => seg.x === x && seg.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={i}
                  className={`border border-gray-800 ${
                    isHead
                      ? 'bg-green-400'
                      : isSnake
                      ? 'bg-green-600'
                      : isFood
                      ? 'bg-red-500'
                      : 'bg-gray-900'
                  }`}
                />
              );
            })}
          </div>

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
              <div className="text-center">
                <h3 className="text-white text-2xl mb-2">Game Over!</h3>
                <p className="text-white mb-3">Final Score: {score}</p>

                <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-white/70 text-sm mt-4">
          Use arrow keys to control the snake
        </p>
      </CardContent>
    </Card>
  );
}
