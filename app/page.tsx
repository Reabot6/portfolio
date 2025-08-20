'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      router.push('/desktop');
    }, 1000);
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoggingIn ? 0 : 1, y: isLoggingIn ? -20 : 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center space-y-6"
      >
        {/* User Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* User Name */}
        <h1 className="text-3xl font-light text-white text-center">Portfolio User</h1>
        
        {/* Login Button */}
        <Button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg transition-all duration-200"
        >
          {isLoggingIn ? 'Signing in...' : 'Sign in'}
        </Button>
      </motion.div>
    </div>
  );
}