import { lazy, Suspense, useEffect, useState, type ComponentType, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, FileDown, Github, Linkedin, Mail } from 'lucide-react';
import { navLinks, profile } from '../data/cv';
import HeroSection from '../components/sections/HeroSection';
import NavTerminal from '../components/fx/NavTerminal';
import PromptLogo from '../components/fx/PromptLogo';
import CabinBackdrop from '../components/fx/CabinBackdrop';
import {
  ARRIVE_EVENT,
  NAV_EVENT,
  SECTION_ORDER,
  adjacentSection,
  navigateTo,
  pathToSection,
  sectionIndex,
  sectionMeta,
  sectionTitle,
  sectionToPath,
  setCurrentSection,
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

function activateReveals(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.querySelectorAll('.reveal').forEach((n) => n.classList.add('active'));
  el.classList.remove('section-arrive');
  void el.offsetWidth;
  el.classList.add('section-arrive');
  window.setTimeout(() => el.classList.remove('section-arrive'), 500);
  const scroller = el.closest('.deck-scroll');
  if (scroller) scroller.scrollTop = 0;
  return true;
}

function SectionSkeleton({ id }: { id: SectionId }) {
  const meta = sectionMeta(id);
  return (
    <section className="section" aria-busy="true" aria-label={`Cargando ${meta.path}`}>
      <div className="mx-auto max-w-6xl px-5 md:px-8 panel-swap">
        <div className="flex items-center justify-between gap-3 mb-6">
          <p className="font-mono text-xs text-[var(--aqua)]">
            <span className="text-[var(--text-muted)]">// </span>
            cargando {meta.path}…
          </p>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">sys.mount</span>
        </div>
        <div className="h-0.5 w-full bg-[#3c3836] overflow-hidden mb-6">
          <div className="h-full w-1/2 bg-[var(--gx-accent)] animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="panel p-5 space-y-3 md:col-span-2">
            <div className="skeleton-bar h-5 w-48" />
            <div className="skeleton-bar h-3.5 w-full" />
            <div className="skeleton-bar h-3.5 w-5/6" />
            <div className="skeleton-bar h-3.5 w-2/3" />
            <div className="flex gap-2 pt-2">
              <div className="skeleton-bar h-6 w-16" />
              <div className="skeleton-bar h-6 w-20" />
              <div className="skeleton-bar h-6 w-14" />
            </div>
          </div>
          <div className="panel p-5 space-y-3">
            <div className="skeleton-bar h-4 w-32" />
            <div className="skeleton-bar h-24 w-full" />
            <div className="skeleton-bar h-10 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

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
  // Con lazy mount el DOM llega después del ARRIVE: reintentar hasta disparar section-arrive.
  useEffect(() => {
    if (!active || !mounted || id === 'top') return;
    if (activateReveals(id)) return;
    let tries = 0;
    let raf = 0;
    const tick = () => {
      if (activateReveals(id) || ++tries > 90) return;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, mounted, id]);

  return (
    <div className={`deck-panel ${active ? 'is-active' : ''}`} id={id === 'top' ? 'panel-top' : undefined} aria-hidden={!active}>
      <div className="deck-scroll">
        <div className="deck-frame">
          {mounted ? <Suspense fallback={<SectionSkeleton id={id} />}>{children}</Suspense> : null}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSection = pathToSection(location.pathname) ?? 'top';
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<SectionId>(initialSection);
  const [seen, setSeen] = useState<Set<SectionId>>(() => new Set(['top', initialSection]));
  const activePath = sectionToPath(activeId);
  const progress = Math.max(0, sectionIndex(activeId)) / Math.max(1, SECTION_ORDER.length - 1);
  const hasNext = !!adjacentSection(activeId, 1);

  const handleNavClick = (e: ReactMouseEvent<HTMLAnchorElement>, id: SectionId, closeMenu = false) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (closeMenu) setMenuOpen(false);
    if (navigateTo(id)) e.preventDefault();
  };

  useEffect(() => {
    document.documentElement.classList.add('deck-mode');
    document.body.classList.add('deck-mode');
    return () => {
      document.documentElement.classList.remove('deck-mode');
      document.body.classList.remove('deck-mode');
    };
  }, []);

  // Sincroniza URL → deck (carga directa, Atrás/Adelante y rutas desconocidas).
  useEffect(() => {
    setMenuOpen(false);
    const resolved = pathToSection(location.pathname);
    if (!resolved) {
      navigate('/', { replace: true });
      return;
    }
    setCurrentSection(resolved);
    setActiveId(resolved);
    setSeen((s) => (s.has(resolved) ? s : new Set(s).add(resolved)));
    activateReveals(resolved);
  }, [location.pathname, navigate]);

  // Título dinámico por sección para pestañas e historial del navegador.
  useEffect(() => {
    document.title = sectionTitle(activeId);
  }, [activeId]);

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

  // Compatibilidad con anclas "#id" internas que puedan existir en secciones.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const href = link?.getAttribute('href');
      if (!href) return;
      const id = href === '#' ? 'top' : href.slice(1);
      if (navigateTo(id)) e.preventDefault();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Monta el chunk apenas empieza la animación de navegación (antes del ARRIVE).
  useEffect(() => {
    const mark = (e: Event) => {
      const id = (e as CustomEvent<{ id: SectionId }>).detail.id;
      setSeen((s) => (s.has(id) ? s : new Set(s).add(id)));
    };
    window.addEventListener(NAV_EVENT, mark);
    return () => window.removeEventListener(NAV_EVENT, mark);
  }, []);

  useEffect(() => {
    const onArrive = (e: Event) => {
      const id = (e as CustomEvent<{ id: SectionId }>).detail.id;
      setActiveId(id);
      setSeen((s) => (s.has(id) ? s : new Set(s).add(id)));
      activateReveals(id);
      const nextPath = sectionToPath(id);
      if (location.pathname !== nextPath) {
        navigate(nextPath);
      }
    };
    window.addEventListener(ARRIVE_EVENT, onArrive);
    document.getElementById('top')?.querySelectorAll('.reveal').forEach((n) => n.classList.add('active'));
    return () => window.removeEventListener(ARRIVE_EVENT, onArrive);
  }, [location.pathname, navigate]);

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
          <PromptLogo active={activeId} />

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={(e) => handleNavClick(e, l.id)}
                className={`nav-link ${activePath === l.href ? 'active' : ''}`}
              >
                {l.label}
              </Link>
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
                <Link
                  key={l.href}
                  to={l.href}
                  className={`nav-link ${activePath === l.href ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, l.id, true)}
                >
                  //{l.label}
                </Link>
              ))}
              <Link
                to="/contacto"
                className={`nav-link ${activePath === '/contacto' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'contacto', true)}
              >
                //contacto
              </Link>
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
