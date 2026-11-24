import type { CSSProperties } from 'react';
import { FileDown, Github, Linkedin, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';
import SectionTitle from './SectionTitle';
import TiltCard from '../fx/TiltCard';
import { profile } from '../../data/cv';

type Channel = {
  label: string;
  value: string;
  href?: string;
  Icon: LucideIcon;
  color: string;
  external?: boolean;
  download?: string;
};

const CHANNELS: Channel[] = [
  { label: 'cv · pdf', value: 'Descargar currículum', href: profile.cv, Icon: FileDown, color: '#fe8019', download: profile.cvFile },
  { label: 'email', value: profile.email, href: `mailto:${profile.email}`, Icon: Mail, color: '#fabd2f' },
  { label: 'teléfono', value: profile.phone, href: profile.phoneHref, Icon: Phone, color: '#8ec07c' },
  { label: 'linkedin', value: profile.linkedinLabel, href: profile.linkedin, Icon: Linkedin, color: '#83a598', external: true },
  { label: 'github', value: profile.githubLabel, href: profile.github, Icon: Github, color: '#fe8019', external: true },
  { label: 'ubicación', value: profile.location, Icon: MapPin, color: '#d3869b' },
];

export default function ContactSection() {
  return (
    <section id="contacto" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="contacto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CHANNELS.map((c, i) => {
            const body = (
              <div className="flex flex-col gap-3">
                <span className="icon-tile" style={{ '--accent-color': c.color } as CSSProperties}>
                  <c.Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: c.color }}>
                    {c.label}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] break-words">{c.value}</p>
                </div>
              </div>
            );
            if (c.href && c.external) {
              return (
                <TiltCard key={c.label} href={c.href} accent={c.color} className={`reveal stagger-${i + 1} p-4`}>
                  {body}
                </TiltCard>
              );
            }
            return (
              <TiltCard key={c.label} accent={c.color} className={`reveal stagger-${i + 1} p-4`}>
                {c.href ? (
                  <a href={c.href} download={c.download} className="block no-underline">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
