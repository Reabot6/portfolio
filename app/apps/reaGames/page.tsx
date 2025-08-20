'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { SnakeGame } from '@/components/games/SnakeGame';
import  TetrisGame  from '@/components/games/TetrisGame';
import { PongGame } from '@/components/games/PongGame';
import { BreakoutGame } from '@/components/games/BreakoutGame';

const games = [
  { id: 'snake', name: 'Snake', description: 'Classic snake game - eat food and grow!' },
  { id: 'tetris', name: 'Tetris', description: 'Stack blocks and clear lines!' },
  { id: 'pong', name: 'Pong', description: 'Classic paddle game!' },
  { id: 'breakout', name: 'Breakout', description: 'Break all the bricks!' }
];

export default function GamesApp() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case 'snake':
        return <SnakeGame />;
      case 'tetris':
        return <TetrisGame />;
      case 'pong':
        return <PongGame />;
      case 'breakout':
        return <BreakoutGame />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-purple-800 to-pink-900 flex flex-col items-center justify-center p-4">
        <div className="mb-4 flex space-x-2">
          <Button 
            onClick={() => setSelectedGame(null)}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          <Button 
            onClick={() => router.push('/desktop')}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Desktop
          </Button>
        </div>
        <div className="flex-1 w-full max-w-4xl">
          {renderGame()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-800 to-pink-900 flex items-center justify-center p-8">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-3xl mb-2">Arcade Games</CardTitle>
          <p className="text-white/80">Choose a game to play!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => (
              <Card key={game.id} className="bg-white/5 border-white/20 hover:bg-white/10 transition-colors">
                <CardContent className="p-6 text-center">
                  <h3 className="text-white text-xl font-semibold mb-2">{game.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{game.description}</p>
                  <Button 
                    onClick={() => setSelectedGame(game.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play {game.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center pt-4">
            <Button 
              onClick={() => router.push('/desktop')}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Desktop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}