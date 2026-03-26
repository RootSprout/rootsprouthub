import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import SkillNode from '../components/SkillNode';
import LearningNavbar from '../components/LearningNavbar';
import { Node } from '../types';
import { Trophy, Target, Star, BookOpen } from 'lucide-react';

const INITIAL_NODES: Node[] = [
  { id: '1', title: 'Process Basics', topic: 'OS', status: 'completed', progress: 100, position: { x: 0, y: 0 } },
  { id: '2', title: 'Memory Layout', topic: 'OS', status: 'available', progress: 45, position: { x: 80, y: 120 } },
  { id: '3', title: 'File Systems', topic: 'OS', status: 'locked', progress: 0, position: { x: -80, y: 240 } },
  { id: '4', title: 'SQL Fundamentals', topic: 'DB', status: 'available', progress: 0, position: { x: 120, y: 360 } },
  { id: '5', title: 'Indexing', topic: 'DB', status: 'locked', progress: 0, position: { x: 0, y: 480 } },
  { id: '6', title: 'TCP/IP Stack', topic: 'Networking', status: 'locked', progress: 0, position: { x: -120, y: 600 } },
];

export default function Dashboard() {
  const [nodes] = useState<Node[]>(INITIAL_NODES);
  const navigate = useNavigate();

  const handleNodeClick = (node: Node) => {
    navigate(`/lesson/${node.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <LearningNavbar />
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-12">
        {/* Left Sidebar - Stats */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">Your Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Star size={16} className="text-primary" />
                  <span className="text-sm">Total XP</span>
                </div>
                <span className="font-bold">2,450</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Target size={16} className="text-primary" />
                  <span className="text-sm">Current Level</span>
                </div>
                <span className="font-bold">14</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[65%] bg-primary glow-gold" />
              </div>
              <p className="text-center text-[10px] text-white/20">350 XP to Level 15</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">Achievements</h2>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
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
              {nodes.slice(0, -1).map((node, i) => {
                const nextNode = nodes[i + 1];
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
              {nodes.map((node) => (
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
              {[
                { label: 'Complete 2 lessons', progress: 50 },
                { label: 'Earn 100 XP', progress: 80 },
                { label: 'Fix 1 DB query', progress: 0 },
              ].map((goal, i) => (
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
