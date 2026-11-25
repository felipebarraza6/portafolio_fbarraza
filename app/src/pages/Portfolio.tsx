import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { ChevronDown, FileDown, Github, Linkedin, Mail } from 'lucide-react';
import { navLinks, profile } from '../data/cv';
import HeroSection from '../components/sections/HeroSection';
import NavTerminal from '../components/fx/NavTerminal';
import PromptLogo from '../components/fx/PromptLogo';
import CabinBackdrop from '../components/fx/CabinBackdrop';
import {
  ARRIVE_EVENT,
  SECTION_ORDER,
  adjacentSection,
  navigateTo,
  sectionIndex,
  type SectionId,
} from '../lib/navigation';

const WorkflowSection = lazy(() => import('../components/sections/WorkflowSection'));
const GitHubBrainSection = lazy(() => import('../components/sections/GitHubBrainSection'));
const ExperienceSection = lazy(() => import('../components/sections/ExperienceSection'));
const ProductsSection = lazy(() => import('../components/sections/ProductsSection'));
const ProjectsSection = lazy(() => import('../components/sections/ProjectsSection'));
const SkillsSection = lazy(() => import('../components/sections/SkillsSection'));
const ContactSection = lazy(() => import('../components/sections/ContactSection'));

const LAZY: Partial<Record<SectionId, ComponentType>> = {
  flujo: WorkflowSection,
  cerebro: GitHubBrainSection,
  experiencia: ExperienceSection,
  productos: ProductsSection,
  proyectos: ProjectsSection,
  stack: SkillsSection,
  contacto: ContactSection,
};

function Panel({
  id,
  active,
  mounted,
  children,
}: {
  id: SectionId;
  active: boolean;
  mounted: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`deck-panel ${active ? 'is-active' : ''}`} id={id === 'top' ? 'panel-top' : undefined} aria-hidden={!active}>
      <div className="deck-scroll">
        <div className="deck-frame">
          {mounted ? <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-16 font-mono text-xs text-[var(--text-muted)]">cargando…</div>}>{children}</Suspense> : null}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<SectionId>('top');
  const [seen, setSeen] = useState<Set<SectionId>>(() => new Set(['top']));
  const activeHref = activeId === 'top' ? '' : `#${activeId}`;
  const progress = Math.max(0, sectionIndex(activeId)) / Math.max(1, SECTION_ORDER.length - 1);
  const hasNext = !!adjacentSection(activeId, 1);

  useEffect(() => {
    document.documentElement.classList.add('deck-mode');
    document.body.classList.add('deck-mode');
    return () => {
      document.documentElement.classList.remove('deck-mode');
      document.body.classList.remove('deck-mode');
    };
  }, []);

  // Prefetch de secciones en idle: no bloquea el primer paint.
  useEffect(() => {
    const warm = () => {
      void import('../components/sections/WorkflowSection');
      void import('../components/sections/GitHubBrainSection');
      void import('../components/sections/ExperienceSection');
      void import('../components/sections/ProductsSection');
      void import('../components/sections/ProjectsSection');
      void import('../components/sections/SkillsSection');
      void import('../components/sections/ContactSection');
    };
    let idleId = 0;
    let timeoutId = 0;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(warm, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }
    timeoutId = window.setTimeout(warm, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  // HashRouter owns location.hash, so in-page "#id" anchors must navigate the deck.
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
      const id = (e as CustomEvent<{ id: SectionId }>).detail.id;
      setActiveId(id);
      setSeen((s) => (s.has(id) ? s : new Set(s).add(id)));
      const el = document.getElementById(id);
      if (!el) return;
      el.querySelectorAll('.reveal').forEach((n) => n.classList.add('active'));
      el.classList.remove('section-arrive');
      void el.offsetWidth;
      el.classList.add('section-arrive');
      window.setTimeout(() => el.classList.remove('section-arrive'), 500);
    };
    window.addEventListener(ARRIVE_EVENT, onArrive);
    document.getElementById('top')?.querySelectorAll('.reveal').forEach((n) => n.classList.add('active'));
    return () => window.removeEventListener(ARRIVE_EVENT, onArrive);
  }, []);

  return (
    <div className="deck relative h-[100dvh] overflow-hidden">
      <div className="gruvbox-bg" />
      <CabinBackdrop active={activeId === 'top'} />
      <div className="noise-overlay" />
      <div className="scanlines" aria-hidden="true" />

      <header
        className="site-header fixed top-0 inset-x-0 z-[100]"
        style={{
          background: 'rgba(29,32,33,0.88)',
          borderBottom: activeId === 'top' ? '1px solid transparent' : '1px solid #3c3836',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8 h-14 flex items-center justify-between gap-3">
          <PromptLogo active={activeHref || '#top'} />

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`nav-link ${activeHref === l.href ? 'active' : ''}`}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={profile.cv}
              download={profile.cvFile}
              className="icon-btn !w-auto px-2.5 gap-1.5 font-mono text-[11px] text-[var(--gx-accent)]"
              aria-label="Descargar CV en PDF"
            >
              <FileDown size={15} /> <span className="hidden sm:inline">CV</span>
            </a>
            <span className="hidden lg:contents">
              <a href={profile.github} target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub">
                <Github size={15} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn">
                <Linkedin size={15} />
              </a>
              <a href={`mailto:${profile.email}`} className="icon-btn" aria-label="Email">
                <Mail size={15} />
              </a>
            </span>
            <button
              type="button"
              className="lg:hidden icon-btn !w-auto px-2.5 font-mono text-[11px]"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Menú"
            >
              {menuOpen ? 'cerrar' : 'menú'}
            </button>
          </div>
        </div>

        <div className="scroll-progress w-full" style={{ transform: `scaleX(${progress})` }} />

        {menuOpen && (
          <div className="lg:hidden border-t border-[#3c3836] bg-[var(--bg-primary)] px-4 sm:px-5 py-4 panel-swap">
            <nav className="grid grid-cols-2 gap-2 mb-4" aria-label="Secciones">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={`nav-link ${activeHref === l.href ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  //{l.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2 border-t border-[#3c3836] pt-3">
              <a href={profile.github} target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub">
                <Github size={15} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn">
                <Linkedin size={15} />
              </a>
              <a href={`mailto:${profile.email}`} className="icon-btn" aria-label="Email">
                <Mail size={15} />
              </a>
              <span className="font-mono text-[10px] text-[var(--text-muted)] ml-1">contacto</span>
            </div>
          </div>
        )}
      </header>

      <NavTerminal />

      <main className="deck-stage relative z-10 h-full">
        <Panel id="top" active={activeId === 'top'} mounted>
          <HeroSection />
        </Panel>
        {SECTION_ORDER.filter((id) => id !== 'top').map((id) => {
          const Comp = LAZY[id];
          if (!Comp) return null;
          const mounted = seen.has(id);
          return (
            <Panel key={id} id={id} active={activeId === id} mounted={mounted}>
              {id === 'contacto' ? (
                <>
                  <Comp />
                  <footer className="border-t border-[#3c3836] py-5 mt-4">
                    <div className="mx-auto max-w-6xl px-5 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="font-mono text-xs text-[var(--text-muted)]">
                        {profile.name} · {profile.role}
                      </p>
                      <p className="font-pixel text-xs text-[var(--text-muted)]">gruvbox · pixel lab · 2012 → hoy</p>
                    </div>
                  </footer>
                </>
              ) : (
                <Comp />
              )}
            </Panel>
          );
        })}
      </main>

      {hasNext && (
        <button
          type="button"
          className="deck-next"
          aria-label="Siguiente sección"
          onClick={() => navigateTo(adjacentSection(activeId, 1)!)}
        >
          <ChevronDown size={16} />
          <span className="font-mono text-[10px]">siguiente</span>
        </button>
      )}
    </div>
  );
}
