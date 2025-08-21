'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Home, ArrowLeft, ArrowRight, RotateCcw, X, Minus, Square, Search, Bookmark, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function BrowserApp() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState('home');
  const [history, setHistory] = React.useState(['home']);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(true);
  const [urlInput, setUrlInput] = React.useState('');
  const [iframeKey, setIframeKey] = React.useState(0);

  const navigateTo = (page: string, isExternal: boolean = false) => {
    if (isExternal) {
      window.open(page, '_blank');
      return;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(page);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPage(page);
    setUrlInput(page === 'home' ? '' : page);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const newPage = history[historyIndex - 1];
      setCurrentPage(newPage);
      setUrlInput(newPage === 'home' ? '' : newPage);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const newPage = history[historyIndex + 1];
      setCurrentPage(newPage);
      setUrlInput(newPage === 'home' ? '' : newPage);
    }
  };

  const reload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const goHome = () => {
    navigateTo('home');
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = urlInput.toLowerCase();
    if (input.includes('google.com') || input.includes('google')) {
      navigateTo('https://www.google.com', true);
    } else if (input.includes('youtube.com') || input.includes('youtube')) {
      navigateTo('https://www.youtube.com', true);
    } else if (input.includes('portfolio') || input === '') {
      navigateTo('portfolio');
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 left-4 bg-slate-200 border border-slate-300 rounded-lg p-2 cursor-pointer shadow-lg"
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-slate-700">Portfolio Browser</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-800 to-blue-950 flex items-center justify-center p-0">
      <Card
        className={`bg-white/10 backdrop-blur-md border-white/20 flex flex-col shadow-2xl transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[90vh] m-4 rounded-lg'
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2 border-b border-white/10">
          <div className="flex space-x-2">
            <button
              onClick={() => router.push('/desktop')}
              className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center group transition-colors"
              aria-label="Close"
            >
              <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="w-3 h-3 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center group transition-colors"
              aria-label="Minimize"
            >
              <Minus className="w-2 h-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center group transition-colors"
              aria-label="Toggle Fullscreen"
            >
              <Square className="w-1.5 h-1.5 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <CardTitle className="text-white text-lg sm:text-xl">Portfolio Browser</CardTitle>
          <div className="w-12"></div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          {/* Browser Toolbar */}
          <div className="bg-slate-200 border-b border-slate-300 p-2 sm:p-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={goBack}
                disabled={historyIndex <= 0}
                className="p-2 hover:bg-slate-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
              <button
                onClick={goForward}
                disabled={historyIndex >= history.length - 1}
                className="p-2 hover:bg-slate-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go Forward"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
              <button onClick={reload} className="p-2 hover:bg-slate-300 rounded transition-colors" aria-label="Reload">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
              <button onClick={goHome} className="p-2 hover:bg-slate-300 rounded transition-colors" aria-label="Home">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
              <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
                <div className="flex-1 bg-white border border-slate-300 rounded-full px-3 py-1 sm:py-2 flex items-center shadow-sm">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter URL or search..."
                    className="w-full bg-transparent text-slate-600 text-sm sm:text-base focus:outline-none"
                  />
                  <button type="submit" className="ml-2 p-1 hover:bg-slate-100 rounded-full">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                  </button>
                </div>
              </form>
              <button className="p-2 hover:bg-slate-300 rounded transition-colors" aria-label="Bookmarks">
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 bg-white/5 rounded-lg mt-2 overflow-auto p-4 sm:p-6">
            {currentPage === 'home' ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-white text-xl sm:text-2xl font-semibold mb-8">Welcome to Portfolio Browser</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <motion.a
                    href="https://www.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    onClick={() => navigateTo('https://www.google.com', true)}
                  >
                    <Image
                      src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                      alt="Google"
                      width={92}
                      height={30}
                      className="mb-2"
                    />
                    <span className="text-white text-sm sm:text-base">Google</span>
                  </motion.a>
                  <motion.a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    onClick={() => navigateTo('https://www.youtube.com', true)}
                  >
                    <Image
                      src="data:image/jpeg;base64,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"
                      alt="YouTube"
                      width={64}
                      height={64}
                      className="mb-2"
                    />
                    <span className="text-white text-sm sm:text-base">YouTube</span>
                  </motion.a>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                    onClick={() => navigateTo('portfolio')}
                  >
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-white text-sm sm:text-base">My Portfolio</span>
                  </motion.div>
                </div>
              </div>
            ) : currentPage === 'portfolio' ? (
              <iframe
                key={iframeKey}
                src="https://reabot6.netlify.app"
                title="Portfolio"
                className="w-full h-full border-none"
                allowFullScreen
              />
            ) : (
              <div className="text-white text-lg">Loading {currentPage}...</div>
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-slate-200 border-t border-slate-300 px-4 py-1 sm:py-2 mt-2 rounded">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
              <span>Ready</span>
              <span>Portfolio Browser v1.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}