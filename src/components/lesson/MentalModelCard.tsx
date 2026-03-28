import { motion } from 'motion/react';

type MentalModelCardProps = {
  title: string;
  content: string;
};

type SectionMap = {
  summary: string[];
  visualMapping: string[];
  keyInsight: string[];
  observe: string[];
  diagramText: string[];
  diagramImage: string;
  visualMappingLabel: string;
  keyInsightLabel: string;
  observeLabel: string;
  diagramLabel: string;
  keyInsightWithoutLabel: string;
  keyInsightWithLabel: string;
};

const headingMap: Record<string, keyof SectionMap | 'terminal'> = {
  Summary: 'summary',
  Overview: 'summary',
  'Visual Mapping': 'visualMapping',
  'Think of the system like a busy city:': 'visualMapping',
  'Key Insight': 'keyInsight',
  'Observe:': 'observe',
  'Diagram: Traffic Flow Model': 'diagramText',
  'Diagram: Access Flow Model': 'diagramText',
  'Terminal Prompt': 'terminal',
};

function parseMentalModelContent(content: string) {
  const sections: SectionMap = {
    summary: [],
    visualMapping: [],
    keyInsight: [],
    observe: [],
    diagramText: [],
    diagramImage: '',
    visualMappingLabel: '',
    keyInsightLabel: '',
    observeLabel: '',
    diagramLabel: '',
    keyInsightWithoutLabel: '',
    keyInsightWithLabel: '',
  };
  let current: keyof SectionMap | 'terminal' = 'summary';
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);

  lines.forEach((line) => {
    if (line.startsWith('Diagram Image:')) {
      sections.diagramImage = line.replace('Diagram Image:', '').trim();
      return;
    }
    if (line.startsWith('Image:') && !sections.diagramImage) {
      sections.diagramImage = line.replace('Image:', '').trim();
      return;
    }
    if (headingMap[line]) {
      current = headingMap[line];
      if (current === 'visualMapping') sections.visualMappingLabel = line;
      if (current === 'keyInsight') sections.keyInsightLabel = line;
      if (current === 'observe') sections.observeLabel = line;
      if (current === 'diagramText') sections.diagramLabel = line;
      return;
    }
    if (current === 'summary') {
      sections.summary.push(line);
      return;
    }
    if (current === 'visualMapping') {
      sections.visualMapping.push(line);
      return;
    }
    if (current === 'keyInsight') {
      sections.keyInsight.push(line);
      return;
    }
    if (current === 'observe') {
      sections.observe.push(line);
      return;
    }
    if (current === 'diagramText') {
      sections.diagramText.push(line);
    }
  });

  return sections;
}

export default function MentalModelCard({ content }: MentalModelCardProps) {
  const sections = parseMentalModelContent(content);
  const stripEmoji = (value: string) =>
    value.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
    const resolveImage = (src: string) => {
      if (!src) return '';
    
      if (src.startsWith('http') || src.startsWith('/')) return src;
    
      try {
        return new URL(`../../assets/OS/section-1/${src}`, import.meta.url).toString();
      } catch {
        return '';
      }
    };
  const splitKeyInsights = (lines: string[]) => {
    const withoutOS: string[] = [];
    const withOS: string[] = [];
    let bucket: 'without' | 'with' | null = null;
    lines.forEach((line) => {
      const cleaned = stripEmoji(line).replace(/:$/, '').trim();
      if (!cleaned) return;
      if (['without the os', 'without kernel protection'].includes(cleaned.toLowerCase())) {
        bucket = 'without';
        sections.keyInsightWithoutLabel = line;
        return;
      }
      if (['with the os', 'with kernel protection'].includes(cleaned.toLowerCase())) {
        bucket = 'with';
        sections.keyInsightWithLabel = line;
        return;
      }
      if (bucket === 'without') {
        withoutOS.push(cleaned);
      } else if (bucket === 'with') {
        withOS.push(cleaned);
      }
    });
    return { withoutOS, withOS };
  };
  const keyInsightGroups = splitKeyInsights(sections.keyInsight);
  const summaryText =
    sections.summary.join(' ') ||
    'Lock in a single picture you can recall instantly when you think about how the OS keeps everything flowing.';
  const diagramImage = resolveImage(sections.diagramImage);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto w-full max-w-[1200px] px-4 md:px-8"
    >
      <div className="rounded-[32px] border border-primary/40 bg-[radial-gradient(circle_at_top,_rgba(255,193,7,0.18),_rgba(8,8,8,0.95))] p-8 md:p-12 shadow-[0_0_40px_rgba(255,195,0,0.18)]">
        <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-white">Mental Model</h1>
        {summaryText ? (
          <p className="mt-4 max-w-2xl text-sm md:text-lg text-white/70">{summaryText}</p>
        ) : (
          <div className="mt-4 h-10 max-w-2xl rounded-xl border border-white/5 bg-white/5" />
        )}
      </div>

      <div className="mt-10">
        <div className="mb-4 text-[11px] min-h-[14px] text-[10px] font-bold uppercase tracking-[0.35em] text-white/50">
          {sections.visualMappingLabel || ''}
        </div>
        {sections.visualMapping.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {sections.visualMapping.map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-primary/30 bg-[#151515] px-5 py-4 text-sm md:text-base font-semibold text-white/85 shadow-[0_0_18px_rgba(255,195,0,0.08)]"
              >
                {stripEmoji(line)}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-16 rounded-2xl border border-white/5 bg-white/5" />
        )}
      </div>

      <div className="mt-8">
        <div className="mb-4 min-h-[10px] text-[11px] font-bold uppercase tracking-[0.35em] text-primary">
          {sections.keyInsightLabel || ''}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#14110a] p-5 shadow-[0_0_20px_rgba(255,195,0,0.1)]">
            <div className="min-h-[14px] text-xs font-bold uppercase tracking-[0.3em] text-white/60">
              {sections.keyInsightWithoutLabel || ''}
            </div>
            {keyInsightGroups.withoutOS.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {keyInsightGroups.withoutOS.map((line) => (
                  <li key={line} className="rounded-lg border border-white/10 bg-[#1b140b] px-3 py-2">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 h-20 rounded-xl border border-white/5 bg-white/5" />
            )}
          </div>
          <div className="rounded-2xl border border-primary/30 bg-[#14110a] p-5 shadow-[0_0_20px_rgba(255,195,0,0.12)]">
            <div className="min-h-[14px] text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {sections.keyInsightWithLabel || ''}
            </div>
            {keyInsightGroups.withOS.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {keyInsightGroups.withOS.map((line) => (
                  <li key={line} className="rounded-lg border border-primary/20 bg-[#1b140b] px-3 py-2">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 h-20 rounded-xl border border-white/5 bg-white/5" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-[#0f0f0f] p-7 md:p-9 text-white/75">
        <div className="min-h-[14px] text-[13px] font-bold uppercase tracking-[0.35em] text-white/50">
          {sections.observeLabel || ''}
        </div>
        {sections.observe.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {sections.observe.map((line) => (
              <div key={line} className="rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-sm text-white/75">
                {stripEmoji(line)}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 h-16 rounded-2xl border border-white/5 bg-white/5" />
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-primary/30 bg-[#0b0a07] p-7 md:p-9 shadow-[0_0_26px_rgba(255,195,0,0.12)]">
        <div className="min-h-[14px] text-[13px] font-bold uppercase tracking-[0.35em] text-primary">
          DIAGRAM
        </div>
        {diagramImage ? (
          <img
            src={diagramImage}
            alt="Mental model diagram"
            className="mt-4 w-full max-w-[720px] mx-auto rounded-2xl"
          />
        ) : sections.diagramText.length > 0 ? (
          <pre className="mt-4 whitespace-pre-wrap text-xs md:text-sm text-white/75">
            {sections.diagramText.join('\n')}
          </pre>
        ) : (
          <div className="mt-4 h-40 rounded-2xl border border-white/10 bg-white/5" />
        )}
      </div>
    </motion.div>
  );
}
