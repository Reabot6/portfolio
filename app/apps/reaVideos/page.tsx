'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function VideosApp() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  // Rickroll video details
  const video = {
    title: 'Epic How i learnt to code in a day',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Rickroll video
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80'

, // Replace with custom catchy thumbnail
    description: 'Get ready for the best video on the internet!',
  };

  // Function to open video in a new tab
  const handleOpenVideo = () => {
    window.open(video.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-red-800 to-red-950 flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 rounded-2xl shadow-xl">
        <CardHeader className="text-center border-b border-white/20">
          <CardTitle className="text-white text-2xl font-semibold">Videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Video Thumbnail */}
          <div className="relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
            <Image
              src={video.thumbnail}
              alt={video.title}
              width={480}
              height={270}
              className="w-full h-48 object-cover rounded-lg"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <Play className="w-12 h-12 text-white" />
            </div>
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              SHOCKING!
            </div>
            <p className="text-white text-sm mt-2 text-center font-medium">{video.title}</p>
            <p className="text-white/60 text-xs mt-1 text-center">{video.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleOpenVideo}
              className="bg-red-600 text-white hover:bg-red-700 flex items-center justify-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch on YouTube
            </Button>
            <Button
              onClick={() => router.push('/desktop')}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Desktop
            </Button>
          </div>

          {/* Video Player (shown when thumbnail is clicked) */}
          {isPlaying && (
            <div className="mt-4 h-64 bg-white/5 rounded-lg overflow-hidden">
              <iframe
                src={`${video.url}?autoplay=1`}
                title={video.title}
                className="w-full h-full border-none"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}