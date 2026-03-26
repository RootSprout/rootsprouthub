import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import SkillNode from '../components/SkillNode';
import LearningNavbar from '../components/LearningNavbar';
import { Node } from '../types';
import { Trophy, Target, Star, BookOpen } from 'lucide-react';
import { getDashboard } from '../api/learning';

const INITIAL_NODES: Node[] = [
  { id: '1', title: 'Process Basics', topic: 'OS', status: 'completed', progress: 100, position: { x: 0, y: 0 } },
  { id: '2', title: 'Memory Layout', topic: 'OS', status: 'available', progress: 45, position: { x: 80, y: 120 } },
  { id: '3', title: 'File Systems', topic: 'OS', status: 'locked', progress: 0, position: { x: -80, y: 240 } },
  { id: '4', title: 'SQL Fundamentals', topic: 'DB', status: 'available', progress: 0, position: { x: 120, y: 360 } },
  { id: '5', title: 'Indexing', topic: 'DB', status: 'locked', progress: 0, position: { x: 0, y: 480 } },
  { id: '6', title: 'TCP/IP Stack', topic: 'Networking', status: 'locked', progress: 0, position: { x: -120, y: 600 } },
];

const DEFAULT_GOALS = [
  { label: 'Complete 2 lessons', progress: 50 },
  { label: 'Earn 100 XP', progress: 80 },
  { label: 'Fix 1 DB query', progress: 0 },
];

export default function Dashboard() {
  const [dashboardNodes, setDashboardNodes] = useState<Node[]>(INITIAL_NODES);
  const [stats, setStats] = useState({ totalXP: 2450, level: 14, xpToNext: 350 });
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [achievements, setAchievements] = useState<number[]>([1, 2, 3, 4, 5]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  const handleNodeClick = (node: Node) => {
    navigate(`/lesson/${node.id}`);
  };

  useEffect(() => {
    let mounted = true;
    getDashboard()
      .then((data) => {
        if (!mounted) return;
        setDashboardNodes(
          data.nodes.map((node) => ({
            id: node.id,
            title: node.title,
            topic: node.topic as Node['topic'],
            status: node.status,
            progress: node.progress,
            position: node.position,
          }))
        );
        setStats(data.stats);
        setUser(data.user);
        setGoals(data.goals.length ? data.goals : DEFAULT_GOALS);
        setAchievements(data.achievements.length ? data.achievements.map((a) => a.id) : [1, 2, 3, 4, 5]);
      })
      .catch((err) => {
        if (err instanceof Error && err.message === 'unauthorized') {
          navigate('/login');
          return;
        }
        setDashboardNodes(INITIAL_NODES);
        setUser(null);
        setGoals(DEFAULT_GOALS);
        setAchievements([1, 2, 3, 4, 5]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const xpProgress = Math.min(
    100,
    Math.round((stats.totalXP / Math.max(1, stats.totalXP + stats.xpToNext)) * 100)
  );

  return (
    <div className="min-h-screen bg-background">
      <LearningNavbar userName={user?.name} xp={stats.totalXP} streak={stats.level} />
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-12">
        {/* Left Sidebar - Stats */}
        <aside className="lg:col-span-3 space-y-6">
          {user && (
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <h2 className="mb-2 text-xl font-bold text-white">Welcome back, {user.name}!</h2>
              <p className="text-sm text-white/50">{user.email}</p>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">Your Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Star size={16} className="text-primary" />
                  <span className="text-sm">Total XP</span>
                </div>
                <span className="font-bold">{stats.totalXP.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Target size={16} className="text-primary" />
                  <span className="text-sm">Current Level</span>
                </div>
                <span className="font-bold">{stats.level}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full bg-primary glow-gold" style={{ width: `${xpProgress}%` }} />
              </div>
              <p className="text-center text-[10px] text-white/20">{stats.xpToNext} XP to next level</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">Achievements</h2>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((i) => (
                <div key={i} className="flex aspect-square items-center justify-center rounded-xl bg-white/5 border border-white/10 text-primary/40">
                  <Trophy size={20} />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content - Skill Tree */}
        <main className="lg:col-span-6">
          <div className="relative flex flex-col items-center py-20">
            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-20">
              {dashboardNodes.slice(0, -1).map((node, i) => {
                const nextNode = dashboardNodes[i + 1];
                return (
                  <line
                    key={i}
                    x1={`calc(50% + ${node.position.x}px)`}
                    y1={`${node.position.y + 100}px`}
                    x2={`calc(50% + ${nextNode.position.x}px)`}
                    y2={`${nextNode.position.y + 100}px`}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                );
              })}
            </svg>

            <div className="relative z-10 flex flex-col items-center gap-24">
              {dashboardNodes.map((node) => (
                <SkillNode 
                  key={node.id} 
                  node={node} 
                  onClick={handleNodeClick} 
                />
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Daily Goals */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">Daily Goals</h2>
            <div className="space-y-4">
              {goals.map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">{goal.label}</span>
                    <span className="font-bold text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      className="h-full bg-primary" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 glow-gold">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-background">
              <BookOpen size={20} />
            </div>
            <h3 className="mb-2 font-bold text-primary">Pro Tip</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Mastering indexing can speed up your database queries by up to 100x. Try the "B-Tree Visualization" challenge!
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
