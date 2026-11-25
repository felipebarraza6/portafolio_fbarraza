import { useEffect, useState } from 'react';
import { FileDown, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import LabCrew from '../pixel/LabCrew';
import TiltCard from '../fx/TiltCard';
import { toCode } from '../../lib/codegen';
import { nowRoles, profile } from '../../data/cv';

const ROLES = [
  { label: 'Developer', color: '#fe8019' },
  { label: 'IA', color: '#8ec07c' },
  { label: 'IoT', color: '#83a598' },
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
    <section id="top" className="section relative">
      <div className="mx-auto max-w-6xl px-5 md:px-8 w-full">
        <div className="hero-enter hero-delay-1 flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-[11px] text-[var(--text-muted)]">
          <span className="flex items-center gap-2">
            <span className="status-dot" />
            cabina FB-LAB · presión ok
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[var(--gx-accent)]" />
            {profile.location} · {clock}
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4">
          <div className="panel hud hero-card hero-enter hero-delay-2 p-5 md:p-7 flex flex-col justify-center">
            <p className="hero-name">{profile.shortName}</p>

            <h1 className="hero-role" aria-label={profile.role}>
              {ROLES.map(({ label, color }, i) => (
                <span key={label} className="hero-role-word">
                  {i > 0 && (
                    <span className="hero-role-sep" aria-hidden="true">
                      {i === 1 ? '+' : '&'}
                    </span>
                  )}
                  <span className="font-pixel" style={{ color }}>
                    {label}
                  </span>
                </span>
              ))}
            </h1>

            <p className="hero-mission">{profile.mission}</p>

            <div className="flex flex-wrap gap-3 mt-6">
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

          <div className="panel hud hud-aqua hero-viewport hero-enter hero-delay-3 relative flex flex-col justify-center overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-3 pb-2 font-mono text-[10px]">
              <span className="text-[var(--aqua)]">lab cortex · equipo de agentes</span>
              <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                <span className="status-dot" /> online
              </span>
            </div>
            <LabCrew />
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
