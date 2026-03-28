import { motion } from 'motion/react';

type DiagramManagerCardProps = {
  content: string;
  diagramSrc?: string;
};

type Role = {
  title: string;
  detail: string;
};

type DiagramManagerContent = {
  title: string;
  summary: string;
  lead: string;
  roles: Role[];
  terminalCommand: string;
  terminalReason: string;
  diagramImage: string;
};

function parseDiagramManagerContent(content: string): DiagramManagerContent {
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);
  const result: DiagramManagerContent = {
    title: 'OS Manager',
    summary: '',
    lead: '',
    roles: [],
    terminalCommand: '',
    terminalReason: '',
    diagramImage: ''
  };

  let mode: 'roles' | 'terminal' | 'reason' = 'roles';
  let pendingRoleTitle = '';
  const reasonLines: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith('Diagram:')) {
      result.title = line.replace('Diagram:', '').trim() || result.title;
      return;
    }

    if (line.startsWith('Diagram Image:')) {
      result.diagramImage = line.replace('Diagram Image:', '').trim();
      return;
    }

    if (line === 'Terminal Prompt') {
      mode = 'terminal';
      return;
    }
    if (line === 'Why this works:') {
      mode = 'reason';
      return;
    }

    if (mode === 'terminal') {
      if (!result.terminalCommand) {
        result.terminalCommand = line;
      }
      return;
    }
    if (mode === 'reason') {
      reasonLines.push(line);
      return;
    }

    if (!result.summary) {
      result.summary = line;
      return;
    }
    if (!result.lead) {
      result.lead = line;
      return;
    }

    if (!pendingRoleTitle) {
      pendingRoleTitle = line;
      return;
    }
    result.roles.push({ title: pendingRoleTitle, detail: line });
    pendingRoleTitle = '';
  });

  if (pendingRoleTitle) {
    result.roles.push({ title: pendingRoleTitle, detail: '' });
  }
  result.terminalReason = reasonLines.join(' ');

  return result;
}

export default function DiagramManagerCard({ content}: DiagramManagerCardProps) {
  const data = parseDiagramManagerContent(content);
  const resolveImage = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('/')) return src;
  
    try {
      return new URL(`../../assets/OS/section-1/${src}`, import.meta.url).toString();
    } catch {
      return '';
    }
  };
  
  const finalImage = resolveImage(data.diagramImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto w-full max-w-[1200px] px-4 md:px-8"
    >
      <div className="rounded-3xl border border-white/10 bg-[#121212] p-7 md:p-9 text-white/80 shadow-[0_0_22px_rgba(0,0,0,0.25)]">
        <div className="text-sm md:text-base font-bold uppercase tracking-[0.35em] text-[#FFC107]">
          Diagram
        </div>
        {finalImage && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#FFC107]/30 bg-[#0f0f0f] p-6 md:p-8 shadow-[0_0_18px_rgba(255,195,0,0.12)]">
            <img
              src={finalImage}
              alt={`Diagram: ${data.title}`}
              className="h-[320px] w-full object-contain md:h-[420px]"
              loading="lazy"
            />
          </div>
        )}
        {data.summary && (
          <p className="mt-6 text-base md:text-lg text-white/75">{data.summary}</p>
        )}
        {data.lead && (
          <p className="mt-5 text-base md:text-lg text-[#FFD166]/85 underline decoration-[#FFD166]/70 underline-offset-4">
            {data.lead}
          </p>
        )}
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {data.roles.map((role) => (
            <div
              key={`${role.title}-${role.detail}`}
              className="rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 py-4"
            >
              <div className="text-sm font-semibold text-white">{role.title}</div>
              {role.detail && (
                <div className="mt-2 text-xs md:text-sm text-white/60">{role.detail}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {data.terminalCommand && (
        <div className="mt-8 rounded-2xl border-2 border-[#FFD166]/60 bg-[#0F0F0F] p-6 shadow-[0_0_18px_rgba(255,195,0,0.12)]">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFD166]/90">
            Terminal Prompt
          </div>
          <div className="mt-4 space-y-2 font-mono text-sm md:text-base text-[#FFD166]">
            <div>{data.terminalCommand}</div>
          </div>
          {data.terminalReason && (
            <>
              <div className="mt-4 text-xs md:text-sm text-[#FFD166]/80">
                Why this works:
              </div>
              <div className="mt-2 text-xs md:text-sm text-white/70">
                {data.terminalReason}
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
