import { useEffect, useState } from 'react';
import { FileDown, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import RobotMascot from '../pixel/RobotMascot';
import TiltCard from '../fx/TiltCard';
import { toCode } from '../../lib/codegen';
import { nowRoles, profile } from '../../data/cv';

const CIRCUIT = [
  'M20 70 H90 L120 100 V160',
  'M380 60 H310 L280 90 V140',
  'M30 300 H80 L110 270 V220',
  'M370 290 H320 L300 270 V210',
  'M60 180 H120',
  'M340 170 H290',
];

const CIRCUIT_NODES: [number, number, string][] = [
  [20, 70, '#8ec07c'],
  [120, 160, '#fe8019'],
  [380, 60, '#83a598'],
  [280, 140, '#8ec07c'],
  [30, 300, '#fabd2f'],
  [110, 220, '#8ec07c'],
  [370, 290, '#fe8019'],
  [300, 210, '#83a598'],
  [60, 180, '#fe8019'],
  [340, 170, '#8ec07c'],
];

function useClock() {
  const fmt = () =>
    new Date().toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour12: false });
  const [now, setNow] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setNow(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export default function HeroSection() {
  const clock = useClock();

  return (
    <section id="top" className="relative pt-20 md:pt-24 pb-6">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="hero-enter hero-delay-1 flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-[11px] text-[var(--text-muted)]">
          <span className="flex items-center gap-2">
            <span className="status-dot" />
            sys.online · centro de control
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[var(--gx-accent)]" />
            {profile.location} · {clock}
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4">
          <div className="panel hud hero-enter hero-delay-2 p-6 md:p-9 flex flex-col justify-center">
            <p className="section-comment">operador</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.02] text-[var(--text-primary)] mb-3 tracking-tight">
              {profile.name}
            </h1>
            <p className="font-pixel text-xl md:text-2xl text-[var(--gx-accent)] mb-5">{profile.role}</p>
            <p className="text-[var(--text-secondary)] max-w-xl mb-7 md:text-lg">{profile.mission}</p>
            <div className="flex flex-wrap gap-3">
              <a className="pixel-btn pixel-btn-primary" href={profile.cv} download={profile.cvFile}>
                <FileDown size={15} /> Descargar CV
              </a>
              <a className="pixel-btn" href={profile.github} target="_blank" rel="noreferrer">
                <Github size={15} /> GitHub
              </a>
              <a className="pixel-btn" href={profile.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={15} /> LinkedIn
              </a>
              <a className="pixel-btn" href={`mailto:${profile.email}`}>
                <Mail size={15} /> Email
              </a>
            </div>
          </div>

          <div className="panel hud hud-aqua lab-chamber hero-enter hero-delay-3 relative flex items-end justify-center min-h-[380px] pt-10 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g fill="none" stroke="#8ec07c" strokeOpacity="0.16" strokeWidth="1">
                {CIRCUIT.map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
              {CIRCUIT_NODES.map(([x, y, c], i) => (
                <circle
                  key={`${x}-${y}`}
                  className="circuit-node"
                  style={{ animationDelay: `${(i % 5) * 0.7}s` }}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill={c}
                />
              ))}
            </svg>
            <RobotMascot scale={3} className="relative z-10" />
            <span className="absolute top-3 left-4 font-mono text-[10px] text-[var(--aqua)]">unidad FB-01</span>
            <span className="absolute top-3 right-4 font-mono text-[10px] text-[var(--text-muted)]">estado · operativo</span>
          </div>
        </div>

        <div id="perfil" className="grid md:grid-cols-3 gap-4 mt-4">
          <TiltCard
            className="hero-enter hero-delay-4 p-5 md:p-6 md:col-span-2"
            code={toCode('perfil', { desde: 2012, enfoque: profile.role, bio: profile.bio[0] })}
            file="perfil.ts"
            max={3}
          >
            <p className="section-comment">perfil</p>
            {profile.bio.map((p) => (
              <p key={p.slice(0, 24)} className="text-sm text-[var(--text-muted)] mb-2 last:mb-0">
                {p}
              </p>
            ))}
          </TiltCard>

          <TiltCard
            className="hero-enter hero-delay-4 p-5"
            code={toCode('ahora', { roles: nowRoles.map((r) => `${r.role} @ ${r.org}`) })}
            file="ahora.ts"
            accent="#8ec07c"
          >
            <p className="section-comment">ahora</p>
            <ul className="space-y-3">
              {nowRoles.map((r) => (
                <li key={r.org} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 shrink-0" style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
                  <div>
                    <p className="text-sm text-[var(--text-primary)] leading-tight">{r.role}</p>
                    <p className="font-mono text-[11px]" style={{ color: r.color }}>
                      {r.org} · {r.since}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
