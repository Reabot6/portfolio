'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Play, Pause } from 'lucide-react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 8;
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const gameState = useRef({
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 4, dy: -4 },
    paddle: { x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2 },
    bricks: [] as Array<{ x: number; y: number; visible: boolean; color: string }>,
    keys: { left: false, right: false }
  });

  const initializeBricks = () => {
    const bricks = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * BRICK_WIDTH,
          y: row * BRICK_HEIGHT + 50,
          visible: true,
          color: colors[row]
        });
      }
    }
    return bricks;
  };

  const resetGame = () => {
    gameState.current = {
      ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 4, dy: -4 },
      paddle: { x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2 },
      bricks: initializeBricks(),
      keys: { left: false, right: false }
    };
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setGameRunning(false);
  };

  const updateGame = useCallback(() => {
    if (!gameRunning || gameOver || gameWon) return;

    const { ball, paddle, bricks, keys } = gameState.current;

    // Move paddle
    if (keys.left && paddle.x > 0) {
      paddle.x -= 8;
    }
    if (keys.right && paddle.x < CANVAS_WIDTH - PADDLE_WIDTH) {
      paddle.x += 8;
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x <= 0 || ball.x >= CANVAS_WIDTH - BALL_SIZE) {
      ball.dx = -ball.dx;
    }
    if (ball.y <= 0) {
      ball.dy = -ball.dy;
    }

    // Ball collision with paddle
    if (ball.y >= CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + PADDLE_WIDTH) {
      ball.dy = -ball.dy;
      // Add some angle based on where ball hits paddle
      const hitPos = (ball.x - paddle.x) / PADDLE_WIDTH;
      ball.dx = 8 * (hitPos - 0.5);
    }

    // Ball collision with bricks
    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];
      if (brick.visible &&
          ball.x < brick.x + BRICK_WIDTH &&
          ball.x + BALL_SIZE > brick.x &&
          ball.y < brick.y + BRICK_HEIGHT &&
          ball.y + BALL_SIZE > brick.y) {
        brick.visible = false;
        ball.dy = -ball.dy;
        setScore(prev => prev + 10);
        break;
      }
    }

    // Check if all bricks are destroyed
    if (bricks.every(brick => !brick.visible)) {
      setGameWon(true);
      setGameRunning(false);
    }

    // Ball falls below paddle
    if (ball.y > CANVAS_HEIGHT) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          setGameRunning(false);
        } else {
          // Reset ball position
          ball.x = CANVAS_WIDTH / 2;
          ball.y = CANVAS_HEIGHT - 50;
          ball.dx = 4;
          ball.dy = -4;
        }
        return newLives;
      });
    }
  }, [gameRunning, gameOver, gameWon]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { ball, paddle, bricks } = gameState.current;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    bricks.forEach(brick => {
      if (brick.visible) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH - 2, BRICK_HEIGHT - 2);
      }
    });

    // Draw paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gameState.current.keys.left = true;
      if (e.key === 'ArrowRight') gameState.current.keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') gameState.current.keys.left = false;
      if (e.key === 'ArrowRight') gameState.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    gameState.current.bricks = initializeBricks();
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      updateGame();
      draw();
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [updateGame, draw]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">Breakout</CardTitle>
        <div className="flex justify-center items-center space-x-4">
          <span className="text-white">Score: {score}</span>
          <span className="text-white">Lives: {lives}</span>
          <Button
            onClick={() => setGameRunning(!gameRunning)}
            disabled={gameOver || gameWon}
            className="bg-green-600 hover:bg-green-700"
          >
            {gameRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-gray-600 mx-auto block"
          />
          {(gameOver || gameWon) && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h3 className="text-white text-2xl mb-2">
                  {gameWon ? 'You Win!' : 'Game Over!'}
                </h3>
                <p className="text-white mb-4">Final Score: {score}</p>
                <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>
        <p className="text-white/70 text-sm text-center mt-4">
          Use arrow keys to move the paddle • Break all bricks to win!
        </p>
      </CardContent>
    </Card>
  );
}