const logo = (file: string) => `${import.meta.env.BASE_URL}logos/${file}`;

export const profile = {
  name: 'Felipe Barraza Vega',
  shortName: 'Felipe Barraza',
  role: 'Developer + IA & IoT',
  ageLabel: '35 años',
  location: 'Chillán, Chile',
  email: 'felipe.barraza.vega@gmail.com',
  phone: '+56 9 5298 1458',
  phoneHref: 'tel:+56952981458',
  linkedin: 'https://linkedin.com/in/felipebarraza6',
  linkedinLabel: 'linkedin.com/in/felipebarraza6',
  github: 'https://github.com/felipebarraza6',
  githubLabel: 'github.com/felipebarraza6',
  cv: `${import.meta.env.BASE_URL}CV_Felipe_Barraza.pdf`,
  cvFile: 'CV_Felipe_Barraza.pdf',
  mission:
    'Plataformas donde el software, la IA y el IoT se encuentran: telemetría en campo, agentes con permisos mínimos y sistemas listos para producción.',
  bio: [
    'Desde 2012 diseño arquitecturas, desarrollo y mantengo infraestructuras. Trabajo con agentes de IA como parte de mi equipo, en cada etapa del desarrollo, para construir productos más sólidos y de mejor calidad.',
    'Lidero el área de software en una empresa de ingeniería y telemetría (IoT y automatización de gestión regulatoria), soy CTO y socio en Quality Net, y desarrollo mis propios productos en Y ARQ.',
  ],
};

export const nowRoles = [
  { role: 'Líder de Área de Software', org: 'SmartHydro', since: 'ene. 2021', color: '#83a598' },
  { role: 'CTO y Accionista', org: 'Quality Net', since: '2017', color: '#fe8019' },
  { role: 'Productos propios', org: 'Y ARQ', since: 'hoy', color: '#8ec07c' },
];

export const workflowSteps = [
  {
    num: '01',
    title: 'Ingeniería de contexto',
    detail: 'AGENTS.md, reglas y skills versionadas: el agente parte conociendo el dominio, no desde un prompt suelto',
  },
  {
    num: '02',
    title: 'Plan con criterios',
    detail: 'El orchestrator define alcance y criterios de aceptación; yo apruebo antes de tocar código',
  },
  {
    num: '03',
    title: 'Build aislado',
    detail: 'Ramas aisladas y permisos mínimos por agente: shell, edición y subagentes solo donde corresponde',
  },
  {
    num: '04',
    title: 'Evidencia, no promesas',
    detail: 'lint, tipos y tests como prueba; Gitleaks y CI en cada PR, staging con healthchecks y smoke tests',
  },
  {
    num: '05',
    title: 'Revisión independiente',
    detail: 'Quien escribe no aprueba: un reviewer distinto audita diff, seguridad y calidad',
  },
  {
    num: '06',
    title: 'Humano en el loop',
    detail: 'Release solo con mi confirmación · TLS · secretos fuera del contexto · alertas y respaldos',
  },
];

export const workflowTools = [
  'AGENTS.md',
  'Skills',
  'Context pruning (DCP)',
  'GitHub Actions',
  'Gitleaks',
  'Docker Compose',
  'Docker Swarm',
  'TLS 1.2/1.3',
  'HSTS',
  'Nginx',
  "Let's Encrypt",
  'systemd',
  'MQTT/ACL',
  'Sentry',
  'PostgreSQL',
  'pgvector',
  'Redis',
  'Celery',
  'S3',
];

export const openCode = {
  agents: [
    {
      id: 'orchestrator',
      label: 'orchestrator',
      color: '#fe8019',
      role: 'Analiza, planifica y diseña antes de que se toque el código. No escribe código.',
      input: 'pedido + contexto del repo',
      output: 'plan y criterios de aceptación',
      edits: false,
      model: 'deepseek-v4.1-flash',
      vars: ['AGENTS.md', 'rules/', 'skills/'],
    },
    {
      id: 'builder',
      label: 'builder',
      color: '#83a598',
      role: 'Implementa el cambio aprobado, agrega tests y corre validaciones locales.',
      input: 'plan aprobado',
      output: 'diff + tests',
      edits: true,
      model: 'deepseek-v4.1-flash',
      vars: ['OPENCODE_BRANCH', 'WORKTREE'],
    },
    {
      id: 'verifier',
      label: 'verifier',
      color: '#b8bb26',
      role: 'Ejecuta lint, tipos y tests. Reporta evidencia sin modificar código.',
      input: 'diff',
      output: 'reporte con evidencia',
      edits: false,
      model: 'mimo-v2.6-flash',
      vars: ['CI=1', 'NODE_ENV=test'],
    },
    {
      id: 'reviewer',
      label: 'reviewer',
      color: '#d3869b',
      role: 'Revisa el diff contra los criterios: seguridad y calidad. Quien escribe no se aprueba solo.',
      input: 'diff + evidencia',
      output: 'aprobación u observaciones',
      edits: false,
      model: 'qwen3.8-flash',
      vars: ['GITLEAKS', 'ACCEPTANCE'],
    },
    {
      id: 'deployer',
      label: 'deployer',
      color: '#8ec07c',
      role: 'Prepara release y migraciones. Nunca despliega a producción sin confirmación humana.',
      input: 'cambio aprobado',
      output: 'release listo · espera tu ok',
      edits: false,
      human: true,
      model: 'mimo-v2.6-flash',
      vars: ['DEPLOY_ENV', 'REQUIRE_HUMAN=1'],
    },
  ],
  models: {
    'deepseek-v4.1-flash': { maker: 'DeepSeek', traits: ['rápido', 'barato', 'caché'] },
    'deepseek-v4.1-flash-free': { maker: 'DeepSeek', traits: ['gratis', 'exploración'] },
    'deepseek-v4-flash': { maker: 'DeepSeek', traits: ['rápido', 'barato'] },
    'mimo-v2.6-flash': { maker: 'Xiaomi', traits: ['liviano', 'ejecuta y reporta'] },
    'qwen3.8-flash': { maker: 'Alibaba', traits: ['rápido', 'revisión'] },
    'qwen3.7-plus': { maker: 'Alibaba', traits: ['equilibrado', 'esfuerzo medio'] },
    'kimi-k3': { maker: 'Moonshot', traits: ['razonamiento', 'arquitectura'] },
    'kimi-k2.7-code': { maker: 'Moonshot', traits: ['código', 'multimodal'] },
    'grok-4.5': { maker: 'xAI', traits: ['razonamiento profundo'] },
  } as Record<string, { maker: string; traits: string[] }>,
  profiles: [
    {
      id: 'ahorro',
      label: 'ahorro',
      color: '#b8bb26',
      when: 'Día a día: features chicas, fixes y refactors. Modelos flash con caché en todo el equipo.',
      stat: '$0.15 / $0.60 por millón de tokens · 13× más barato en entrada que kimi-k3.1-pro',
      models: {
        orchestrator: 'deepseek-v4.1-flash',
        builder: 'deepseek-v4.1-flash',
        verifier: 'mimo-v2.6-flash',
        reviewer: 'qwen3.8-flash',
        deployer: 'mimo-v2.6-flash',
      },
    },
    {
      id: 'calidad',
      label: 'calidad',
      color: '#d3869b',
      when: 'Cambios críticos: auth, pagos, migraciones. Más razonamiento donde se planifica y se revisa.',
      stat: 'kimi-k3 planifica y revisa · kimi-k2.7-code implementa',
      models: {
        orchestrator: 'kimi-k3',
        builder: 'kimi-k2.7-code',
        verifier: 'qwen3.7-plus',
        reviewer: 'kimi-k3',
        deployer: 'deepseek-v4-flash',
      },
    },
  ] as { id: string; label: string; color: string; when: string; stat: string; models: Record<string, string> }[],
  specialists: [
    { need: 'typos y cambios de un archivo', model: 'deepseek-v4.1-flash-free', agent: 'quick' },
    { need: 'explorar el repo y buscar docs', model: 'deepseek-v4.1-flash-free', agent: 'explore · librarian' },
    { need: 'arquitectura y debugging profundo', model: 'kimi-k3', agent: 'oracle · metis · momus' },
    { need: 'lógica compleja', model: 'grok-4.5', agent: 'ultrabrain' },
    { need: 'UI, frontend y capturas', model: 'kimi-k2.7-code', agent: 'visual · multimodal' },
  ],
  flow: 'contexto → plan → build aislado → evidencia → revisión → release con humano',
  rules: 'permisos mínimos por agente · contexto podado (DCP) · sin secretos en el contexto',
  deploy: 'nunca a producción sin confirmación humana',
  configUrl: 'https://github.com/felipebarraza6/opencode-config',
};

export const skillGroups = [
  {
    title: 'Lenguajes',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Go', 'Shell', 'Dart', 'PHP', 'Java', 'C#'],
  },
  {
    title: 'Backend & APIs',
    items: ['Django', 'DRF', 'FastAPI', 'Celery', 'Flask', 'NestJS', 'Express', 'Spring', 'Hibernate', 'GraphQL'],
  },
  {
    title: 'Datos & colas',
    items: ['PostgreSQL', 'pgvector', 'TimescaleDB', 'Redis', 'MySQL', 'RabbitMQ', 'S3', 'SOAP/REST', 'HQL'],
  },
  {
    title: 'Infra & cloud',
    items: ['Docker', 'Docker Compose', 'Nginx', 'systemd', 'GitHub Actions', 'Cloudflare', 'DigitalOcean', 'TLS', "Let's Encrypt", 'Sentry'],
  },
  {
    title: 'Frontend & mobile',
    items: ['React', 'Next.js', 'Flutter', 'Angular', 'Astro', 'TanStack Query', 'Zustand', 'Tailwind'],
  },
  {
    title: 'IoT & realtime',
    items: ['MQTT', 'Mosquitto', 'WebSockets', 'Cloudflare Tunnel'],
  },
  {
    title: 'IA & agentes',
    items: ['LLMs multi-proveedor', 'RAG', 'equipo de agentes', 'Cursor', 'Claude Code', 'Grok Build'],
  },
];

/** Simple Icons slug for stack chips (https://cdn.simpleicons.org). */
export const skillLogos: Record<string, string> = {
  Python: 'python',
  TypeScript: 'typescript',
  JavaScript: 'javascript',
  SQL: 'postgresql',
  Go: 'go',
  Shell: 'gnubash',
  Dart: 'dart',
  PHP: 'php',
  Java: 'openjdk',
  'C#': 'csharp',
  Django: 'django',
  DRF: 'django',
  FastAPI: 'fastapi',
  Celery: 'celery',
  Flask: 'flask',
  NestJS: 'nestjs',
  Express: 'express',
  Spring: 'spring',
  Hibernate: 'hibernate',
  GraphQL: 'graphql',
  PostgreSQL: 'postgresql',
  pgvector: 'postgresql',
  TimescaleDB: 'timescale',
  Redis: 'redis',
  MySQL: 'mysql',
  RabbitMQ: 'rabbitmq',
  S3: 'amazons3',
  Docker: 'docker',
  'Docker Compose': 'docker',
  Nginx: 'nginx',
  systemd: 'systemd',
  'GitHub Actions': 'githubactions',
  Cloudflare: 'cloudflare',
  DigitalOcean: 'digitalocean',
  TLS: 'letsencrypt',
  "Let's Encrypt": 'letsencrypt',
  Sentry: 'sentry',
  React: 'react',
  'Next.js': 'nextdotjs',
  Flutter: 'flutter',
  Angular: 'angular',
  Astro: 'astro',
  'TanStack Query': 'reactquery',
  Zustand: 'react',
  Tailwind: 'tailwindcss',
  MQTT: 'eclipsemosquitto',
  Mosquitto: 'eclipsemosquitto',
  WebSockets: 'socketdotio',
  'Cloudflare Tunnel': 'cloudflare',
  Cursor: 'cursor',
};

export type OrgNode = { label: string; sub?: string; me?: boolean };

export type Job = {
  role: string;
  company: string;
  logo?: string;
  period: string;
  place: string;
  context: string;
  positions?: { title: string; period: string }[];
  /** Niveles de arriba hacia abajo; un nivel con varios nodos son pares. */
  org: { levels: OrgNode[][]; below: { label: string; items: string[] } };
  highlights: string[];
  stack: string[];
  tools: string[];
  references?: { name: string; role: string; letter: string; page: number }[];
};

const AI_TOOLS = ['OpenCode', 'Cursor', 'Claude Code', 'Grok Build', 'Agentes de IA'];

export const experience: Job[] = [
  {
    role: 'Líder de Área de Software',
    company: 'SmartHydro',
    logo: logo('ikolu.png'),
    period: 'ene. 2021 – actualidad',
    place: 'Chillán',
    context: 'Empresa chilena de telemetría de agua y cumplimiento ambiental.',
    org: {
      levels: [[{ label: 'CEO' }], [{ label: 'CTO' }], [{ label: 'Líder de Área de Software', sub: 'mi cargo', me: true }]],
      below: { label: 'equipo de software a cargo', items: ['Backend', 'Frontend', 'DevOps e infra', 'QA', 'Datos e IA', 'Soporte'] },
    },
    highlights: [
      'Lidero la arquitectura de datos y de las plataformas de Operaciones y Ventas, en alineación directa con el CTO y las prioridades del negocio.',
      'Conduzco al equipo de software en estándares, revisión de código y entrega a producción de APIs, frontends y automatizaciones.',
      'Automaticé el despliegue continuo con systemd y GitHub Actions, y los respaldos de PostgreSQL con retención en DigitalOcean Spaces y en el clúster gestionado.',
      "Publiqué el broker MQTT con TLS y ACL mediante Cloudflare Tunnel, en contenedores endurecidos con certificados automáticos de Let's Encrypt.",
      'Desarrollo investigación aplicada en IA e IoT y prototipos de agentes multimodales para operaciones institucionales.',
    ],
    stack: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Redis', 'Celery', 'MQTT', 'React', 'Next.js', 'Flutter', 'Docker', 'GitHub Actions', 'Cloudflare', 'DigitalOcean'],
    tools: AI_TOOLS,
  },
  {
    role: 'CTO y Accionista',
    company: 'Quality Net',
    logo: logo('qualitynet.svg'),
    period: '2017 – actualidad',
    place: 'Chillán · Norte Grande',
    context: 'Empresa de desarrollo de software con Martín Esparza como CEO y clientes como Click and Go.',
    org: {
      levels: [
        [
          { label: 'Martín Esparza', sub: 'CEO' },
          { label: 'Felipe Barraza', sub: 'CTO y accionista', me: true },
        ],
        [{ label: 'Quality Net', sub: 'desarrollo de software' }],
      ],
      below: { label: 'clientes', items: ['Click and Go · portales municipales', 'Otros clientes · plataformas a medida'] },
    },
    highlights: [
      'Desarrollo plataformas web a medida para los clientes de la empresa.',
      'Administro la infraestructura de los portales de medios de Click and Go, como iquique.cl y viña.cl: proxy Nginx con TLS, caché y CDN de Cloudflare, además de gestión de contenidos y SEO.',
      'Desarrollé la plataforma digital del encuentro de artes escénicas AMA, del Teatro Regional del Maule (2021–2022), con streaming, chat en vivo y soporte 24/7.',
      'Desarrollé sistemas de gestión de RRHH, recursos y productos, e implementé Dolibarr para clientes empresariales.',
    ],
    stack: ['Angular', 'JavaScript', 'PHP', 'WordPress', 'Dolibarr', 'Nginx', 'Cloudflare', 'Docker'],
    tools: [...AI_TOOLS, 'DeepSeek y modelos abiertos'],
  },
  {
    role: 'Analista Estadístico y Programador',
    company: 'Hospital Dr. Ernesto Torres Galdames',
    logo: logo('hospital.png'),
    period: '2016 – 2018',
    place: 'Iquique',
    context: 'Hospital regional de Iquique. Trabajé en la unidad que concentra la información estadística de todos los servicios clínicos.',
    org: {
      levels: [
        [{ label: 'Dirección' }],
        [{ label: 'Subdirección Médica' }],
        [{ label: 'U. de Estadísticas y Gestión de la Información', sub: 'mi unidad', me: true }],
      ],
      below: {
        label: 'servicios que consolidaba',
        items: ['Urgencia', 'Pabellón', 'Hospitalización', 'Consultas (CAE)', 'Apoyo clínico', 'Otros'],
      },
    },
    highlights: [
      'Analicé y consolidé los datos de producción de todos los servicios del hospital para los reportes estadísticos y de gestión.',
      'Automaticé procesos de recolección y reporte de la unidad, y gestioné los proyectos con metodología PMO.',
      'Desarrollé la plataforma web con la que la unidad publica su información estadística.',
    ],
    stack: ['R', 'BI', 'PHP', 'JavaScript', 'SQL', 'MySQL', 'Linux'],
    tools: [],
    references: [
      { name: 'Patricio Chandía Núñez', role: 'Jefe Depto. de Administración de Información de Salud', letter: 'carta · sep. 2018', page: 11 },
      { name: 'William Caqueo', role: 'Subdirector Depto. de Planificación, Desarrollo y Proyectos', letter: 'recomendación · sep. 2018', page: 13 },
      { name: 'Irene Vásquez Guacte', role: 'Jefa Unidad Gestión de la Información en Salud · Servicio de Salud Iquique', letter: 'recomendación · sep. 2018', page: 12 },
    ],
  },
  {
    role: 'Desarrollador de Sistemas · Administrador de Sistemas',
    company: 'MOR Chile S.A.',
    logo: logo('mor.png'),
    period: '2012 – may. 2016',
    place: 'Iquique',
    context: 'Empresa de ingeniería y montaje para la gran minería, con base en Alto Hospicio.',
    positions: [
      { title: 'Desarrollador de Sistemas (Full Stack)', period: 'nov. 2015 – may. 2016' },
      { title: 'Administrador de Sistemas', period: '2012 – 2015' },
    ],
    org: {
      levels: [
        [{ label: 'Gerencia General' }],
        [{ label: 'Área de Sistemas (TI)' }],
        [{ label: 'Administrador de sistemas · desarrollador Java', sub: 'mi rol', me: true }],
      ],
      below: { label: 'a mi cargo', items: ['Servidores', 'Redes', 'Soporte', 'Desarrollo Java', 'Web services', 'Proyecto EWS'] },
    },
    highlights: [
      'Administré servidores, redes y soporte a usuarios, e implementé los servidores del proyecto EWS.',
      'Desarrollé aplicaciones web en Java con Hibernate y HQL, integradas mediante web services.',
    ],
    stack: ['Java', 'Hibernate', 'HQL', 'Web services SOAP', 'SQL', 'C#', 'Shell', 'Linux'],
    tools: [],
    references: [
      { name: 'Mariajosé Tapia Saavedra', role: 'Líder de Proyectos y Contratos', letter: 'carta · jun. 2016', page: 10 },
    ],
  },
];

export const groupLogos: Record<string, string> = {
  SmartHydro: logo('ikolu.png'),
  'Click and Go': logo('clickandgo.png'),
  'Hábito Firme': logo('habito.png'),
  SmartAPR: logo('cauce.png'),
  'Andean Labs': logo('andeanlabs.png'),
};

export type ProductItem = {
  name: string;
  logo?: string;
  url?: string;
  description: string;
  group: string;
  sites?: string[];
};

export const products: ProductItem[] = [
  {
    group: 'SmartHydro',
    name: 'Ikolu',
    logo: logo('ikolu.png'),
    url: 'https://smarthydro.cl',
    description:
      'Telemetría de pozos y reportes ante la DGA y la SMA. Frontend en React y Leaflet, con despliegue propio.',
  },
  {
    group: 'SmartHydro',
    name: 'Ikolu 3',
    logo: logo('ikolu3.png'),
    url: 'https://erp-ikolu.smarthydro.app',
    description:
      'Escritorio de operación de nueva generación: une flujo comercial, operación de campo y telemetría. Flutter sobre Nereus.',
  },
  {
    group: 'SmartHydro',
    name: 'Observatorio Público DGA',
    logo: logo('observatorio.png'),
    url: 'https://observatorio.smarthydro.app',
    description: 'Mapa abierto con mediciones exigidas por la DGA. Leaflet sobre la API de telemetría.',
  },
  {
    group: 'SmartHydro',
    name: 'Control de Captaciones',
    logo: logo('captaciones.png'),
    url: 'https://smart-hydro.github.io/smarthydro_app',
    description: 'Pozos, captaciones y alertas en el celular. Flutter para Android y PWA.',
  },
  {
    group: 'Click and Go',
    name: 'Portales municipales',
    logo: logo('clickandgo.png'),
    url: 'https://clickandgo.cl',
    description:
      'Plataformas de gestión de medios municipales. Administro toda su infraestructura.',
    sites: [
      'iquique.cl',
      'altohospicio.cl',
      'isladepascua.cl',
      'sanpedrodeatacama.cl',
      'tocopilla.cl',
      'antofagasta.cl',
      'aricachile.cl',
      'viña.cl',
    ],
  },
  {
    group: 'Hábito Firme',
    name: 'Plataforma Hábito Firme',
    logo: logo('habito.png'),
    url: 'https://habitofirme.app',
    description:
      'PWA de hábitos: categorías, registro diario, rachas, gráficos, coach de IA y sync con Google Calendar.',
  },
  {
    group: 'Hábito Firme',
    name: 'Proyecto 90',
    logo: logo('proyecto90.jpg'),
    url: 'https://90dias.habitofirme.app',
    description: 'Desafío de 90 días: landing, inscripción, seguimiento y panel del equipo.',
  },
  {
    group: 'SmartAPR',
    name: 'Cauce',
    logo: logo('cauce.png'),
    url: 'https://cauce.smartapr.cl',
    description: 'Cliente web del ciclo de agua potable rural: socio, medidor, lectura, tarifa y cobro.',
  },
  {
    group: 'Andean Labs',
    name: 'Sitio Andean Labs',
    logo: logo('andeanlabs.png'),
    url: 'https://andeanlabs.cl',
    description: 'Centro de I+D+i de Iquique en español, inglés y chino; contenidos editables en JSON.',
  },
];

export type PersonalProject = {
  name: string;
  logo?: string;
  status: string;
  description: string;
  url?: string;
  stack: string[];
};

export const yarq = {
  title: 'Y ARQ',
  logo: logo('yarq.svg'),
  tagline: 'Arquitectura e infraestructura',
  description:
    'Proyecto personal de arquitectura de software e infraestructura. Backend multi-tenant con API compartida: una instalación atiende varias sucursales con datos aislados y módulos según el plan. Infra propia: contenedores, Nginx+TLS, PostgreSQL, Redis, Celery, CI/CD, monitoreo y respaldos. De Y ARQ nace Nereus, fork para telemetría y operación.',
  url: 'https://felipebarraza6.github.io/yggdra-web',
  site: 'https://yggdra.cl',
  traits: ['Multi-tenant', 'API compartida', 'Infraestructura propia', 'CI/CD', 'Fork Nereus'],
};

export const personalProjects: PersonalProject[] = [
  {
    name: 'Frig',
    logo: logo('frig.png'),
    status: 'en producción',
    description:
      'Punto de venta gastronómico: caja, cocina, mesas, inventario, recetas y finanzas. Multisucursal y white-label sobre la API de Y ARQ.',
    url: 'https://frig.yggdra.cl',
    stack: ['Next.js', 'React', 'TanStack Query', 'Zustand', 'Recharts', 'GSAP', 'shadcn/ui'],
  },
  {
    name: 'Muninn',
    logo: logo('muninn.png'),
    status: 'en producción',
    description:
      'Cliente para diseñar y operar agentes de IA: catálogo, estudio, chat, canales y flujos, publicable en el dominio de cada organización.',
    url: 'https://felipebarraza6.github.io/muninn',
    stack: ['React', 'Vite', 'React Flow'],
  },
  {
    name: 'HEIR',
    status: 'demo',
    description:
      'Comercio general sobre la API de Y ARQ: landing y cotizador por sucursal, con vistas pública, local y de administración.',
    url: 'https://felipebarraza6.github.io/heir',
    stack: ['React', 'Zustand', 'Next.js'],
  },
  {
    name: 'Forja',
    logo: logo('forja.svg'),
    status: 'demo',
    description:
      'Plataforma para personal trainers: venta del servicio, alumnos, rutinas, nutrición, adherencia, mensajes y suscripciones.',
    url: 'https://felipebarraza6.github.io/forja',
    stack: ['React', 'Vite'],
  },
  {
    name: 'Gungir',
    status: 'en diseño',
    description:
      'Agenda, pagos y agente de reservas para profesionales de la salud (kinesiología, psicología, nutrición).',
    url: 'https://felipebarraza6.github.io/gungir',
    stack: ['Vite', 'PWA', 'React'],
  },
  {
    name: 'Nxord',
    logo: logo('nxord.svg'),
    status: 'pre-producción',
    description:
      'Telemetría hídrica: equipos, variables, gráficos y alertas casi en tiempo real, con módulo opcional para comités APR.',
    url: 'https://felipebarraza6.github.io/nxord',
    stack: ['React', 'Vite'],
  },
  {
    name: 'Y Print',
    status: 'staging',
    description:
      'Agente de impresión de escritorio para productos Y ARQ: tickets térmicos 58/80 mm sin diálogo del navegador.',
    url: 'https://github.com/felipebarraza6/y-print',
    stack: ['Tauri 2', 'Rust', 'Vite'],
  },
  {
    name: 'OpenCode config',
    status: 'público',
    description:
      'Configuración pública de OpenCode: cinco agentes con roles separados, reglas y skills propias.',
    url: 'https://github.com/felipebarraza6/opencode-config',
    stack: ['Agentes de IA', 'OpenCode', 'Shell'],
  },
];

export const education = {
  title: 'Técnico de Nivel Superior en Computación e Informática',
  school: 'Universidad Arturo Prat, Iquique',
  program: 'Desarrollo de Sistemas',
  period: '2012 – 2015',
  note: 'Titulado el 31 ago. 2015 · Aprobado con distinción',
};

export const certifications = [
  { title: 'Desarrollador Web', org: 'Next U', detail: '12 cursos · jun. 2016' },
  { title: 'Carrera de Desarrollo con Java y 10 cursos', org: 'Platzi', detail: '2016 – 2018' },
  { title: 'Excel Intermedio', org: 'Quality & Improvement', detail: '2018' },
];

export const languages = [{ name: 'Español', level: 'nativo' }];

export const navLinks = [
  { href: '#flujo', label: 'flujo de trabajo' },
  { href: '#cerebro', label: 'cortex' },
  { href: '#experiencia', label: 'experiencia' },
  { href: '#productos', label: 'plataformas' },
  { href: '#proyectos', label: 'proyectos' },
  { href: '#stack', label: 'stack' },
];
