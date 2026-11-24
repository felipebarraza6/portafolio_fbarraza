import { useEffect, useRef, useState } from 'react';
import { FileDown, Github, Linkedin, Mail } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { navLinks, profile } from '../data/cv';
import HeroSection from '../components/sections/HeroSection';
import WorkflowSection from '../components/sections/WorkflowSection';
import GitHubBrainSection from '../components/sections/GitHubBrainSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import ProductsSection from '../components/sections/ProductsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import SkillsSection from '../components/sections/SkillsSection';
import ContactSection from '../components/sections/ContactSection';
import NavTerminal from '../components/fx/NavTerminal';
import PromptLogo from '../components/fx/PromptLogo';
import { ARRIVE_EVENT, navigateTo } from '../lib/navigation';

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const progressRef = useRef<HTMLDivElement>(null);
  useScrollReveal();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current?.style.setProperty('transform', `scaleX(${max > 0 ? y / max : 0})`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // HashRouter owns location.hash, so in-page "#id" anchors must scroll manually instead of navigating.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const href = link?.getAttribute('href');
      if (!href || href.startsWith('#/')) return;
      const id = href === '#' ? 'top' : href.slice(1);
      if (navigateTo(id)) e.preventDefault();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const onArrive = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id;
      const el = document.getElementById(id);
      if (!el) return;
      if (id !== 'top') setActive(`#${id}`);
      el.classList.remove('section-arrive');
      void el.offsetWidth;
      el.classList.add('section-arrive');
      window.setTimeout(() => el.classList.remove('section-arrive'), 800);
    };
    window.addEventListener(ARRIVE_EVENT, onArrive);
    return () => window.removeEventListener(ARRIVE_EVENT, onArrive);
  }, []);

  useEffect(() => {
    const targets = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((n): n is Element => n !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="gruvbox-bg" />
      <div className="iso-bg" />
      <div className="noise-overlay" />
      <div className="scanlines" aria-hidden="true" />

      <header
        className="fixed top-0 inset-x-0 z-50 transition-colors duration-300"
        style={{
          background: scrolled ? 'rgba(29,32,33,0.9)' : 'transparent',
          borderBottom: scrolled ? '1px solid #3c3836' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(10px)' : undefined,
        }}
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8 h-14 flex items-center justify-between gap-4">
          <PromptLogo active={active} />

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`nav-link ${active === l.href ? 'active' : ''}`}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={profile.cv}
              download={profile.cvFile}
              className="icon-btn !w-auto px-2.5 gap-1.5 font-mono text-[11px] text-[var(--gx-accent)]"
              aria-label="Descargar CV en PDF"
            >
              <FileDown size={15} /> <span className="hidden sm:inline">CV</span>
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub">
              <Github size={15} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn">
              <Linkedin size={15} />
            </a>
            <a href={`mailto:${profile.email}`} className="icon-btn hidden sm:inline-flex" aria-label="Email">
              <Mail size={15} />
            </a>
            <button
              type="button"
              className="lg:hidden icon-btn !w-auto px-3 font-mono text-[11px]"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Menú"
            >
              {menuOpen ? 'cerrar' : 'menú'}
            </button>
          </div>
        </div>

        <div ref={progressRef} className="scroll-progress w-full" style={{ transform: 'scaleX(0)' }} />

        {menuOpen && (
          <div className="lg:hidden border-t border-[#3c3836] bg-[var(--bg-primary)] px-5 py-4 grid grid-cols-2 gap-3 panel-swap">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link ${active === l.href ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                //{l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <NavTerminal />

      <main className="relative z-10">
        <HeroSection />
        <WorkflowSection />
        <GitHubBrainSection />
        <ExperienceSection />
        <ProductsSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <footer className="relative z-10 border-t border-[#3c3836] py-6">
        <div className="mx-auto max-w-6xl px-5 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            {profile.name} · {profile.role}
          </p>
          <p className="font-pixel text-xs text-[var(--text-muted)]">gruvbox · pixel lab · 2012 → hoy</p>
        </div>
      </footer>
    </div>
  );
}
