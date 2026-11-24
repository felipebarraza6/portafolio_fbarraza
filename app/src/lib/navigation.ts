import { experience, openCode, personalProjects, products, skillGroups, workflowSteps } from '../data/cv';

export const NAV_EVENT = 'fb:nav';
export const ARRIVE_EVENT = 'fb:arrive';
const HEADER_OFFSET = 64;

export type SectionMeta = { path: string; lines: string[] };

export const SECTION_META: Record<string, SectionMeta> = {
  top: { path: '~', lines: ['volviendo al centro de control', 'sys.online'] },
  perfil: { path: '~/perfil', lines: ['operador: Felipe Barraza Vega', 'rol: Developer + IA & IoT'] },
  flujo: { path: '~/flujo', lines: [`${workflowSteps.length} etapas cargadas`, 'humano en el loop: activo'] },
  opencode: { path: '~/agentes', lines: [`${openCode.agents.length} agentes en línea`, 'permisos mínimos: ok'] },
  cerebro: { path: '~/cortex', lines: ['lab cortex · sebas cortex', 'sincronizando github…'] },
  experiencia: { path: '~/experiencia', lines: [`${experience.length} organizaciones indexadas`, 'rango: 2012 → hoy'] },
  productos: { path: '~/plataformas', lines: [`${products.length} plataformas en producción`, 'logos y dominios verificados'] },
  proyectos: { path: '~/y-arq', lines: [`${personalProjects.length} productos sobre Y ARQ`, 'backend multi-tenant: ok'] },
  stack: {
    path: '~/stack',
    lines: [`${skillGroups.reduce((n, g) => n + g.items.length, 0)} tecnologías indexadas`, 'formación y certificaciones'],
  },
  contacto: { path: '~/contacto', lines: ['abriendo canal seguro', 'TLS 1.3 · handshake ok'] },
};

export const sectionMeta = (id: string): SectionMeta => SECTION_META[id] ?? { path: `~/${id}`, lines: [] };

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function jumpTo(id: string, behavior: ScrollBehavior) {
  const el = id === 'top' ? null : document.getElementById(id);
  const top = el ? el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET : 0;
  window.scrollTo({ top, behavior });
  window.dispatchEvent(new CustomEvent(ARRIVE_EVENT, { detail: { id } }));
}

/** Entry point for in-page navigation: plays the terminal transition, or jumps directly with reduced motion. */
export function navigateTo(id: string) {
  if (id !== 'top' && !document.getElementById(id)) return false;
  if (reducedMotion()) jumpTo(id, 'auto');
  else window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: { id } }));
  return true;
}
