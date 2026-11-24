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
    'Mi misión como profesional es transformar problemas reales en productos de software robustos, seguros y listos para escalar.',
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

export const experience = [
  {
    role: 'Líder de Área de Software',
    company: 'SmartHydro',
    logo: logo('ikolu.png'),
    period: 'ene. 2021 – actualidad',
    place: 'Chillán',
    summary:
      'Empresa chilena de telemetría de agua y cumplimiento ambiental. Lidero arquitectura de datos y plataformas de Operaciones y Ventas, alineado con el CTO y las prioridades del negocio.',
    highlights: [
      'Conduzco al equipo de software en estándares, revisión de código y entrega a producción de APIs, frontends y automatizaciones.',
      'Automaticé el despliegue continuo con systemd y GitHub Actions, y los respaldos de PostgreSQL con retención en DigitalOcean Spaces.',
      'Publiqué el broker MQTT con TLS y ACL mediante Cloudflare Tunnel, en contenedores endurecidos con Let\'s Encrypt.',
      'Desarrollo investigación aplicada en IA e IoT y prototipos de agentes multimodales para operaciones institucionales.',
    ],
    stack: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Redis', 'Celery', 'MQTT', 'React', 'Next.js', 'Flutter', 'Docker'],
    tools: ['GitHub Actions', 'Cloudflare', 'DigitalOcean', 'equipo de agentes', 'Cursor', 'Claude Code', 'Grok Build'],
  },
  {
    role: 'CTO y Accionista',
    company: 'Quality Net',
    logo: logo('qualitynet.svg'),
    period: '2017 – actualidad',
    place: 'Chillán · Norte Grande',
    summary:
      'Empresa de desarrollo de software. Desarrollo plataformas web a medida y administro infraestructura de portales de medios de Click and Go.',
    highlights: [
      'Infraestructura de portales como iquique.cl y viña.cl: Nginx con TLS, caché y CDN Cloudflare, contenidos y SEO.',
      'Plataforma digital del encuentro AMA (Teatro Regional del Maule, 2021–2022): streaming, chat en vivo y soporte 24/7.',
      'Sistemas de gestión de RRHH, recursos y productos; implementación de Dolibarr para clientes empresariales.',
    ],
    stack: ['Angular', 'JavaScript', 'PHP', 'WordPress', 'Dolibarr'],
    tools: ['Nginx', 'Cloudflare', 'Docker', 'equipo de agentes', 'Cursor', 'Claude Code', 'Grok Build'],
  },
  {
    role: 'Analista Estadístico y Programador',
    company: 'Hospital Dr. Ernesto Torres Galdames',
    logo: logo('hospital.png'),
    period: '2016 – 2018',
    place: 'Iquique',
    summary:
      'Unidad de Estadísticas y Gestión de la Información: consolidación de datos de producción clínica y reportes de gestión.',
    highlights: [
      'Automaticé recolección y reportes de la unidad; gestión de proyectos con metodología PMO.',
      'Desarrollé la plataforma web con la que la unidad publica su información estadística.',
    ],
    stack: ['R', 'BI', 'PHP', 'JavaScript', 'SQL', 'MySQL', 'Linux'],
    tools: [],
  },
  {
    role: 'Desarrollador de Sistemas (Full Stack) / Administrador de Sistemas',
    company: 'MOR Chile S.A.',
    logo: logo('mor.png'),
    period: '2012 – 2016',
    place: 'Iquique',
    summary:
      'Empresa de ingeniería y montaje para la gran minería. Administración de servidores, redes y desarrollo Java.',
    highlights: [
      'Implementé servidores del proyecto EWS y soporte a usuarios.',
      'Aplicaciones web en Java con Hibernate y HQL, integradas mediante web services SOAP.',
    ],
    stack: ['Java', 'Hibernate', 'HQL', 'Web services SOAP', 'SQL', 'C#', 'Shell', 'Linux'],
    tools: [],
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
