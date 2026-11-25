import { Fragment, useState, type CSSProperties } from 'react';
import { Building2, FileText } from 'lucide-react';
import SectionTitle from './SectionTitle';
import TiltCard from '../fx/TiltCard';
import { experience, profile, type Job } from '../../data/cv';

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

function OrgChart({ org, color }: { org: Job['org']; color: string }) {
  return (
    <div className="org-chart" style={{ '--c': color } as CSSProperties} aria-label="Organigrama">
      {org.levels.map((level, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="org-link" aria-hidden="true" />}
          <div className="org-level">
            {level.map((n) => (
              <span key={n.label} className={`org-node ${n.me ? 'is-me' : ''}`}>
                <span className="block">{n.label}</span>
                {n.sub && <span className="org-sub">{n.sub}</span>}
              </span>
            ))}
          </div>
        </Fragment>
      ))}
      <span className="org-link" aria-hidden="true" />
      <div className="org-branch">
        <p className="org-branch-label">{org.below.label}</p>
        <div className={`org-leaves ${org.below.items.length < 3 ? 'is-wide' : ''}`}>
          {org.below.items.map((item) => (
            <span key={item} className="org-leaf">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
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

        <div className="grid md:grid-cols-[250px_1fr] gap-4">
          <div role="tablist" aria-label="Experiencia" className="reveal stagger-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0 pr-0.5">
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
                    <span className="block font-mono text-[10px] text-[var(--text-muted)] truncate">{j.role}</span>
                    <span className="block font-mono text-[10px] text-[var(--text-muted)]">{j.period}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <TiltCard key={idx} className="panel-swap p-5 md:p-6" accent={color} max={2}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span style={{ '--accent-color': color } as CSSProperties}>
                  <Logo src={job.logo} name={job.company} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">{job.role}</h3>
                  <p className="font-mono text-sm" style={{ color }}>
                    {job.company}
                  </p>
                </div>
              </div>
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {job.place} · {job.period}
              </p>
            </div>

            {job.references ? (
              <>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{job.context}</p>
                {job.positions && (
                  <ol className="mb-3 space-y-1.5">
                    {job.positions.map((p) => (
                      <li key={p.title} className="data-row flex items-center justify-between gap-3 font-mono text-[11px]">
                        <span className="text-[var(--text-primary)]">{p.title}</span>
                        <span className="shrink-0 text-[var(--text-muted)]">{p.period}</span>
                      </li>
                    ))}
                  </ol>
                )}
                <ul className="space-y-2 mb-3">
                  {job.highlights.map((h, i) => (
                    <li
                      key={h.slice(0, 40)}
                      className="panel-swap flex gap-2 text-sm text-[var(--text-muted)] leading-relaxed"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className="font-mono shrink-0" style={{ color }} aria-hidden="true">
                        ›
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5 mb-4">
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
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="panel hud p-3">
                    <p className="section-comment !mb-3">organigrama</p>
                    <OrgChart org={job.org} color={color} />
                  </div>
                  <div className="panel hud p-3">
                    <p className="section-comment !mb-2">referencias · cartas en el CV</p>
                    <ul className="space-y-1.5">
                      {job.references.map((r) => (
                        <li key={r.name}>
                          <a
                            href={`${profile.cv}#page=${r.page}`}
                            target="_blank"
                            rel="noreferrer"
                            className="data-row flex gap-2.5 no-underline"
                          >
                            <FileText size={13} className="mt-0.5 shrink-0" style={{ color }} />
                            <span className="min-w-0">
                              <span className="block text-xs text-[var(--text-primary)]">{r.name}</span>
                              <span className="block text-[11px] text-[var(--text-muted)] leading-snug">{r.role}</span>
                              <span className="block font-mono text-[10px] mt-0.5" style={{ color }}>
                                {r.letter} · anexo C, pág. {r.page}
                              </span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid lg:grid-cols-[1fr_280px] gap-4 lg:items-start">
                <div className="min-w-0">
                  <p className="text-sm text-[var(--text-secondary)] mb-3">{job.context}</p>
                  <ul className="space-y-2 mb-4">
                    {job.highlights.map((h, i) => (
                      <li
                        key={h.slice(0, 40)}
                        className="panel-swap flex gap-2 text-sm text-[var(--text-muted)] leading-relaxed"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <span className="font-mono shrink-0" style={{ color }} aria-hidden="true">
                          ›
                        </span>
                        <span>{h}</span>
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
                </div>
                <aside className="min-w-0">
                  <div className="panel hud p-3">
                    <p className="section-comment !mb-3">organigrama</p>
                    <OrgChart org={job.org} color={color} />
                  </div>
                </aside>
              </div>
            )}
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
