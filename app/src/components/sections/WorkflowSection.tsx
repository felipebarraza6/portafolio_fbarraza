import { Github } from 'lucide-react';
import SectionTitle from './SectionTitle';
import TiltCard from '../fx/TiltCard';
import AgentSwarm from '../pixel/AgentSwarm';
import { toCode } from '../../lib/codegen';
import { openCode, workflowSteps, workflowTools } from '../../data/cv';

const STEP_COLORS = ['#fabd2f', '#fe8019', '#b8bb26', '#83a598', '#fb4934', '#8ec07c'];

export default function WorkflowSection() {
  return (
    <section id="flujo" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="flujo de trabajo" />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-3">
            {workflowSteps.map((step, i) => (
              <TiltCard
                key={step.num}
                className={`reveal stagger-${i + 1} p-4`}
                accent={STEP_COLORS[i]}
                code={toCode(`paso${step.num}`, { titulo: step.title, detalle: step.detail })}
                file={`flujo/${step.num}.ts`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-lg" style={{ color: STEP_COLORS[i] }}>
                    {step.num}
                  </span>
                  <span className="h-[2px] w-8" style={{ background: STEP_COLORS[i] }} />
                </div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1">{step.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{step.detail}</p>
              </TiltCard>
            ))}
          </div>

          <div id="opencode" className="reveal stagger-2 panel hud hud-aqua lab-chamber p-5 md:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <p className="section-comment !mb-0">equipo de agentes</p>
              <a
                href={openCode.configUrl}
                target="_blank"
                rel="noreferrer"
                className="icon-btn"
                aria-label="Configuración del equipo de agentes en GitHub"
              >
                <Github size={15} />
              </a>
            </div>

            <AgentSwarm />

            <dl className="mt-6 space-y-2 font-mono text-xs">
              {[
                { k: 'flujo', v: openCode.flow, c: 'var(--yellow)' },
                { k: 'reglas', v: openCode.rules, c: 'var(--aqua)' },
                { k: 'deploy', v: openCode.deploy, c: 'var(--gx-accent)' },
              ].map((row) => (
                <div key={row.k} className="grid grid-cols-[64px_1fr] gap-2 border-t border-[#3c3836] pt-2">
                  <dt style={{ color: row.c }}>{row.k}</dt>
                  <dd className="text-[var(--text-muted)]">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="reveal stagger-3 mt-5 flex flex-wrap gap-2">
          {workflowTools.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
