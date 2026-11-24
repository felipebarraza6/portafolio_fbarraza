import type { CSSProperties } from 'react';
import {
  Award,
  Bot,
  Cloud,
  Code2,
  Database,
  GraduationCap,
  Languages,
  Radio,
  Server,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import SectionTitle from './SectionTitle';
import TiltCard from '../fx/TiltCard';
import { toCode } from '../../lib/codegen';
import { certifications, education, languages, skillGroups, skillLogos } from '../../data/cv';

const GROUP_META: Record<string, { Icon: LucideIcon; color: string }> = {
  Lenguajes: { Icon: Code2, color: '#fabd2f' },
  'Backend & APIs': { Icon: Server, color: '#fe8019' },
  'Datos & colas': { Icon: Database, color: '#d3869b' },
  'Infra & cloud': { Icon: Cloud, color: '#83a598' },
  'Frontend & mobile': { Icon: Smartphone, color: '#8ec07c' },
  'IoT & realtime': { Icon: Radio, color: '#b8bb26' },
  'IA & agentes': { Icon: Bot, color: '#fb4934' },
};

function SkillChip({ name }: { name: string }) {
  const slug = skillLogos[name];
  return (
    <span className="tag skill-chip">
      {slug && (
        <img
          src={`https://cdn.simpleicons.org/${slug}/a89984`}
          alt=""
          width={12}
          height={12}
          loading="lazy"
          className="skill-logo"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      {name}
    </span>
  );
}

export default function SkillsSection() {
  return (
    <section id="stack" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="stack · formación" />
        </div>

        <div className="grid lg:grid-cols-[1.45fr_1fr] gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {skillGroups.map((g, i) => {
              const { Icon, color } = GROUP_META[g.title] ?? { Icon: Code2, color: '#fe8019' };
              return (
                <TiltCard
                  key={g.title}
                  accent={color}
                  className={`reveal stagger-${(i % 6) + 1} p-4`}
                  code={toCode(g.title, { items: g.items })}
                  file={`stack/${g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ts`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={15} style={{ color }} />
                    <h3 className="font-mono text-xs" style={{ color }}>
                      {g.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <SkillChip key={item} name={item} />
                    ))}
                  </div>
                </TiltCard>
              );
            })}
          </div>

          <div id="formacion" className="reveal stagger-2 panel hud p-5 md:p-6 space-y-5 h-fit">
            <div className="flex gap-3">
              <span className="icon-tile" style={{ '--accent-color': '#fabd2f' } as CSSProperties}>
                <GraduationCap size={18} />
              </span>
              <div>
                <p className="section-comment !mb-1">formación</p>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{education.title}</h3>
                <p className="font-mono text-[11px] text-[var(--gx-accent)]">
                  {education.program} · {education.school}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {education.period} · {education.note}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="icon-tile" style={{ '--accent-color': '#8ec07c' } as CSSProperties}>
                <Award size={18} />
              </span>
              <div className="flex-1">
                <p className="section-comment !mb-2">certificaciones</p>
                <ul className="space-y-2.5">
                  {certifications.map((c) => (
                    <li key={c.title} className="pl-0">
                      <p className="text-sm text-[var(--text-primary)] leading-tight">{c.title}</p>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">
                        <span className="text-[var(--aqua)]">{c.org}</span> · {c.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <span className="icon-tile" style={{ '--accent-color': '#83a598' } as CSSProperties}>
                <Languages size={18} />
              </span>
              <div>
                <p className="section-comment !mb-0">idiomas</p>
                {languages.map((l) => (
                  <p key={l.name} className="font-mono text-xs text-[var(--text-secondary)]">
                    {l.name} · {l.level}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
