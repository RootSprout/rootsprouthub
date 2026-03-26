import { LayoutDashboard, Users, Video, PenSquare, Flame, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: PenSquare, label: 'Blogs', path: '/blogs' },
];

export default function LearningNavbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background glow-gold group-hover:glow-gold-strong transition-all">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-gradient-gold">
            ROOTSPROUTHUB
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path ? "text-primary" : "text-white/60"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <div className="flex items-center gap-1.5 text-primary">
              <Flame size={18} fill="currentColor" />
              <span className="text-sm font-bold">12</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <Zap size={18} fill="currentColor" />
              <span className="text-sm font-bold">2,450 XP</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Avatar"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
