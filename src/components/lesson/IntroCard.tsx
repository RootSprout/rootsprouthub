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
  mentalModel: string[];
};

const headingMap: Record<string, keyof SectionMap | 'diagram'> = {
  'What is an Operating System?': 'description',
  'What does an OS actually do?': 'keyPoints',
  'Real-Life Examples': 'examples',
  'Mermaid Diagram (Enhanced Mental Model)': 'diagram',
  'Terminal Prompt': 'mentalModel',
};

function parseIntroContent(content: string) {
  const sections: SectionMap = {
    description: [],
    keyPoints: [],
    examples: [],
    mentalModel: [],
  };
  let current: keyof SectionMap | 'diagram' = 'description';
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);

  lines.forEach((line) => {
    if (headingMap[line]) {
      current = headingMap[line];
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
    if (current === 'mentalModel') {
      sections.mentalModel.push(line);
      return;
    }
    if (current !== 'diagram') {
      sections.description.push(line);
    }
  });

  return sections;
}

export default function IntroCard({ title, content, diagramSrc }: IntroCardProps) {
  const sections = parseIntroContent(content);
  const [headline, supporting, ...restDescription] = sections.description;
  const heroTitle = title || 'Lesson Introduction';
  const heroDescription = headline || '';
  const heroSupporting = supporting ? supporting : restDescription.join(' ');
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
            What is it
          </div>
          <h1 className="mt-5 text-2xl md:text-4xl font-black tracking-tight text-white break-words leading-tight">
            What is an Operating System (OS)?
          </h1>
          <div className="mt-5 h-[3px] w-20 rounded-full bg-[#FFC107]" />
          <p className="mt-4 text-base md:text-xl leading-relaxed text-white/85">{heroDescription}</p>
          {heroSupporting && (
            <p className="mt-4 text-sm md:text-lg leading-relaxed text-white/60">{heroSupporting}</p>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
            Functional Capabilities
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {sections.keyPoints.map((item) => (
              <div
                key={`${item.title}-${item.detail}`}
                className="group md:[perspective:1200px]"
              >
                <div className="relative h-full min-h-[140px] break-words rounded-2xl border border-white/10 bg-[#1C1C1C] p-6 text-white/80 shadow-[0_0_18px_rgba(255,195,0,0.06)] transition duration-700 ease-out md:[transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] hover:border-[#FFC107]/60 hover:shadow-[0_0_26px_rgba(255,195,0,0.18)]">
                  <div className="static md:absolute inset-0 p-6 md:[backface-visibility:hidden]">
                    <div className="text-lg font-bold text-white break-words">{item.title}</div>
                    <div className="mt-2 text-xs text-white/50 hidden md:block">Hover to flip</div>
                    <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/40 md:hidden">What it means</div>
                    <div className="mt-2 text-sm leading-relaxed text-white/70 md:hidden">{item.detail}</div>
                  </div>
                  <div className="hidden md:block absolute inset-0 p-6 md:[backface-visibility:hidden] md:[transform:rotateY(180deg)]">
                    <div className="text-base font-semibold text-white">What it means</div>
                    <div className="mt-2 text-sm leading-relaxed text-white/70">{item.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
            Device Ecosystem
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {sections.examples.map((item) => (
              <div
                key={`${item.title}-${item.detail}`}
                className="group md:[perspective:1200px]"
              >
                <div className="relative h-full min-h-[140px] break-words rounded-2xl border border-white/10 bg-[#1C1C1C] p-7 text-base text-white/80 shadow-[0_0_18px_rgba(255,195,0,0.08)] transition duration-700 ease-out md:[transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] hover:border-[#FFC107]/60 hover:shadow-[0_0_26px_rgba(255,195,0,0.18)]">
                  <div className="static md:absolute inset-0 p-7 md:[backface-visibility:hidden]">
                    <div className="text-lg font-bold text-white break-words">{item.title}</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                      {item.detail.split('/').map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-[#FFC107]/50 px-3 py-1.5 text-[#FFC107]/90"
                        >
                          {label.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/40 md:hidden">Common OS</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/70 md:hidden">
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
                    <div className="text-base font-semibold text-white">Common OS</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
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

        <div className="rounded-3xl border border-white/10 bg-[#0F0F0F] p-10 shadow-[0_0_30px_rgba(255,195,0,0.08)]">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">The Layers of Interaction</h3>
            <p className="mt-3 text-base text-white/50">
              See how the OS sits in the middle of everything you do.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="w-full max-w-[760px] rounded-xl border border-[#FFC107]/70 bg-[#1a1a1a] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.25em] text-[#FFC107]">
              User Interaction (UI/UX)
            </div>
            <div className="text-white/40">↓</div>
            <div className="w-full max-w-[760px] rounded-xl border border-white/10 bg-[#121212] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Applications (Browser, Games, Spotify)
            </div>
            <div className="text-white/40">↓</div>
            <div className="w-full max-w-[760px] rounded-xl border border-[#FFC107]/70 bg-[#161616] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#FFC107] shadow-[0_0_18px_rgba(255,195,0,0.2)]">
              Kernel & System Services
            </div>
            <div className="text-white/40">↓</div>
            <div className="w-full max-w-[760px] rounded-xl border border-white/10 bg-[#121212] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Physical Hardware (CPU, RAM, Disk)
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#FFD166]/60 bg-[#0F0F0F] p-5 text-base text-white/70">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-[#FFD166]/90">
            Terminal Prompt
          </div>
          {sections.mentalModel.length > 0 && (
            <>
              <div className="rounded-xl border border-[#FFD166]/40 bg-[#101010] px-4 py-3 font-mono text-[#FFD166]">
                {sections.mentalModel[0]}
              </div>
              {sections.mentalModel.slice(1).map((line) => (
                <p key={line} className="mt-3 text-white/70">
                  {line}
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
