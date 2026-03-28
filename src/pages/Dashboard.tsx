import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningNavbar from '../components/LearningNavbar';
import { Node } from '../types';
import { Check, Lock, Play, BadgeCheck } from 'lucide-react';
import { getDashboard, getRoadmaps, type RoadmapTopic } from '../api/learning';

const INITIAL_NODES: Node[] = [
  { id: '7', title: 'What is an Operating System?', topic: 'OS', status: 'available', progress: 0, position: { x: 0, y: 0 } },
  { id: '8', title: 'User Mode vs Kernel Mode', topic: 'OS', status: 'locked', progress: 0, position: { x: 80, y: 120 } },
  { id: '9', title: 'System Calls', topic: 'OS', status: 'locked', progress: 0, position: { x: -80, y: 240 } },
  { id: '10', title: 'OS as Resource Manager', topic: 'OS', status: 'locked', progress: 0, position: { x: 120, y: 360 } },
  { id: '11', title: 'Real System Observation', topic: 'OS', status: 'locked', progress: 0, position: { x: 0, y: 480 } },
  { id: '12', title: 'Mental Model Diagram', topic: 'OS', status: 'locked', progress: 0, position: { x: -120, y: 600 } },
  { id: '1', title: 'Process Basics', topic: 'OS', status: 'locked', progress: 0, position: { x: 120, y: 720 } },
  { id: '2', title: 'Memory Layout', topic: 'OS', status: 'locked', progress: 0, position: { x: 0, y: 840 } },
  { id: '3', title: 'File Systems', topic: 'OS', status: 'locked', progress: 0, position: { x: -120, y: 960 } },
  { id: '4', title: 'SQL Fundamentals', topic: 'DB', status: 'available', progress: 0, position: { x: 120, y: 1080 } },
  { id: '5', title: 'Indexing', topic: 'DB', status: 'locked', progress: 0, position: { x: 0, y: 1200 } },
  { id: '6', title: 'TCP/IP Stack', topic: 'Networking', status: 'locked', progress: 0, position: { x: -120, y: 1320 } },
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
        Foundations: [
          'What is an Operating System?',
          'User Mode vs Kernel Mode',
          'System Calls',
          'OS as Resource Manager',
          'Real System Observation',
          'Mental Model Diagram',
        ],
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
      'What is an Operating System?': 'Think like the OS: programs, resources, and control.',
      'User Mode vs Kernel Mode': 'Security boundaries between apps and the kernel.',
      'System Calls': 'Safe requests from apps to the operating system.',
      'OS as Resource Manager': 'Scheduling CPU and memory across apps.',
      'Real System Observation': 'Use terminal tools to observe real processes.',
      'Mental Model Diagram': 'Assemble the full OS stack in one picture.',
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

      <div className="grid gap-8 md:grid-cols-[1fr,2fr,1fr] px-6 py-6 max-w-[1440px] mx-auto">
        <div className="hidden md:block" />

        <div className="p-8 mx-auto w-full max-w-[1100px]">
          <div className="w-full text-center mx-auto">
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-widest text-gold">System Architecture</p>
              <div className="mt-5 flex flex-wrap justify-center gap-4 text-base font-semibold text-gold">
                {displaySections.length === 0 ? (
                  <span className="rounded-full border border-gold/50 bg-black-soft/70 px-5 py-2 text-gold/70">
                    No sections yet
                  </span>
                ) : (
                  displaySections.map((section) => (
                    <span
                      key={section.title}
                      className="rounded-full border border-gold/50 bg-black-soft/70 px-5 py-2 text-gold/80"
                    >
                      {section.title}
                    </span>
                  ))
                )}
              </div>
            </div>
            <h1 className="text-[3.25rem] font-extrabold tracking-tight text-white leading-tight">{roadmapTitle}</h1>
            <p className="mt-4 text-xl text-white/50 leading-relaxed max-w-[640px] mx-auto" />
          </div>

          <div className="relative mt-10 w-full max-w-[1100px] mx-auto">
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
                      <div className={`inline-flex items-center gap-3 rounded-md border px-7 py-3.5 text-sm font-bold uppercase tracking-widest ${
                        sectionActiveOrCompleted
                          ? 'border-gold/30 bg-[#1a1a14] text-gold shadow-[0_0_20px_rgba(255,195,0,0.15)]'
                          : 'border-transparent bg-[#121212] text-white/30'
                      }`}>
                        {sectionIndex + 1}. {section.title}
                      </div>
                    </div>

                    <div className="mt-16 grid gap-y-16 md:grid-cols-1">
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
                          className={`relative flex w-full ${alignLeft ? 'justify-start md:-translate-x-10' : 'justify-end md:translate-x-10'}`}
                        >
                            <button
                              onClick={() => !isLocked && handleNodeClick(node)}
                              className={`group relative w-full max-w-[520px] transition-transform ${!isLocked && 'hover:scale-[1.02]'}`}
                              disabled={isLocked}
                            >
                              <div className={`flex items-center gap-3 ${alignLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                                
                                <div className="relative z-10 flex shrink-0">
                                  <div
                                    className={`flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-[1.2rem] transition ${
                                      isCompleted
                                        ? 'bg-gold text-black shadow-[0_0_20px_rgba(255,195,0,0.4)]'
                                        : isLocked
                                          ? 'border border-white/5 bg-[#121212] text-white/20'
                                        : 'border border-gold bg-black-deep text-gold shadow-[0_0_15px_rgba(255,195,0,0.15)]'
                                    }`}
                                  >
                                    {isLocked ? (
                                      <Lock size={22} strokeWidth={2.5} />
                                    ) : isCompleted ? (
                                      <Check size={30} strokeWidth={3} />
                                    ) : (
                                      <Play size={22} fill="currentColor" />
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-start text-left max-w-[380px] md:max-w-[460px]">
                                  <h4 className={`text-lg md:text-2xl font-bold ${isLocked ? 'text-white/30' : 'text-white/90'}`}>
                                    {displayTitle}
                                  </h4>
                                  <p className={`mt-2 text-sm md:text-base leading-relaxed ${isLocked ? 'text-white/20' : 'text-white/50'}`}>
                                    {description}
                                  </p>
                                  {isActive && (
                                    <div className="mt-3 hidden md:block" />
                                  )}
                                </div>
                              </div>
                            </button>
                            {isActive && (
                              <div className="absolute left-1/2 top-full mt-4 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-gold">
                                ACTIVE MODULE
                                <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(255,195,0,1)]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden md:block" />
      </div>
    </div>
  );
}
