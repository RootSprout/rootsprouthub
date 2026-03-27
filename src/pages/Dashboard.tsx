import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningNavbar from '../components/LearningNavbar';
import { Node } from '../types';
import { Check, Lock, Play, BadgeCheck } from 'lucide-react';
import { getDashboard, getRoadmaps, type RoadmapTopic } from '../api/learning';

const INITIAL_NODES: Node[] = [
  { id: '1', title: 'Process Basics', topic: 'OS', status: 'completed', progress: 100, position: { x: 0, y: 0 } },
  { id: '2', title: 'Memory Layout', topic: 'OS', status: 'available', progress: 45, position: { x: 80, y: 120 } },
  { id: '3', title: 'File Systems', topic: 'OS', status: 'locked', progress: 0, position: { x: -80, y: 240 } },
  { id: '4', title: 'SQL Fundamentals', topic: 'DB', status: 'available', progress: 0, position: { x: 120, y: 360 } },
  { id: '5', title: 'Indexing', topic: 'DB', status: 'locked', progress: 0, position: { x: 0, y: 480 } },
  { id: '6', title: 'TCP/IP Stack', topic: 'Networking', status: 'locked', progress: 0, position: { x: -120, y: 600 } },
];

export default function Dashboard() {
  const [dashboardNodes, setDashboardNodes] = useState<Node[]>(INITIAL_NODES);
  const [stats, setStats] = useState({ totalXP: 2450, level: 14, xpToNext: 350 });
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [roadmaps, setRoadmaps] = useState<RoadmapTopic[]>([]);
  const [activeTopic, setActiveTopic] = useState<string>('');
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
      })
      .catch((err) => {
        if (err instanceof Error && err.message === 'unauthorized') {
          navigate('/login');
          return;
        }
        setDashboardNodes(INITIAL_NODES);
        setUser(null);
      });

    getRoadmaps()
      .then((data) => {
        if (!mounted) return;
        setRoadmaps(data.topics);
        setActiveTopic(data.currentTopics[0] || data.topics[0]?.topic || '');
      })
      .catch(() => {
        setRoadmaps([]);
      });
    return () => {
      mounted = false;
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
        'Memory Management': ['Memory Layout'],
        'CPU Scheduling': ['Process Basics'],
        'File Systems': ['File Systems'],
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
      const nodes = orderedNodes.filter((node) => (lessons as string[]).includes(node.title));
      const completed = nodes.length > 0 && nodes.every((node) => node.status === 'completed');
      return { title, nodes, completed, topic: activeTopic };
    });
  }, [activeTopic, orderedNodes, sectionLessonMap]);

  const displaySections = useMemo(() => {
    if (roadmapSections.length > 0) {
      return roadmapSections.map((section) => {
        const nodes = [...section.nodes];
        if (section.topic === 'OS') {
          if (section.title === 'Memory Management' && nodes.length < 2) {
            nodes.push({
              id: `${section.title}-stack-heap`,
              title: 'Stack & Heap',
              topic: section.topic,
              status: 'locked',
              progress: 0,
              position: { x: 0, y: 0 },
            });
          }
          if (section.title === 'CPU Scheduling' && nodes.length < 2) {
            nodes.push({
              id: `${section.title}-interrupts`,
              title: 'Interrupts & syscalls',
              topic: section.topic,
              status: 'locked',
              progress: 0,
              position: { x: 0, y: 0 },
            });
          }
          if (section.title === 'File Systems' && nodes.length < 1) {
            nodes.push({
              id: `${section.title}-io`,
              title: 'I/O Scheduling',
              topic: section.topic,
              status: 'locked',
              progress: 0,
              position: { x: 0, y: 0 },
            });
          }
        }
        return { ...section, nodes };
      });
    }
    if (orderedNodes.length === 0) return [];
    return [
      {
        title: 'Roadmap',
        nodes: orderedNodes,
        completed: false,
        topic: activeTopic || 'Roadmap',
      },
    ];
  }, [roadmapSections, orderedNodes, activeTopic]);

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

  const topicLabels = useMemo(
    () => ({
      OS: 'Operating Systems',
      DB: 'Databases',
      Networking: 'Networking',
      'Distributed Systems': 'Distributed Systems',
      'System Design': 'System Design',
    }),
    []
  );

  const roadmapTitle = useMemo(() => {
    return topicLabels[activeTopic as keyof typeof topicLabels] || activeTopic || 'Roadmap';
  }, [activeTopic, topicLabels]);

  const xpProgress = Math.min(
    100,
    Math.round((stats.totalXP / Math.max(1, stats.totalXP + stats.xpToNext)) * 100)
  );

  const topicSummary = useMemo(() => {
    const summaries: Record<string, string> = {
      OS: 'Master the inner workings of modern kernels. From low-level memory management to high-performance file systems.',
      DB: 'Design efficient storage engines, indexing strategies, and query optimizations.',
      Networking: 'Understand protocol stacks, routing, and reliable data transfer at scale.',
      'Distributed Systems': 'Build resilient systems with consensus, replication, and fault tolerance.',
      'System Design': 'Architect scalable systems with real-world tradeoffs and patterns.',
    };
    return summaries[activeTopic] || 'Choose a roadmap to start your journey.';
  }, [activeTopic]);

  const nodeDescriptions = useMemo(
    () => ({
      'Memory Layout': 'Paging, segmentation, and address translation logic.',
      'Virtual Memory': 'Paging, segmentation, and address translation logic.',
      'Stack & Heap': 'Dynamic allocation, pointers, and memory leaks.',
      'Process Basics': 'Lifecycle of a process: Ready, Running, Waiting.',
      'Process States': 'Lifecycle of a process: Ready, Running, Waiting.',
      'Interrupts & syscalls': 'Kernel mode vs User mode transitions.',
      'File Systems': 'Disk structures, caching, and read/write optimization.',
      'I/O Scheduling': 'Disk structures and read/write optimization.',
      'SQL Fundamentals': 'Core SQL concepts and relational modeling.',
      Indexing: 'B-trees, hashes, and query acceleration.',
      'TCP/IP Stack': 'Protocol layers, sockets, and packet flow.',
    }),
    []
  );

  const nodeTitleOverrides = useMemo(
    () => ({
      'Memory Layout': 'Virtual Memory',
      'Process Basics': 'Process States',
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <LearningNavbar
        userName={user?.name}
        userEmail={user?.email}
        xp={stats.totalXP}
        streak={stats.level}
        roadmapTopics={roadmaps.map((topic) => topic.topic)}
        activeTopic={activeTopic}
        onSelectTopic={setActiveTopic}
      />

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-[260px,minmax(0,1fr)] lg:items-start">
        <aside className="space-y-12 lg:pr-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Systems Architecture</p>
            <div className="mt-5 space-y-1">
              {roadmaps.length === 0 ? (
                <div className="text-xs text-white/40">No roadmaps available</div>
              ) : (
                roadmaps.map((topic) => (
                  <button
                    key={topic.topic}
                    onClick={() => setActiveTopic(topic.topic)}
                    className={`group flex w-full items-center justify-between rounded-r-lg py-3 pl-4 pr-3 text-left text-sm font-semibold transition ${
                      activeTopic === topic.topic
                        ? 'border-l-2 border-gold bg-white/[0.03] text-gold'
                        : 'border-l-2 border-transparent text-white/50 hover:bg-white/[0.02] hover:text-white'
                    }`}
                  >
                    <span>{topicLabels[topic.topic as keyof typeof topicLabels] || topic.topic}</span>
                    <span className="text-white/20 transition group-hover:text-white/40">›</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[#121212] p-6 shadow-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Profile Tier</p>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gold">Lvl {stats.level} Architect</h3>
              <div className="flex text-gold">
                 <BadgeCheck size={24} fill="currentColor" stroke="#121212" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>XP Progress</span>
                <span className="text-white/60">
                  {stats.totalXP.toLocaleString()} / {(stats.totalXP + stats.xpToNext).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
                <div className="h-full rounded-full bg-gold shadow-[0_0_10px_rgba(255,195,0,0.5)]" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
            <div className="mt-8 flex justify-between text-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Modules</p>
                <p className="mt-1 text-base font-bold text-white">
                  {topicCompletion.completed}/{topicCompletion.total}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Rank</p>
                <p className="mt-1 text-base font-bold text-white">Top 2%</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex flex-col lg:pl-10">
          <div className="w-full max-w-3xl text-left">
            <h1 className="text-[2.75rem] font-extrabold tracking-tight text-white leading-tight">{roadmapTitle}</h1>
            <p className="mt-4 text-lg text-white/50 leading-relaxed max-w-[600px]">{topicSummary}</p>
          </div>

          <div className="relative mt-20 w-full max-w-4xl">
            <div 
              className="absolute left-1/2 top-0 h-[calc(100%-80px)] w-px -translate-x-1/2" 
              style={{
                background: 'linear-gradient(to bottom, rgba(255,195,0,0.6) 0%, rgba(255,195,0,0.3) 40%, rgba(255,255,255,0.05) 75%)'
              }}
            />

            <div className="space-y-24">
              {displaySections.map((section, sectionIndex) => {
                const sectionActiveOrCompleted = section.nodes.some(n => n.status !== 'locked');
                
                return (
                  <div key={section.title} className="relative">
                    <div className="flex justify-center relative z-10">
                      <div className={`inline-flex items-center gap-3 rounded-md border px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest ${
                        sectionActiveOrCompleted
                          ? 'border-gold/30 bg-[#1a1a14] text-gold shadow-[0_0_20px_rgba(255,195,0,0.15)]'
                          : 'border-transparent bg-[#121212] text-white/30'
                      }`}>
                        {String(sectionIndex + 1).padStart(2, '0')}. {section.title}
                      </div>
                    </div>

                    <div className="mt-16 grid gap-y-16 md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
                      {(section.nodes.length ? section.nodes : []).map((node, index) => {
                        const isLocked = node.status === 'locked';
                        const isCompleted = node.status === 'completed';
                        const isActive = node.status === 'available';
                        const displayTitle =
                          node.title === 'File Systems' && node.status === 'locked'
                            ? 'I/O Scheduling'
                            : nodeTitleOverrides[node.title as keyof typeof nodeTitleOverrides] || node.title;
                        const description =
                          nodeDescriptions[displayTitle as keyof typeof nodeDescriptions] ||
                          nodeDescriptions[node.title as keyof typeof nodeDescriptions] ||
                          'Module description coming soon.';
                        const alignLeft = index % 2 === 0;

                        return (
                          <div
                            key={node.id}
                            className={`relative flex w-full ${alignLeft ? 'md:justify-end' : 'md:justify-start'}`}
                          >
                            <button
                              onClick={() => !isLocked && handleNodeClick(node)}
                              className={`group relative w-full max-w-[340px] transition-transform ${!isLocked && 'hover:scale-[1.02]'}`}
                              disabled={isLocked}
                            >
                              <div className={`flex items-center gap-6 ${alignLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                                
                                <div className="relative z-10 flex shrink-0">
                                  <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-[0.85rem] transition ${
                                      isCompleted
                                        ? 'bg-gold text-black shadow-[0_0_20px_rgba(255,195,0,0.4)]'
                                        : isLocked
                                          ? 'border border-white/5 bg-[#121212] text-white/20'
                                          : 'border border-gold bg-black-deep text-gold shadow-[0_0_15px_rgba(255,195,0,0.15)]'
                                    }`}
                                  >
                                    {isLocked ? (
                                      <Lock size={18} strokeWidth={2.5} />
                                    ) : isCompleted ? (
                                      <Check size={22} strokeWidth={3} />
                                    ) : (
                                      <Play size={18} fill="currentColor" />
                                    )}
                                  </div>
                                  
                                  <span
                                    className={`absolute top-1/2 -translate-y-1/2 hidden h-px w-6 lg:w-8 md:block ${
                                      isCompleted ? 'bg-gold' : isActive ? 'bg-gold/40' : 'bg-white/10'
                                    } ${alignLeft ? '-right-6 lg:-right-8' : '-left-6 lg:-left-8'}`}
                                  />
                                </div>
                                
                                <div className={`flex flex-col ${alignLeft ? 'items-end text-right' : 'items-start text-left'}`}>
                                  <h4 className={`text-lg font-bold ${isLocked ? 'text-white/30' : 'text-white/90'}`}>
                                    {displayTitle}
                                  </h4>
                                  <p className={`mt-1.5 text-[13px] leading-relaxed ${isLocked ? 'text-white/20' : 'text-white/50'}`}>
                                    {description}
                                  </p>
                                  {isActive && (
                                    <div className={`mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold`}>
                                      {alignLeft ? (
                                        <>
                                          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(255,195,0,1)]" />
                                          ACTIVE MODULE
                                        </>
                                      ) : (
                                        <>
                                          ACTIVE MODULE
                                          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(255,195,0,1)]" />
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
