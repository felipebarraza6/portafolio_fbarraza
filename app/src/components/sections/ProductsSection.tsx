import { useState, type CSSProperties } from 'react';
import { ArrowUpRight, Globe, LayoutGrid } from 'lucide-react';
import SectionTitle from './SectionTitle';
import TiltCard from '../fx/TiltCard';
import { toCode } from '../../lib/codegen';
import { groupLogos, products } from '../../data/cv';

const GROUP_COLOR: Record<string, string> = {
  SmartHydro: '#83a598',
  'Click and Go': '#fe8019',
  'Hábito Firme': '#b8bb26',
  SmartAPR: '#8ec07c',
  'Andean Labs': '#d3869b',
};

export default function ProductsSection() {
  const [filter, setFilter] = useState('todas');
  const groups = [...new Set(products.map((p) => p.group))];
  const shown = filter === 'todas' ? products : products.filter((p) => p.group === filter);

  return (
    <section id="productos" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="productos desarrollados" />
        </div>

        <div className="reveal stagger-1 flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Filtrar plataformas">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'todas'}
            className={`chip-btn ${filter === 'todas' ? 'active' : ''}`}
            onClick={() => setFilter('todas')}
          >
            <LayoutGrid size={12} /> todas · {products.length}
          </button>
          {groups.map((g) => {
            const color = GROUP_COLOR[g] ?? '#fe8019';
            return (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={filter === g}
                className={`chip-btn ${filter === g ? 'active' : ''}`}
                style={{ '--accent-color': color } as CSSProperties}
                onClick={() => setFilter(g)}
              >
                {groupLogos[g] && <img src={groupLogos[g]} alt="" className="chip-logo" />} {g}
              </button>
            );
          })}
        </div>

        <div key={filter} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((p) => {
            const color = GROUP_COLOR[p.group] ?? '#fe8019';
            const host = p.url?.replace(/^https?:\/\//, '');
            return (
              <TiltCard
                key={p.name}
                href={p.url}
                accent={color}
                className="panel-swap p-5"
                code={toCode(p.name, { cliente: p.group, url: host, descripcion: p.description, sitios: p.sites })}
                file={`plataformas/${p.name.toLowerCase().replace(/\s+/g, '-')}.ts`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="logo-tile" style={{ '--accent-color': color } as CSSProperties}>
                      {p.logo ? <img src={p.logo} alt={`Logo ${p.name}`} loading="lazy" /> : <Globe size={18} />}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color }}>
                      {p.group}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">{p.name}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">{p.description}</p>
                  {p.sites && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.sites.map((s) => (
                        <span key={s} className="tag !text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {host && (
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--blue)]">
                      <Globe size={12} /> <span className="truncate">{host}</span>
                      <ArrowUpRight size={12} className="ml-auto shrink-0" />
                    </span>
                  )}
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
