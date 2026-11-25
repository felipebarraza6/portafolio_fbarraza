import { useEffect, useRef } from 'react';

const DUST_COLORS = ['#ebdbb2', '#a89984', '#83a598', '#8ec07c', '#fabd2f', '#fe8019'];
const PIXEL = 2;

/** Polvo estelar en 3D: partículas que vienen hacia la cabina, como una nave avanzando lento. */
function SpaceDust({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      w = Math.ceil(window.innerWidth / PIXEL);
      h = Math.ceil(window.innerHeight / PIXEL);
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const count = window.innerWidth < 640 ? 45 : 90;
    const spawn = (z = Math.random()) => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z,
      c: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
    });
    const dust = Array.from({ length: count }, () => spawn());
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.03;
      pointer.y += (pointer.ty - pointer.y) * 0.03;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2 - pointer.x * w * 0.04;
      const cy = h * 0.45 - pointer.y * h * 0.04;
      const fov = Math.min(w, h) * 0.6;

      for (const p of dust) {
        if (!reduced) p.z -= dt * 0.035;
        if (p.z <= 0.04) Object.assign(p, spawn(1));
        const sx = cx + (p.x / p.z) * fov;
        const sy = cy + (p.y / p.z) * fov;
        if (sx < -2 || sy < -2 || sx > w + 2 || sy > h + 2) {
          Object.assign(p, spawn(1));
          continue;
        }
        const near = 1 - p.z;
        ctx.globalAlpha = Math.min(0.75, near * near * 0.9);
        ctx.fillStyle = p.c;
        const size = near > 0.85 ? 2 : 1;
        ctx.fillRect(Math.round(sx), Math.round(sy), size, size);
      }
      ctx.globalAlpha = 1;
      if (!reduced && !document.hidden && activeRef.current) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (!activeRef.current) return;
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    };
    const onVisible = () => {
      if (document.hidden || reduced || !activeRef.current) return;
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };

    if (!reduced && active) raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [active]);

  return <canvas ref={ref} className="cabin-dust-canvas pixel-art" />;
}

/** Fondo fijo: cosmos vivo visto desde la cabina del lab. */
export default function CabinBackdrop({ active = true }: { active?: boolean }) {
  return (
    <div className="cabin-bg" aria-hidden="true">
      <div className="cabin-stars cabin-stars-far" />
      <div className="cabin-stars cabin-stars-near" />
      <div className="cabin-nebula" />
      <div className="cabin-planet" />
      <div className="cabin-planet cabin-planet-sm" />
      <SpaceDust active={active} />
      <span className="cabin-comet cabin-comet-a" />
      <span className="cabin-comet cabin-comet-b" />
      <span className="cabin-comet cabin-comet-c" />
      <span className="cabin-satellite" />
      <div className="cabin-vignette" />
      <div className="cabin-hud">
        <span className="cabin-corner cabin-tl" />
        <span className="cabin-corner cabin-tr" />
        <span className="cabin-corner cabin-bl" />
        <span className="cabin-corner cabin-br" />
        <span className="cabin-led cabin-led-a" />
        <span className="cabin-led cabin-led-b" />
        <span className="cabin-led cabin-led-c" />
      </div>
    </div>
  );
}
