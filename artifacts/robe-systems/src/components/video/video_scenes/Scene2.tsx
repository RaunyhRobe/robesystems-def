import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSceneTime } from '@/lib/video/VideoTimeContext';
import { useReel } from '@/lib/video/ReelContext';

const questions = [
  { q: "Quantas horas por semana sua equipe perde em tarefas repetitivas?", hint: "média: 12h/semana por colaborador" },
  { q: "Quantos erros acontecem por falta de integração entre sistemas?",   hint: "cada retrabalho custa tempo e dinheiro" },
  { q: "Quanto vale crescer sem aumentar sua equipe?",                       hint: "automação libera capacidade sem custo extra" },
];

export function Scene2() {
  const { sceneElapsed, renderMode } = useSceneTime();
  const reel = useReel();

  const [indexState, setIndex] = useState(0);
  const [showHintState, setShowHint] = useState(false);

  useEffect(() => {
    if (renderMode) return;
    setIndex(0); setShowHint(false);
    const timers = [
      setTimeout(() => setShowHint(true), 1000),
      setTimeout(() => { setIndex(1); setShowHint(false); }, 4000),
      setTimeout(() => setShowHint(true), 5000),
      setTimeout(() => { setIndex(2); setShowHint(false); }, 8000),
      setTimeout(() => setShowHint(true), 9000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [renderMode]);

  const e = sceneElapsed ?? 0;
  const index    = renderMode ? (e >= 8000 ? 2 : e >= 4000 ? 1 : 0) : indexState;
  const showHint = renderMode
    ? ((e >= 1000 && e < 4000) || (e >= 5000 && e < 8000) || e >= 9000)
    : showHintState;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex gap-2">
        {questions.map((_, i) => (
          <motion.div key={i} className="h-px rounded-full"
            animate={{
              width: i <= index ? '28px' : '10px',
              backgroundColor: i === index ? 'rgba(255,255,255,0.7)' : i < index ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)',
            }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>

      <div className={`relative text-center ${reel ? 'max-w-[85%]' : 'max-w-[78vw]'}`}>
        <AnimatePresence mode="wait">
          <motion.div key={index}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="font-display font-bold text-white leading-[1.15] tracking-tight"
              style={{ fontSize: reel ? '40px' : '4.8vw' }}
            >
              {questions[index].q}
            </h2>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showHint && (
            <motion.p key={`hint-${index}`}
              className="mt-6 font-mono tracking-wide text-white/30"
              style={{ fontSize: reel ? '14px' : '1.5vw' }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              — {questions[index].hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
