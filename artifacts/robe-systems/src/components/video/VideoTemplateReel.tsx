import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { VideoTimeContext } from '@/lib/video/VideoTimeContext';
import { ReelContext } from '@/lib/video/ReelContext';
import { useState, useEffect, useCallback } from 'react';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';
import logoImage from '@assets/logo_robe_systems.png';

const SCENE_DURATIONS = {
  gancho:     3000,
  problema:  12000,
  virada:     3000,
  solucao:   10000,
  resultado:  7000,
  autoridade: 5000,
  cta:       10000,
};

const REEL_W = 608;
const REEL_H = 1080;

const NORMAL_CTX = { sceneElapsed: null, renderMode: false } as const;

export default function VideoTemplateReel() {
  const [resetKey, setResetKey] = useState(0);
  const [scale, setScale]       = useState(1);

  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
    resetKey,
  });

  useEffect(() => {
    const update = () => {
      const s = Math.min(window.innerWidth / REEL_W, window.innerHeight / REEL_H);
      setScale(parseFloat(s.toFixed(4)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleReplay = useCallback(() => setResetKey(k => k + 1), []);

  const logoOp = currentScene >= 0 && currentScene < 5 ? 0.8 : 0;

  const isPreview = scale < 1;

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative">

      {/* ── Preview-only controls (hidden in OBS when scale≥1) ── */}
      {isPreview && (
        <div className="absolute top-3 right-3 z-50 flex flex-col items-end gap-1.5">
          <button
            onClick={handleReplay}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono hover:bg-white/20 transition-all"
          >
            ↺ Replay
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-white/35 tracking-wider">OBS · Browser Source · 1080×1920</span>
          </div>
        </div>
      )}

      {/* ── Portrait video box (608×1080, scaled to fit) ── */}
      <VideoTimeContext.Provider value={NORMAL_CTX}>
        <ReelContext.Provider value={true}>
          <div
            style={{
              width: REEL_W,
              height: REEL_H,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
            className="bg-[#0a0a0a]"
          >
            {/* Background */}
            <div className="absolute inset-0">
              <motion.div className="absolute inset-0"
                animate={{ background: [
                  'radial-gradient(circle at 50% 50%, rgba(25,25,35,1) 0%, rgba(10,10,10,1) 100%)',
                  'radial-gradient(circle at 60% 40%, rgba(20,20,30,1) 0%, rgba(5,5,5,1) 100%)',
                  'radial-gradient(circle at 40% 60%, rgba(30,30,40,1) 0%, rgba(10,10,10,1) 100%)',
                  'radial-gradient(circle at 50% 50%, rgba(25,25,35,1) 0%, rgba(10,10,10,1) 100%)',
                ]}}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0 opacity-40 mix-blend-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/dark-texture.png)` }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute rounded-full opacity-5 blur-[60px]"
                style={{ width: 480, height: 480, background: 'radial-gradient(circle, #ffffff, transparent)' }}
                animate={{ x: ['-20%', '20%', '-10%'], y: ['-10%', '30%', '-20%'] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute rounded-full opacity-10 blur-[80px] right-0 bottom-0"
                style={{ width: 360, height: 360, background: 'radial-gradient(circle, #60a5fa, transparent)' }}
                animate={{ x: ['10%', '-30%', '5%'], y: ['10%', '-40%', '10%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Corner logo */}
            <motion.img
              src={logoImage}
              alt="Robe Systems Logo"
              style={{ width: 90, top: 24, left: 28 }}
              className="absolute z-40 object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: logoOp }}
              transition={{ duration: 1 }}
            />

            {/* Scenes */}
            <AnimatePresence mode="wait">
              {currentScene === 0 && <Scene1 key="gancho" />}
              {currentScene === 1 && <Scene2 key="problema" />}
              {currentScene === 2 && <Scene3 key="virada" />}
              {currentScene === 3 && <Scene4 key="solucao" />}
              {currentScene === 4 && <Scene5 key="resultado" />}
              {currentScene === 5 && <Scene6 key="autoridade" />}
              {currentScene === 6 && <Scene7 key="cta" />}
            </AnimatePresence>
          </div>
        </ReelContext.Provider>
      </VideoTimeContext.Provider>
    </div>
  );
}
