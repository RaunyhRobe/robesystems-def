import { motion } from "framer-motion";
import { DollarSign, Scale, ShoppingBag, ArrowRight } from "lucide-react";

const PROJECTS = [
  {
    href: "/projetos/financeiro",
    icon: DollarSign,
    tag: "Financeiro",
    title: "Sistema Financeiro",
    desc: "Controle de receitas, despesas, contas bancárias e cotações de câmbio em tempo real.",
    features: ["Lançamentos & fluxo de caixa", "Gráficos de receitas/despesas", "Cotações USD, EUR, BTC ao vivo"],
  },
  {
    href: "/projetos/advocacia",
    icon: Scale,
    tag: "Advocacia",
    title: "Gestão de Processos Jurídicos",
    desc: "Acompanhe processos, clientes e audiências com busca de endereço por CEP integrada.",
    features: ["Processos com nº CNJ", "Cadastro de clientes + CEP automático", "Agenda de audiências"],
  },
  {
    href: "/projetos/pedidos",
    icon: ShoppingBag,
    tag: "Restaurante",
    title: "Controle de Pedidos",
    desc: "Gestão completa de pedidos com cardápio interativo, mesas e relatório diário.",
    features: ["Cardápio com tamanhos e adicionais", "Kanban de cozinha em tempo real", "Relatório de vendas por categoria"],
  },
];

const gentleStagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const gentleFadeIn  = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };

export default function ProjectShowcase() {
  return (
    <section id="projetos" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={gentleStagger} className="mb-16"
        >
          <motion.p variants={gentleFadeIn} className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Projetos</motion.p>
          <motion.h2 variants={gentleFadeIn} className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-2xl mb-4">
            Sistemas que já criamos para clientes reais.
          </motion.h2>
          <motion.p variants={gentleFadeIn} className="text-white/45 text-base max-w-xl leading-relaxed">
            Explore os demos abaixo e teste você mesmo — cada sistema é totalmente funcional e interativo.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          variants={gentleStagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {PROJECTS.map(proj => {
            const Icon = proj.icon;
            return (
              <motion.div key={proj.href} variants={gentleFadeIn}>
                <a href={proj.href} className="group flex flex-col h-full bg-white/[0.02] border border-white/8 rounded-2xl p-6 hover:border-white/18 hover:bg-white/[0.04] transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" />
                      </div>
                      <span className="text-[10px] text-white/25 border border-white/8 px-2 py-1 rounded-full">{proj.tag}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 leading-snug">{proj.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed mb-5 flex-1">{proj.desc}</p>
                    <ul className="flex flex-col gap-2 mb-5">
                      {proj.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-white/35">
                          <span className="w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-white/50 group-hover:text-white transition-colors mt-auto">
                      Abrir demo <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
