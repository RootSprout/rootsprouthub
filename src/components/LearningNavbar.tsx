import React from 'react';
import { LayoutDashboard, Users, Video, PenSquare, Flame, Zap, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import rootsproutLogo from '../assets/rootsprout-logo.svg';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: PenSquare, label: 'Blogs', path: '/blogs' },
];

type LearningNavbarProps = {
  userName?: string;
  userEmail?: string;
  xp?: number;
  streak?: number;
  roadmapTopics?: string[];
  activeTopic?: string;
  onSelectTopic?: (topic: string) => void;
};

export default function LearningNavbar({
  userName,
  userEmail,
  xp = 0,
  streak = 0,
  roadmapTopics = [],
  activeTopic,
  onSelectTopic,
}: LearningNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('rs_token');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black-deep">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-black-deep border border-gold/40 glow-gold group-hover:glow-gold-strong transition-all flex items-center justify-center">
            <img src={rootsproutLogo} alt="Rootsprout logo" className="w-9 h-9 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight">Rootsprout</span>
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

          {roadmapTopics.length > 0 && (
            <div className="hidden lg:flex items-center border-l border-white/10 pl-6">
              <div className="relative group">
                <button className="text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  Roadmaps
                </button>
                <div className="absolute left-0 top-full mt-3 hidden min-w-[220px] rounded-2xl border border-white/10 bg-black-deep/95 p-3 shadow-xl group-hover:block group-focus-within:block">
                  <div className="flex flex-col gap-1">
                    {roadmapTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => onSelectTopic?.(topic)}
                        className={`w-full rounded-xl px-3 py-2 text-left text-[11px] font-bold uppercase tracking-widest transition-colors ${
                          activeTopic === topic
                            ? 'bg-gold/20 text-gold'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-8">
            <div className="flex items-center gap-1.5 text-primary">
              <Flame size={18} fill="currentColor" />
              <span className="text-sm font-bold">{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <Zap size={18} fill="currentColor" />
              <span className="text-sm font-bold">{xp.toLocaleString()} XP</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 overflow-hidden">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName || 'rootsprout')}`} 
                alt="Avatar"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={handleLogout}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        <button
          className="ml-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 md:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="text-lg">☰</span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black-deep/70 backdrop-blur-sm md:hidden">
          <div className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-black-deep/95 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold uppercase tracking-widest text-white/60">Menu</span>
              <button
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 text-white/60"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            {userName && (
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-white/50">Profile</p>
                <p className="mt-2 text-sm font-bold text-white">{userName}</p>
                {userEmail && <p className="mt-1 text-xs text-white/50">{userEmail}</p>}
                <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
                  <span>{xp.toLocaleString()} XP</span>
                  <span className="text-white/20">•</span>
                  <span>Level {streak}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname === item.path ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </div>

            {roadmapTopics.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">Roadmaps</p>
                <div className="space-y-1">
                  {roadmapTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        onSelectTopic?.(topic);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-widest transition-colors",
                        activeTopic === topic ? "bg-gold/20 text-gold" : "text-white/60 hover:text-white"
                      )}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:border-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
