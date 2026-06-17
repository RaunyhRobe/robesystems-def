import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSceneTime } from '@/lib/video/VideoTimeContext';
import { useReel } from '@/lib/video/ReelContext';

const results = [
  { phrase: "Mais eficiência.", accent: "Processos automáticos. Equipe focada no que importa." },
  { phrase: "Menos custo.",     accent: "Elimine erros manuais e desperdício operacional." },
  { phrase: "Mais escala.",     accent: "Cresça sem aumentar a complexidade." },
];

export function Scene5() {
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

  const e = sceneElapsed ?? 0;
  const index = renderMode ? (e >= 6600 ? 2 : e >= 3300 ? 1 : 0) : indexState;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div className="absolute left-[8%] top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-white/12 to-transparent"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }} style={{ originY: 0 }} />
      <motion.div className="absolute right-[8%] top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-white/12 to-transparent"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }} style={{ originY: 1 }} />

      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex items-center gap-3">
        {results.map((_, i) => (
          <motion.div key={i} className="h-px rounded-full"
            animate={{ width: i === index ? "32px" : "12px", backgroundColor: i === index ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)" }}
            transition={{ duration: 0.4 }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className={`text-center px-16 ${reel ? 'max-w-[85%]' : 'max-w-[85vw]'}`}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <h2
            className="font-display font-black text-white leading-[1.0] tracking-tighter mb-5"
            style={{ fontSize: reel ? '72px' : '9vw' }}
          >
            {results[index].phrase}
          </h2>
          <motion.p
            className="font-light tracking-wide leading-relaxed text-white/35"
            style={{ fontSize: reel ? '15px' : '1.6vw' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {results[index].accent}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
