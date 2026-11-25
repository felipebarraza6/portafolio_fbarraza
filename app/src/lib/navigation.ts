import { experience, openCode, personalProjects, products, skillGroups, workflowSteps } from '../data/cv';

export const NAV_EVENT = 'fb:nav';
export const ARRIVE_EVENT = 'fb:arrive';

/** Orden del deck: una sección a la vez, sin scroll de página. */
export const SECTION_ORDER = [
  'top',
  'flujo',
  'cerebro',
  'experiencia',
  'productos',
  'proyectos',
  'stack',
  'contacto',
] as const;

export type SectionId = (typeof SECTION_ORDER)[number];

export type SectionMeta = { path: string; lines: string[] };

export const SECTION_META: Record<string, SectionMeta> = {
  top: { path: '~', lines: ['centro de control', 'sys.online'] },
  perfil: { path: '~', lines: ['centro de control', 'sys.online'] },
  flujo: { path: '~/flujo', lines: [`${workflowSteps.length} etapas cargadas`, 'humano en el loop: activo'] },
  opencode: { path: '~/flujo', lines: [`${openCode.agents.length} agentes en línea`, 'permisos mínimos: ok'] },
  cerebro: { path: '~/cortex', lines: ['observation cortex · núcleo en línea', 'sincronizando github…'] },
  experiencia: { path: '~/experiencia', lines: [`${experience.length} organizaciones indexadas`, 'rango: 2012 → hoy'] },
  productos: { path: '~/plataformas', lines: [`${products.length} plataformas en producción`, 'logos y dominios verificados'] },
  proyectos: { path: '~/y-arq', lines: [`${personalProjects.length} productos sobre Y ARQ`, 'backend multi-tenant: ok'] },
  stack: {
    path: '~/stack',
    lines: [`${skillGroups.reduce((n, g) => n + g.items.length, 0)} tecnologías indexadas`, 'formación y certificaciones'],
  },
  contacto: { path: '~/contacto', lines: ['abriendo canal seguro', 'TLS 1.3 · handshake ok'] },
};

/** Alias internos → sección del deck. */
const ALIAS: Record<string, SectionId> = {
  perfil: 'top',
  opencode: 'flujo',
  formacion: 'stack',
};

export const sectionMeta = (id: string): SectionMeta => SECTION_META[id] ?? { path: `~/${id}`, lines: [] };

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function resolveSection(id: string): SectionId | null {
  const mapped = (ALIAS[id] ?? id) as SectionId;
  return SECTION_ORDER.includes(mapped) ? mapped : null;
}

export function sectionIndex(id: string) {
  const resolved = resolveSection(id);
  return resolved ? SECTION_ORDER.indexOf(resolved) : -1;
}

export function adjacentSection(id: string, dir: 1 | -1): SectionId | null {
  const i = sectionIndex(id);
  if (i < 0) return null;
  const next = i + dir;
  if (next < 0 || next >= SECTION_ORDER.length) return null;
  return SECTION_ORDER[next];
}

let busy = false;
let current: SectionId = 'top';
export const setNavBusy = (v: boolean) => {
  busy = v;
};
export const currentSection = () => current;

/** Activa una sección del deck (sin scroll de página). */
export function jumpTo(id: string) {
  const resolved = resolveSection(id) ?? 'top';
  current = resolved;
  window.dispatchEvent(new CustomEvent(ARRIVE_EVENT, { detail: { id: resolved } }));
}

/** Entra a una sección: siempre anima terminal salvo reduced-motion. */
export function navigateTo(id: string) {
  const resolved = resolveSection(id);
  if (!resolved) return false;
  if (busy) return true;
  if (resolved === current) return true;
  if (reducedMotion()) {
    jumpTo(resolved);
  } else {
    setNavBusy(true);
    window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: { id: resolved } }));
  }
  return true;
}