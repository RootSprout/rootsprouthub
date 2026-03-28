import { motion } from 'motion/react';
import trafficFlowDiagram from '../../assets/OS/section-1/traffic-flow-diagram.png';

type MentalModelCardProps = {
  title: string;
  subtitle?: string;
  content: string;
};

type SectionMap = {
  visualMapping: string[];
  keyInsight: string[];
  observe: string[];
  diagramText: string[];
  terminal: string[];
};

const headingMap: Record<string, keyof SectionMap> = {
  'Visual Mapping': 'visualMapping',
  'Think of the system like a busy city:': 'visualMapping',
  'Key Insight': 'keyInsight',
  'Observe:': 'observe',
  'Diagram: Traffic Flow Model': 'diagramText',
  'Terminal Prompt': 'terminal',
};

function parseMentalModelContent(content: string) {
  const sections: SectionMap = {
    visualMapping: [],
    keyInsight: [],
    observe: [],
    diagramText: [],
    terminal: [],
  };

  let current: keyof SectionMap = 'visualMapping';

  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);

  lines.forEach((line) => {
    if (headingMap[line]) {
      current = headingMap[line];
      return;
    }
    sections[current].push(line);
  });

  return sections;
}

export default function MentalModelCardVariant({
  title,
  subtitle,
  content,
}: MentalModelCardProps) {
  const sections = parseMentalModelContent(content);

  const stripEmoji = (value: string) =>
    value.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();

  const renderSection = (label: string, items: string[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mt-8">
        <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
          {label}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((line) => (
            <div
              key={line}
              className="rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-sm text-white/75"
            >
              {stripEmoji(line)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto w-full max-w-[1200px] px-4 md:px-8"
    >
      {/* Header */}
      <div className="rounded-[32px] border border-primary/40 bg-[radial-gradient(circle_at_top,_rgba(255,193,7,0.18),_rgba(8,8,8,0.95))] p-8 md:p-12 shadow-[0_0_40px_rgba(255,195,0,0.18)]">
        <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-2xl text-sm md:text-lg text-white/70">
            {subtitle}
          </p>
        )}
      </div>

      {/* Sections */}
      {renderSection('Visual Mapping', sections.visualMapping)}
      {renderSection('Key Insight', sections.keyInsight)}
      {renderSection('Observe', sections.observe)}

      {/* Terminal */}
      {renderSection('Terminal Prompt', sections.terminal)}

      {/* Diagram */}
      {sections.diagramText.length > 0 && (
        <div className="mt-8 rounded-3xl border border-primary/30 bg-[#0b0a07] p-7 md:p-9 shadow-[0_0_26px_rgba(255,195,0,0.12)]">
          <img
            src={trafficFlowDiagram}
            alt="diagram"
            className="mt-4 w-full max-w-[720px] mx-auto rounded-2xl"
          />
        </div>
      )}
    </motion.div>
  );
}