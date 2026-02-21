import { 
  Github, 
  Linkedin, 
  Mail, 
  Code2, 
  Database, 
  Layout,
  Server,
  Container,
  ArrowRight,
  Terminal,
  Star,
  Calendar,
  Building2,
  MapPin,
  Briefcase,
  Phone,
  MessageSquare,
  Bot,
  CheckCircle2,
  FolderGit2,
  Cpu,
  Layers,
  Zap,
  Rocket,
  Award,
  FileText,
  Radio,
  Activity,
  TrendingUp,
  GitMerge,
  Coffee,
  Globe,
  Smartphone,
  ShoppingCart,
  BarChart3,
  Users,
  Plug,
  Cog,
  GraduationCap,
  Video,
  Shield,
  Cloud,
  Cast,
  Signal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

// ============================================
// HOOK: Scroll Reveal
// ============================================
const useScrollReveal = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
};

// ============================================
// DATOS
// ============================================

const skills = [
  { name: 'React / Next.js', category: 'Frontend', level: 95 },
  { name: 'TypeScript / JavaScript', category: 'Frontend', level: 92 },
  { name: 'Node.js / Express', category: 'Backend', level: 90 },
  { name: 'Python / Django', category: 'Backend', level: 88 },
  { name: 'PostgreSQL / TimescaleDB', category: 'Database', level: 87 },
  { name: 'Docker / Kubernetes', category: 'DevOps', level: 85 },
  { name: 'IoT / MQTT / WebSockets', category: 'Real-time', level: 90 },
  { name: 'AI Agents / LLMs', category: 'AI', level: 85 },
];

// Carreras completas con iconos vectorizados
const careers = [
  {
    name: 'Carrera de Java SE',
    platform: 'Platzi',
    icon: Coffee,
    color: '#E76F00',
    courses: [
      { name: 'Java Básico 2015', year: '2015' },
      { name: 'Java Básico SE 2018', year: '2018' },
      { name: 'Java Avanzado SE', year: '2017' },
      { name: 'Java EE Profesional', year: '2017' }
    ],
    validator: '@felipebarraza6'
  },
  {
    name: 'Carrera de Desarrollo Web',
    platform: 'Platzi',
    icon: Globe,
    color: '#61DAFB',
    courses: [
      { name: 'Fundamentos de JavaScript', year: '2018' },
      { name: 'jQuery a JavaScript', year: '2018' },
      { name: 'React.js 2019', year: '2019' },
      { name: 'Redux por Bedu', year: '2019' },
      { name: 'React Router', year: '2018' },
      { name: 'Vue.js Básico', year: '2016' },
      { name: 'Vue.js Profesional', year: '2018' }
    ],
    validator: '@felipebarraza6'
  },
  {
    name: 'Carrera de Python & Django',
    platform: 'Platzi',
    icon: Code2,
    color: '#3776AB',
    courses: [
      { name: 'Python 2019', year: '2019' },
      { name: 'Python Práctico (CRUD)', year: '2019' },
      { name: 'Django Básico v2', year: '2019' },
      { name: 'Django Avanzado v2', year: '2019' }
    ],
    validator: '@felipebarraza6'
  },
  {
    name: 'Carrera de Bases de Datos',
    platform: 'Platzi',
    icon: Database,
    color: '#336791',
    courses: [
      { name: 'Fundamentos de Bases de Datos', year: '2017' },
      { name: 'PostgreSQL', year: '2017' }
    ],
    validator: '@felipebarraza6'
  },
  {
    name: 'Carrera de DevOps',
    platform: 'Platzi',
    icon: Cog,
    color: '#FF6B6B',
    courses: [
      { name: 'Git y GitHub Profesional', year: '2017' },
      { name: 'Administración de Servidores Linux', year: '2017' }
    ],
    validator: '@felipebarraza6'
  },
  {
    name: 'Carrera Mobile',
    platform: 'Platzi',
    icon: Smartphone,
    color: '#02569B',
    courses: [
      { name: 'Flutter', year: '2019' }
    ],
    validator: '@felipebarraza6'
  },
  {
    name: 'Carrera de Go',
    platform: 'Platzi',
    icon: Zap,
    color: '#00ADD8',
    courses: [
      { name: 'Programación en GO', year: '2015' }
    ],
    validator: '@felipebarraza6'
  }
];

const certifications = [
  {
    name: 'Desarrollador Web Full Stack',
    institution: 'Next U',
    icon: GraduationCap,
    color: '#0056D2',
    date: 'Junio 2016',
    certificate: '10220193',
    description: '12 cursos completados - Frontend, Backend, Bases de Datos',
    url: 'https://www.nextu.com'
  }
];

const experience = [
  {
    role: 'Líder de Software',
    company: 'Smart Hydro',
    period: '2019 - Presente',
    location: 'Chillán, Ñuble, Chile',
    description: 'Arquitectura y liderazgo técnico de sistemas de telemetría hídrica. Cumplimiento normativo DGA, integración IoT, Kubernetes.',
    achievements: [
      '50+ empresas usando nuestros sistemas',
      '120+ instalaciones de monitoreo activo',
      '7,200 litros/segundo gestionados en tiempo real',
      'Cumplimiento Res. N° 1.238 MEE DGA'
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'TimescaleDB', 'MQTT', 'Docker', 'Kubernetes']
  },
  {
    role: 'Lead Developer',
    company: 'Quality Net Chile',
    period: '2017 - Presente',
    location: 'Chillán, Chile',
    description: 'Desarrollo freelance de soluciones tecnológicas end-to-end. Arquitectura de sistemas, APIs REST, automatización con agentes.',
    achievements: [
      'Múltiples proyectos empresariales entregados',
      'Arquitecturas escalables implementadas',
      'Equipos de desarrollo liderados'
    ],
    stack: ['React', 'Node.js', 'Python', 'Docker', 'PostgreSQL']
  },
  {
    role: 'Administrador de Sistemas Linux',
    company: 'MOR Chile S.A.',
    period: 'Nov 2015 - May 2016',
    location: 'Iquique, Chile · Área Minera',
    description: 'Administración de servidores Linux y gestión de software de calidad para el área minera. Implementación y soporte de SISCO 2.0, software de gestión desarrollado por Plan B Computación.',
    achievements: [
      'Carta de recomendación por desempeño destacado',
      'Administración de servidores Linux en producción',
      'Gestión de software de calidad SISCO 2.0 para minería',
      'Soporte técnico a operaciones mineras'
    ],
    stack: ['Linux', 'SISCO 2.0', 'Servidores', 'Software de Calidad'],
    recommendation: true
  },
  {
    role: 'Administrador de Sistemas',
    company: 'Plan B Computación',
    period: '2015',
    location: 'Iquique, Chile',
    description: 'Administración de sistemas y soporte técnico. Desarrollador del software SISCO 2.0, sistema de gestión para el área minera.',
    achievements: [
      'Desarrollo de SISCO 2.0 - Software de gestión minera',
      'Administración de infraestructura de servidores',
      'Soporte técnico especializado'
    ],
    stack: ['Linux', 'Desarrollo de Software', 'Soporte Técnico']
  },
  {
    role: 'Programador Analista',
    company: 'Hospital Dr. Ernesto Torres Galdames',
    period: '2016 - 2017',
    location: 'Chillán, Chile',
    description: 'Análisis estadístico de datos hospitalarios, desarrollo de sistemas de reportes y dashboards de métricas.',
    achievements: [
      'Sistemas de reportes automatizados',
      'Análisis de datos epidemiológicos'
    ],
    stack: ['Python', 'Pandas', 'SQL', 'R']
  }
];

const repoHighlights = [
  {
    name: 'amamaule',
    description: 'Plataforma cultural multi-tenant',
    impact: '135 commits · Sistema de gestión de eventos y venta de entradas',
    tech: ['Django', 'React', 'PostgreSQL'],
    year: '2018'
  },
  {
    name: 'techxdc_prototype',
    description: 'Plataforma de aceleración tecnológica',
    impact: '384 commits · Frontend + Backend + Data Science',
    tech: ['React', 'Node.js', 'Python'],
    year: '2021'
  },
  {
    name: 'move4it_ecosystem',
    description: 'Ecosistema deportivo completo',
    impact: '153 commits · App + API + Landing + Admin',
    tech: ['React', 'Django', 'Redux'],
    year: '2019'
  },
  {
    name: 'agent_master_sh',
    description: 'Sistema de agentes inteligentes',
    impact: '45 commits · Automatización con procesamiento paralelo',
    tech: ['Python', 'Node.js', 'Redis'],
    year: '2023'
  }
];

const iotCapabilities = [
  {
    title: 'Telemetría en Tiempo Real',
    description: 'Procesamiento de datos de sensores con MQTT y WebSockets',
    context: 'Experiencia en Smart Hydro: 120+ instalaciones activas'
  },
  {
    title: 'Series Temporales',
    description: 'Optimización de consultas con TimescaleDB para datos históricos',
    context: '7,200 L/s monitoreados continuamente'
  },
  {
    title: 'Alertas Inteligentes',
    description: 'Sistema de notificaciones basado en umbrales configurables',
    context: 'Notificaciones SMS, Email y push en tiempo real'
  },
  {
    title: 'Dashboards Analíticos',
    description: 'Visualización de métricas con gráficos interactivos',
    context: 'Reportes automáticos diarios/semanales/mensuales'
  }
];

const metrics = [
  { label: 'Años Freelancer', value: '18', icon: Calendar },
  { label: 'Repositorios', value: '44', icon: FolderGit2 },
  { label: 'Proyectos', value: '40+', icon: CheckCircle2 },
  { label: 'Empresas', value: '50+', icon: Building2 },
];

const contactInfo = {
  personal: 'felipe.barraza.vega@gmail.com',
  work: 'felipebarraza@smarthydro.cl',
  phone: '+56 9 33932112',
  linkedin: 'https://www.linkedin.com/in/luis-felipe-andr%C3%A9s-barraza-vega-56692551/',
  github: 'https://github.com/felipebarraza6',
  location: 'Chillán, Ñuble, Chile'
};

// Productos disponibles para venta con iconos vectorizados
const products = [
  {
    id: 'saas-notes',
    name: 'SaaS de Notas',
    tagline: 'Notion-like para equipos',
    description: 'Plataforma de notas colaborativas con workspaces, permisos granulares y editor enriquecido.',
    features: ['Workspaces', 'Editor rich-text', 'Permisos', 'Export PDF'],
    stack: ['React', 'Node.js', 'PostgreSQL'],
    icon: FileText,
    color: '#FCD34D',
    delivery: '2-3 semanas'
  },
  {
    id: 'ecommerce-pro',
    name: 'E-commerce Pro',
    tagline: 'Tienda online completa',
    description: 'Sistema de e-commerce con carrito, pagos, inventario y panel de administración.',
    features: ['Pasarela pagos', 'Inventario', 'Cupones', 'Reportes'],
    stack: ['Next.js', 'Stripe', 'PostgreSQL'],
    icon: ShoppingCart,
    color: '#10B981',
    delivery: '3-4 semanas'
  },
  {
    id: 'dashboard-analytics',
    name: 'Dashboard Analytics',
    tagline: 'Métricas en tiempo real',
    description: 'Panel de análisis con gráficos interactivos, exportación de datos y alertas configurables.',
    features: ['Gráficos D3', 'Export Excel', 'Alertas', 'Filtros'],
    stack: ['React', 'D3.js', 'TimescaleDB'],
    icon: BarChart3,
    color: '#3B82F6',
    delivery: '2-3 semanas'
  },
  {
    id: 'booking-system',
    name: 'Sistema de Reservas',
    tagline: 'Agendamiento completo',
    description: 'Sistema de booking con calendario, notificaciones y gestión de disponibilidad.',
    features: ['Calendario', 'Notificaciones', 'Pagos', 'Recordatorios'],
    stack: ['React', 'Node.js', 'Redis'],
    icon: Calendar,
    color: '#8B5CF6',
    delivery: '2-3 semanas'
  },
  {
    id: 'crm-lite',
    name: 'CRM Lite',
    tagline: 'Gestión de clientes',
    description: 'Sistema CRM con pipeline de ventas, contactos y seguimiento de oportunidades.',
    features: ['Pipeline', 'Contactos', 'Tareas', 'Emails'],
    stack: ['React', 'Django', 'PostgreSQL'],
    icon: Users,
    color: '#EC4899',
    delivery: '3-4 semanas'
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    tagline: 'Backend escalable',
    description: 'API REST completa con autenticación, rate limiting, documentación Swagger y tests.',
    features: ['JWT Auth', 'Rate Limit', 'Swagger', 'Tests'],
    stack: ['Node.js', 'Express', 'Redis'],
    icon: Plug,
    color: '#F59E0B',
    delivery: '1-2 semanas'
  }
];

// Servicios adicionales basados en experiencia
const services = [
  {
    icon: Video,
    title: 'Video Llamadas',
    description: 'Sistema de videoconferencias con WebRTC, salas privadas, chat en tiempo real y grabación.',
    tags: ['WebRTC', 'Socket.io', 'React']
  },
  {
    icon: Cast,
    title: 'Streaming Masivo',
    description: 'Plataforma de streaming en vivo con CDN, chat interactivo y monetización.',
    tags: ['HLS', 'WebRTC', 'Node.js']
  },
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'Arquitectura cloud-native con auto-scaling, load balancing y CI/CD pipelines.',
    tags: ['AWS', 'Kubernetes', 'Terraform']
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Implementación de seguridad: OAuth2, JWT, encryptación, pentesting básico.',
    tags: ['OAuth2', 'JWT', 'SSL/TLS']
  },
  {
    icon: Bot,
    title: 'AI & Automation',
    description: 'Integración de LLMs, chatbots inteligentes y workflows automatizados.',
    tags: ['OpenAI', 'LangChain', 'Python']
  },
  {
    icon: Signal,
    title: 'Real-time Systems',
    description: 'Sistemas en tiempo real con WebSockets, MQTT para IoT y notificaciones push.',
    tags: ['WebSockets', 'MQTT', 'Redis']
  },
  {
    icon: Database,
    title: 'Data Engineering',
    description: 'Pipelines de datos, ETL, warehouses y visualización de métricas.',
    tags: ['PostgreSQL', 'TimescaleDB', 'Pandas']
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Aplicaciones móviles con React Native y backend integrado.',
    tags: ['React Native', 'Expo', 'APIs']
  }
];

// ============================================
// COMPONENTES
// ============================================

const TerminalHeader = ({ title }: { title: string }) => (
  <div className="terminal-header">
    <div className="terminal-dot red" />
    <div className="terminal-dot yellow" />
    <div className="terminal-dot green" />
    <span className="ml-3 text-xs text-[var(--text-muted)] font-mono">{title}</span>
  </div>
);

const Prompt = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2">
    <span className="prompt whitespace-nowrap">felipe@dev:~$</span>
    <span className="command">{children}</span>
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} className={`mb-8 reveal ${isVisible ? 'active' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--accent)]" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-[var(--text-secondary)] text-sm ml-[52px]">{subtitle}</p>}
    </div>
  );
};

const TagBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="tag">{children}</span>
);

// Background Debian minimalista
const DebianBackground = () => (
  <>
    <div className="debian-bg" />
    <div className="subtle-grid" />
  </>
);

// ============================================
// DIAGRAMA DE ENJAMBRE - CORAZON DE LA INNOVACION
// ============================================

const SwarmDiagram = () => {
  const [step, setStep] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [manualMode, setManualMode] = React.useState(false);

  React.useEffect(() => {
    if (!isPlaying || manualMode) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, manualMode]);

  const handleStepClick = (index: number) => {
    setManualMode(true);
    setIsPlaying(false);
    setStep(index);
  };

  const handlePlay = () => {
    setManualMode(false);
    setIsPlaying(true);
  };

  const agents = [
    { 
      id: 'architect',
      name: 'Arquitecto', 
      icon: Layers, 
      role: 'Diseña la estructura',
      task: 'Define modelos, rutas, esquemas DB',
      stack: 'TypeScript, Prisma, UML',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.15)'
    },
    { 
      id: 'frontend',
      name: 'Frontend', 
      icon: Layout, 
      role: 'Construye la UI',
      task: 'Componentes, estados, formularios',
      stack: 'React, Tailwind, Zustand',
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.15)'
    },
    { 
      id: 'backend',
      name: 'Backend', 
      icon: Server, 
      role: 'Desarrolla APIs',
      task: 'Endpoints, auth, lógica de negocio',
      stack: 'Node.js, Express, JWT',
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.15)'
    },
    { 
      id: 'database',
      name: 'Database', 
      icon: Database, 
      role: 'Optimiza datos',
      task: 'Queries, índices, migraciones',
      stack: 'PostgreSQL, Redis',
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.15)'
    },
  ];

  const steps = [
    { 
      label: 'Requerimiento', 
      desc: 'El cliente describe su necesidad',
      detail: 'Recibo tu idea, analizo el alcance y defino los objetivos del proyecto. Todo parte de una conversación clara.'
    },
    { 
      label: 'Análisis', 
      desc: 'El Orquestador IA entiende y planifica',
      detail: 'El Orquestador descompone el proyecto en tareas específicas y crea un plan de ejecución optimizado.'
    },
    { 
      label: 'Distribución', 
      desc: 'Tareas asignadas a cada agente',
      detail: 'Cada agente especializado recibe sus tareas: Arquitecto diseña, Frontend construye UI, Backend APIs, Database esquemas.'
    },
    { 
      label: 'Ejecución', 
      desc: 'Agentes trabajan en paralelo',
      detail: 'Los 4 agentes trabajan simultáneamente. Cada uno es experto en su área con un LLM optimizado para su rol.'
    },
    { 
      label: 'Integración', 
      desc: 'Código unido y testeado',
      detail: 'El Integrador une todo el código, ejecuta tests, verifica que todo funcione y genera documentación.'
    },
    { 
      label: 'Deploy', 
      desc: 'Sistema en producción',
      detail: 'El sistema se despliega a producción, listo para que tus usuarios lo usen. Soporte post-lanzamiento incluido.'
    },
  ];

  return (
    <div className="w-full">
      {/* Layout principal: Steps a la izquierda, Diagrama a la derecha */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        
        {/* Panel izquierdo: Steps verticales */}
        <div className="space-y-2">
          {/* Controles */}
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => isPlaying ? setIsPlaying(false) : handlePlay()}
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-mono hover:border-[var(--accent)] transition-colors flex items-center justify-center gap-2"
            >
              {isPlaying && !manualMode ? '⏸' : '▶'}
            </button>
            <button 
              onClick={() => { setStep(0); setManualMode(false); setIsPlaying(true); }}
              className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-mono hover:border-[var(--accent)] transition-colors"
            >
              ↺
            </button>
          </div>
          
          {manualMode && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-[var(--accent)]/20 border border-[var(--accent)] text-xs font-mono text-[var(--accent)] text-center">
              Modo Manual
            </div>
          )}

          {/* Steps verticales */}
          <div className="space-y-2">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${
                  step === i
                    ? 'border-[var(--accent)] bg-[var(--accent-dim)]'
                    : step > i
                      ? 'border-[var(--accent)]/30 bg-[var(--bg-secondary)]'
                      : 'border-[var(--border)] bg-[var(--bg-secondary)] opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                    step === i
                      ? 'bg-[var(--accent)] text-white'
                      : step > i
                        ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                        : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
                  }`}>
                    {step > i ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${step === i ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">{s.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Explicación del paso actual */}
          <div className="mt-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] mb-1 font-mono">// Etapa {step + 1}/6</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {steps[step].detail}
            </p>
          </div>
        </div>

        {/* Panel derecho: Diagrama visual */}
        <div className="relative bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-6 overflow-hidden min-h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--error)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]" />
              <span className="ml-2 text-xs font-mono text-[var(--text-muted)]">swarm_visualization</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[var(--text-muted)] font-mono">{Math.round(((step + 1) / 6) * 100)}%</span>
              <div className="w-20 h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-500"
                  style={{ width: `${((step + 1) / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Diagrama vertical centrado */}
          <div className="flex flex-col items-center space-y-4">
            
            {/* Input */}
            <div className={`transition-all duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-500 ${
                step === 0 
                  ? 'border-[var(--accent)] bg-[var(--accent-dim)] shadow-[0_0_20px_rgba(215,10,83,0.15)]' 
                  : 'border-[var(--border)] bg-[var(--bg-card)]'
              }`}>
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Input</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">Requerimiento del cliente</p>
                </div>
              </div>
            </div>

            {/* Conector */}
            <div className="relative w-px h-6 bg-[var(--border)]">
              <div className="absolute top-0 left-0 w-full bg-[var(--accent)] transition-all duration-500" style={{ height: step >= 1 ? '100%' : '0%' }} />
            </div>

            {/* Orquestador */}
            <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`flex flex-col items-center px-6 py-4 rounded-xl border-2 transition-all duration-500 ${
                step >= 1 && step < 5
                  ? 'border-[var(--accent)] bg-gradient-to-b from-[var(--accent-dim)] to-transparent shadow-[0_0_30px_rgba(215,10,83,0.2)]' 
                  : 'border-[var(--border)] bg-[var(--bg-card)]'
              }`}>
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center mb-2">
                  <Bot className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <p className="text-sm font-semibold text-[var(--accent)] font-mono">Orquestador IA</p>
                <p className="text-[10px] text-[var(--text-muted)]">Analiza y coordina</p>
              </div>
            </div>

            {/* Conector a agentes */}
            <div className="relative w-px h-4 bg-[var(--border)]">
              <div className="absolute top-0 left-0 w-full bg-[var(--accent)] transition-all duration-500" style={{ height: step >= 2 ? '100%' : '0%' }} />
            </div>

            {/* Sección de Agentes con línea horizontal */}
            <div className="relative w-full max-w-lg">
              {/* Línea horizontal de fondo */}
              <div className="absolute top-3 left-0 right-0 h-px bg-[var(--border)]" />
              {/* Línea horizontal animada */}
              <div className="absolute top-3 left-0 h-px bg-[var(--accent)] transition-all duration-700" style={{ width: step >= 2 ? '100%' : '0%' }} />
              
              {/* Agentes en fila */}
              <div className="relative grid grid-cols-4 gap-3 pt-6">
                {agents.map((agent, i) => (
                  <div key={agent.id} className="flex flex-col items-center">
                    {/* Conector vertical desde la línea horizontal */}
                    <div className="absolute top-0 w-px h-6 bg-[var(--border)]" style={{ left: `${12.5 + i * 25}%`, marginLeft: '-1px' }}>
                      <div className="absolute top-0 left-0 w-full bg-[var(--accent)] transition-all duration-500" style={{ height: step >= 2 ? '100%' : '0%', transitionDelay: `${i * 150}ms` }} />
                    </div>
                    {/* Card del agente */}
                    <div 
                      className={`relative w-full p-3 rounded-xl border transition-all duration-500 ${
                        step >= 3 
                          ? 'border-opacity-100 scale-100' 
                          : 'border-opacity-40 scale-95'
                      }`}
                      style={{ 
                        borderColor: agent.color,
                        backgroundColor: step >= 3 ? agent.bgColor : 'var(--bg-card)',
                        transitionDelay: `${i * 100}ms`
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div 
                          className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
                          style={{ backgroundColor: `${agent.color}20` }}
                        >
                          <agent.icon className="w-4 h-4" style={{ color: agent.color }} />
                        </div>
                        <p className="text-[10px] font-semibold font-mono mb-1" style={{ color: agent.color }}>{agent.name}</p>
                        <p className="text-[9px] text-[var(--text-muted)] leading-tight">{agent.task}</p>
                      </div>
                      {step === 3 && (
                        <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conector a integrador */}
            <div className="relative w-px h-6 bg-[var(--border)]">
              <div className="absolute top-0 left-0 w-full bg-[var(--accent)] transition-all duration-500" style={{ height: step >= 4 ? '100%' : '0%' }} />
            </div>

            {/* Integrador */}
            <div className={`transition-all duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-500 ${
                step === 4
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                  : 'border-[var(--border)] bg-[var(--bg-card)]'
              }`}>
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center">
                  <GitMerge className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-400 font-mono">Integrador</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Une, testea, documenta</p>
                </div>
              </div>
            </div>

            {/* Conector final */}
            <div className="relative w-px h-6 bg-[var(--border)]">
              <div className="absolute top-0 left-0 w-full bg-[var(--accent)] transition-all duration-500" style={{ height: step >= 5 ? '100%' : '0%' }} />
            </div>

            {/* Output */}
            <div className={`transition-all duration-500 ${step >= 5 ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-500 ${
                step === 5
                  ? 'border-[var(--success)] bg-[var(--success)]/10 shadow-[0_0_30px_rgba(35,134,54,0.2)]' 
                  : 'border-[var(--border)] bg-[var(--bg-card)]'
              }`}>
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-[var(--success)]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[var(--success)] font-mono">Sistema Desplegado</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Producción lista</p>
                </div>
                {step === 5 && (
                  <div className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--success)]/20">
                    <CheckCircle2 className="w-3 h-3 text-[var(--success)]" />
                    <span className="text-[9px] text-[var(--success)] font-mono">LIVE</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECCIONES
// ============================================

const HeroSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 py-20 relative z-10">
      <div className="max-w-4xl mx-auto w-full">
        <div ref={ref} className={`terminal-card overflow-hidden hover-glow reveal ${isVisible ? 'active' : ''}`}>
          <TerminalHeader title="profile.sh --freelancer" />
          <div className="p-6 md:p-10 space-y-8">
            {/* Status */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="status-badge">Disponible para proyectos</span>
              <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {contactInfo.location}
              </span>
            </div>
            
            {/* Name */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
                Felipe Barraza
              </h1>
              <p className="text-xl text-[var(--accent)] font-mono flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Líder de Software & Arquitecto de Sistemas
              </p>
            </div>
            
            {/* Description */}
            <div className="space-y-4">
              <Prompt>cat perfil.txt</Prompt>
              <div className="pl-4 border-l-2 border-[var(--border)] ml-[88px] space-y-3">
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  <span className="text-[var(--accent)] font-mono">18 años</span> como freelancer desarrollando 
                  soluciones tecnológicas end-to-end. Especialista en <span className="text-[var(--accent)]">JavaScript</span> y 
                  <span className="text-[var(--accent)]"> Python</span>, con dominio de todo el stack desde frontend hasta infraestructura.
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Mis proyectos hablan por mí: <span className="text-[var(--accent)]">amamaule</span>, 
                  <span className="text-[var(--accent)]"> techxdc</span>, <span className="text-[var(--accent)]">move4it</span> y 
                  <span className="text-[var(--accent)]">agent_master</span> son solo algunos de los sistemas que he construido 
                  y que hoy están en producción. Actualmente <span className="text-[var(--text-primary)]">Líder de Software en Smart Hydro</span>, 
                  desarrollando <span className="text-[var(--accent)]">Ikolu</span>: plataforma de telemetría 
                  con <span className="text-[var(--accent)]">50+ empresas</span> y 
                  <span className="text-[var(--accent)]">120+ instalaciones</span> activas.
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {metrics.map((m, i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
                  <div className="stat-number">{m.value}</div>
                  <div className="stat-label mt-1">{m.label}</div>
                </div>
              ))}
            </div>
            
            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={`mailto:${contactInfo.work}`} className="terminal-btn">
                <Mail className="w-4 h-4" />
                Contactar
              </a>
              <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="terminal-btn">
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="terminal-btn">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HighlightsSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-16 relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          icon={Star} 
          title="Hitos de Repositorios"
          subtitle="Proyectos que respaldan mi experiencia"
        />
        
        <div ref={ref} className={`grid md:grid-cols-2 gap-4 reveal ${isVisible ? 'active' : ''}`}>
          {repoHighlights.map((repo, i) => (
            <div key={i} className={`terminal-card p-5 stagger-${i + 1}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--accent)] font-mono">{repo.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{repo.description}</p>
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono">{repo.year}</span>
              </div>
              
              <p className="text-xs text-[var(--text-muted)] mb-3 font-mono">{repo.impact}</p>
              
              <div className="flex flex-wrap gap-2">
                {repo.tech.map((t, j) => (
                  <TagBadge key={j}>{t}</TagBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center reveal">
          <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-mono hover:underline">
            <Github className="w-4 h-4" />
            Explorar los 44 repositorios
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

const CertificationsSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-16 bg-[var(--bg-secondary)] relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          icon={Award} 
          title="Certificaciones y Carreras"
          subtitle="Formación técnica completa con IDs validadores"
        />
        
        {/* Certificación Next U */}
        <div ref={ref} className={`terminal-card p-6 mb-6 border-l-4 reveal ${isVisible ? 'active' : ''}`} style={{ borderLeftColor: certifications[0].color }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" 
                 style={{ background: `${certifications[0].color}20` }}>
              <GraduationCap className="w-7 h-7" style={{ color: certifications[0].color }} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold">{certifications[0].name}</h3>
                <span className="text-xs text-[var(--text-muted)] font-mono">{certifications[0].date}</span>
              </div>
              <p className="font-mono text-sm mb-2" style={{ color: certifications[0].color }}>{certifications[0].institution}</p>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{certifications[0].description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)] font-mono">ID: {certifications[0].certificate}</span>
                <a href={certifications[0].url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent)] hover:underline">
                  Verificar →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Carreras de Platzi */}
        <div className="terminal-card overflow-hidden">
          <TerminalHeader title="platzi_careers.json" />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#98CA3F] to-[#7CB342] flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <p className="text-sm font-semibold">Platzi</p>
                <p className="text-xs text-[var(--text-muted)]">@felipebarraza6 · 7 Carreras · 22+ Cursos</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {careers.map((career, i) => {
                const CareerIcon = career.icon;
                return (
                  <div key={i} className={`terminal-card p-4 hover:border-[var(--accent)] transition-all stagger-${i + 1}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                           style={{ background: `${career.color}20` }}>
                        <CareerIcon className="w-6 h-6" style={{ color: career.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{career.name}</h4>
                        <p className="text-xs font-mono mt-0.5" style={{ color: career.color }}>{career.courses.length} cursos</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {career.courses.slice(0, 3).map((c, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-muted)]">
                              {c.name.split(' ')[0]}
                            </span>
                          ))}
                          {career.courses.length > 3 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-muted)]">
                              +{career.courses.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-xs text-[var(--text-muted)]">ID Validador: @felipebarraza6</span>
              <a href="https://platzi.com/p/felipebarraza6/" target="_blank" rel="noopener noreferrer" 
                 className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-mono hover:underline">
                Ver perfil completo
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-16 relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          icon={Zap} 
          title="Servicios Disponibles"
          subtitle="Soluciones técnicas para cualquier necesidad"
        />
        
        <div ref={ref} className={`grid md:grid-cols-2 lg:grid-cols-4 gap-4 reveal ${isVisible ? 'active' : ''}`}>
          {services.map((service, i) => {
            const ServiceIcon = service.icon;
            return (
              <div key={i} className={`service-card stagger-${i + 1}`}>
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center mb-3">
                  <ServiceIcon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h4 className="font-semibold text-sm mb-2">{service.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] mb-3">{service.description}</p>
                <div className="flex flex-wrap gap-1">
                  {service.tags.map((tag, j) => (
                    <span key={j} className="text-[9px] px-2 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ExperienceSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-16 bg-[var(--bg-secondary)] relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          icon={Briefcase} 
          title="Experiencia Profesional"
          subtitle="Trayectoria en desarrollo de software"
        />
        
        <div ref={ref} className={`space-y-6 reveal ${isVisible ? 'active' : ''}`}>
          {experience.map((exp, i) => (
            <div key={i} className={`terminal-card stagger-${i + 1}`}>
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <p className="text-[var(--accent)] font-mono text-sm mt-1">{exp.company}</p>
                    {exp.recommendation && (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--accent)] mt-1">
                        <Award className="w-3 h-3" />
                        Carta de recomendación
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--text-secondary)] font-mono">{exp.period}</p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </p>
                  </div>
                </div>
                
                <p className="text-[var(--text-secondary)] text-sm mb-4">{exp.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs text-[var(--text-muted)] mb-2 font-mono">// Logros destacados</p>
                  <ul className="space-y-2">
                    {exp.achievements.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span className="text-[var(--text-secondary)]">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {exp.stack.map((s, j) => (
                    <TagBadge key={j}>{s}</TagBadge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IoTSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-16 relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          icon={Radio} 
          title="Experiencia IoT"
          subtitle="Capacidades demostradas en entornos de producción"
        />
        
        <div ref={ref} className={`terminal-card p-6 mb-6 reveal ${isVisible ? 'active' : ''}`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-dim)] flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Smart Hydro - Ikolu</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                Líder técnico de plataforma de telemetría hídrica con 120+ instalaciones de sensores IoT 
                monitoreando 7,200 litros/segundo en tiempo real.
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Esta experiencia demuestra mi capacidad para construir sistemas IoT robustos, 
                pero mis servicios freelance se enfocan en otros dominios.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {iotCapabilities.map((cap, i) => (
            <div key={i} className={`terminal-card p-5 stagger-${i + 1}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                <h4 className="font-semibold text-sm">{cap.title}</h4>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-2">{cap.description}</p>
              <p className="text-xs text-[var(--text-muted)]">{cap.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectsSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-16 bg-[var(--bg-secondary)] relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          icon={Zap} 
          title="Productos Disponibles"
          subtitle="Sistemas empaquetados listos para implementar"
        />
        
        {/* Galería de productos */}
        <div ref={ref} className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 reveal ${isVisible ? 'active' : ''}`}>
          {products.map((product, i) => {
            const ProductIcon = product.icon;
            return (
              <div key={i} className={`product-card group stagger-${i + 1}`}>
                {/* Header con icono */}
                <div className="p-4 border-b border-[var(--border)] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${product.color}, transparent)` }} />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                         style={{ background: `${product.color}20` }}>
                      <ProductIcon className="w-6 h-6" style={{ color: product.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <p className="text-[10px] text-[var(--text-muted)]">{product.tagline}</p>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.features.map((f, j) => (
                      <span key={j} className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-muted)]">
                        {f}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stack */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.stack.map((s, j) => (
                      <span key={j} className="text-[9px] px-1.5 py-0.5 rounded font-mono" 
                            style={{ background: `${product.color}15`, color: product.color }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {product.delivery}
                    </span>
                    <a href={`mailto:${contactInfo.work}?subject=Interés en ${product.name}`} 
                       className="text-[10px] px-3 py-1.5 rounded-lg font-medium transition-all"
                       style={{ background: product.color, color: '#000' }}>
                      Cotizar
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* CTA */}
        <div className="mt-8 text-center reveal">
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            ¿Necesitas algo personalizado? Todos los productos se adaptan a tus requerimientos.
          </p>
          <a href={`mailto:${contactInfo.work}`} className="terminal-btn inline-flex">
            <MessageSquare className="w-4 h-4" />
            Consultar proyecto personalizado
          </a>
        </div>
      </div>
    </section>
  );
};

const SkillsSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-16 relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          icon={Code2} 
          title="Stack Tecnológico"
          subtitle="Tecnologías que domino y uso en producción"
        />
        
        <div ref={ref} className={`terminal-card p-6 reveal ${isVisible ? 'active' : ''}`}>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, i) => (
              <div key={i} className={`stagger-${i + 1}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-[var(--text-muted)] font-mono">{skill.level}%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                </div>
                <span className="text-xs text-[var(--text-muted)]">{skill.category}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { icon: Layout, title: 'Frontend', desc: 'React, TypeScript' },
            { icon: Server, title: 'Backend', desc: 'Node.js, Python' },
            { icon: Database, title: 'Database', desc: 'PostgreSQL, Redis' },
            { icon: Container, title: 'DevOps', desc: 'Docker, Kubernetes' },
          ].map((item, i) => (
            <div key={i} className={`terminal-card p-4 text-center hover:border-[var(--accent)] transition-colors stagger-${i + 1}`}>
              <item.icon className="w-6 h-6 text-[var(--accent)] mx-auto mb-2" />
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SwarmSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-20 bg-[var(--bg-secondary)] relative z-10">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent)]/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        {/* Header destacado */}
        <div ref={ref} className={`text-center mb-12 reveal ${isVisible ? 'active' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-dim)] border border-[var(--accent)]/30 mb-4">
            <Bot className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-mono text-[var(--accent)]">INNOVACIÓN CORE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Arquitectura de <span className="text-[var(--accent)]">Enjambre</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Mi metodología revolucionaria: en lugar de trabajar solo, orquesto un equipo de 
            <span className="text-[var(--accent)]"> agentes IA especializados</span> que trabajan en paralelo.
          </p>
        </div>
        
        {/* Diagrama Principal con layout lateral */}
        <div className={`mb-12 reveal ${isVisible ? 'active' : ''}`}>
          <SwarmDiagram />
        </div>
        
        {/* Grid de beneficios */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className={`p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all reveal ${isVisible ? 'active' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-semibold text-sm mb-2">Velocidad 4x</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              4 agentes trabajando simultáneamente = desarrollo 4x más rápido que un solo desarrollador.
            </p>
          </div>
          
          <div className={`p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all reveal ${isVisible ? 'active' : ''}`} style={{ transitionDelay: '100ms' }}>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-semibold text-sm mb-2">Especialización</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Cada agente tiene un LLM optimizado para su rol: arquitectura, frontend, backend o datos.
            </p>
          </div>
          
          <div className={`p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all reveal ${isVisible ? 'active' : ''}`} style={{ transitionDelay: '200ms' }}>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <h4 className="font-semibold text-sm mb-2">Calidad Garantizada</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Código revisado, testeado y documentado automáticamente por el integrador.
            </p>
          </div>
        </div>
        
        {/* CTA final */}
        <div className={`text-center reveal ${isVisible ? 'active' : ''}`} style={{ transitionDelay: '300ms' }}>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            ¿Quieres ver cómo el enjambre puede acelerar tu proyecto?
          </p>
          <a href={`mailto:${contactInfo.work}?subject=Consulta sobre Arquitectura de Enjambre`} 
             className="terminal-btn inline-flex">
            <Bot className="w-4 h-4" />
            Consultar sobre el enjambre
          </a>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="px-6 py-16 relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          icon={MessageSquare} 
          title="Contacto"
          subtitle="Disponible para proyectos y consultoría"
        />
        
        <div ref={ref} className={`terminal-card p-6 reveal ${isVisible ? 'active' : ''}`}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Email principal</p>
                  <a href={`mailto:${contactInfo.work}`} className="terminal-link font-mono text-sm">
                    {contactInfo.work}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Email personal</p>
                  <a href={`mailto:${contactInfo.personal}`} className="terminal-link font-mono text-sm">
                    {contactInfo.personal}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Teléfono</p>
                  <a href={`tel:${contactInfo.phone}`} className="terminal-link font-mono text-sm">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Ubicación</p>
                  <p className="text-sm">{contactInfo.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">LinkedIn</p>
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="terminal-link font-mono text-sm">
                    /in/felipebarraza
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-dim)] flex items-center justify-center">
                  <Github className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">GitHub</p>
                  <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="terminal-link font-mono text-sm">
                    @felipebarraza6
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <a href={`mailto:${contactInfo.work}`} className="terminal-btn w-full justify-center">
              <Mail className="w-4 h-4" />
              Enviar email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="px-6 py-8 border-t border-[var(--border)] relative z-10 bg-[var(--bg-primary)]">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-[var(--accent)]" />
        <span className="footer-text">felipe@dev:~$</span>
      </div>
      <p className="footer-text text-center">
        © 2026 Felipe Barraza · Freelancer · 18 años de experiencia
      </p>
      <div className="flex items-center gap-4">
        <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
          <Github className="w-4 h-4" />
        </a>
        <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
          <Linkedin className="w-4 h-4" />
        </a>
        <a href={`mailto:${contactInfo.personal}`} className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </div>
  </footer>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Debian Background */}
      <DebianBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--accent)]" />
            <span className="font-mono text-sm">felipe@dev</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#hitos" className="nav-link hidden sm:block">Hitos</a>
            <a href="#experiencia" className="nav-link hidden sm:block">Experiencia</a>
            <a href="#enjambre" className="nav-link">Enjambre</a>
            <Link to="/guia-kimi" className="nav-link">Guía</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-14">
        <HeroSection />
        <div className="section-divider" />
        <div id="hitos">
          <HighlightsSection />
        </div>
        <div className="section-divider" />
        <CertificationsSection />
        <div className="section-divider" />
        <ServicesSection />
        <div className="section-divider" />
        <div id="experiencia">
          <ExperienceSection />
        </div>
        <div className="section-divider" />
        <IoTSection />
        <div className="section-divider" />
        <ProjectsSection />
        <div className="section-divider" />
        <SkillsSection />
        <div className="section-divider" />
        <div id="enjambre">
          <SwarmSection />
        </div>
        <div className="section-divider" />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
