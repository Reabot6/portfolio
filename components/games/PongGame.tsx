'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Play, Pause } from 'lucide-react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;

export function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [gameOver, setGameOver] = useState(false);

  const gameState = useRef({
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 5, dy: 3 },
    playerPaddle: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    computerPaddle: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    keys: { up: false, down: false }
  });

  const resetGame = () => {
    gameState.current = {
      ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 5, dy: 3 },
      playerPaddle: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
      computerPaddle: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
      keys: { up: false, down: false }
    };
    setScore({ player: 0, computer: 0 });
    setGameOver(false);
    setGameRunning(false);
  };

  const updateGame = useCallback(() => {
    if (!gameRunning || gameOver) return;

    const { ball, playerPaddle, computerPaddle, keys } = gameState.current;

    // Move player paddle
    if (keys.up && playerPaddle.y > 0) {
      playerPaddle.y -= 7;
    }
    if (keys.down && playerPaddle.y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
      playerPaddle.y += 7;
    }

    // Move computer paddle (AI)
    const paddleCenter = computerPaddle.y + PADDLE_HEIGHT / 2;
    if (paddleCenter < ball.y - 35) {
      computerPaddle.y += 5;
    } else if (paddleCenter > ball.y + 35) {
      computerPaddle.y -= 5;
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y <= 0 || ball.y >= CANVAS_HEIGHT - BALL_SIZE) {
      ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (ball.x <= PADDLE_WIDTH && 
        ball.y >= playerPaddle.y && 
        ball.y <= playerPaddle.y + PADDLE_HEIGHT) {
      ball.dx = -ball.dx;
      ball.x = PADDLE_WIDTH;
    }

    if (ball.x >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && 
        ball.y >= computerPaddle.y && 
        ball.y <= computerPaddle.y + PADDLE_HEIGHT) {
      ball.dx = -ball.dx;
      ball.x = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE;
    }

    // Score points
    if (ball.x < 0) {
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
      ball.x = CANVAS_WIDTH / 2;
      ball.y = CANVAS_HEIGHT / 2;
      ball.dx = 5;
    }

    if (ball.x > CANVAS_WIDTH) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      ball.x = CANVAS_WIDTH / 2;
      ball.y = CANVAS_HEIGHT / 2;
      ball.dx = -5;
    }

    // Check win condition
    if (score.player >= 5 || score.computer >= 5) {
      setGameOver(true);
      setGameRunning(false);
    }
  }, [gameRunning, gameOver, score]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { ball, playerPaddle, computerPaddle } = gameState.current;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, playerPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, computerPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') gameState.current.keys.up = true;
      if (e.key === 'ArrowDown') gameState.current.keys.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') gameState.current.keys.up = false;
      if (e.key === 'ArrowDown') gameState.current.keys.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
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
        <CardTitle className="text-white text-2xl">Pong</CardTitle>
        <div className="flex justify-center items-center space-x-4">
          <span className="text-white">Player: {score.player}</span>
          <span className="text-white">Computer: {score.computer}</span>
          <Button
            onClick={() => setGameRunning(!gameRunning)}
            disabled={gameOver}
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
          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h3 className="text-white text-2xl mb-2">
                  {score.player > score.computer ? 'You Win!' : 'Computer Wins!'}
                </h3>
                <p className="text-white mb-4">
                  Final Score: {score.player} - {score.computer}
                </p>
                <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>
        <p className="text-white/70 text-sm text-center mt-4">
          Use arrow keys to move your paddle • First to 5 points wins!
        </p>
      </CardContent>
    </Card>
  );
}