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
                      src="https://www.youtube.com/s/desktop/4e5b8f7f/img/favicon_144.png"
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