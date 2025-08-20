'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function SpotifyApp() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-green-900 to-black flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-3xl">Spotify Clone</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-white/80 text-lg">
            Placeholder for Spotify app/code. Replace this folder with your code.
          </p>
          <p className="text-white/60 text-sm">
            This is where your music streaming application would go. You can build a music player, 
            playlist manager, or any audio-related application here.
          </p>
          <Button 
            onClick={() => router.push('/desktop')}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Desktop
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}