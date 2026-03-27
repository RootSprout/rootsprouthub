/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  Zap,
  Code,
  Database,
  Terminal,
  Layout,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import LearningNavbar from '../components/LearningNavbar';
import Footer from '../components/Footer';
import { getDashboard } from '../api/learning';

// --- Types ---
interface Course {
  id: string;
  title: string;
  progress: number;
  icon: React.ReactNode;
  category: string;
  target?: string;
}

// --- Mock Data ---
const CONTINUING_COURSES: Course[] = [
  {
    id: 'os',
    title: 'Operating Systems',
    progress: 65,
    icon: <Terminal className="h-5 w-5 text-gold" />,
    category: 'Systems',
    target: '/dashboard',
  },
  {
    id: 'networking',
    title: 'Networking',
    progress: 42,
    icon: <Layout className="h-5 w-5 text-gold" />,
    category: 'Networks',
    target: '/dashboard',
  },
  {
    id: 'db',
    title: 'Databases',
    progress: 15,
    icon: <Database className="h-5 w-5 text-gold" />,
    category: 'Architecture',
    target: '/dashboard',
  },
];

const EXPLORE_COURSES = [
  { title: 'Rust for Systems', icon: <Terminal /> },
  { title: 'Distributed Systems', icon: <Database /> },
  { title: 'Compiler Design', icon: <Code /> },
  { title: 'Network Protocols', icon: <Layout /> },
];

// --- Components ---

const ContinueLearning: React.FC<{ onCourseClick: (course: Course) => void }> = ({ onCourseClick }) => (
  <section className="py-8">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
      <ChevronRight className="h-6 w-6 text-white/40" />
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      {CONTINUING_COURSES.map((course) => (
        <motion.button
          key={course.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCourseClick(course)}
          className="group rounded-3xl border border-white/10 bg-black-soft/80 p-7 text-left shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition hover:border-gold/30"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-black-muted text-gold">
              {course.icon}
            </div>
            <span className="text-xs text-white/40">Progress</span>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-gold">{course.title}</h3>
          <p className="mt-3 text-sm text-white/40">Next: {course.title} Basics</p>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full bg-gold" style={{ width: `${course.progress}%` }} />
          </div>
          <div className="mt-3 text-right text-xs text-white/40">{course.progress}%</div>
        </motion.button>
      ))}
    </div>
  </section>
);

const DailyChallenge = () => (
  <section className="py-8">
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[32px] border border-gold/30 bg-gradient-to-br from-black-soft to-black-muted p-8 shadow-[0_20px_70px_rgba(0,0,0,0.5)]"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <div className="mb-3 flex items-center gap-2 text-gold">
            <Zap className="h-6 w-6 fill-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Today's Challenge</span>
          </div>
          <h3 className="text-3xl font-bold leading-tight text-white">
            Optimize the <br />
            <span className="text-gold">LRU Cache</span> Logic
          </h3>
          <p className="mt-3 max-w-[280px] text-sm text-white/40">
            Master memory management and eviction policies.
          </p>
        </div>
        <div className="rounded-2xl border border-gold/20 bg-gold/10 p-4">
          <Terminal className="h-10 w-10 text-gold" />
        </div>
      </div>

      <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-3 text-sm font-bold text-black-deep transition-colors hover:bg-white">
        Start Now
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  </section>
);

const ExploreCourses = () => (
  <section className="py-8">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Explore New Tracks</h2>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full border border-white/10 bg-black-soft text-white/50">‹</button>
        <button className="h-10 w-10 rounded-full border border-white/10 bg-black-soft text-white/50">›</button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {EXPLORE_COURSES.map((course, i) => (
        <motion.div
          key={i}
          whileTap={{ scale: 0.95 }}
          className="group cursor-pointer rounded-3xl border border-white/10 bg-black-soft/80 p-5 transition-all hover:border-gold/30"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-colors group-hover:bg-gold/10 group-hover:text-gold">
            {React.cloneElement(course.icon as React.ReactElement, { className: 'h-6 w-6' })}
          </div>
          <h4 className="text-base font-bold leading-snug text-white transition-colors group-hover:text-gold">
            {course.title}
          </h4>
          <button className="mt-5 w-full rounded-xl border border-white/10 bg-black-muted py-2 text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Start Track
          </button>
        </motion.div>
      ))}
    </div>
  </section>
);

// --- Main App ---

export default function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(0);
  const [streakMonth, setStreakMonth] = useState<{ year: number; month: number; days: { date: string; completed: boolean }[] } | null>(null);
  const [achievements, setAchievements] = useState<number[]>([]);

  useEffect(() => {
    let mounted = true;
    getDashboard()
      .then((data) => {
        if (!mounted) return;
        setUserName(data.user?.name);
        setUserEmail(data.user?.email);
        setXp(data.stats?.totalXP ?? 0);
        setLevel(data.stats?.level ?? 0);
        setStreakMonth(data.streak ?? null);
        setAchievements(data.achievements?.map((item) => item.id) ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setStreakMonth(null);
        setAchievements([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const streakLabel = useMemo(() => {
    if (!streakMonth) return 'This Month';
    return new Date(streakMonth.year, streakMonth.month - 1, 1).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }, [streakMonth]);

  const streakCount = useMemo(
    () => streakMonth?.days.filter((day) => day.completed).length ?? 0,
    [streakMonth]
  );

  const monthDays = useMemo(() => {
    const now = new Date();
    const year = streakMonth?.year ?? now.getFullYear();
    const monthIndex = (streakMonth?.month ?? now.getMonth() + 1) - 1;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayIndex = new Date(year, monthIndex, 1).getDay();
    return { daysInMonth, firstDayIndex };
  }, [streakMonth]);

  return (
    <div className="font-display relative mx-auto min-h-screen max-w-6xl overflow-x-hidden pb-20 text-white">
      <div className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute right-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <LearningNavbar userName={userName} xp={xp} streak={level} />

      <motion.main
        className="px-6 pb-12 pt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold text-gold">
            Welcome back {userName || 'Learner'}
          </h2>
          <p className="mt-1 text-base text-white/60">{userEmail || ''}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,195,0,0.2),transparent_55%)] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold/70">
              <Zap className="h-5 w-5 text-gold" />
              Today's Elite Challenge
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Optimize the <span className="text-gold">LRU</span> Cache Logic
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/50">
              Implement a thread-safe Least Recently Used cache with O(1) get and put operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-black-deep">
                Initialize Lab
              </button>
              <div className="rounded-2xl border border-white/10 bg-black-muted px-4 py-3 text-[11px] uppercase tracking-widest text-white/50">
                Est. time 45 min
              </div>
              <div className="rounded-2xl border border-white/10 bg-black-muted px-4 py-3 text-[11px] uppercase tracking-widest text-white/50">
                Difficulty: Hard
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ContinueLearning onCourseClick={(course) => course.target && navigate(course.target)} />
        </div>

        <div className="mt-10">
          <ExploreCourses />
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Achievements</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-[1.2fr,2fr]">
            <div className="rounded-3xl border border-white/10 bg-black-soft/80 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-widest text-white/40">Badges</p>
                  <p className="text-2xl font-bold text-white">{Math.max(achievements.length, 0)}</p>
                </div>
                <button className="text-xs uppercase tracking-widest text-gold/70">View All</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {achievements.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black-soft/70 px-4 py-3 text-sm text-white/40">
                    Complete lessons to unlock achievements.
                  </div>
                ) : (
                  achievements.slice(0, 6).map((id) => (
                    <div
                      key={id}
                      className="h-14 w-14 rounded-2xl border border-white/10 bg-black-muted flex items-center justify-center text-gold"
                    >
                      <Zap className="h-6 w-6" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black-soft/80 p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-white/70">Streak Calendar</p>
                <p className="text-xs uppercase tracking-widest text-white/30">{streakLabel}</p>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 48 }).map((_, index) => (
                  <div key={`streak-${index}`} className="h-3 w-3 rounded-[3px] bg-emerald-400/90" />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <span>Less</span>
                <div className="h-3 w-3 rounded-[3px] bg-white/10" />
                <div className="h-3 w-3 rounded-[3px] bg-emerald-400/50" />
                <div className="h-3 w-3 rounded-[3px] bg-emerald-400/80" />
                <div className="h-3 w-3 rounded-[3px] bg-emerald-400/100" />
                <span>More</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10">
          <DailyChallenge />
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
