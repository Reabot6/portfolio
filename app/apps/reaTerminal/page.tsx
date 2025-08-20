'use client';

import React, { useEffect, useRef, useState } from 'react'; // Consolidated import
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// ---- Inlined useTerminal logic ----
type TerminalEntry = { type: 'command' | 'output'; content: string; delay?: number };

function useTerminal() {
  const [history, setHistory] = useState<TerminalEntry[]>([]);

  const commands: Record<string, (args?: string) => Promise<string | string[]>> = {
    welcome: async () => [
      '> Welcome to Adeiza Onimisi\'s Terminal Portfolio',
      '- Type "help" to see available commands'
    ],
    help: async () => [
      '> Available commands:',
      '- about : About me',
      '- learning : My learning path',
      '- skills : My technical skills',
      '- projects [name] : List projects or view project details',
      '- blog [name] : List blog posts or view post details',
      '- certificates : My certifications',
      '- resources : Free coding resources',
      '- bounties : Web3 bounty projects',
      '- freelance : Freelance services',
      '- github : GitHub activity',
      '- contact : Contact information',
      '- clear : Clear terminal'
    ],
    about: async () => [
      '> Adeiza Onimisi Adeolu',
      'Curious and passionate developer thriving on solving challenges.',
      'Skills: Web development, Three.js, APIs',
      'Interests: Coding, music (guitar), reading, series',
      'Goal: Build tools and experiences that matter'
    ],
    learning: async () => [
      '> My Learning Path:',
      '- HTML, CSS, JavaScript (Frontend Basics)',
      '- Data Structures (Computer Science)',
      '- jQuery, Tailwind CSS, SCSS, Bootstrap (Frontend)',
      '- React (Frontend)',
      '- Node.js (Backend)',
      '- Git, NPM (Tools)',
      '- Web Basics, HTTPS & Networking'
    ],
    skills: async () => [
      '> Skills:',
      '- Frontend: HTML, CSS, JavaScript, React, Tailwind CSS, Bootstrap, SCSS',
      '- Backend: Node.js, Express.js',
      '- Tools & Utilities: Git, NPM, Webpack',
      '- Core Concepts: Data Structures & Algorithms, HTTPS & Networking'
    ],
    projects: async (args) => {
      if (!args) {
        return [
          '> Projects:',
          '- kids : Kids Study Companion',
          '- cloak : Invisibility Cloak',
          '- habit : Habit Tracker',
          '- pdf : PDF Editor Pro',
          '- weather : Weather Forecast Dashboard',
          '- resourcehub : ResourceHub (Coming Soon)',
          'Use "projects [name]" for details'
        ];
      }
      const projectDetails: Record<string, string[]> = {
        kids: [
          '> Kids Study Companion',
          'An interactive educational platform for children.',
          'Tech: React',
          'Features: Gamified lessons, progress tracking, engaging activities',
          'Links: github.com/adeiza/kids-study | live: kids-study.adeiza.dev'
        ],
        cloak: [
          '> Invisibility Cloak',
          'A computer vision project using real-time background subtraction.',
          'Tech: JavaScript, OpenCV, Canvas API',
          'Links: github.com/adeiza/cloak | live: cloak.adeiza.dev'
        ],
        habit: [
          '> Habit Tracker',
          'A habit tracking app with streak counters and visualizations.',
          'Tech: React, TypeScript, Chart.js, Local Storage',
          'Links: github.com/adeiza/habit | live: habit.adeiza.dev'
        ],
        pdf: [
          '> PDF Editor Pro',
          'A web-based PDF editor for merging, splitting, and annotating.',
          'Tech: React, PDF-lib, Canvas API, File API',
          'Links: github.com/adeiza/pdf-editor | live: pdf.adeiza.dev'
        ],
        weather: [
          '> Weather Forecast Dashboard',
          'A weather app with forecasts, maps, and alerts.',
          'Tech: React, OpenWeather API, Mapbox, Chart.js',
          'Links: github.com/adeiza/weather | live: weather.adeiza.dev'
        ],
        resourcehub: [
          '> ResourceHub (Coming Soon)',
          'A platform for developers to share coding resources.',
          'Tech: React, TypeScript, Supabase, Tailwind CSS'
        ]
      };
      return projectDetails[args] || [`ERROR: Project "${args}" not found. Try "projects" for a list.`];
    },
    blog: async (args) => {
      if (!args) {
        return [
          '> Blog Posts:',
          '- future : The Future of Web Development',
          '- react : Mastering React Performance',
          'Use "blog [name]" for details'
        ];
      }
      const blogDetails: Record<string, string[]> = {
        future: [
          '> The Future of Web Development (2024-03-15, 5 min read)',
          'A journey through upcoming trends in web development.',
          'Link: blog.adeiza.dev/future-web'
        ],
        react: [
          '> Mastering React Performance (2024-03-10, 8 min read)',
          'Techniques and best practices for optimizing React apps.',
          'Link: blog.adeiza.dev/react-performance'
        ]
      };
      return blogDetails[args] || [`ERROR: Blog post "${args}" not found. Try "blog" for a list.`];
    },
    certificates: async () => [
      '> Certificates:',
      '- JavaScript Algorithms and Data Structures: Advanced JS, ES6+, async programming',
      '- Web Design: Comprehensive web design certification'
    ],
    resources: async () => [
      '> Free Coding Resources:',
      'A website for beginners to learn HTML, CSS, and JavaScript.',
      'Link: resources.adeiza.dev'
    ],
    bounties: async () => [
      '> Web3 Bounty Projects:',
      '- DeFi Yield Optimizer: Yield farming strategies (Solidity, React, Web3.js)',
      '- NFT Marketplace: Minting, trading, auctions (React, Solidity, IPFS, MetaMask)',
      '- Cross-Chain Bridge: Asset transfers between Ethereum and Polygon (Solidity, Node.js, Web3.js)'
    ],
    freelance: async () => [
      '> Freelance Services:',
      '- E-commerce Development: Modern online shopping experiences',
      '- Web Application Development: Custom business solutions',
      '- API Development & Integration: Seamless system connections',
      '- UI/UX Design Implementation: Pixel-perfect designs',
      '- Performance Optimization: Lightning-fast web apps'
    ],
    github: async () => [
      '> GitHub Activity:',
      '- Contributions: 1,243',
      '- Pull Requests: 56',
      '- Repositories: 32',
      '- Stars Earned: 128',
      'Link: github.com/adeiza'
    ],
    contact: async () => [
      '> Contact Information:',
      '- Email: adeiza@domain.com',
      '- GitHub: github.com/adeiza',
      '- LinkedIn: linkedin.com/in/adeiza',
      'Submit inquiries via: adeiza.dev/contact'
    ]
  };

  const executeCommand = async (cmd: string) => {
    try {
      const [command, ...args] = cmd.trim().toLowerCase().split(' ');
      setHistory((h) => [...h, { type: 'command', content: cmd }]);
      const handler = commands[command] || (async () => `ERROR: Unknown command "${command}"`);
      const result = await handler(args.join(' '));
      const lines = Array.isArray(result) ? result.filter(line => line !== undefined && line !== null) : [result];
      lines.forEach((line, index) => {
        setHistory((h) => [...h, { type: 'output', content: line, delay: index * 200 }]);
      });
    } catch (error) {
      setHistory((h) => [...h, { type: 'output', content: `ERROR: An unexpected error occurred: ${(error as Error).message}` }]);
    }
  };

  const clearHistory = () => setHistory([]);

  return { history, executeCommand, clearHistory };
}

// ---- Matrix Rain component ----
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(0);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;

      drops.forEach((y, i) => {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillStyle = `rgba(0, 255, 70, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillText(text, i * fontSize, y * fontSize);
        drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    const interval = setInterval(draw, 35);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-20"
    />
  );
};

// ---- Terminal Output component ----
const TerminalOutput = React.memo(
  ({ entry, index }: { entry: TerminalEntry; index: number }) => {
    const [text, setText] = useState('');
    const [cursor, setCursor] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (entry.type === 'command') {
        setText(entry.content);
        setCursor(false);
        return;
      }

      let i = 0;
      const content = entry.content || '';
      setText('');
      setCursor(true);

      const typeChar = () => {
        if (i < content.length) {
          setText((t) => t + content[i]);
          i++;
          timerRef.current = setTimeout(typeChar, Math.random() * 50 + 20);
        } else {
          setCursor(false);
        }
      };

      const startDelay = entry.delay || 100;
      timerRef.current = setTimeout(typeChar, startDelay);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [entry.content, entry.type, entry.delay]);

    return (
      <div className="font-mono text-sm leading-relaxed text-green-400">
        {entry.type === 'command' ? (
          <div>
            <span className="text-green-600">guest@adeiza:~$ </span>
            <span>{entry.content}</span>
          </div>
        ) : (
          <div>
            {text}
            {cursor && <span className="animate-pulse text-green-400">█</span>}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.entry.content === nextProps.entry.content &&
    prevProps.entry.type === nextProps.entry.type &&
    prevProps.entry.delay === nextProps.entry.delay &&
    prevProps.index === nextProps.index
);

// ---- Main Page Component ----
export default function TerminalApp() {
  const router = useRouter();
  const { history, executeCommand, clearHistory } = useTerminal();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      executeCommand('welcome');
    }
  }, [executeCommand]);

  useEffect(() => {
    if (!isTyping && inputRef.current && !isMinimized) {
      inputRef.current.focus();
    }
  }, [isTyping, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || isTyping) return;
    setInput('');
    if (cmd.toLowerCase() === 'clear') {
      clearHistory();
      return;
    }
    setIsTyping(true);
    await executeCommand(cmd);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (terminalRef.current && !isMinimized) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isMinimized]);

  // Add click to focus input for better UX
  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };
    terminalRef.current?.addEventListener('click', handleClick);
    return () => terminalRef.current?.removeEventListener('click', handleClick);
  }, []);

  const handleClose = () => {
    router.push('/desktop');
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  return (
    <>
      <MatrixRain />
      <div className="h-screen w-screen flex items-center justify-center p-4 bg-black">
        {isMinimized ? (
          <div className="fixed bottom-4 left-4">
            <Button
              onClick={handleRestore}
              className="bg-green-900/50 text-green-400 font-mono border border-green-700 hover:bg-green-700/30 text-sm px-3 py-1"
            >
              Restore Terminal
            </Button>
          </div>
        ) : (
          <div
            className={`bg-black border border-green-800 shadow-[0_0_10px_rgba(0,255,0,0.3)] rounded-sm transition-all ${
              isMaximized ? 'fixed inset-0 m-0' : 'w-full max-w-3xl'
            }`}
          >
            <div className="flex items-center justify-between bg-green-900/50 text-green-400 px-3 py-1.5 text-sm font-mono">
              <span>adeiza@terminal ~ bash</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleClose}
                  className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none flex items-center justify-center text-[10px] text-black font-bold"
                  aria-label="Close Terminal"
                >
                  ×
                </button>
                <button
                  onClick={handleMinimize}
                  className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-none flex items-center justify-center text-[10px] text-black font-bold"
                  aria-label="Minimize Terminal"
                >
                  −
                </button>
                <button
                  onClick={handleMaximize}
                  className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none flex items-center justify-center text-[10px] text-black font-bold"
                  aria-label={isMaximized ? 'Restore Terminal' : 'Maximize Terminal'}
                >
                  {isMaximized ? '↙↗' : '↖↘'}
                </button>
              </div>
            </div>
            <div
              ref={terminalRef}
              className={`p-4 bg-black/95 overflow-y-auto font-mono text-green-400 ${
                isMaximized ? 'h-[calc(100vh-40px)]' : 'h-[80vh]'
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.02) 1px, transparent 1px)`,
                backgroundSize: '100% 1.2em',
              }}
            >
              {history.map((entry, idx) => (
                <TerminalOutput key={idx} entry={entry} index={idx} />
              ))}
              <form onSubmit={handleSubmit} className="flex items-center mt-2">
                <span className="text-green-600">guest@adeiza:~$ </span>
                <span className="flex-1 text-green-400">{input}</span>
                <span className="animate-pulse text-green-400">█</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  className="absolute opacity-0 w-px h-px"
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            </div>
            <div className="p-2 flex justify-center bg-green-900/20">
              <Button
                onClick={ () => router.push('/desktop')}
                className="bg-transparent border border-green-700 text-green-400 hover:bg-green-700/30 font-mono text-sm px-3 py-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Desktop
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}