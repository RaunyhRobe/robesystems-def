import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSceneTime } from '@/lib/video/VideoTimeContext';
import { useReel } from '@/lib/video/ReelContext';

// ─── Fake Project 1: Orders management (Restaurant) — Landscape ───────────
function Project1Landscape() {
  const orders = [
    { id: '#2341', table: 'Mesa 4',   value: 'R$ 89,00',  status: 'Entregue',    dot: 'bg-emerald-400' },
    { id: '#2342', table: 'Delivery', value: 'R$ 143,50', status: 'Em preparo',  dot: 'bg-amber-400' },
    { id: '#2343', table: 'Mesa 7',   value: 'R$ 212,00', status: 'Aguardando',  dot: 'bg-white/30' },
    { id: '#2344', table: 'Mesa 2',   value: 'R$ 56,00',  status: 'Entregue',    dot: 'bg-emerald-400' },
  ];
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[1.1vw] text-white/40 font-mono uppercase tracking-widest mb-1">Projeto — Restaurante</p>
          <h3 className="text-[2.2vw] font-display font-bold text-white leading-tight">Sistema de Gestão de Pedidos</h3>
        </div>
        <div className="text-right">
          <p className="text-[1vw] text-white/30 font-mono">hoje</p>
          <p className="text-[2vw] font-bold text-white font-display">347 pedidos</p>
          <p className="text-[1vw] text-emerald-400/80 font-mono">↑ 23% vs ontem</p>
        </div>
      </div>
      <div className="grid grid-cols-4 px-3 pb-2 text-[0.9vw] font-mono text-white/25 uppercase tracking-wider border-b border-white/5">
        <span>Pedido</span><span>Mesa</span><span>Valor</span><span>Status</span>
      </div>
      <div className="flex flex-col gap-1.5 mt-2">
        {orders.map((o, i) => (
          <motion.div key={o.id}
            className="grid grid-cols-4 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 items-center"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[1.1vw] font-mono text-white/50">{o.id}</span>
            <span className="text-[1.1vw] text-white/80">{o.table}</span>
            <span className="text-[1.1vw] font-medium text-white">{o.value}</span>
            <span className="flex items-center gap-1.5 text-[1vw] text-white/60">
              <span className={`w-1.5 h-1.5 rounded-full ${o.dot}`} />{o.status}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div className="mt-auto pt-3 border-t border-white/5 flex items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[0.9vw] font-mono text-white/30">Sincronizado em tempo real · Atualizado agora</span>
      </motion.div>
    </div>
  );
}

function Project2Landscape() {
  const messages = [
    { from: 'user',  text: 'Olá, quero agendar uma consulta' },
    { from: 'bot',   text: 'Olá! 👋 Para qual especialidade?' },
    { from: 'user',  text: 'Cardiologia' },
    { from: 'bot',   text: 'Temos disponibilidade na terça-feira, 14h com Dr. Costa. Confirmar?' },
    { from: 'user',  text: 'Sim, por favor' },
    { from: 'bot',   text: '✅ Agendado! Você receberá um lembrete 1h antes.' },
  ];
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[1.1vw] text-white/40 font-mono uppercase tracking-widest mb-1">Projeto — Clínica Médica</p>
          <h3 className="text-[2.2vw] font-display font-bold text-white leading-tight">Bot de Agendamento via WhatsApp</h3>
        </div>
        <div className="text-right">
          <p className="text-[1vw] text-white/30 font-mono">este mês</p>
          <p className="text-[2vw] font-bold text-white font-display">2.4k</p>
          <p className="text-[1vw] text-emerald-400/80 font-mono">atendimentos automáticos</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {messages.map((m, i) => (
          <motion.div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <span className={`px-3 py-1.5 rounded-xl text-[1.05vw] max-w-[75%] leading-snug ${
              m.from === 'user' ? 'bg-white/10 text-white/70 rounded-tr-sm' : 'bg-emerald-900/30 border border-emerald-500/20 text-emerald-300/90 rounded-tl-sm'
            }`}>{m.text}</span>
          </motion.div>
        ))}
      </div>
      <motion.div className="mt-2 pt-3 border-t border-white/5 flex items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[0.9vw] font-mono text-white/30">Ativo 24h · Zero intervenção humana necessária</span>
      </motion.div>
    </div>
  );
}

function Project3Landscape() {
  const kpis = [
    { label: 'Receita',  value: 'R$ 2.4M', delta: '↑ 18%', positive: true },
    { label: 'Custo Op.', value: 'R$ 1.1M', delta: '↓ 7%',  positive: true },
    { label: 'Margem',   value: '54%',      delta: '↑ 11%', positive: true },
  ];
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[1.1vw] text-white/40 font-mono uppercase tracking-widest mb-1">Projeto — Construtora</p>
          <h3 className="text-[2.2vw] font-display font-bold text-white leading-tight">Dashboard Financeiro em Tempo Real</h3>
        </div>
        <motion.div className="px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400/80 text-[0.9vw] font-mono"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>live ●</motion.div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[0.9vw] text-white/30 font-mono mb-1">{k.label}</p>
            <p className="text-[1.6vw] font-bold text-white font-display leading-none">{k.value}</p>
            <p className={`text-[0.95vw] font-mono mt-1 ${k.positive ? 'text-emerald-400/80' : 'text-red-400/80'}`}>{k.delta}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col mt-2">
        <p className="text-[0.9vw] text-white/25 font-mono mb-1.5 uppercase tracking-wider">Evolução mensal</p>
        <svg viewBox="0 0 600 130" className="w-full" style={{ height: '130px' }}>
          {[{ y: 10, label: '2.4M' }, { y: 35, label: '2.2M' }, { y: 60, label: '2.0M' }, { y: 85, label: '1.8M' }, { y: 110, label: '1.6M' }].map(({ y, label }) => (
            <g key={y}>
              <line x1="42" y1={y} x2="595" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <text x="38" y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.22)" fontFamily="monospace">{label}</text>
            </g>
          ))}
          {['Jan','Fev','Mar','Abr','Mai','Jun'].map((m, i) => (
            <text key={m} x={45 + i * 110} y="126" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{m}</text>
          ))}
          {/* Series 3 — Margem % (emerald) — drawn first so behind */}
          <motion.path d="M 45,47 L 155,47 L 265,108 L 375,18 L 485,47 L 595,24"
            fill="none" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 1.2, ease: 'easeInOut' }} />
          {[[45,47],[155,47],[265,108],[375,18],[485,47],[595,24]].map(([cx,cy], i) => (
            <motion.circle key={i} cx={cx} cy={cy} r="3" fill="rgba(52,211,153,0.6)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + 0.2*i, duration: 0.3 }} />
          ))}
          {/* Series 2 — Custo Op (dimmer white) */}
          <motion.path d="M 45,60 L 155,110 L 265,110 L 375,110 L 485,85 L 595,110"
            fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 1.2, ease: 'easeInOut' }} />
          {/* Series 1 — Receita (bright white) */}
          <motion.path d="M 45,48 L 155,35 L 265,42 L 375,22 L 485,28 L 595,10"
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 1.2, ease: 'easeInOut' }} />
          {[[45,48],[155,35],[265,42],[375,22],[485,28],[595,10]].map(([cx,cy], i) => (
            <motion.circle key={i} cx={cx} cy={cy} r="3.5" fill="rgba(255,255,255,0.8)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + 0.18*i, duration: 0.3 }} />
          ))}
          {/* End labels */}
          <motion.text x="598" y="13" fontSize="8" fill="rgba(255,255,255,0.6)" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>R$2.4M</motion.text>
          <motion.text x="598" y="27" fontSize="8" fill="rgba(52,211,153,0.7)" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>54%</motion.text>
        </svg>
        {/* Legend */}
        <motion.div className="flex items-center gap-4 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          <span className="flex items-center gap-1.5 text-[0.8vw] font-mono text-white/45">
            <span className="w-5 h-px bg-white/75 inline-block" />Receita
          </span>
          <span className="flex items-center gap-1.5 text-[0.8vw] font-mono text-white/35">
            <span className="w-5 h-px bg-white/25 inline-block border-dashed border-t border-white/25" />Custo Op.
          </span>
          <span className="flex items-center gap-1.5 text-[0.8vw] font-mono text-emerald-400/60">
            <span className="w-5 h-px bg-emerald-400/50 inline-block" />Margem
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Portrait single-column layout: all 3 cards visible simultaneously ────
function PortraitScene4() {
  const orders = [
    { table: 'Mesa 4',   value: 'R$ 89,00',  status: 'Entregue',   dot: 'bg-emerald-400' },
    { table: 'Delivery', value: 'R$ 143,50', status: 'Em preparo', dot: 'bg-amber-400' },
    { table: 'Mesa 7',   value: 'R$ 212,00', status: 'Aguardando', dot: 'bg-white/30' },
  ];
  const messages = [
    { from: 'user', text: 'Quero agendar uma consulta' },
    { from: 'bot',  text: 'Olá! 👋 Para qual especialidade?' },
    { from: 'user', text: 'Cardiologia' },
    { from: 'bot',  text: '✅ Agendado! Lembrete enviado 1h antes.' },
  ];
  const kpis = [
    { label: 'Receita',   value: 'R$ 2.4M', delta: '↑ 18%' },
    { label: 'Custo Op.', value: 'R$ 1.1M', delta: '↓ 7%'  },
    { label: 'Margem',    value: '54%',      delta: '↑ 11%' },
    { label: 'Projetos',  value: '7',        delta: 'ativos' },
  ];

  const cardBase = { opacity: 0, y: 24, filter: 'blur(4px)' };
  const cardIn   = { opacity: 1, y: 0, filter: 'blur(0px)' };
  const cardT    = (delay: number) => ({ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center z-10 px-8 py-10 gap-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.p className="text-[13px] uppercase tracking-[0.3em] text-white/25 font-mono mb-1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        Projetos desenvolvidos
      </motion.p>

      {/* Card 1 — Restaurant */}
      <motion.div className="w-full rounded-xl bg-white/[0.03] border border-white/8 p-4"
        initial={cardBase} animate={cardIn} transition={cardT(0.15)}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[12px] text-white/35 font-mono uppercase tracking-widest">Restaurante</p>
            <h3 className="text-[18px] font-display font-bold text-white leading-tight">Sistema de Gestão de Pedidos</h3>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p className="text-[15px] font-bold text-white font-display">347 pedidos</p>
            <p className="text-[12px] text-emerald-400/80 font-mono">↑ 23% hoje</p>
          </div>
        </div>
        <div className="grid grid-cols-3 px-2 pb-1.5 text-[12px] font-mono text-white/20 uppercase tracking-wider border-b border-white/5">
          <span>Mesa</span><span>Valor</span><span>Status</span>
        </div>
        <div className="flex flex-col gap-1 mt-1.5">
          {orders.map((o, i) => (
            <motion.div key={i} className="grid grid-cols-3 px-2 py-1.5 rounded-lg bg-white/[0.03] items-center"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              <span className="text-[14px] text-white/75">{o.table}</span>
              <span className="text-[14px] font-medium text-white">{o.value}</span>
              <span className="flex items-center gap-1 text-[14px] text-white/55">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${o.dot}`} />{o.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Card 2 — Clinic WhatsApp bot */}
      <motion.div className="w-full rounded-xl bg-white/[0.03] border border-white/8 p-4"
        initial={cardBase} animate={cardIn} transition={cardT(0.3)}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[12px] text-white/35 font-mono uppercase tracking-widest">Clínica Médica</p>
            <h3 className="text-[18px] font-display font-bold text-white leading-tight">Bot de Agendamento WhatsApp</h3>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p className="text-[15px] font-bold text-white font-display">2.4k</p>
            <p className="text-[12px] text-emerald-400/80 font-mono">atendimentos/mês</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {messages.map((m, i) => (
            <motion.div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.12, duration: 0.3 }}>
              <span className={`px-3 py-1.5 rounded-lg text-[14px] leading-snug max-w-[80%] ${
                m.from === 'user'
                  ? 'bg-white/10 text-white/70 rounded-tr-sm'
                  : 'bg-emerald-900/30 border border-emerald-500/20 text-emerald-300/90 rounded-tl-sm'
              }`}>{m.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Card 3 — Construction dashboard, 2×2 KPI grid */}
      <motion.div className="w-full rounded-xl bg-white/[0.03] border border-white/8 p-4"
        initial={cardBase} animate={cardIn} transition={cardT(0.45)}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[12px] text-white/35 font-mono uppercase tracking-widest">Construtora</p>
            <h3 className="text-[18px] font-display font-bold text-white leading-tight">Dashboard Financeiro</h3>
          </div>
          <motion.div className="px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400/70 text-[12px] font-mono flex-shrink-0 ml-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            live ●
          </motion.div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {kpis.map((k, i) => (
            <motion.div key={k.label} className="p-3 rounded-lg bg-white/[0.04] border border-white/5"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.35 }}>
              <p className="text-[12px] text-white/30 font-mono">{k.label}</p>
              <p className="text-[19px] font-bold text-white font-display leading-tight">{k.value}</p>
              <p className="text-[12px] text-emerald-400/70 font-mono">{k.delta}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Scene ────────────────────────────────────────────────────────────
const LANDSCAPE_PROJECTS = [Project1Landscape, Project2Landscape, Project3Landscape];
const LABELS = ['01 — Gestão de Pedidos', '02 — Automação WhatsApp', '03 — Dashboard Financeiro'];

export function Scene4() {
  const { sceneElapsed, renderMode } = useSceneTime();
  const reel = useReel();
  const [indexState, setIndex] = useState(0);

  useEffect(() => {
    if (renderMode) return;
    setIndex(0);
    const timers = [
      setTimeout(() => setIndex(1), 3300),
      setTimeout(() => setIndex(2), 6600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [renderMode]);

  if (reel) {
    return <PortraitScene4 />;
  }

  const e = sceneElapsed ?? 0;
  const index = renderMode ? (e >= 6600 ? 2 : e >= 3300 ? 1 : 0) : indexState;
  const ProjectComponent = LANDSCAPE_PROJECTS[index];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-[8vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full flex items-center justify-between mb-6">
        <motion.p className="text-[1.1vw] uppercase tracking-[0.3em] text-white/25 font-mono"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Projetos desenvolvidos
        </motion.p>
        <div className="flex items-center gap-3">
          {LABELS.map((_, i) => (
            <motion.div key={i} className="h-px rounded-full"
              animate={{ width: i === index ? '32px' : '10px', backgroundColor: i === index ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)' }}
              transition={{ duration: 0.35 }} />
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={index}
          className="w-full rounded-2xl bg-white/[0.03] border border-white/8 p-6"
          style={{ minHeight: '55vh' }}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProjectComponent />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.p key={`label-${index}`}
          className="mt-4 text-[1vw] font-mono text-white/20 tracking-wider"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          {LABELS[index]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
