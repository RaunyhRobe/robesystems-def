import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, Cpu, Code2, Lock, Rocket, Zap, MessageCircle, CheckCircle2, ChevronRight, AlertCircle, UtensilsCrossed, Bot, TrendingUp, LayoutDashboard, ChevronDown, DollarSign, Scale, ShoppingBag } from "lucide-react";
import logoImage from "@assets/logo_robe_systems.png";
import ProjectShowcase from "@/components/demos/ProjectShowcase";
import Financeiro from "@/pages/Financeiro";
import Advocacia from "@/pages/Advocacia";
import Pedidos from "@/pages/Pedidos";
import VideoTemplateReel from "@/components/video/VideoTemplateReel";
import { useState } from "react";

const queryClient = new QueryClient();

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const gentleFadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const gentleStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const gentleScaleIn = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

function smoothScrollTo(targetId: string) {
  const el = document.querySelector(targetId);
  if (!el) return;
  const start = window.scrollY;
  const end = (el as HTMLElement).getBoundingClientRect().top + start - 80;
  const distance = end - start;
  const duration = 900;
  let startTime: number | null = null;

  function easeInOutQuart(t: number) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutQuart(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <img src={logoImage} alt="Robe Systems" className={className} />
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5511983012404"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 h-13 px-5 py-3 rounded-full bg-white text-black text-sm font-semibold shadow-lg hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95"
      data-testid="floating-whatsapp"
    >
      <MessageCircle className="w-5 h-5" />
      WhatsApp
    </a>
  );
}

function ProjectsDropdown() {
  const [open, setOpen] = useState(false);
  const items = [
    { href: "/projetos/financeiro", label: "Financeiro",        icon: DollarSign,  desc: "Controle financeiro PJ"        },
    { href: "/projetos/advocacia",  label: "Advocacia",         icon: Scale,       desc: "Gestão de processos jurídicos" },
    { href: "/projetos/pedidos",    label: "Gestão de Pedidos", icon: ShoppingBag, desc: "Sistema de restaurante"        },
  ];
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => smoothScrollTo("#projetos")}
        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        data-testid="nav-projects"
      >
        Projetos <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-zinc-950 border border-white/10 rounded-2xl p-1.5 shadow-2xl shadow-black/50 z-50"
          >
            {items.map(item => {
              const Icon = item.icon;
              return (
                <a key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-white/50 group-hover:text-white/70 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors leading-tight">{item.label}</p>
                    <p className="text-[11px] text-white/30">{item.desc}</p>
                  </div>
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="cursor-pointer" data-testid="logo-home">
          <Logo className="h-16 w-auto" />
        </button>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <button onClick={() => smoothScrollTo("#servicos")} className="hover:text-white transition-colors cursor-pointer" data-testid="nav-services">Serviços</button>
          <ProjectsDropdown />
          <button onClick={() => smoothScrollTo("#contato")} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer" data-testid="nav-contact">
            Falar com especialista
          </button>
        </div>
        <button onClick={() => smoothScrollTo("#contato")} className="md:hidden px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all cursor-pointer" data-testid="nav-mobile-contact">
          Contato
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(255,255,255,0.07),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_60%,rgba(180,180,220,0.04),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_55%,rgba(180,200,220,0.04),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_100%,rgba(255,255,255,0.03),transparent)] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.h1 variants={fadeIn} className="flex flex-col items-center gap-1 text-[clamp(2rem,8vw,72px)] font-bold leading-[1.12] tracking-[-0.02em] mb-7 text-white">
            <motion.span
              className="md:whitespace-nowrap text-center"
              initial={{ scale: 1, color: "rgba(255,255,255,1)" }}
              animate={{ scale: 0.82, color: "rgba(255,255,255,0.3)" }}
              transition={{ delay: 1.4, duration: 1.2, ease: "easeInOut" }}
            >
              Automatizamos processos e
            </motion.span>
            <motion.span
              className="md:whitespace-nowrap text-center"
              initial={{ scale: 1, color: "rgba(255,255,255,0.2)" }}
              animate={{ scale: 1.06, color: "rgba(255,255,255,1)" }}
              transition={{ delay: 1.4, duration: 1.2, ease: "easeInOut" }}
            >
              criamos sistemas sob medida
            </motion.span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/45 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Elimine tarefas manuais, organize sua operação e aumente a produtividade com tecnologia feita sob medida para o seu negócio.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/5511983012404"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-all cursor-pointer"
              data-testid="hero-cta-primary"
            >
              <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
            </a>
            <button onClick={() => smoothScrollTo("#servicos")} className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-white/70 text-sm font-medium border border-white/10 hover:border-white/25 hover:text-white transition-all cursor-pointer" data-testid="hero-cta-secondary">
              Ver como funciona <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

const painPoints = [
  "Perde tempo com tarefas manuais",
  "Usa planilhas que não conversam entre si",
  "Tem retrabalho na operação",
  "Falta controle do que está acontecendo na empresa",
];

function PainPoints() {
  return (
    <section className="py-24 px-6 bg-white/[0.015]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            Você está passando por isso?
          </motion.h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={gentleStagger}
          className="flex flex-col gap-4 mb-10"
        >
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              variants={gentleFadeIn}
              className="flex items-center gap-4 p-5 border border-white/8 rounded-xl bg-white/[0.02]"
            >
              <AlertCircle className="w-5 h-5 text-white/30 flex-shrink-0" />
              <span className="text-white/70 text-base">{point}</span>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center"
        >
          <p className="text-white/50 text-base leading-relaxed">
            Se você respondeu sim para algum desses pontos,{" "}
            <span className="text-white/90 font-medium">conseguimos resolver isso com um sistema sob medida.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: Code2,
    title: "Sistemas Personalizados",
    description: "Criamos sistemas feitos exatamente para o seu negócio, eliminando processos manuais e organizando sua operação.",
    features: ["Web Apps & APIs", "Integrações ERP/CRM", "Portais Empresariais"]
  },
  {
    icon: Cpu,
    title: "Automação de Processos",
    description: "Automatizamos tarefas repetitivas para sua empresa economizar tempo e reduzir erros no dia a dia.",
    features: ["RPA e bots de processo", "Fluxos de aprovação", "Relatórios automáticos"]
  },
  {
    icon: Globe,
    title: "Plataformas Digitais",
    description: "Construímos produtos digitais completos — do conceito ao lançamento — com foco em experiência do usuário e resultados reais.",
    features: ["SaaS e Marketplaces", "E-commerce B2B/B2C", "Apps Mobile"]
  },
  {
    icon: Zap,
    title: "Integrações & APIs",
    description: "Conectamos suas ferramentas para tudo funcionar junto, sem retrabalho e sem perda de informação.",
    features: ["Webhooks & REST APIs", "ERPs & CRMs", "Pagamentos & Logística"]
  },
  {
    icon: Lock,
    title: "Segurança & Compliance",
    description: "Garantimos que os sistemas da sua empresa seguem as melhores práticas de segurança e conformidade com regulamentações como LGPD.",
    features: ["Auditoria de segurança", "LGPD & compliance", "Autenticação avançada"]
  },
  {
    icon: Rocket,
    title: "Consultoria Técnica",
    description: "Assessoramos sua empresa na escolha das melhores tecnologias e na estruturação de uma arquitetura digital sustentável e escalável.",
    features: ["Arquitetura de software", "Revisão de sistemas", "Planejamento técnico"]
  }
];

function Services() {
  return (
    <section id="servicos" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={gentleStagger}
          className="mb-16"
        >
          <motion.p variants={gentleFadeIn} className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Serviços</motion.p>
          <motion.h2 variants={gentleFadeIn} className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-xl">
            Tudo que seu negócio precisa para crescer.
          </motion.h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={gentleStagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5"
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                variants={gentleScaleIn}
                className="bg-black p-8 flex flex-col gap-5 group hover:bg-white/[0.02] transition-colors cursor-default"
                data-testid={`service-card-${i}`}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white/50 group-hover:text-white/40 transition-colors duration-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-white/40 transition-colors duration-500 mb-2">{service.title}</h3>
                  <p className="text-sm text-white/45 group-hover:text-white/90 transition-colors duration-500 leading-relaxed">{service.description}</p>
                </div>
                <ul className="flex flex-col gap-2 mt-auto">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-white/35 group-hover:text-white/70 transition-colors duration-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 flex-shrink-0 transition-colors duration-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

const differentials = [
  {
    number: "01",
    title: "Atendimento direto, sem intermediários",
    description: "Você fala direto com quem vai construir a solução. Sem repasses, sem terceirizações ocultas."
  },
  {
    number: "02",
    title: "Soluções feitas sob medida",
    description: "Não usamos modelos prontos. Cada sistema é desenvolvido para o seu negócio, do zero."
  },
  {
    number: "03",
    title: "Foco em resultado e ganho real",
    description: "Não entregamos apenas código — entregamos soluções que geram valor mensurável para a sua operação."
  },
  {
    number: "04",
    title: "Entrega rápida com acompanhamento",
    description: "Sprints curtos, comunicação constante e visibilidade total em cada etapa do projeto."
  }
];

function Differentials() {
  return (
    <section id="diferenciais" className="py-32 px-6 bg-white/[0.015]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={gentleStagger}
          className="mb-16"
        >
          <motion.p variants={gentleFadeIn} className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Diferenciais</motion.p>
          <motion.h2 variants={gentleFadeIn} className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
            Por que empresas escolhem a Robe Systems.
          </motion.h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={gentleStagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {differentials.map((d, i) => (
            <motion.div
              key={i}
              variants={gentleFadeIn}
              className="flex gap-6"
              data-testid={`differential-${i}`}
            >
              <span className="text-xs font-mono text-white/20 mt-1 w-6 flex-shrink-0">{d.number}</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{d.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{d.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const solutions = [
  { icon: UtensilsCrossed, title: "Sistema para restaurante", description: "Gestão de pedidos, cozinha e atendimento integrados em uma plataforma." },
  { icon: Bot, title: "Automação de atendimento via WhatsApp", description: "Bots inteligentes que respondem, qualificam e encaminham clientes automaticamente." },
  { icon: TrendingUp, title: "Controle financeiro personalizado", description: "Dashboard financeiro feito para a realidade do seu negócio, sem excesso de funcionalidades." },
  { icon: LayoutDashboard, title: "Dashboard com dados do negócio", description: "Visão unificada dos indicadores da sua operação em tempo real." },
];

function Solutions() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={gentleStagger}
          className="mb-16"
        >
          <motion.h2 variants={gentleFadeIn} className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl">
            Soluções que podemos desenvolver para você.
          </motion.h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={gentleStagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {solutions.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                variants={gentleFadeIn}
                className="flex gap-5 p-7 border border-white/8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
              >
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Icon className="w-5 h-5 text-white/30 group-hover:text-white/50 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed group-hover:text-white/65 transition-colors duration-300">{s.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contato" className="py-32 px-6 bg-white/[0.015]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p variants={fadeIn} className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Contato</motion.p>
          <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
            Pronto para parar de perder tempo<br />e organizar seu negócio?
          </motion.h2>
          <motion.p variants={fadeIn} className="text-lg text-white/45 leading-relaxed mb-10">
            Fale com a gente agora e vamos entender o que dá para automatizar na sua empresa.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/5511983012404"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-14 px-8 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-all"
              data-testid="contact-whatsapp"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp agora
            </a>
            <a
              href="mailto:robesystems@gmail.com"
              className="inline-flex items-center gap-2 h-14 px-8 rounded-full text-white/70 text-sm font-medium border border-white/10 hover:border-white/25 hover:text-white transition-all"
              data-testid="contact-email"
            >
              Enviar e-mail <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo className="h-12 w-auto" />
        <p className="text-sm text-white/25">
          © {new Date().getFullYear()} Robe Systems. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6 text-sm text-white/30">
          <button onClick={() => smoothScrollTo("#servicos")} className="hover:text-white/60 transition-colors cursor-pointer">Serviços</button>
          <button onClick={() => smoothScrollTo("#projetos")} className="hover:text-white/60 transition-colors cursor-pointer">Projetos</button>
          <button onClick={() => smoothScrollTo("#contato")} className="hover:text-white/60 transition-colors cursor-pointer">Contato</button>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <PainPoints />
      <Services />
      <ProjectShowcase />
      <Solutions />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projetos/financeiro" component={Financeiro} />
      <Route path="/projetos/advocacia"  component={Advocacia}  />
      <Route path="/projetos/pedidos"    component={Pedidos}           />
      <Route path="/video-reel"          component={VideoTemplateReel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
