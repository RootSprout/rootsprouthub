import { motion } from 'motion/react';

type IntroCardProps = {
  title: string;
  content: string;
  diagramSrc?: string;
};

type SectionMap = {
  description: string[];
  keyPoints: { title: string; detail: string }[];
  examples: { title: string; detail: string }[];
  visualMapping: string[];
  keyInsight: string[];
  observe: string[];
  diagramText: string[];
  terminalPrompt: string[];
  diagramImage: string;
  labels: {
    description: string;
    keyPoints: string;
    examples: string;
    visualMapping: string;
    keyInsight: string;
    observe: string;
    diagramText: string;
    terminalPrompt: string;
  };
};

const headingMap: Record<string, keyof SectionMap | 'diagram'> = {
  'What is an Operating System?': 'description',
  'What does an OS actually do?': 'keyPoints',
  'Real-Life Examples': 'examples',
  'Mermaid Diagram (Enhanced Mental Model)': 'diagram',
  'Visual Mapping': 'visualMapping',
  'Think of the system like a busy city:': 'visualMapping',
  'Key Insight': 'keyInsight',
  'Observe:': 'observe',
  'Diagram: Traffic Flow Model': 'diagramText',
  'Terminal Prompt': 'terminalPrompt',
};

function parseIntroContent(content: string): SectionMap {
  const sections: SectionMap = {
    description: [],
    keyPoints: [],
    examples: [],
    visualMapping: [],
    keyInsight: [],
    observe: [],
    diagramText: [],
    terminalPrompt: [],
    diagramImage: '',
    labels: {
      description: '',
      keyPoints: '',
      examples: '',
      visualMapping: '',
      keyInsight: '',
      observe: '',
      diagramText: '',
      terminalPrompt: '',
    },
  };
  let current: keyof SectionMap | 'diagram' = 'description';
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
      if (current in sections.labels) {
        sections.labels[current as keyof SectionMap['labels']] = line;
      }
      return;
    }
    if (current === 'keyPoints' || current === 'examples') {
      const parts = line.split('->').map((part) => part.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const [title, ...rest] = parts;
        const detail = rest.join(' -> ');
        if (current === 'keyPoints') {
          sections.keyPoints.push({ title, detail });
        } else {
          sections.examples.push({ title, detail });
        }
        return;
      }
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
      return;
    }
    if (current === 'terminalPrompt') {
      sections.terminalPrompt.push(line);
      return;
    }
    if (current !== 'diagram') {
      sections.description.push(line);
    }
  });

  return sections;
}

function resolveImage(src: string, fallback?: string) {
  if (src) {
    if (src.startsWith('http') || src.startsWith('/')) return src;
    if (src === 'traffic-flow-diagram') {
      return new URL('../../assets/OS/section-1/traffic-flow-diagram.png', import.meta.url).toString();
    }
    if (src === 'os-diagram') {
      return new URL('../../assets/OS/section-1/1.png', import.meta.url).toString();
    }
    return src;
  }
  return fallback || '';
}

export default function IntroCard({ title, content, diagramSrc }: IntroCardProps) {
  const sections = parseIntroContent(content);
  const [headline, supporting, ...restDescription] = sections.description;
  const heroDescription = headline || '';
  const heroSupporting = supporting ? supporting : restDescription.join(' ');
  const diagramImage = resolveImage(sections.diagramImage, diagramSrc);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto w-full max-w-[1440px] px-4 md:px-8"
    >
      <div className="mt-10">
        <div className="rounded-3xl border border-[#FFC107]/40 bg-[#121212] p-6 md:p-10 shadow-[0_0_34px_rgba(255,195,0,0.14)] transition hover:scale-[1.02] hover:shadow-[0_0_42px_rgba(255,195,0,0.24)] overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFC107]">
            {title || ''}
          </div>
          <h1 className="mt-5 text-xl md:text-3xl font-black tracking-tight text-white break-words leading-tight">
            {sections.labels.description}
          </h1>
          <div className="mt-5 h-[3px] w-20 rounded-full bg-[#FFC107]" />
          {heroDescription && (
            <p className="mt-4 text-sm md:text-lg leading-relaxed text-white/85">{heroDescription}</p>
          )}
          {heroSupporting && (
            <p className="mt-4 text-xs md:text-base leading-relaxed text-white/60">{heroSupporting}</p>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            {sections.labels.keyPoints || ''}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {sections.keyPoints.map((item) => (
              <div key={`${item.title}-${item.detail}`} className="group md:[perspective:1200px]">
                <div className="relative h-full min-h-[140px] break-words rounded-2xl border border-white/10 bg-[#1C1C1C] p-6 text-white/80 shadow-[0_0_18px_rgba(255,195,0,0.06)] transition duration-700 ease-out md:[transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] hover:border-[#FFC107]/60 hover:shadow-[0_0_26px_rgba(255,195,0,0.18)]">
                  <div className="static md:absolute inset-0 p-6 md:[backface-visibility:hidden]">
                    <div className="text-base font-bold text-white break-words">{item.title}</div>
                    <div className="mt-2 text-[11px] text-white/50 hidden md:block">Hover to flip</div>
                    <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40 md:hidden">What it means</div>
                    <div className="mt-2 text-xs leading-relaxed text-white/70 md:hidden">{item.detail}</div>
                  </div>
                  <div className="hidden md:block absolute inset-0 p-6 md:[backface-visibility:hidden] md:[transform:rotateY(180deg)]">
                    <div className="text-sm font-semibold text-white">What it means</div>
                    <div className="mt-2 text-xs leading-relaxed text-white/70">{item.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {sections.visualMapping.length > 0 && (
          <div>
            <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
              {sections.labels.visualMapping || ''}
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1C1C1C] p-6 text-white/80 shadow-[0_0_18px_rgba(255,195,0,0.06)]">
              <div className="grid gap-3 md:grid-cols-3">
                {sections.visualMapping.map((line) => (
                  <div
                    key={line}
                    className="rounded-xl border border-[#FFC107]/30 bg-[#141414] px-4 py-3 text-xs md:text-sm font-semibold text-white/85"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {sections.keyInsight.length > 0 && (
          <div className="rounded-2xl border border-[#FFC107]/30 bg-[#14110a] p-6 text-white/80 shadow-[0_0_22px_rgba(255,195,0,0.12)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFC107]">
              {sections.labels.keyInsight || ''}
            </div>
            <div className="mt-4 space-y-1 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {sections.keyInsight.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
        )}

        {sections.observe.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#181818] p-6 text-white/80 shadow-[0_0_18px_rgba(255,195,0,0.06)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
              {sections.labels.observe || ''}
            </div>
            <ul className="mt-4 space-y-2 text-sm md:text-base text-white/70">
              {sections.observe.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FFC107]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(sections.diagramText.length > 0 || diagramImage) && (
          <div className="rounded-2xl border border-[#FFC107]/30 bg-[#0f0d08] p-6 shadow-[0_0_25px_rgba(255,195,0,0.12)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFC107]">
              {sections.labels.diagramText || ''}
            </div>
            {diagramImage ? (
              <img src={diagramImage} alt="Diagram" className="mt-4 w-full rounded-2xl" />
            ) : (
              <pre className="mt-4 whitespace-pre-wrap font-mono text-xs md:text-sm text-white/80">
                {sections.diagramText.join('\n')}
              </pre>
            )}
          </div>
        )}

        <div>
          <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            {sections.labels.examples || ''}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {sections.examples.map((item) => (
              <div key={`${item.title}-${item.detail}`} className="group md:[perspective:1200px]">
                <div className="relative h-full min-h-[140px] break-words rounded-2xl border border-white/10 bg-[#1C1C1C] p-7 text-base text-white/80 shadow-[0_0_18px_rgba(255,195,0,0.08)] transition duration-700 ease-out md:[transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] hover:border-[#FFC107]/60 hover:shadow-[0_0_26px_rgba(255,195,0,0.18)]">
                  <div className="static md:absolute inset-0 p-7 md:[backface-visibility:hidden]">
                    <div className="text-base font-bold text-white break-words">{item.title}</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/60">
                      {item.detail.split('/').map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-[#FFC107]/50 px-3 py-1.5 text-[#FFC107]/90"
                        >
                          {label.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40 md:hidden">Common OS</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/70 md:hidden">
                      {item.detail.split('/').map((label) => (
                        <span
                          key={`${label}-mobile`}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-white/70"
                        >
                          {label.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:block absolute inset-0 p-7 md:[backface-visibility:hidden] md:[transform:rotateY(180deg)]">
                    <div className="text-sm font-semibold text-white">Common OS</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/70">
                      {item.detail.split('/').map((label) => (
                        <span
                          key={`${label}-back`}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-white/70"
                        >
                          {label.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {sections.terminalPrompt.length > 0 && (
          <div className="rounded-2xl border-2 border-[#FFD166]/60 bg-[#0F0F0F] p-5 text-base text-white/70">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FFD166]/90">
              {sections.labels.terminalPrompt || ''}
            </div>
            <div className="space-y-2 font-mono text-[#FFD166]">
              {sections.terminalPrompt.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
