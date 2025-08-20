'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function XApp() {
  const router = useRouter();

  // Load the Twitter widget script only once
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).twttr == null) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-8">
      <Card className="w-full max-w-3xl bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-3xl">My X Profile</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          {/* Wrap the timeline so Tailwind doesn’t purge the twitter-timeline class */}
          <div className="w-full overflow-y-auto max-h-[600px]">
            <a
              className="twitter-timeline"
              data-theme="dark"
              data-height="600"
              href="https://twitter.com/reabot6"
            >
              Tweets by reabot6
            </a>
          </div>

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
