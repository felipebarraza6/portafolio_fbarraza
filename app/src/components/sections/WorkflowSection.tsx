import { useState } from 'react';
import { Github } from 'lucide-react';
import SectionTitle from './SectionTitle';
import TiltCard from '../fx/TiltCard';
import AgentSwarm from '../pixel/AgentSwarm';
import ModelRouter from './ModelRouter';
import { toCode } from '../../lib/codegen';
import { openCode, workflowSteps, workflowTools } from '../../data/cv';

const STEP_COLORS = ['#fabd2f', '#fe8019', '#b8bb26', '#83a598', '#fb4934', '#8ec07c'];

export default function WorkflowSection() {
  const [tab, setTab] = useState(openCode.profiles[0].id);
  const profileModels = openCode.profiles.find((p) => p.id === tab)?.models;

  return (
    <section id="flujo" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="flujo de trabajo" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {workflowSteps.map((step, i) => (
            <TiltCard
              key={step.num}
              className={`reveal stagger-${i + 1} p-3.5`}
              accent={STEP_COLORS[i]}
              code={toCode(`paso${step.num}`, { titulo: step.title, detalle: step.detail })}
              file={`flujo/${step.num}.ts`}
              max={4}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-pixel text-base" style={{ color: STEP_COLORS[i] }}>
                  {step.num}
                </span>
                <span className="h-[2px] flex-1" style={{ background: `${STEP_COLORS[i]}66` }} />
              </div>
              <h3 className="font-semibold text-[13px] text-[var(--text-primary)] mb-1 leading-snug">{step.title}</h3>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{step.detail}</p>
            </TiltCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
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
            <AgentSwarm models={profileModels} />
          </div>

          <div className="reveal stagger-3 panel hud p-5 md:p-6">
            <ModelRouter tab={tab} onTab={setTab} />
          </div>
        </div>

        <div className="reveal stagger-4 mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-[var(--text-muted)] mr-1">{openCode.rules}</span>
          {workflowTools.slice(0, 8).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
