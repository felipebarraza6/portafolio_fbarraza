import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { NAV_EVENT, jumpTo, sectionMeta, setNavBusy } from '../../lib/navigation';

const SCROLL_AT = 380;
const EXIT_AT = 460;
const DONE_AT = 680;

function hexField(seed: number) {
  const rows: string[] = [];
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let r = 0; r < 14; r++) {
    let line = '';
    for (let c = 0; c < 18; c++) line += Math.floor(rnd() * 65535).toString(16).padStart(4, '0') + ' ';
    rows.push(line);
  }
  return rows;
}

export default function NavTerminal() {
  const [run, setRun] = useState<{ id: string; key: number; phase: 'in' | 'out' } | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    const onNav = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id;
      clear();
      const key = Date.now();
      setNavBusy(true);
      setRun({ id, key, phase: 'in' });
      timers.current.push(
        window.setTimeout(() => jumpTo(id), SCROLL_AT),
        window.setTimeout(() => setRun((r) => (r && r.key === key ? { ...r, phase: 'out' } : r)), EXIT_AT),
        window.setTimeout(() => {
          setRun((r) => (r && r.key === key ? null : r));
          setNavBusy(false);
        }, DONE_AT),
      );
    };
    window.addEventListener(NAV_EVENT, onNav);
    return () => {
      clear();
      setNavBusy(false);
      window.removeEventListener(NAV_EVENT, onNav);
    };
  }, []);

  if (!run) return null;
  const meta = sectionMeta(run.id);
  const cmd = `cd ${meta.path}`;

  return (
    <div className={`nav-term ${run.phase === 'out' ? 'is-out' : ''}`} aria-hidden="true">
      <div className="nav-term-hex">
        {hexField(run.key % 233280).map((row, i) => (
          <p key={i} style={{ animationDelay: `${i * 18}ms` }}>
            {row}
          </p>
        ))}
      </div>
      <div className="nav-term-win">
        <div className="nav-term-bar">
          <span />
          <span />
          <span />
          <em>fb@lab — zsh</em>
        </div>
        <div className="nav-term-body">
          <p>
            <span className="text-[var(--aqua)]">fb@lab</span>
            <span className="text-[var(--text-muted)]">:~$ </span>
            <span className="nav-term-type" style={{ '--n': cmd.length } as CSSProperties}>
              {cmd}
            </span>
          </p>
          {meta.lines.map((l, i) => (
            <p key={l} className="nav-term-line" style={{ animationDelay: `${180 + i * 70}ms` }}>
              <span className="text-[var(--gx-accent)]">›</span> {l}
            </p>
          ))}
          <div className="nav-term-progress">
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
