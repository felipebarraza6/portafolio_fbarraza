import { 
  Sparkles, 
  Terminal, 
  Cloud, 
  Users, 
  Search, 
  FileText,
  Brain,
  Code2,
  Zap,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Clock,
  Target,
  Layers,
  ExternalLink,
  Play,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Zap,
    title: '40 Usos de Agente',
    description: 'Ejecuta hasta 40 agentes inteligentes por mes para automatizar tareas complejas.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10'
  },
  {
    icon: Users,
    title: 'Enjambre de Agentes',
    description: 'Soporte para ejecutar múltiples agentes simultáneamente, trabajando en paralelo.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10'
  },
  {
    icon: Cloud,
    title: 'Kimi Claw Beta',
    description: 'Acceso exclusivo al servicio cloud-native basado en OpenClaw. Operación 24/7.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10'
  },
  {
    icon: Brain,
    title: 'Kimi K2.5',
    description: 'El modelo más potente de Moonshot con ventana de contexto de 256K tokens.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10'
  },
  {
    icon: Search,
    title: 'Investigación Profunda',
    description: '40 usos mensuales de investigación profunda con acceso a datos en tiempo real.',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10'
  },
  {
    icon: FileText,
    title: 'Generación de PPT',
    description: 'Crea presentaciones profesionales automáticamente con 40 usos mensuales.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10'
  }
];

const workflowSteps = [
  {
    number: '01',
    icon: Terminal,
    title: 'Kimi Code CLI',
    subtitle: 'Programación en Terminal',
    description: 'Instala y configura Kimi Code para programar directamente desde tu terminal con asistencia IA.',
    install: 'npm install -g kimi-code',
    setup: 'kimi login',
    usage: 'kimi chat',
    features: [
      'Integración con VS Code, Cursor, NeoVim',
      'Soporte para 20+ lenguajes',
      'Autocompletado inteligente',
      'Refactorización automática'
    ],
    color: 'from-blue-600 to-cyan-600'
  },
  {
    number: '02',
    icon: Cloud,
    title: 'Kimi Claw Beta',
    subtitle: 'Agentes en la Nube',
    description: 'Accede a Kimi Claw Beta, el servicio cloud-native que opera 24/7 sin configuración local.',
    install: 'Acceso desde kimi.ai',
    setup: 'Activar Kimi Claw en settings',
    usage: 'Operación 24/7 en navegador',
    features: [
      '40GB almacenamiento cloud',
      '5,000+ habilidades comunitarias',
      'Sin configuración local',
      'Integración OpenClaw'
    ],
    color: 'from-purple-600 to-pink-600'
  },
  {
    number: '03',
    icon: Users,
    title: 'Enjambre de Agentes',
    subtitle: 'Ejecución Paralela',
    description: 'Utiliza el enjambre para ejecutar múltiples tareas simultáneamente.',
    install: 'Disponible en Allegretto+',
    setup: 'Configurar coordinación',
    usage: 'Hasta 5 agentes paralelos',
    features: [
      'Coordinación automática',
      'Distribución de tareas',
      'Resultados consolidados',
      'Balanceo de carga'
    ],
    color: 'from-green-600 to-emerald-600'
  },
  {
    number: '04',
    icon: Search,
    title: 'Investigación Profunda',
    subtitle: 'Análisis Exhaustivo',
    description: 'Aprovecha los 40 usos mensuales para análisis detallados con datos actualizados.',
    install: 'Incluido en Allegretto',
    setup: 'Seleccionar modo investigación',
    usage: '40 investigaciones/mes',
    features: [
      'Búsqueda web en tiempo real',
      'Análisis de múltiples fuentes',
      'Síntesis de información',
      'Citaciones automáticas'
    ],
    color: 'from-orange-600 to-red-600'
  }
];

const tips = [
  {
    icon: Target,
    title: 'Planifica tus Agentes',
    description: 'Define claramente el objetivo antes de ejecutar. Un agente bien dirigido consume menos tokens.',
    category: 'Estrategia'
  },
  {
    icon: Layers,
    title: 'Usa el Enjambre Estratégicamente',
    description: 'Divide tareas grandes en subtareas paralelas. Cada agente debe tener un objetivo específico.',
    category: 'Estrategia'
  },
  {
    icon: Clock,
    title: 'Programa Investigaciones',
    description: 'Usa investigaciones profundas solo para temas que requieren datos actualizados.',
    category: 'Ahorro'
  },
  {
    icon: Zap,
    title: 'Aprovecha el Contexto 256K',
    description: 'Carga documentos completos. No desperdicies tokens repitiendo contexto.',
    category: 'Optimización'
  },
  {
    icon: TrendingUp,
    title: 'Monitorea tu Uso',
    description: 'Revisa semanalmente cuántos agentes has usado para ajustar tu estrategia.',
    category: 'Gestión'
  },
  {
    icon: Lightbulb,
    title: 'Combina Herramientas',
    description: 'Kimi Code para desarrollo, Kimi Claw para cloud, chat para brainstorming.',
    category: 'Estrategia'
  }
];

const useCases = [
  {
    task: 'Desarrollo Feature Completa',
    agents: 3,
    tokens: '~15K',
    time: '2-3h',
    description: 'Arquitectura + Implementación + Tests'
  },
  {
    task: 'Investigación Tecnología',
    agents: 2,
    tokens: '~8K',
    time: '30min',
    description: 'Investigación profunda + Síntesis'
  },
  {
    task: 'Refactorización Código',
    agents: 1,
    tokens: '~5K',
    time: '1h',
    description: 'Análisis completo del codebase'
  },
  {
    task: 'Documentación Técnica',
    agents: 2,
    tokens: '~6K',
    time: '45min',
    description: 'Generar docs + Revisar y mejorar'
  },
  {
    task: 'Debug Complejo',
    agents: 2,
    tokens: '~4K',
    time: '30min',
    description: 'Análisis + Soluciones propuestas'
  }
];

const warnings = [
  'No uses agentes para tareas simples que puedes resolver con el chat normal',
  'Evita reiniciar conversaciones con el mismo contexto',
  'No ignores los límites - planifica para no quedarte sin agentes',
  'Evita ejecutar agentes sin objetivos claros'
];

const codeExamples = [
  {
    title: 'Iniciar Proyecto',
    code: `# Instalar Kimi Code CLI
npm install -g kimi-code

# Iniciar sesión
kimi login

# Crear nuevo proyecto
kimi init mi-proyecto --template react-ts

# Modo interactivo
kimi chat`
  },
  {
    title: 'Configurar Enjambre',
    code: `// Configuración de enjambre
const swarm = await kimi.createSwarm({
  agents: [
    { name: 'architect', task: 'design-api' },
    { name: 'implementer', task: 'build-endpoints' },
    { name: 'tester', task: 'write-tests' }
  ],
  coordination: 'parallel',
  maxConcurrent: 3
});

const results = await swarm.execute();`
  },
  {
    title: 'Investigación Profunda',
    code: `// Usar investigación profunda
const research = await kimi.deepResearch({
  query: 'Tendencias microfrontends 2026',
  sources: ['web', 'academic', 'github'],
  depth: 'comprehensive',
  maxResults: 50
});

console.log(research.summary);
console.log(research.sources);`
  }
];

export default function KimiGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              <span className="text-xl font-bold text-white">Felipe</span>
              <span className="text-xl font-bold gradient-text">Barraza</span>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-300">
                <Sparkles className="w-3 h-3 mr-1" />
                Allegretto
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-purple-500/30 bg-purple-500/10 text-purple-300">
            <Sparkles className="w-4 h-4 mr-2" />
            Suscripción Allegretto Activa
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Guía <span className="gradient-text">Kimi</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Maximiza tus 40 usos de agente, enjambre de agentes y Kimi Claw Beta. 
            Saca el máximo provecho a tu suscripción Allegretto.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-white">40</div>
              <div className="text-sm text-muted-foreground">Agentes/mes</div>
            </div>
            <div className="glass rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-purple-400">256K</div>
              <div className="text-sm text-muted-foreground">Contexto</div>
            </div>
            <div className="glass rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-cyan-400">Beta</div>
              <div className="text-sm text-muted-foreground">Kimi Claw</div>
            </div>
            <div className="glass rounded-lg px-6 py-3">
              <div className="text-2xl font-bold text-green-400">¥199</div>
              <div className="text-sm text-muted-foreground">mensual</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/5 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              Características
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Tu Plan <span className="gradient-text">Allegretto</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass border-white/10 hover:bg-white/5 transition-all">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-cyan-950/5 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-purple-500/30 bg-purple-500/10 text-purple-300">
              <Play className="w-3 h-3 mr-1" />
              Flujo de Trabajo
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Cómo <span className="gradient-text">Empezar</span>
            </h2>
          </div>

          <Tabs defaultValue="01" className="w-full">
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-8">
              {workflowSteps.map((step) => (
                <TabsTrigger key={step.number} value={step.number} className="data-[state=active]:bg-purple-500/20">
                  <span className="mr-2 text-muted-foreground">{step.number}</span>
                  {step.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {workflowSteps.map((step) => (
              <TabsContent key={step.number} value={step.number}>
                <Card className="glass border-white/10">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <div className={`text-4xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-2`}>
                            {step.number}
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-1">{step.title}</h3>
                          <p className={`text-sm bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>{step.subtitle}</p>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                        <div className="space-y-3">
                          {step.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className={`w-4 h-4 text-purple-400`} />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="glass rounded-lg p-4 font-mono text-sm space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                          </div>
                          <div className="space-y-1">
                            <p><span className="text-green-400">$</span> <span className="text-white">{step.install}</span></p>
                            <p><span className="text-green-400">$</span> <span className="text-white">{step.setup}</span></p>
                            <p><span className="text-green-400">$</span> <span className="text-white">{step.usage}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Tips */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/5 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-green-500/30 bg-green-500/10 text-green-300">
              <Lightbulb className="w-3 h-3 mr-1" />
              Mejores Prácticas
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Tips para <span className="gradient-text">Maximizar</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tips.map((tip, index) => (
              <Card key={index} className="glass border-white/10 hover:bg-white/5 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <tip.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <Badge variant="outline" className="text-xs">{tip.category}</Badge>
                  </div>
                  <CardTitle className="text-lg text-white">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Use Cases */}
          <Card className="glass border-white/10 mb-12">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Ejemplos de Uso Óptimo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="glass rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">{useCase.task}</span>
                      <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                        {useCase.agents} agente{useCase.agents > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{useCase.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>~{useCase.tokens}</span>
                      <span>{useCase.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          <Card className="glass border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Qué Evitar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{warning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Code Examples */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-cyan-950/5 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <Code2 className="w-3 h-3 mr-1" />
              Código
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ejemplos <span className="gradient-text">Prácticos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {codeExamples.map((example, index) => (
              <Card key={index} className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{example.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="glass rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-muted-foreground">{example.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/10 to-background" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-strong border-purple-500/20 glow-purple">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Recursos Adicionales
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <a href="https://kimi.ai" target="_blank" rel="noopener noreferrer" className="glass rounded-lg p-4 hover:bg-white/10 transition-colors flex items-center justify-between">
                  <span className="text-white">Kimi AI</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="https://code.kimi.ai" target="_blank" rel="noopener noreferrer" className="glass rounded-lg p-4 hover:bg-white/10 transition-colors flex items-center justify-between">
                  <span className="text-white">Kimi Code</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="https://docs.kimi.ai" target="_blank" rel="noopener noreferrer" className="glass rounded-lg p-4 hover:bg-white/10 transition-colors flex items-center justify-between">
                  <span className="text-white">Documentación</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="https://platform.moonshot.cn" target="_blank" rel="noopener noreferrer" className="glass rounded-lg p-4 hover:bg-white/10 transition-colors flex items-center justify-between">
                  <span className="text-white">API Platform</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
              <Link to="/">
                <Button size="lg" variant="outline" className="border-white/20 mt-4">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Volver al Portafolio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">Felipe</span>
              <span className="text-lg font-bold gradient-text">Barraza</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Guía para usuarios de Kimi Allegretto
            </p>
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Allegretto Activo
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
