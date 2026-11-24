import { useEffect, useState } from 'react';
import { reducedMotion, sectionMeta } from '../../lib/navigation';

/** Header logo as a live shell prompt that retypes the path of the section in view. */
export default function PromptLogo({ active }: { active: string }) {
  const path = sectionMeta(active.replace('#', '') || 'top').path;
  const [typed, setTyped] = useState({ path, n: path.length });

  useEffect(() => {
    if (reducedMotion()) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped({ path, n: i });
      if (i >= path.length) window.clearInterval(id);
    }, 38);
    return () => window.clearInterval(id);
  }, [path]);

  const shown = typed.path === path ? path.slice(0, typed.n) : reducedMotion() ? path : '';

  return (
    <a href="#top" className="prompt-logo no-underline" aria-label="Felipe Barraza, volver al inicio">
      <span className="w-2 h-2 bg-[var(--gx-accent)] shadow-[0_0_8px_var(--gx-accent)] shrink-0" />
      <span className="text-[var(--gx-accent)]">fb</span>
      <span className="text-[var(--text-muted)]">@lab:</span>
      <span className="text-[var(--blue)]">{shown}</span>
      <span className="text-[var(--text-muted)]">$</span>
      <span className="code-cursor" />
    </a>
  );
}
