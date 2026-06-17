import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSceneTime } from '@/lib/video/VideoTimeContext';
import { useReel } from '@/lib/video/ReelContext';
import logoImage from '@assets/logo_robe_systems.png';

export function Scene6() {
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
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex flex-col items-center">
        <motion.img
          src={logoImage} alt="Robe Systems Logo"
          className="object-contain mb-12"
          style={reel ? { width: '75%', maxWidth: 456 } : { width: '40vw', maxWidth: 600 }}
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={phase >= 1 ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="font-display text-white/80 tracking-tight text-center"
          style={{
            fontSize: reel ? '28px' : '3vw',
            maxWidth: reel ? '80%' : '70vw',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Tecnologia feita para crescer com o seu negócio.
        </motion.div>
      </div>
    </motion.div>
  );
}
