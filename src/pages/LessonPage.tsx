import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Terminal as TerminalIcon, Play, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(33);
  const [activeStep, setActiveStep] = useState(0);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['$ rootsprouthub init', 'Initializing system simulation...', 'Ready.']);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const steps = [
    {
      title: "Understanding Processes",
      content: "A process is an instance of a computer program that is being executed. It contains the program code and its current activity. Each process has its own address space.",
      task: "Type 'ps aux' to list running processes in the simulation."
    },
    {
      title: "Process States",
      content: "Processes move through different states: Running, Waiting, and Ready. The OS scheduler decides which process gets CPU time.",
      task: "Type 'kill -9 1234' to terminate the zombie process."
    },
    {
      title: "Context Switching",
      content: "When the CPU switches from one process to another, it saves the state of the current process and loads the state of the next one. This is called a context switch.",
      task: "Type 'top' to see real-time CPU usage."
    }
  ];

  const handleTerminalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const newHistory = [...terminalHistory, `$ ${terminalInput}`];
    
    const expected = activeStep === 0 ? 'ps aux' : activeStep === 1 ? 'kill -9 1234' : 'top';

    if (terminalInput.trim() === expected) {
      newHistory.push("Success: Command executed correctly.");
      setIsCorrect(true);
      setTimeout(() => {
        if (activeStep < steps.length - 1) {
          setActiveStep(prev => prev + 1);
          setProgress(prev => Math.min(100, prev + 33));
          setIsCorrect(null);
        } else {
          setProgress(100);
        }
      }, 1500);
    } else {
      newHistory.push(`Error: Command not found or invalid for this challenge.`);
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 2000);
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>

        <div className="flex flex-1 max-w-xl mx-10 items-center gap-4">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary glow-gold" 
            />
          </div>
          <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Info size={18} />
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section className="flex w-1/2 flex-col border-r border-white/10 p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {activeStep + 1} of {steps.length}</span>
                <h1 className="text-4xl font-black tracking-tight">{steps[activeStep].title}</h1>
              </div>

              <div className="rounded-2xl border border-white/5 bg-surface p-8 leading-relaxed text-white/70">
                {steps[activeStep].content}
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-primary">
                  <Play size={18} fill="currentColor" />
                  Your Challenge
                </h3>
                <p className="text-sm text-white/80">{steps[activeStep].task}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-auto flex justify-between pt-10">
            <button 
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => prev - 1)}
              className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white disabled:opacity-0"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            {progress === 100 && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => navigate('/dashboard')}
                className="rounded-xl bg-primary px-8 py-3 font-bold text-background glow-gold hover:scale-105 transition-all"
              >
                Finish Lesson
              </motion.button>
            )}
          </div>
        </section>

        <section className="relative flex w-1/2 flex-col bg-[#050505] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40">
              <TerminalIcon size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">System Terminal</span>
            </div>
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/20" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1">
            {terminalHistory.map((line, i) => (
              <div key={i} className={cn(
                line.startsWith('$') ? "text-white" : 
                line.startsWith('Success') ? "text-green-400" : 
                line.startsWith('Error') ? "text-red-400" : 
                "text-white/40"
              )}>
                {line}
              </div>
            ))}
            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
              <span className="text-primary font-bold">$</span>
              <input 
                autoFocus
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white"
                placeholder="Type command..."
              />
            </form>
          </div>

          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl px-6 py-4 font-bold shadow-2xl",
                  isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}
              >
                {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                {isCorrect ? "Correct! Well done." : "Try again. Check the command."}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
