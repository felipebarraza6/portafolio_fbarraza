import type { CSSProperties } from 'react';
import { ArrowUpRight, Boxes, Github, Globe } from 'lucide-react';
import SectionTitle from './SectionTitle';
import TiltCard from '../fx/TiltCard';
import { toCode } from '../../lib/codegen';
import { personalProjects, profile, yarq } from '../../data/cv';

const STATUS_COLOR: Record<string, string> = {
  'en producción': '#b8bb26',
  demo: '#83a598',
  'en diseño': '#d3869b',
  'pre-producción': '#fe8019',
  staging: '#fabd2f',
  público: '#8ec07c',
};

export default function ProjectsSection() {
  return (
    <section id="proyectos" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="proyectos personales" />
        </div>

        <TiltCard
          className="reveal stagger-1 p-6 md:p-7 mb-4"
          accent="#8ec07c"
          max={2}
          code={toCode('yArq', { tipo: yarq.tagline, rasgos: yarq.traits, sitio: 'yggdra.cl', descripcion: yarq.description })}
          file="y-arq/index.ts"
        >
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="logo-tile" style={{ '--accent-color': '#8ec07c' } as CSSProperties}>
                  <img src={yarq.logo} alt="Logo Y ARQ" loading="lazy" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] leading-tight">{yarq.title}</h3>
                  <p className="font-mono text-[11px] text-[var(--aqua)]">{yarq.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-3xl">{yarq.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {yarq.traits.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex md:flex-col gap-2">
              <a href={yarq.url} target="_blank" rel="noreferrer" className="pixel-btn">
                <Globe size={13} /> sitio técnico
              </a>
              <a href={yarq.site} target="_blank" rel="noreferrer" className="pixel-btn">
                <ArrowUpRight size={13} /> yggdra.cl
              </a>
            </div>
          </div>
        </TiltCard>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {personalProjects.map((p, i) => {
            const color = STATUS_COLOR[p.status] ?? '#a89984';
            const isRepo = p.url?.includes('github.com');
            return (
              <TiltCard
                key={p.name}
                href={p.url}
                accent={color}
                className={`reveal stagger-${(i % 6) + 1} p-4`}
                code={toCode(p.name, { estado: p.status, stack: p.stack, descripcion: p.description })}
                file={`productos/${p.name.toLowerCase().replace(/\s+/g, '-')}.ts`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="logo-tile logo-tile-sm" style={{ '--accent-color': color } as CSSProperties}>
                        {p.logo ? (
                          <img src={p.logo} alt={`Logo ${p.name}`} loading="lazy" />
                        ) : isRepo ? (
                          <Github size={14} />
                        ) : (
                          <Boxes size={14} />
                        )}
                      </span>
                      <h4 className="font-semibold text-[var(--text-primary)] truncate">{p.name}</h4>
                    </span>
                    <span className="badge" style={{ color }}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-3 flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.stack.slice(0, 4).map((s) => (
                      <span key={s} className="tag !text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--blue)]">
                    {isRepo ? <Github size={11} /> : <Globe size={11} />}
                    {isRepo ? 'repositorio' : 'demo / sitio'}
                    <ArrowUpRight size={11} className="ml-auto" />
                  </span>
                </div>
              </TiltCard>
            );
          })}
        </div>

        <p className="reveal mt-5 font-mono text-xs text-[var(--text-muted)] flex items-center gap-2">
          <Github size={13} /> Código y más en{' '}
          <a href={profile.github} target="_blank" rel="noreferrer" className="text-[var(--blue)] hover:text-[var(--gx-accent)]">
            {profile.githubLabel}
          </a>
        </p>
      </div>
    </section>
  );
}
