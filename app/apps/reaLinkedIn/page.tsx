'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function LinkedInApp() {
  const router = useRouter();
  const linkedinProfileUrl = 'https://linkedin.com/in/adeiza-onimisihttps://www.linkedin.com/in/onimisi-adeiza-bb2035254/?lipi=urn%3Ali%3Apage%3Amessaging_index%3Bfd2ac851-6069-45ce-8a03-adeb3dcf5e7a';

  // Function to open LinkedIn profile in a new tab
  const handleOpenProfile = () => {
    window.open(linkedinProfileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 rounded-2xl shadow-xl">
        <CardHeader className="text-center border-b border-white/20">
          <CardTitle className="text-white text-2xl font-semibold">LinkedIn Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Profile Preview */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-medium">OA</span>
            </div>
            <div className="text-center">
              <h2 className="text-white text-lg font-medium">Onimisi Adeiza</h2>
              <p className="text-white/60 text-sm">Software Developer | Innovator</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleOpenProfile}
              className="bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View LinkedIn Profile
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

          {/* Iframe Fallback (with note about potential restrictions) */}
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Note: Viewing the profile directly below may be restricted by LinkedIn&apos;s security settings.
            </p>
            <div className="mt-4 h-64 bg-white/5 rounded-lg overflow-hidden">
              <iframe
                src={linkedinProfileUrl}
                title="Onimisi Adeiza's LinkedIn Profile"
                className="w-full h-full border-none"
                allowFullScreen
                onError={() => (
                  <div className="flex items-center justify-center h-full text-white/60">
                    Profile cannot be displayed due to security restrictions. Use the button above to view.
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}