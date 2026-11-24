import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Kept for call-site compatibility; code peek was removed (content no longer disappears on hover). */
  code?: unknown;
  file?: string;
  href?: string;
  accent?: string;
  max?: number;
  id?: string;
};

/** Card with subtle tilt. Content stays visible on hover. */
export default function TiltCard({
  children,
  className = '',
  href,
  accent = '#fe8019',
  max = 5,
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef(0);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
      el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };

  const cls = `panel tilt ${className}`;
  const style = { '--accent-color': accent } as CSSProperties;
  const inner = (
    <>
      <div className="tilt-content">{children}</div>
      <span className="tilt-glare" aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <a
        id={id}
        ref={(n) => {
          ref.current = n;
        }}
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${cls} block no-underline`}
        style={style}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      id={id}
      ref={(n) => {
        ref.current = n;
      }}
      className={cls}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {inner}
    </div>
  );
}
