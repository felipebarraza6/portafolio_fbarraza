import { ArrowRight, Shuffle } from 'lucide-react';
import { openCode } from '../../data/cv';

export const SPECIALISTS_TAB = 'demanda';

type Props = { tab: string; onTab: (id: string) => void };

function ModelName({ id }: { id: string }) {
  const info = openCode.models[id];
  return (
    <span className="min-w-0">
      <span className="block truncate text-[var(--text-primary)]">{id}</span>
      <span className="flex flex-wrap gap-x-1.5 text-[10px] text-[var(--text-muted)]">
        <span>{info?.maker}</span>
        {info?.traits.map((t) => (
          <span key={t} className="model-trait">
            {t}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Mismo equipo, distinto modelo según lo que pida la tarea. */
export default function ModelRouter({ tab, onTab }: Props) {
  const profile = openCode.profiles.find((p) => p.id === tab);
  const tabs = [
    ...openCode.profiles.map((p) => ({ id: p.id, label: p.label, color: p.color })),
    { id: SPECIALISTS_TAB, label: 'a demanda', color: '#fabd2f' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="section-comment !mb-0">router de modelos</p>
        <Shuffle size={14} className="text-[var(--text-muted)]" />
      </div>
      <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
        Los roles y permisos no cambian; el modelo se elige según lo que pida la tarea: costo, profundidad de razonamiento o visión.
      </p>

      <div role="tablist" aria-label="Perfil de modelos" className="grid grid-cols-3 gap-1.5 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => onTab(t.id)}
            className={`model-tab ${tab === t.id ? 'active' : ''}`}
            style={{ color: tab === t.id ? t.color : undefined, borderColor: tab === t.id ? t.color : undefined }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab} className="panel-swap flex-1 flex flex-col">
        {profile ? (
          <>
            <ul className="space-y-1.5 font-mono text-xs">
              {openCode.agents.map((a) => (
                <li key={a.id} className="model-row">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 shrink-0" style={{ background: a.color }} />
                    <span className="truncate" style={{ color: a.color }}>
                      {a.label}
                    </span>
                  </span>
                  <ArrowRight size={12} className="text-[var(--text-muted)] shrink-0" />
                  <ModelName id={profile.models[a.id]} />
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 space-y-1.5">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                <span className="font-mono" style={{ color: profile.color }}>
                  cuándo ·{' '}
                </span>
                {profile.when}
              </p>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">{profile.stat}</p>
            </div>
          </>
        ) : (
          <>
            <ul className="space-y-1.5 font-mono text-xs">
              {openCode.specialists.map((s) => (
                <li key={s.need} className="model-row">
                  <span className="min-w-0">
                    <span className="block text-[var(--text-secondary)] leading-snug">{s.need}</span>
                    <span className="block text-[10px] text-[var(--yellow)]">{s.agent}</span>
                  </span>
                  <ArrowRight size={12} className="text-[var(--text-muted)] shrink-0" />
                  <ModelName id={s.model} />
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-4 text-xs text-[var(--text-secondary)] leading-relaxed">
              <span className="font-mono text-[var(--yellow)]">cuándo · </span>
              Subagentes y categorías que se llaman solo si la tarea lo pide. Con fallback de modelo: si un proveedor falla, el
              agente sigue con otro.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
