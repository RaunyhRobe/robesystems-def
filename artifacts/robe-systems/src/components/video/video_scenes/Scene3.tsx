import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSceneTime } from '@/lib/video/VideoTimeContext';
import { useReel } from '@/lib/video/ReelContext';

export function Scene3() {
  const { sceneElapsed, renderMode } = useSceneTime();
  const reel = useReel();
  const [phaseState, setPhase] = useState(0);

  useEffect(() => {
    if (renderMode) return;
    setPhase(0);
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [renderMode]);

  const e = sceneElapsed ?? 0;
  const phase = renderMode ? (e >= 1500 ? 2 : e >= 500 ? 1 : 0) : phaseState;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.15 }}
    >
      <div className={`relative text-center ${reel ? 'max-w-[80%]' : 'max-w-[75vw]'}`}>
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-white"
          initial={{ scaleY: 0 }}
          animate={phase >= 1 ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          style={{ originY: 0 }}
        />
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-1 bg-white"
          initial={{ scaleY: 0 }}
          animate={phase >= 1 ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, ease: "circOut", delay: 0.1 }}
          style={{ originY: 1 }}
        />
        <motion.h2
          className="font-display font-black text-white leading-[1.1] tracking-tight px-12 py-8"
          style={{ fontSize: reel ? '52px' : '6vw' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1.05, opacity: 1 } : { scale: 0.9, opacity: phase >= 1 ? 1 : 0 }}
          transition={{ scale: { duration: 10, ease: "linear" }, opacity: { duration: 0.5 } }}
        >
          Isso está travando<br/>o crescimento da sua empresa.
        </motion.h2>
      </div>
    </motion.div>
  );
}
