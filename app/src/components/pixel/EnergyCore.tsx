import { useEffect, useRef } from 'react';

type Props = {
  burstKey: string | number;
  colors: string[];
  className?: string;
};

type Node3 = { x: number; y: number; z: number; c: string };
type Pulse = { e: number; t: number; v: number; c: string; rev: boolean };

const BASE = ['#8ec07c', '#8ec07c', '#83a598', '#fabd2f', '#fe8019'];
const VIEW_ANGLE = 0.35;
const VIEW_TILT = 0.3;

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** Holographic neural brain: static 3D point cloud split in two hemispheres, animated only by its energy core and synapse pulses. */
export default function EnergyCore({ burstKey, colors, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef({ key: burstKey, colors });

  useEffect(() => {
    burstRef.current = { key: burstKey, colors };
  }, [burstKey, colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const N = 190;
    const nodes: Node3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const x = Math.cos(th) * r;
      const side = x >= 0 ? 1 : -1;
      nodes.push({
        x: x * 1.2 + side * 0.1,
        y: y * 0.82 - (y < -0.6 ? 0.06 : 0),
        z: Math.sin(th) * r,
        c: BASE[i % BASE.length],
      });
    }

    const edges: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const crosses = Math.sign(a.x) !== Math.sign(b.x);
        if (crosses && (i + j) % 9 !== 0) continue;
        const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
        if (d < 0.1) edges.push([i, j]);
      }
    }

    const energy = new Float32Array(N);
    const proj = nodes.map(() => ({ x: 0, y: 0, d: 0 }));
    let pulses: Pulse[] = [];
    let lastBurst = burstRef.current.key;
    let coreBoost = 0;
    let t = 0;
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      project();
      if (reduced) draw();
    };

    const spawn = (count: number, palette: string[]) => {
      for (let k = 0; k < count; k++) {
        pulses.push({
          e: Math.floor(Math.random() * edges.length),
          t: 0,
          v: 0.012 + Math.random() * 0.02,
          c: palette[k % palette.length] ?? '#fe8019',
          rev: Math.random() > 0.5,
        });
      }
    };

    const ca = Math.cos(VIEW_ANGLE);
    const sa = Math.sin(VIEW_ANGLE);
    const ct = Math.cos(VIEW_TILT);
    const st = Math.sin(VIEW_TILT);
    let cx = 0;
    let cy = 0;
    let R = 0;

    function project() {
      cx = w / 2;
      cy = h / 2;
      R = Math.min(w, h) * 0.3;
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const x1 = n.x * ca - n.z * sa;
        const z1 = n.x * sa + n.z * ca;
        const y1 = n.y * ct - z1 * st;
        const z2 = n.y * st + z1 * ct;
        const s = 3 / (3 + z2);
        proj[i].x = cx + x1 * R * s;
        proj[i].y = cy + y1 * R * s;
        proj[i].d = (1 - z2) / 2;
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // energy core
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.05);
      const coreR = R * (0.5 + pulse * 0.06 + coreBoost * 0.25);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      g.addColorStop(0, `rgba(251, 241, 199, ${0.5 + coreBoost * 0.4})`);
      g.addColorStop(0.25, `rgba(254, 128, 25, ${0.35 + coreBoost * 0.3})`);
      g.addColorStop(0.6, 'rgba(142, 192, 124, 0.12)');
      g.addColorStop(1, 'rgba(142, 192, 124, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      // synapses
      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = proj[i];
        const b = proj[j];
        const depth = Math.min(a.d, b.d);
        const glow = Math.max(energy[i], energy[j]);
        ctx.strokeStyle = `rgba(142, 192, 124, ${0.04 + depth * 0.16 + glow * 0.35})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // energy pulses
      const next: Pulse[] = [];
      for (const p of pulses) {
        p.t += p.v;
        const [i0, j0] = edges[p.e];
        const i = p.rev ? j0 : i0;
        const j = p.rev ? i0 : j0;
        const a = proj[i];
        const b = proj[j];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(x - 1.5), Math.round(y - 1.5), 3, 3);
        if (p.t >= 1) {
          energy[j] = 1;
          if (Math.random() < 0.45) {
            const cont = edges.findIndex(([u, v]) => (u === j || v === j) && Math.random() < 0.5);
            if (cont >= 0) next.push({ ...p, e: cont, t: 0, rev: edges[cont][1] === j });
          }
        } else {
          next.push(p);
        }
      }
      ctx.shadowBlur = 0;
      pulses = next.slice(-160);

      // neurons (pixel squares)
      for (let i = 0; i < N; i++) {
        const p = proj[i];
        const e = energy[i];
        const size = Math.round(1 + p.d * 2.4 + e * 2);
        ctx.fillStyle = e > 0.15 ? `rgba(251, 241, 199, ${0.6 + e * 0.4})` : `rgba(${hexToRgb(nodes[i].c)}, ${0.25 + p.d * 0.65})`;
        ctx.fillRect(Math.round(p.x - size / 2), Math.round(p.y - size / 2), size, size);
        energy[i] *= 0.95;
      }

      coreBoost *= 0.96;
    }

    const loop = () => {
      t += 1;
      const b = burstRef.current;
      if (b.key !== lastBurst) {
        lastBurst = b.key;
        coreBoost = 1;
        spawn(28, b.colors.length ? b.colors : BASE);
      }
      if (Math.random() < 0.22) spawn(1, BASE);
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (reduced) {
      draw();
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} aria-hidden="true" />;
}
