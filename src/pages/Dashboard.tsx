import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import SkillNode from '../components/SkillNode';
import LearningNavbar from '../components/LearningNavbar';
import { Node } from '../types';
import { Trophy, Target, Star, BookOpen } from 'lucide-react';
import { getDashboard, getRoadmaps, type RoadmapTopic } from '../api/learning';

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
  const [isMobile, setIsMobile] = useState(false);
  const [roadmaps, setRoadmaps] = useState<RoadmapTopic[]>([]);
  const [currentTopics, setCurrentTopics] = useState<string[]>([]);
  const [activeTopic, setActiveTopic] = useState<string>('');
  const navigate = useNavigate();

  const handleNodeClick = (node: Node) => {
    navigate(`/lesson/${node.id}`);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

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

    getRoadmaps()
      .then((data) => {
        if (!mounted) return;
        setRoadmaps(data.topics);
        setCurrentTopics(data.currentTopics);
        setActiveTopic(data.currentTopics[0] || data.topics[0]?.topic || '');
      })
      .catch(() => {
        setRoadmaps([]);
        setCurrentTopics([]);
      });
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const orderedNodes = useMemo(() => {
    const sorted = [...dashboardNodes].sort((a, b) => Number(a.id) - Number(b.id));
    const filtered = activeTopic ? sorted.filter((node) => node.topic === activeTopic) : sorted;
    return filtered;
  }, [dashboardNodes, activeTopic]);

  const sectionLessonMap = useMemo(
    () => ({
      OS: {
        Memory: ['Memory Layout'],
        CPU: ['Process Basics'],
        'File System': ['File Systems'],
      },
      DB: {
        SQL: ['SQL Fundamentals'],
        Indexing: ['Indexing'],
      },
      Networking: {
        Core: ['TCP/IP Stack'],
      },
      'Distributed Systems': {},
    }),
    []
  );

  const roadmapSections = useMemo(() => {
    if (!activeTopic) return [];
    const map = sectionLessonMap[activeTopic as keyof typeof sectionLessonMap];
    if (!map) return [];
    return Object.entries(map).map(([title, lessons]) => {
      const nodes = orderedNodes.filter((node) => lessons.includes(node.title));
      const completed = nodes.length > 0 && nodes.every((node) => node.status === 'completed');
      return { title, nodes, completed, topic: activeTopic };
    });
  }, [activeTopic, orderedNodes, sectionLessonMap]);

  const layoutSections = useMemo(() => {
    if (roadmapSections.length === 0) {
      return [
        {
          title: activeTopic || 'Roadmap',
          completed: false,
          nodes: orderedNodes.map((node, index) => ({
            ...node,
            position: {
              x: isMobile ? 0 : index % 2 === 0 ? -80 : 80,
              y: index * 140,
            },
          })),
        },
      ];
    }
    return roadmapSections.map((section) => {
      const baseNodes = section.nodes.map((node) => ({ ...node }));
      const placeholders: Node[] = [
        {
          id: `${section.title}-placeholder-1`,
          title: 'Coming Soon',
          topic: section.topic as Node['topic'],
          status: 'locked',
          progress: 0,
          position: { x: 0, y: 0 },
        },
        {
          id: `${section.title}-placeholder-2`,
          title: 'Coming Soon',
          topic: section.topic as Node['topic'],
          status: 'locked',
          progress: 0,
          position: { x: 0, y: 0 },
        },
      ];

      const nodes = [...baseNodes, ...placeholders].map((node, index) => {
        const xOffset = isMobile ? 0 : index % 2 === 0 ? -80 : 80;
        const yOffset = index * 140;
        return {
          ...node,
          position: { x: xOffset, y: yOffset },
        };
      });
      return { ...section, nodes };
    });
  }, [roadmapSections, isMobile]);

  const layoutNodes = useMemo(() => {
    return layoutSections.flatMap((section) => section.nodes);
  }, [layoutSections]);

  const topicProgress = useMemo(() => {
    const progress: Record<string, { total: number; completed: number }> = {};
    dashboardNodes.forEach((node) => {
      if (!progress[node.topic]) {
        progress[node.topic] = { total: 0, completed: 0 };
      }
      progress[node.topic].total += 1;
      if (node.status === 'completed') {
        progress[node.topic].completed += 1;
      }
    });
    return progress;
  }, [dashboardNodes]);

  const topicCompletion = useMemo(() => {
    if (!activeTopic) return { completed: 0, total: 0 };
    const progress = topicProgress[activeTopic] || { total: 0, completed: 0 };
    return progress;
  }, [activeTopic, topicProgress]);

  const xpProgress = Math.min(
    100,
    Math.round((stats.totalXP / Math.max(1, stats.totalXP + stats.xpToNext)) * 100)
  );

  return (
    <div className="min-h-screen bg-background">
      <LearningNavbar
        userName={user?.name}
        userEmail={user?.email}
        xp={stats.totalXP}
        streak={stats.level}
        roadmapTopics={roadmaps.map((topic) => topic.topic)}
        activeTopic={activeTopic}
        onSelectTopic={setActiveTopic}
      />
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 pb-24 lg:grid-cols-12">
        {/* Left Sidebar - Stats */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          {user && (
            <div>
              <h2 className="mb-3 text-xl font-bold text-white">Welcome back, {user.name}!</h2>
              <div className="rounded-2xl border border-white/10 bg-surface p-6">
                <div className="flex items-center justify-between text-xs text-white/60">
                <span>Currently studying</span>
                <span className="text-gold/80">{currentTopics.join(', ') || activeTopic || 'Getting started'}</span>
              </div>
            </div>
            </div>
          )}

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

          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">Your Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Star size={16} className="text-primary" />
                  <span className="text-sm">⚡ Total XP</span>
                </div>
                <span className="font-bold">{stats.totalXP.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Target size={16} className="text-primary" />
                  <span className="text-sm">🏆 Current Level</span>
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
            {isMobile && user && (
              <div className="w-full max-w-md mb-8">
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Welcome back, <span className="text-gold">{user.name}</span>!
                </h2>
                <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-black-deep via-black-deep/95 to-gold/10 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gold/20 bg-black-deep/50 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">⚡ XP</p>
                    <p className="text-sm font-bold">{stats.totalXP.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-gold/20 bg-black-deep/50 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">🏆 Level</p>
                    <p className="text-sm font-bold">{stats.level}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-black-deep/50 p-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40">
                    <span>Progress</span>
                    <span className="text-white/70">
                      {topicCompletion.completed}/{topicCompletion.total}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-primary glow-gold"
                      style={{
                        width: `${
                          topicCompletion.total
                            ? Math.round((topicCompletion.completed / topicCompletion.total) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-white/50">
                    Currently studying: {currentTopics.join(', ') || activeTopic || 'Getting started'}
                  </p>
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black-deep/60 p-4">
                  <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/50">Daily Goals</h3>
                  <div className="space-y-3">
                    {goals.map((goal, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/70">{goal.label}</span>
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
                </div>
              </div>
            )}
            <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-10">
              {layoutSections.map((section, sectionIndex) => (
                <div key={section.title} className="w-full flex flex-col items-center relative">
                  <div className="mb-6 text-xs font-bold uppercase tracking-widest text-white/50">
                    {section.title}
                  </div>
                  <svg className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[320px] h-full pointer-events-none opacity-20">
                    {section.nodes.slice(0, -1).map((node, i) => {
                      const nextNode = section.nodes[i + 1];
                      const x1 = 160 + node.position.x;
                      const y1 = node.position.y + 100;
                      const x2 = 160 + nextNode.position.x;
                      const y2 = nextNode.position.y + 100;
                      const bend = isMobile ? 12 : 22;
                      const midX = (x1 + x2) / 2;
                      const c1x = midX + (i % 2 === 0 ? -bend : bend);
                      const c2x = midX + (i % 2 === 0 ? bend : -bend);
                      const c1y = y1 + (y2 - y1) * 0.35;
                      const c2y = y1 + (y2 - y1) * 0.65;
                      return (
                        <path
                          key={`${section.title}-${i}`}
                          d={`M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`}
                          stroke="white"
                          strokeWidth="2"
                          strokeDasharray="8 8"
                          fill="none"
                        />
                      );
                    })}
                  </svg>
                  <div className="relative flex flex-col items-center gap-8 z-10">
                    {section.nodes.map((node, index) => (
                      <SkillNode
                        key={node.id}
                        node={node}
                        isLast={index === section.nodes.length - 1}
                        onClick={handleNodeClick}
                      />
                    ))}
                  </div>
                  <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/40 bg-gold/10 text-gold">
                    <span className="text-lg">🎁</span>
                  </div>
                  {sectionIndex < layoutSections.length - 1 && (
                    <div className="my-10 h-px w-full bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">

          {roadmaps.length > 0 && activeTopic && (
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Roadmap</h2>
                {currentTopics.length > 0 && (
                  <span className="text-[10px] font-bold text-gold/80">Studying {currentTopics.join(', ')}</span>
                )}
              </div>

              {roadmaps
                .filter((topic) => topic.topic === activeTopic)
                .map((topic) => (
                  <div key={topic.topic} className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/40">
                      {topic.topic}
                    </div>
                    {topic.sections.map((section) => (
                      <div key={section.title} className="rounded-xl border border-white/10 bg-black-deep/40 p-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                          {section.title}
                        </p>
                        <div className="space-y-1">
                          {section.steps.map((step) => (
                            <div key={step} className="text-xs text-white/70">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}

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
