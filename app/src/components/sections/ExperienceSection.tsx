import { useState, type CSSProperties } from 'react';
import { Building2 } from 'lucide-react';
import SectionTitle from './SectionTitle';
import TiltCard from '../fx/TiltCard';
import { experience } from '../../data/cv';

const COLOR: Record<string, string> = {
  SmartHydro: '#83a598',
  'Quality Net': '#fe8019',
  'Hospital Dr. Ernesto Torres Galdames': '#8ec07c',
  'MOR Chile S.A.': '#fabd2f',
};

function Logo({ src, name, small }: { src?: string; name: string; small?: boolean }) {
  return (
    <span className={`logo-tile ${small ? 'logo-tile-sm' : ''}`}>
      {src ? <img src={src} alt={`Logo ${name}`} loading="lazy" /> : <Building2 size={small ? 14 : 18} />}
    </span>
  );
}

export default function ExperienceSection() {
  const [idx, setIdx] = useState(0);
  const job = experience[idx];
  const color = COLOR[job.company] ?? '#fe8019';

  return (
    <section id="experiencia" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="experiencia" />
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-4">
          <div role="tablist" aria-label="Experiencia" className="reveal stagger-1 flex md:flex-col gap-2 overflow-x-auto pb-1 md:pb-0">
            {experience.map((j, i) => {
              const c = COLOR[j.company] ?? '#fe8019';
              return (
                <button
                  key={j.company}
                  role="tab"
                  type="button"
                  aria-selected={i === idx}
                  onClick={() => setIdx(i)}
                  className={`tab-btn min-w-[220px] md:min-w-0 ${i === idx ? 'active' : ''}`}
                  style={{ '--accent-color': c } as CSSProperties}
                >
                  <Logo src={j.logo} name={j.company} small />
                  <span className="min-w-0">
                    <span className="block text-sm truncate">{j.company}</span>
                    <span className="block font-mono text-[10px] text-[var(--text-muted)]">{j.period}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <TiltCard key={idx} className="panel-swap p-5 md:p-7" accent={color} max={2}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span style={{ '--accent-color': color } as CSSProperties}>
                  <Logo src={job.logo} name={job.company} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">{job.role}</h3>
                  <p className="font-mono text-sm" style={{ color: color }}>
                    {job.company}
                  </p>
                </div>
              </div>
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {job.place} · {job.period}
              </p>
            </div>

            <p className="text-sm text-[var(--text-secondary)] mb-4">{job.summary}</p>

            <ul className="space-y-2 mb-5">
              {job.highlights.map((h, i) => (
                <li
                  key={h.slice(0, 40)}
                  className="panel-swap text-sm text-[var(--text-muted)]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1.5">
              {job.stack.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
              {job.tools.map((t) => (
                <span key={t} className="tag" style={{ color: 'var(--aqua)' }}>
                  {t}
                </span>
              ))}
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
