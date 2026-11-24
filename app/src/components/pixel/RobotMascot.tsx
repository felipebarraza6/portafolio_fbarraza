import { useEffect, useRef, useState } from 'react';
import { METAL, Sprite, ball, bayer, metal, solid, type Paint } from '../../lib/pixelKit';

const LINES = [
  'contexto cargado · AGENTS.md',
  'orchestrator planificando…',
  'builder en rama aislada',
  'verifier: 0 errores, 0 warnings',
  'reviewer: diff aprobado',
  'podando contexto (DCP)…',
  'MQTT · TLS · ACL ok',
  'deploy espera tu ok',
];

const W = 88;
const H = 100;
const FRAME_MS = 90;

const SCREEN = ['#592b0b', '#47220a', '#381b08', '#2a1407', '#1d0e05'];
const CAT = { line: '#fe8019', eye: '#fabd2f', fill: '#4a260d', glow: '#6e3410', whisker: '#b3561a' };

const CAT_ROWS = [
  '..o...............o..',
  '..oo.............oo..',
  '..o.o...........o.o..',
  '..o..ooooooooooo..o..',
  '.o.................o.',
  '.o.................o.',
  'o...................o',
  'o...................o',
  'o...................o',
  'o...................o',
  'o...................o',
  '.o.................o.',
  '.o.................o.',
  '..oo.............oo..',
  '....ooooooooooooo....',
];
const EYES_OPEN = [
  [4, 6], [5, 6], [4, 7], [5, 7], [4, 8], [5, 8],
  [15, 6], [16, 6], [15, 7], [16, 7], [15, 8], [16, 8],
];
const EYES_CLOSED = [[3, 8], [4, 8], [5, 8], [6, 8], [14, 8], [15, 8], [16, 8], [17, 8]];
const EYES_HAPPY = [[3, 8], [4, 7], [5, 6], [6, 7], [7, 8], [13, 8], [14, 7], [15, 6], [16, 7], [17, 8]];
const MOUTH = [[7, 10], [10, 10], [13, 10], [8, 11], [9, 11], [11, 11], [12, 11]];
const MOUTH_HAPPY = [[7, 10], [13, 10], [8, 11], [9, 12], [10, 12], [11, 12], [12, 11]];
const WHISKERS = [[-1, 9], [-2, 9], [-3, 8], [-1, 11], [-2, 11], [-3, 12], [21, 9], [22, 9], [23, 8], [21, 11], [22, 11], [23, 12]];

const screenPaint: Paint = (x, y, u, v) => {
  const d = Math.hypot((u - 0.5) * 1.15, v - 0.5) / 0.72;
  const t = d * 4.1;
  let k = Math.floor(t);
  if (t - k > bayer(x, y)) k++;
  if (y % 2 === 1) k++;
  return SCREEN[Math.min(SCREEN.length - 1, Math.max(0, k))];
};

function rivet(s: Sprite, x: number, y: number) {
  s.set(x, y, METAL.spec);
  s.set(x + 1, y, METAL.light);
  s.set(x, y + 1, METAL.light);
  s.set(x + 1, y + 1, METAL.ink);
}

function buildTorso() {
  const s = new Sprite(W, H);
  s.rrect(36, 58, 16, 13, 2, solid(METAL.deep));
  for (const y of [60, 63, 66]) {
    s.line(34, y, 53, y, METAL.high);
    s.line(34, y + 1, 53, y + 1, METAL.base);
    for (const x of [34, 53]) {
      s.set(x, y, METAL.ink);
      s.set(x, y + 1, METAL.ink);
    }
  }
  s.rrect(0, 74, 17, 30, 6, metal);
  s.rrect(71, 74, 17, 30, 6, metal);
  s.rrect(10, 68, 68, 36, 8, metal);
  s.ellipse(9, 84, 3, 3, ball);
  s.ellipse(79, 84, 3, 3, ball);
  s.rrect(27, 76, 34, 19, 3, (_x, _y, _u, v) => (v < 0.1 ? METAL.dark : METAL.deep));
  for (const y of [80, 83, 86, 89]) s.line(31, y, 42, y, METAL.base);
  for (const y of [85, 86, 89, 90]) s.line(47, y, 57, y, METAL.dark);
  rivet(s, 15, 72);
  rivet(s, 71, 72);
  s.fadeBelow(88);
  return s.toCanvas();
}

function buildHead() {
  const s = new Sprite(W, H);
  s.rrect(20, 12, 13, 5, 1, metal);
  for (let y = 7; y <= 12; y++) {
    s.set(25, y, METAL.ink);
    s.set(26, y, METAL.high);
    s.set(27, y, METAL.mid);
    s.set(28, y, METAL.ink);
  }
  s.ellipse(26.5, 5, 3.3, 3.3, ball);
  s.rrect(6, 29, 7, 15, 2, metal);
  for (const y of [32, 35, 38, 41]) s.line(8, y, 10, y, METAL.ink);
  s.rrect(71, 28, 6, 16, 2, metal);
  s.ellipse(79, 36, 4.3, 4.3, ball);
  s.ellipse(79, 36, 1.6, 1.6, solid(METAL.ink), null);
  s.rrect(11, 15, 62, 46, 7, metal);
  rivet(s, 15, 19);
  rivet(s, 67, 19);
  rivet(s, 15, 55);
  rivet(s, 67, 55);
  s.rrect(17, 20, 50, 33, 6, (_x, _y, _u, v) => (v < 0.08 ? METAL.dark : METAL.deep));
  s.rrect(20, 23, 44, 27, 5, screenPaint, null);
  s.line(23, 27, 25, 25, '#6a3d1c');
  s.line(26, 25, 32, 25, '#6a3d1c');
  for (const x0 of [46, 50, 54]) s.line(x0, 56, x0 + 2, 56, METAL.ink);
  return s.toCanvas();
}

function buildDish() {
  const s = new Sprite(W, H);
  s.line(58, 16, 64, 10, METAL.light);
  s.line(59, 16, 65, 10, METAL.mid);
  s.ellipse(69, 8, 3.5, 7, metal);
  s.ellipse(68, 8, 1.5, 5, solid(METAL.ink), null);
  s.line(62, 8, 67, 8, METAL.spec);
  return s.toCanvas();
}

const led = (phase: number, on: string, mid: string, off: string) => (phase > 0.35 ? on : phase > -0.35 ? mid : off);

type Props = { className?: string; scale?: number };

/** Pixel-art CRT robot (LinkedIn banner style): sprites are rasterized once, face and LEDs animate per frame. */
export default function RobotMascot({ className = '', scale = 3 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lookRef = useRef({ x: 0, y: 0 });
  const happyRef = useRef(false);
  const [happy, setHappy] = useState(false);
  const [msg, setMsg] = useState(0);

  useEffect(() => {
    happyRef.current = happy;
  }, [happy]);

  useEffect(() => {
    const id = window.setInterval(() => setMsg((m) => (m + 1) % LINES.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const torso = buildTorso();
    const head = buildHead();
    const dish = buildDish();

    let raf = 0;
    let last = 0;
    let blinkUntil = 0;
    let nextBlink = performance.now() + 2500;
    let flickerUntil = 0;
    let visible = true;

    const render = (now: number) => {
      const t = reduced ? 0 : now / 1000;
      const look = lookRef.current;
      const isHappy = happyRef.current;
      const hx = Math.round(look.x * 1.2);
      const hy = isHappy ? -1 : Math.round(Math.max(0, look.y) * 0.6);
      const dishY = !reduced && Math.sin(t * 0.9) > 0 ? 1 : 0;

      if (!reduced && now > nextBlink) {
        blinkUntil = now + 140;
        nextBlink = now + 3000 + Math.random() * 3500;
        if (Math.random() < 0.25) flickerUntil = now + 80;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(torso, 0, 0);
      ctx.drawImage(dish, hx, hy + dishY);
      ctx.drawImage(head, hx, hy);

      const fx = 32 + hx + Math.round(look.x * 2);
      const fy = 30 + hy + Math.round(look.y);
      const px = (x: number, y: number, c: string) => {
        const sx = x + fx;
        const sy = y + fy;
        if (sx < 21 + hx || sx > 62 + hx || sy < 24 + hy || sy > 48 + hy) return;
        ctx.fillStyle = c;
        ctx.fillRect(sx, sy, 1, 1);
      };

      const lit: [number, number][] = [];
      CAT_ROWS.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) if (row[x] === 'o') lit.push([x, y]);
      });
      const eyes = isHappy ? EYES_HAPPY : now < blinkUntil ? EYES_CLOSED : EYES_OPEN;
      const mouth = isHappy ? MOUTH_HAPPY : MOUTH;
      const all = [...lit, ...eyes, ...mouth] as [number, number][];

      for (const [x, y] of all) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) px(x + dx, y + dy, CAT.glow);
      CAT_ROWS.forEach((row, y) => {
        if (y < 4) return;
        const a = row.indexOf('o');
        const b = row.lastIndexOf('o');
        for (let x = a + 1; x < b; x++) px(x, y, CAT.fill);
      });
      for (const [x, y] of WHISKERS) px(x, y, CAT.whisker);
      for (const [x, y] of lit) px(x, y, CAT.line);
      for (const [x, y] of mouth) px(x, y, CAT.line);
      for (const [x, y] of eyes) px(x, y, CAT.eye);

      if (now < flickerUntil) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(20 + hx, 23 + hy, 44, 27);
      } else if (isHappy) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(254,128,25,0.1)';
        ctx.fillRect(21 + hx, 24 + hy, 42, 25);
        ctx.globalCompositeOperation = 'source-over';
      }

      const dot = (x: number, y: number, c: string) => {
        ctx.fillStyle = c;
        ctx.fillRect(x, y, 2, 2);
      };
      dot(26 + hx, 4 + hy, led(Math.sin(t * 2.4), '#fabd2f', '#b57614', '#5a3c10'));
      dot(60 + hx, 7 + hy + dishY, led(Math.sin(t * 1.6 + 1), '#fe8019', '#af3a03', '#4a2008'));
      dot(62 + hx, 55 + hy, led(Math.sin(t * 1.9 + 2), '#b8bb26', '#79740e', '#3a3a10'));
      dot(47, 79, led(Math.sin(t * 2.2), '#fe8019', '#af3a03', '#3a1c08'));
      dot(51, 79, led(Math.sin(t * 2.2 + 2.1), '#8ec07c', '#427b58', '#1f3326'));
      dot(55, 79, led(Math.sin(t * 2.2 + 4.2), '#fabd2f', '#b57614', '#3a2c10'));
      const meter = (y: number, c: string, k: number) => {
        const len = 3 + Math.round((Math.sin(t * 1.7 + k) + 1) * 4);
        ctx.fillStyle = c;
        ctx.fillRect(47, y, len, 2);
      };
      meter(85, '#83a598', 0);
      meter(89, '#fe8019', 1.8);
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

    const onMove = (e: PointerEvent) => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      lookRef.current = {
        x: clamp((e.clientX - (r.left + r.width / 2)) / 360),
        y: clamp((e.clientY - (r.top + r.height * 0.35)) / 280),
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative flex flex-col items-center select-none cursor-pointer ${className}`}
      onPointerEnter={() => setHappy(true)}
      onPointerLeave={() => setHappy(false)}
      onClick={() => setMsg((m) => (m + 1) % LINES.length)}
      role="img"
      aria-label="Robot FB-01 en pixel art con cabeza de monitor CRT"
    >
      <div key={msg} className="speech mb-3 whitespace-nowrap" aria-live="polite">
        <span className="text-[var(--gx-accent)]">&gt;</span> {happy ? 'hola, bienvenido al lab' : LINES[msg]}
      </div>
      <div className="robot-idle relative" style={{ width: W * scale, height: H * scale }}>
        <div className="robot-spill" aria-hidden="true" />
        <canvas ref={canvasRef} width={W} height={H} className="pixel-art relative block w-full h-full" aria-hidden="true" />
      </div>
    </div>
  );
}
