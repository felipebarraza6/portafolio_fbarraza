import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, Lock, PenLine, UserCheck } from 'lucide-react';
import { openCode } from '../../data/cv';
import { METAL, Sprite, ball, bitmap, checker, metal } from '../../lib/pixelKit';

const BW = 24;
const BH = 26;
const AUTO_MS = 3200;
const PAUSE_TICKS = 3;

const GLYPHS: Record<string, string[]> = {
  orchestrator: ['..#..', '.#.#.', '#.#.#', '.#.#.', '..#..'],
  builder: ['####.', '####.', '..#..', '..#..', '..#..'],
  verifier: ['....#', '...#.', '#.#..', '.#...', '.....'],
  reviewer: ['.###.', '#...#', '#.#.#', '#...#', '.###.'],
  deployer: ['..#..', '.###.', '#####', '..#..', '.#.#.'],
};

function mix(hex: string, to: number, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.round(((n >> s) & 255) * (1 - k) + to * k);
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')}`;
}

function MiniBot({ id, color, active }: { id: string; color: string; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    const screenA = active ? mix(color, 0, 0.72) : '#1d2021';
    const screenB = active ? mix(color, 0, 0.82) : '#161819';
    const s = new Sprite(BW, BH);
    for (let y = 1; y <= 4; y++) {
      s.set(11, y, METAL.high);
      s.set(12, y, METAL.mid);
    }
    s.rrect(0, 10, 4, 6, 1, metal);
    s.rrect(20, 10, 4, 6, 1, metal);
    s.rrect(2, 4, 20, 16, 3, metal);
    s.rrect(4, 6, 16, 12, 2, (x, y) => (y % 2 || checker(x, y) ? screenB : screenA));
    s.rrect(6, 19, 12, 7, 2, metal);
    s.ellipse(11.5, 1.5, 1.6, 1.6, ball, null);
    ctx.clearRect(0, 0, BW, BH);
    ctx.drawImage(s.toCanvas(), 0, 0);
    const glyph = GLYPHS[id] ?? GLYPHS.orchestrator;
    if (active) {
      const halo = mix(color, 0, 0.45);
      glyph.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          if (row[x] !== '#') continue;
          ctx.fillStyle = halo;
          ctx.fillRect(9 + x, 9 + y, 2, 2);
        }
      });
    }
    bitmap(ctx, glyph, 10, 9, { '#': active ? color : '#665c54' });
    ctx.fillStyle = active ? color : '#3c3836';
    ctx.fillRect(11, 0, 2, 1);
    ctx.fillRect(11, 22, 2, 2);
  }, [id, color, active]);

  return (
    <canvas
      ref={ref}
      width={BW}
      height={BH}
      className={`pixel-art block ${active ? 'agent-active' : ''}`}
      style={{ width: BW * 3, height: BH * 3, '--glow': color } as CSSProperties}
      aria-hidden="true"
    />
  );
}

export default function AgentSwarm() {
  const agents = openCode.agents;
  const [active, setActive] = useState(0);
  const pausedTicks = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (pausedTicks.current > 0) {
        pausedTicks.current -= 1;
        return;
      }
      setActive((i) => (i + 1) % agents.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [agents.length]);

  const pick = (i: number) => {
    pausedTicks.current = PAUSE_TICKS;
    setActive(i);
  };

  const current = agents[active];
  const next = agents[(active + 1) % agents.length];
  const slot = (i: number) => `${((i + 0.5) / agents.length) * 100}%`;
  const isLast = active === agents.length - 1;

  return (
    <div className="w-full">
      <div className="relative">
        <div className="agent-track" aria-hidden="true">
          <span
            key={active}
            className="agent-packet"
            style={
              {
                '--from': slot(active),
                '--to': isLast ? '100%' : slot(active + 1),
                '--glow': current.color,
              } as CSSProperties
            }
          />
        </div>
        <div className="relative grid grid-cols-5 gap-1 sm:gap-3">
          {agents.map((agent, i) => {
            const isActive = i === active;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => pick(i)}
                className="flex flex-col items-center gap-1.5 bg-transparent border-0 cursor-pointer"
                aria-pressed={isActive}
                aria-label={`${agent.label}: ${agent.role}`}
              >
                <MiniBot id={agent.id} color={agent.color} active={isActive} />
                <span
                  className="font-mono text-[10px] sm:text-[11px] transition-colors"
                  style={{ color: isActive ? agent.color : 'var(--text-muted)' }}
                >
                  {agent.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex gap-1">
        {agents.map((a, i) => (
          <span
            key={a.id}
            className="h-1 flex-1 transition-all duration-500"
            style={{ background: i <= active ? a.color : '#3c3836', boxShadow: i === active ? `0 0 10px ${a.color}` : 'none' }}
          />
        ))}
      </div>

      <div className="agent-card mt-4 border border-[#3c3836] bg-[rgba(29,32,33,0.7)] p-4">
        <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
          <span className="truncate" style={{ color: current.color }}>
            {current.label} · paso {active + 1}/{agents.length}
          </span>
          <span className="text-[var(--text-muted)] shrink-0">
            → <span style={{ color: isLast ? 'var(--yellow)' : next.color }}>{isLast ? 'humano' : next.label}</span>
          </span>
        </div>
        <p className="agent-role text-sm text-[var(--text-secondary)]">{current.role}</p>
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 font-mono text-[11px]">
          <span className="agent-io border border-[#3c3836] px-2 py-1.5 text-[var(--text-muted)]">
            <span className="block text-[9px] uppercase tracking-wider text-[var(--blue)]">recibe</span>
            {current.input}
          </span>
          <ArrowRight size={14} className="self-center shrink-0" style={{ color: current.color }} />
          <span className="agent-io border border-[#3c3836] px-2 py-1.5 text-[var(--text-secondary)]">
            <span className="block text-[9px] uppercase tracking-wider" style={{ color: current.color }}>
              entrega
            </span>
            {current.output}
          </span>
        </div>
        <div className="agent-tags flex flex-wrap gap-1.5 content-start">
          <span className="tag" style={{ color: current.color }}>
            model · {current.model}
          </span>
          <span className="tag" style={{ color: current.edits ? 'var(--green)' : 'var(--text-muted)' }}>
            {current.edits ? <PenLine size={11} /> : <Lock size={11} />} {current.edits ? 'edita' : 'solo lectura'}
          </span>
          <span className={`tag ${current.human ? '' : 'invisible'}`} style={{ color: 'var(--yellow)' }}>
            <UserCheck size={11} /> humano
          </span>
        </div>
        <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">
          vars · {current.vars.join(' · ')}
        </p>
      </div>
    </div>
  );
}
