'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const desktopIcons = [
  { name: 'Terminal', icon: 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png', route: '/apps/reaTerminal' },
  { name: 'Browser', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png', route: '/apps/reaBrowser' }, // Points to BrowserApp
  { name: 'Games', icon: 'https://cdn-icons-png.flaticon.com/512/3781/3781904.png', route: '/apps/reaGames' },
  { name: 'Pictures', icon: 'https://cdn-icons-png.flaticon.com/512/716/716784.png', route: '/apps/reaPictures' },
  { name: 'Videos', icon: 'https://cdn-icons-png.flaticon.com/512/716/716769.png', route: '/apps/reaVideos' },
];

const taskbarApps = [
  { name: 'Netflix', icon: 'https://cdn-icons-png.flaticon.com/512/5977/5977590.png', route: '/apps/reaNetflix', running: true },
  { name: 'Spotify', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111624.png', route: '/apps/reaSpotify', running: false },
  { name: 'Phone', icon: 'https://cdn-icons-png.flaticon.com/512/724/724664.png', route: '/apps/reaPhone', running: true },
  { name: 'X', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968830.png', route: '/apps/reaX', running: false },
  { name: 'LinkedIn', icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png', route: '/apps/reaLinkedIn', running: false },
  { name: 'Phone2', icon: 'https://cdn-icons-png.flaticon.com/512/724/724664.png', route: '/apps/reaPhone2', running: false },
  { name: 'Mail', icon: 'https://cdn-icons-png.flaticon.com/512/732/732200.png', route: '/apps/reaMail', running: true },
  { name: 'GitHub', icon: 'https://cdn-icons-png.flaticon.com/512/733/733553.png', route: '/apps/reaGitHub', running: false },
];

export default function DesktopPage() {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'h:mm a')); // Set initial values
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'MMM d')); // Set initial values
  const [isMounted, setIsMounted] = useState(false); // Track client-side mounting
  const router = useRouter();

  // Update time and date only on the client side
  useEffect(() => {
    setIsMounted(true); // Mark as mounted on client
    const updateTime = () => {
      setCurrentTime(format(new Date(), 'h:mm a'));
      setCurrentDate(format(new Date(), 'MMM d'));
    };
    updateTime(); // Initial update
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleIconClick = (route: string) => {
    router.push(route);
  };

  // Prevent rendering of dynamic content until mounted
  if (!isMounted) {
    return <div>Loading...</div>; // Static fallback UI
  }

  return (
    <TooltipProvider>
      <div
        className="h-screen w-screen relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Desktop Icons */}
        <div className="absolute top-8 left-8 grid grid-cols-1 gap-4 z-10">
          {desktopIcons.map((icon, index) => (
            <motion.div
              key={icon.name}
              className="flex flex-col items-center space-y-1 cursor-pointer p-2 rounded-md hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleIconClick(icon.route)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src={icon.icon} alt={icon.name} className="w-10 h-10" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{icon.name}</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-white text-xs text-center drop-shadow-lg font-medium">{icon.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Activate Windows Watermark */}
        <div className="absolute bottom-20 right-4 opacity-50 text-white text-sm pointer-events-none">
          Activate Windows
          <br />
          <span className="text-xs">Go to Settings to activate Windows.</span>
        </div>

        {/* Taskbar */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/20 backdrop-blur-md border-t border-gray-200/50 flex items-center justify-between px-2 z-20">
          {/* Start Button */}
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className="p-2 hover:bg-white/10 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStartMenu(true)}
                >
                  <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="Start" className="w-6 h-6" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Taskbar Apps */}
          <div className="flex items-center space-x-1">
            {taskbarApps.map((app, index) => (
              <div key={`${app.name}-${index}`} className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      className="relative p-2 hover:bg-white/10 rounded-md flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleIconClick(app.route)}
                    >
                      <img src={app.icon} alt={app.name} className="w-6 h-6" />
                      {app.running && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-blue-500 rounded-full" />
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{app.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>

          {/* System Tray */}
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      className="p-1 hover:bg-white/10 rounded"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src="https://cdn-icons-png.flaticon.com/512/93/93158.png" alt="WiFi" className="w-4 h-4" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Network</p>
                  </TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="text-sm">Connected to WiFi</div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button className="p-1 hover:bg-white/10 rounded" whileHover={{ scale: 1.05 }}>
                      <img src="https://cdn-icons-png.flaticon.com/512/664/664883.png" alt="Battery" className="w-4 h-4" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Battery</p>
                  </TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent className="w-32">
                <div className="text-sm">100% Available</div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button className="p-1 hover:bg-white/10 rounded" whileHover={{ scale: 1.05 }}>
                      <img src="https://cdn-icons-png.flaticon.com/512/565/565422.png" alt="Notifications" className="w-4 h-4" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="text-sm">No new notifications</div>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className="text-white text-xs p-2 hover:bg-white/10 rounded text-center leading-tight"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowCalendar(true)}
                >
                  <div>{currentTime}</div>
                  <div>{currentDate}</div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Date and Time</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Start Menu */}
        <AnimatePresence>
          {showStartMenu && (
            <div className="fixed inset-0 z-50 flex items-end justify-center pb-16">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-96 h-96 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20"
              >
                <div className="p-4 space-y-4">
                  {/* Search Bar */}
                  <Input placeholder="Type here to search" className="w-full bg-white/50 border-none" />

                  {/* Pinned Apps */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Pinned</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[...taskbarApps.slice(0, 6), ...desktopIcons.slice(0, 3)].map((app, index) => (
                        <motion.button
                          key={`${app.name}-${index}`}
                          className="p-3 hover:bg-white/20 rounded-md flex flex-col items-center space-y-1"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => {
                            handleIconClick(app.route);
                            setShowStartMenu(false);
                          }}
                        >
                          <img src={app.icon} alt={app.name} className="w-8 h-8" />
                          <span className="text-xs text-gray-800 text-center">{app.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Recommended */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Recommended</h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-md">
                        <img src="https://cdn-icons-png.flaticon.com/512/716/716784.png" alt="Document" className="w-6 h-6" />
                        <div className="text-xs text-gray-800">Portfolio.docx</div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 hover:bg-white/20 rounded-md">
                        <img src="https://cdn-icons-png.flaticon.com/512/716/716784.png" alt="Document" className="w-6 h-6" />
                        <div className="text-xs text-gray-800">Resume.pdf</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex justify-between items-center pt-2">
                    <Popover>
                      <PopoverTrigger>
                        <div className="flex items-center space-x-2 p-2 hover:bg-white/20 rounded-md cursor-pointer">
                          <img src="https://via.placeholder.com/24/4A90E2/FFFFFF?text=U" alt="User" className="w-6 h-6 rounded-full" />
                          <span className="text-sm text-gray-800">User</span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Button variant="ghost" className="w-full">Sign out</Button>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button className="p-2 hover:bg-white/20 rounded-md" whileHover={{ scale: 1.05 }}>
                              <img src="https://cdn-icons-png.flaticon.com/512/1828/1828427.png" alt="Power" className="w-6 h-6" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Power</p>
                          </TooltipContent>
                        </Tooltip>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="space-y-2">
                          <Button variant="ghost" className="w-full justify-start">Sleep</Button>
                          <Button variant="ghost" className="w-full justify-start">Shut down</Button>
                          <Button variant="ghost" className="w-full justify-start">Restart</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </motion.div>
              <div className="absolute inset-0 bg-black/20" onClick={() => setShowStartMenu(false)} />
            </div>
          )}
        </AnimatePresence>

        {/* Calendar Modal */}
        <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border-none" />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}