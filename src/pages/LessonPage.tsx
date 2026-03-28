import { useEffect, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Terminal as TerminalIcon, Play, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { getLesson, validateCommand, completeLesson, type LessonStep } from '../api/learning';
import osDiagram from '../assets/OS/section-1/1.png';
import IntroCard from '../components/lesson/IntroCard';

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<LessonStep[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['$ rootsprouthub init', 'Initializing system simulation...', 'Ready.']);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setIsLoading(true);
    getLesson(id)
      .then((data) => {
        if (!mounted) return;
        setSteps(data.steps);
        setActiveStep(0);
        setProgress(0);
      })
      .catch((err) => {
        if (err instanceof Error && err.message === 'unauthorized') {
          navigate('/login');
          return;
        }
        if (!mounted) return;
        setSteps([]);
        setProgress(0);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const currentStep = steps[activeStep];
  const stepType = currentStep?.type || (currentStep?.task ? 'terminal' : 'concept');
  const stepOptions = Array.isArray(currentStep?.options) ? currentStep?.options : [];
  const isTerminalStep = stepType === 'terminal';
  const canContinue = !isTerminalStep && (stepOptions.length === 0 || selectedOption !== null);

  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
  }, [activeStep]);

  const advanceStep = (fromIndex: number) => {
    const nextStep = fromIndex + 1;
    if (nextStep < steps.length) {
      setActiveStep(nextStep);
      setProgress(Math.min(100, Math.round((nextStep / steps.length) * 100)));
      return;
    }
    setProgress(100);
  };

  const handleOptionSelect = (option: string) => {
    if (!currentStep) return;
    const answer = (currentStep.answer || '').trim();
    const hasAnswer = answer.length > 0;
    const correct = !hasAnswer || option === answer;
    setSelectedOption(option);
    if (currentStep.explanation) {
      setFeedback({ correct, message: currentStep.explanation });
      return;
    }
    if (hasAnswer && !correct) {
      setFeedback({ correct, message: `Correct answer: ${answer}` });
      return;
    }
    setFeedback({ correct, message: 'Nice choice.' });
  };

  const handleTerminalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    if (!id || steps.length === 0) return;

    const newHistory = [...terminalHistory, `$ ${terminalInput}`];

    try {
      const currentStep = steps[activeStep];
      const result = await validateCommand(id, currentStep.id, terminalInput.trim());
      newHistory.push(result.message);
      setIsCorrect(result.correct);
      if (result.correct) {
        setTimeout(() => {
          setIsCorrect(null);
          advanceStep(activeStep);
        }, 1500);
      } else {
        setTimeout(() => setIsCorrect(null), 2000);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'unauthorized') {
        navigate('/login');
        return;
      }
      newHistory.push('Error: Unable to validate command right now.');
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 2000);
    } finally {
      setTerminalHistory(newHistory);
      setTerminalInput('');
    }
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

      <main className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        <section
          className={cn(
            "flex w-full flex-col border-b border-white/10 p-6 md:w-[55%] md:border-b-0 md:border-r md:p-10 overflow-y-auto"
          )}
        >
          {!isLoading && steps.length > 0 && (
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
                  {steps[activeStep].uiHint && (
                    <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {steps[activeStep].uiHint?.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                {steps[activeStep].uiHint === 'intro_card' ? (
                  <IntroCard title={steps[activeStep].title} content={steps[activeStep].content} diagramSrc={osDiagram} />
                ) : (
                  <div className="rounded-2xl border border-white/5 bg-surface p-8 leading-relaxed text-white/70 whitespace-pre-line shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                    {steps[activeStep].content}
                  </div>
                )}

                {steps[activeStep].uiHint === 'diagram_manager' && (
                  <div className="rounded-2xl border border-primary/40 bg-[#0f0d08] p-5 shadow-[0_0_25px_rgba(255,195,0,0.12)]">
                    <img
                      src={osDiagram}
                      alt="OS manager diagram"
                      className="w-full rounded-xl border border-primary/30"
                    />
                  </div>
                )}

                {stepOptions.length > 0 && (
                  <div className="grid gap-3 md:grid-cols-2">
                    {stepOptions.map((option) => {
                      const isSelected = selectedOption === option;
                      return (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className={cn(
                            "rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition",
                            isSelected
                              ? "border-primary bg-primary/15 text-primary shadow-[0_0_20px_rgba(255,195,0,0.2)]"
                              : "border-white/10 bg-[#101010] text-white/70 hover:border-primary/40 hover:text-white"
                          )}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}

                {steps[activeStep].task && stepOptions.length === 0 && !isTerminalStep && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-primary">
                      <Play size={18} fill="currentColor" />
                      Action
                    </h3>
                    <p className="text-sm text-white/80 whitespace-pre-line">{steps[activeStep].task}</p>
                  </div>
                )}

                {feedback && (
                  <div
                    className={cn(
                      "rounded-2xl border px-6 py-4 text-sm font-semibold",
                      feedback.correct
                        ? "border-green-500/40 bg-green-500/10 text-green-300"
                        : "border-red-500/40 bg-red-500/10 text-red-300"
                    )}
                  >
                    {feedback.message}
                  </div>
                )}

                {steps[activeStep].uiHint === 'completion_reward' && (
                  <div className="rounded-2xl border border-primary/30 bg-[#14110a] p-6 text-primary shadow-[0_0_25px_rgba(255,195,0,0.15)]">
                    <div className="text-xs font-bold uppercase tracking-widest">Completion</div>
                    <div className="mt-2 text-2xl font-black">+30 XP</div>
                    <p className="mt-2 text-sm text-primary/80">You unlocked the next lesson node.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
          {!isLoading && steps.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-surface p-8 text-white/60">
              No lesson data available yet.
            </div>
          )}

          <div className="mt-auto flex justify-between pt-10">
            <button 
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => prev - 1)}
              className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white disabled:opacity-0"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            {canContinue && progress < 100 && (
              <button
                onClick={() => advanceStep(activeStep)}
                className="rounded-xl border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-bold text-primary hover:bg-primary/20 transition"
              >
                Continue
              </button>
            )}
            {progress === 100 && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={async () => {
                  if (!id) return;
                  try {
                    await completeLesson(id);
                  } catch {
                    // ignore and still navigate back
                  }
                  navigate('/dashboard');
                }}
                className="rounded-xl bg-primary px-8 py-3 font-bold text-background glow-gold hover:scale-105 transition-all"
              >
                Finish Lesson
              </motion.button>
            )}
          </div>
        </section>

        <section className="relative flex min-h-[60vh] w-full md:w-[40%] flex-col bg-[#050505] p-6 md:min-h-full">
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

            <div className="flex-1 overflow-y-auto font-mono text-xl space-y-2">
              {terminalHistory.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    line.startsWith('$')
                      ? "text-white"
                      : line.startsWith('Success')
                        ? "text-green-400"
                        : line.startsWith('Error')
                          ? "text-red-400"
                          : "text-white/40"
                  )}
                >
                  {line}
                </div>
              ))}
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 text-xl">
                <span className="text-primary font-bold text-xl">$</span>
                <input
                  autoFocus
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-white text-xl"
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
