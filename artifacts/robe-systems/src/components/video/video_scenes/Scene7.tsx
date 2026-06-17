import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSceneTime } from '@/lib/video/VideoTimeContext';
import { useReel } from '@/lib/video/ReelContext';

export function Scene7() {
  const { sceneElapsed, renderMode } = useSceneTime();
  const reel = useReel();
  const [phaseState, setPhase] = useState(0);

  useEffect(() => {
    if (renderMode) return;
    setPhase(0);
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 1900),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [renderMode]);

  const e = sceneElapsed ?? 0;
  const phase = renderMode
    ? (e >= 2800 ? 4 : e >= 1900 ? 3 : e >= 1100 ? 2 : e >= 400 ? 1 : 0)
    : phaseState;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {phase >= 4 && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[100%] pointer-events-none"
          style={reel
            ? { width: 340, height: 340, background: 'radial-gradient(ellipse, rgba(255,255,255,0.04), transparent)' }
            : { width: '50vw', height: '20vw', background: 'radial-gradient(ellipse, rgba(255,255,255,0.04), transparent)' }
          }
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="flex flex-col items-center text-center gap-8">
        <motion.p
          className="font-mono uppercase tracking-[0.35em] text-white/25"
          style={{ fontSize: reel ? '11px' : '1.1vw' }}
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Pronto para automatizar?
        </motion.p>

        <motion.h2
          className="font-display font-bold text-white tracking-tight leading-[1.05]"
          style={{ fontSize: reel ? '54px' : '6.5vw' }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Fale com a Robe Systems.
        </motion.h2>

        <motion.div
          className={`flex items-center ${reel ? 'flex-col gap-3' : 'flex-row gap-6'}`}
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/50 fill-none stroke-current stroke-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
            </svg>
            <span className="font-mono text-white/70 tracking-wide" style={{ fontSize: reel ? '14px' : '1.5vw' }}>(11) 98301-2404</span>
          </div>
          {!reel && <div className="w-px h-5 bg-white/10" />}
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/50 fill-none stroke-current stroke-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
            </svg>
            <span className="font-mono text-white/70 tracking-wide" style={{ fontSize: reel ? '14px' : '1.5vw' }}>robesystems@gmail.com</span>
          </div>
        </motion.div>

        <motion.p
          className="font-mono text-white/25 tracking-wider"
          style={{ fontSize: reel ? '11px' : '1.1vw' }}
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          robesystems.com
        </motion.p>
      </div>
    </motion.div>
  );
}
