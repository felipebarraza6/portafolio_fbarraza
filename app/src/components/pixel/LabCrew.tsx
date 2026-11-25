import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { openCode } from '../../data/cv';
import { METAL, Sprite, ball, metal } from '../../lib/pixelKit';

const W = 200;
const H = 120;
const FRAME_MS = 90;
const STEP_MS = 3400;
const BOT_W = 26;
const BOT_H = 34;
const FEET_Y = 106;
const PIPE_Y = 46;
const MONITOR = { x: 40, y: 6, w: 120, h: 30 };

type Pt = [number, number];

const centers = openCode.agents.map((_, i) => Math.round(((i + 0.5) / openCode.agents.length) * W));

const CAT_POINTY = [
  '.#.........#.',
  '.##.......##.',
  '.#.#######.#.',
  '#...........#',
  '#...........#',
  '#...........#',
  '#.....#.....#',
  '.#...#.#...#.',
  '..#########..',
];
const CAT_ROUND = [
  '.##.......##.',
  '#..#.....#..#',
  '#...#####...#',
  '#...........#',
  '#...........#',
  '#...........#',
  '#.....#.....#',
  '.#...#.#...#.',
  '..#########..',
];

/** Cada agente tiene su propio gatito: orejas y ojos distintos. */
const STYLES: Record<string, { ears: string[]; eyes: Pt[] }> = {
  orchestrator: { ears: CAT_POINTY, eyes: [[3, 4], [3, 5], [9, 4], [9, 5]] },
  builder: { ears: CAT_ROUND, eyes: [[3, 4], [3, 5], [8, 5], [9, 5], [10, 5]] },
  verifier: {
    ears: CAT_POINTY,
    eyes: [[2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [3, 5], [9, 5]],
  },
  reviewer: { ears: CAT_ROUND, eyes: [[3, 4], [4, 4], [3, 5], [4, 5], [8, 4], [9, 4], [8, 5], [9, 5]] },
  deployer: { ears: CAT_POINTY, eyes: [[2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5]] },
};
const EYES_HAPPY: Pt[] = [[2, 5], [3, 4], [4, 5], [8, 5], [9, 4], [10, 5]];
const EYES_BLINK: Pt[] = [[2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5]];

function mix(hex: string, to: number, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.round(((n >> s) & 255) * (1 - k) + to * k);
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')}`;
}

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function buildBot() {
  const s = new Sprite(BOT_W, BOT_H);
  for (let y = 1; y <= 4; y++) {
    s.set(12, y, METAL.high);
    s.set(13, y, METAL.mid);
  }
  s.ellipse(12.5, 1.5, 1.6, 1.6, ball, null);
  s.rrect(0, 9, 3, 7, 1, metal);
  s.rrect(23, 9, 3, 7, 1, metal);
  s.rrect(1, 4, 24, 18, 3, metal);
  s.rrect(10, 21, 6, 3, 1, metal);
  s.rrect(3, 23, 20, 11, 3, metal);
  s.rrect(7, 25, 12, 6, 1, (_x, _y, _u, v) => (v < 0.15 ? METAL.dark : METAL.deep));
  return s.toCanvas();
}

function buildRoom() {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const fill = (x: number, y: number, w: number, h: number, col: string) => {
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
  };

  for (let y = 0; y < 84; y++) fill(0, y, W, 1, y < 60 ? '#202426' : y % 2 ? '#1c1f21' : '#1e2224');
  for (let x = 0; x < W; x += 25) {
    fill(x, 0, 1, 84, '#171a1b');
    fill(x + 1, 0, 1, 84, '#2a2e30');
  }
  fill(0, 60, W, 1, '#171a1b');
  fill(0, 61, W, 1, '#2a2e30');

  fill(0, 84, W, H - 84, '#16191a');
  fill(0, 84, W, 1, '#2f3335');
  for (const y of [88, 93, 100, 109, 119]) fill(0, y, W, 1, '#1d2122');
  ctx.fillStyle = '#1d2122';
  for (let i = -6; i <= 6; i++) {
    const x0 = 100 + i * 9;
    const x1 = 100 + i * 34;
    const steps = H - 85;
    for (let k = 0; k <= steps; k++) ctx.fillRect(Math.round(x0 + ((x1 - x0) * k) / steps), 85 + k, 1, 1);
  }

  const mon = new Sprite(W, H);
  mon.rrect(MONITOR.x, MONITOR.y, MONITOR.w, MONITOR.h, 3, metal);
  mon.rrect(MONITOR.x + 3, MONITOR.y + 3, MONITOR.w - 6, MONITOR.h - 6, 2, (_x, y) => (y % 2 ? '#0f1412' : '#121a16'));
  mon.rrect(96, 36, 8, 4, 1, metal);
  mon.ellipse(20, 22, 12, 12, metal);
  mon.ellipse(20, 22, 9, 9, (_x, y) => (y % 2 ? '#0b0e12' : '#0d1116'));
  mon.rrect(170, 6, 24, 40, 2, metal);
  for (const y of [10, 18, 26, 34]) mon.rrect(173, y, 18, 6, 1, () => METAL.deep);
  mon.rrect(8, PIPE_Y, 184, 3, 1, (_x, _y, _u, v) => (v < 0.4 ? METAL.mid : METAL.dark));
  ctx.drawImage(mon.toCanvas(), 0, 0);
  return c;
}

function catLines(rows: string[]) {
  const lit: Pt[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === '#') lit.push([x, y]);
  });
  return lit;
}

const pathLength = (pts: Pt[]) =>
  pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

function pointAt(pts: Pt[], t: number): Pt {
  let left = pathLength(pts) * t;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const seg = Math.hypot(bx - ax, by - ay);
    if (left <= seg) {
      const k = seg ? left / seg : 0;
      return [ax + (bx - ax) * k, ay + (by - ay) * k];
    }
    left -= seg;
  }
  return pts[pts.length - 1];
}

/** Lab de agentes en pixel art: cada bot con su gatito, el trabajo viaja por el ducto de datos. */
export default function LabCrew() {
  const agents = openCode.agents;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(0);
  const stepStartRef = useRef(0);
  const pausedRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    activeRef.current = active;
    stepStartRef.current = performance.now();
  }, [active]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (pausedRef.current > 0) {
        pausedRef.current -= 1;
        return;
      }
      setActive((i) => (i + 1) % agents.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [agents.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const room = buildRoom();
    const bot = buildBot();
    const cats = agents.map((a) => {
      const style = STYLES[a.id] ?? STYLES.orchestrator;
      return { lines: catLines(style.ears), eyes: style.eyes };
    });
    const blinkAt = agents.map(() => performance.now() + 1500 + Math.random() * 4000);
    const blinkUntil = agents.map(() => 0);
    const portStars = Array.from({ length: 9 }, () => [13 + Math.random() * 14, 15 + Math.random() * 14, Math.random() * 6]);

    let raf = 0;
    let last = 0;
    let visible = true;

    const render = (now: number) => {
      const t = reduced ? 0 : now / 1000;
      const act = activeRef.current;
      const color = agents[act].color;
      const px = (x: number, y: number, c: string, w = 1, h = 1) => {
        ctx.fillStyle = c;
        ctx.fillRect(Math.round(x), Math.round(y), w, h);
      };

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(room, 0, 0);

      for (const [sx, sy, ph] of portStars) {
        const on = Math.sin(t * 1.3 + ph) > -0.2;
        if (on) px(((sx - 13 + t * 1.5) % 14) + 13, sy, ph > 3 ? '#ebdbb2' : '#83a598');
      }
      px(24, 26, '#458588', 3, 2);
      px(25, 25, '#83a598');

      for (let i = 0; i < 4; i++) {
        const y = 12 + i * 8;
        px(176, y, Math.sin(t * 3 + i * 1.7) > 0 ? '#8ec07c' : '#2b3a2e', 2, 1);
        px(180, y, Math.sin(t * 2.2 + i) > 0.3 ? '#fabd2f' : '#3a3220', 2, 1);
        px(184, y, Math.sin(t * 4 + i * 2.3) > 0.5 ? '#fe8019' : '#3a2516', 2, 1);
      }

      for (let x = MONITOR.x + 4; x < MONITOR.x + MONITOR.w - 4; x += 1) {
        if ((x + Math.floor(t * 8)) % 23 === 0) px(x, MONITOR.y + MONITOR.h - 5, rgba(color, 0.5));
      }

      const ground = ctx.createRadialGradient(centers[act], FEET_Y, 2, centers[act], FEET_Y, 26);
      ground.addColorStop(0, rgba(color, 0.28));
      ground.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = ground;
      ctx.fillRect(centers[act] - 30, 84, 60, H - 84);

      const next = act === agents.length - 1 ? -1 : act + 1;
      agents.forEach((a, i) => {
        const cx = centers[i];
        const lit = i === act || i === next;
        for (let y = PIPE_Y + 3; y < FEET_Y - BOT_H + 1; y++) px(cx, y, lit ? mix(a.color, 0, 0.45) : METAL.base);
      });
      if (next === -1) for (let y = MONITOR.y + MONITOR.h + 4; y < PIPE_Y; y++) px(100, y, mix(color, 0, 0.45));

      const elapsed = reduced ? 0 : Math.min(1, (now - stepStartRef.current) / (STEP_MS * 0.85));
      const ease = elapsed < 0.5 ? 2 * elapsed * elapsed : 1 - (-2 * elapsed + 2) ** 2 / 2;
      const from = centers[act];
      const route: Pt[] =
        next === -1
          ? [[from, FEET_Y - BOT_H], [from, PIPE_Y + 1], [100, PIPE_Y + 1], [100, MONITOR.y + MONITOR.h]]
          : [[from, FEET_Y - BOT_H], [from, PIPE_Y + 1], [centers[next], PIPE_Y + 1], [centers[next], FEET_Y - BOT_H]];
      for (let k = 4; k >= 0; k--) {
        const [qx, qy] = pointAt(route, Math.max(0, ease - k * 0.025));
        px(qx - 1, qy - 1, k === 0 ? color : rgba(color, 0.5 - k * 0.09), 2, 2);
      }

      agents.forEach((a, i) => {
        const isActive = i === act;
        const bob = reduced ? 0 : Math.sin(t * 2 + i * 1.3) > 0.6 ? 1 : 0;
        const ox = centers[i] - BOT_W / 2;
        const oy = FEET_Y - BOT_H - bob - (isActive ? 1 : 0);

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(ox + 4, FEET_Y - 1, BOT_W - 8, 2);
        ctx.drawImage(bot, ox, oy);

        const screenA = mix(a.color, 0, isActive ? 0.74 : 0.86);
        const screenB = mix(a.color, 0, isActive ? 0.8 : 0.9);
        for (let y = 7; y < 19; y++) px(ox + 4, oy + y, y % 2 ? screenB : screenA, 18, 1);

        if (!reduced && now > blinkAt[i]) {
          blinkUntil[i] = now + 150;
          blinkAt[i] = now + 2500 + Math.random() * 4500;
        }
        const line = isActive ? a.color : mix(a.color, 0, 0.35);
        const eyeCol = isActive ? mix(a.color, 255, 0.55) : mix(a.color, 0, 0.15);
        const eyes = isActive ? EYES_HAPPY : now < blinkUntil[i] ? EYES_BLINK : cats[i].eyes;
        const cxo = ox + 7;
        const cyo = oy + 8;
        if (isActive) for (const [x, y] of cats[i].lines) px(cxo + x - 1, cyo + y, mix(a.color, 0, 0.55), 3, 1);
        for (const [x, y] of cats[i].lines) px(cxo + x, cyo + y, line);
        for (const [x, y] of eyes) px(cxo + x, cyo + y, eyeCol);

        const ledOn = (k: number) => Math.sin(t * 2.4 + i + k * 2.1) > 0;
        px(ox + 9, oy + 27, ledOn(0) ? a.color : METAL.dark, 2, 1);
        px(ox + 12, oy + 27, ledOn(1) ? mix(a.color, 255, 0.3) : METAL.dark, 2, 1);
        px(ox + 15, oy + 27, ledOn(2) ? a.color : METAL.dark, 2, 1);
        px(ox + 12, oy, isActive ? a.color : METAL.mid, 2, 1);
      });
    };

    const loop = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        render(now);
      }
      if (visible) raf = requestAnimationFrame(loop);
    };

    render(performance.now());
    if (reduced) return;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [agents]);

  const pick = (i: number) => {
    pausedRef.current = 2;
    setActive(i);
  };

  const current = agents[active];
  const isLast = active === agents.length - 1;
  const pct = (v: number, total: number) => `${(v / total) * 100}%`;

  return (
    <div className="lab-crew relative w-full select-none" style={{ aspectRatio: `${W} / ${H}` }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="pixel-art absolute inset-0 w-full h-full"
        role="img"
        aria-label="Laboratorio con cinco agentes de IA cooperando: orchestrator, builder, verifier, reviewer y deployer"
      />

      <div
        className="lab-monitor absolute flex flex-col justify-center"
        style={{
          left: pct(MONITOR.x + 5, W),
          top: pct(MONITOR.y + 3, H),
          width: pct(MONITOR.w - 10, W),
          height: pct(MONITOR.h - 6, H),
        }}
        aria-live="polite"
      >
        <span className="lab-monitor-meta">
          lab cortex · paso {active + 1}/{agents.length}
        </span>
        <span key={active} className="lab-monitor-line" style={{ '--glow': current.color } as CSSProperties}>
          <span style={{ color: current.color }}>{current.label}</span>
          <span className="text-[var(--text-muted)]"> › </span>
          {current.output}
          {isLast && <span className="text-[var(--yellow)]"> · humano</span>}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-[0.5%] grid" style={{ gridTemplateColumns: `repeat(${agents.length}, 1fr)` }}>
        {agents.map((a, i) => (
          <button
            key={a.id}
            type="button"
            onClick={() => pick(i)}
            className="lab-crew-label"
            style={{ color: i === active ? a.color : undefined }}
            aria-pressed={i === active}
            aria-label={`${a.label}: ${a.role}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 top-[44%] bottom-[10%] grid" style={{ gridTemplateColumns: `repeat(${agents.length}, 1fr)` }}>
        {agents.map((a, i) => (
          <button
            key={a.id}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => pick(i)}
            className="cursor-pointer bg-transparent border-0"
          />
        ))}
      </div>
    </div>
  );
}
