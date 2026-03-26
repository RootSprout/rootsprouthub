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
  xp?: number;
  streak?: number;
};

export default function LearningNavbar({ userName, xp = 0, streak = 0 }: LearningNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('rs_token');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-black-deep border border-gold/40 glow-gold group-hover:glow-gold-strong transition-all flex items-center justify-center">
            <img src={rootsproutLogo} alt="Rootsprout logo" className="w-9 h-9 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-gradient-gold">ROOTSPROUTHUB</span>
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
      </div>
    </nav>
  );
}
