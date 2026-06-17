import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import { VideoTimeContext } from '@/lib/video/VideoTimeContext';
import { useState, useRef, useCallback } from 'react';
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
const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
const FPS = 24;

type ExportStatus = 'idle' | 'capturing' | 'encoding' | 'done' | 'error';

// Normal mode context (scenes use their own useState/timers → smooth animations)
const NORMAL_CTX = { sceneElapsed: null, renderMode: false } as const;

export default function VideoTemplate() {
  const [resetKey, setResetKey] = useState(0);
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState('');
  const videoRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
    resetKey,
  });

  // ── Real-time frame capture + encode ───────────────────────────────────────
  const handleExport = useCallback(async () => {
    if (!videoRef.current) return;
    abortRef.current = false;

    if (typeof VideoEncoder === 'undefined') {
      setExportError('Use Chrome 94+ para exportar.');
      setExportStatus('error');
      return;
    }

    setExportStatus('capturing');
    setExportProgress(0);

    try {
      const { domToCanvas } = await import('modern-screenshot');
      const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');

      // Reset video to beginning
      setResetKey(k => k + 1);
      await new Promise(r => setTimeout(r, 250));

      const el   = videoRef.current!;
      const rect = el.getBoundingClientRect();
      const W    = Math.floor(rect.width  / 2) * 2;
      const H    = Math.floor(rect.height / 2) * 2;

      // Detect supported H.264 profile
      const profiles = ['avc1.4d001f', 'avc1.42001f', 'avc1.640028', 'avc1.42e01e'];
      let codec = '';
      for (const c of profiles) {
        const s = await VideoEncoder.isConfigSupported({ codec: c, width: W, height: H, bitrate: 8_000_000, framerate: FPS });
        if (s.supported) { codec = c; break; }
      }
      if (!codec) throw new Error('Nenhum codec H.264 suportado. Use Chrome 94+ atualizado.');

      const muxTarget = new ArrayBufferTarget();
      const muxer = new Muxer({
        target: muxTarget,
        video: { codec: 'avc', width: W, height: H },
        fastStart: 'in-memory',
      });

      let encodeError: Error | null = null;
      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta ?? undefined),
        error:  (e) => { encodeError = e; console.error('VideoEncoder error:', e); },
      });

      encoder.configure({ codec, width: W, height: H, bitrate: 8_000_000, framerate: FPS });

      // ── Real-time capture loop ──
      // Captures DOM as the video plays at real speed.
      // Each frame gets timestamped by actual elapsed time → smooth animations.
      const captureStart = performance.now();
      let prevBitmap: ImageBitmap | null = null;
      let prevTs = 0;
      let frameIdx = 0;

      while (!abortRef.current && !encodeError) {
        const elapsed = performance.now() - captureStart;
        if (elapsed >= TOTAL_DURATION + 800) break;

        const ts = elapsed; // timestamp for this frame

        const canvas = await domToCanvas(el, { width: W, height: H, scale: 1 }).catch(() => null);
        if (!canvas) { await new Promise(r => setTimeout(r, 0)); continue; }

        const bitmap = await createImageBitmap(canvas);

        // Encode the PREVIOUS bitmap now that we know its duration
        if (prevBitmap) {
          const dur = Math.max(1, ts - prevTs);
          const vf = new VideoFrame(prevBitmap, {
            timestamp: Math.round(prevTs * 1000),
            duration:  Math.round(dur   * 1000),
          });
          encoder.encode(vf, { keyFrame: frameIdx % (FPS * 2) === 0 });
          vf.close();
          prevBitmap.close();
          frameIdx++;
        }

        prevBitmap = bitmap;
        prevTs     = ts;

        setExportProgress(Math.min(elapsed / TOTAL_DURATION * 0.88, 0.88));
        await new Promise(r => setTimeout(r, 0)); // yield to browser/rAF
      }

      // Flush last frame
      if (prevBitmap) {
        const vf = new VideoFrame(prevBitmap, {
          timestamp: Math.round(prevTs * 1000),
          duration:  Math.round((1000 / FPS) * 1000),
        });
        encoder.encode(vf, { keyFrame: true });
        vf.close();
        prevBitmap.close();
      }

      if (encodeError) throw encodeError;

      if (!abortRef.current) {
        setExportStatus('encoding');
        setExportProgress(0.9);
        await encoder.flush();
        encoder.close();
        muxer.finalize();

        const blob = new Blob([muxTarget.buffer], { type: 'video/mp4' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = 'robe-systems-brand-video.mp4';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setExportProgress(1);
        setExportStatus('done');
      }
    } catch (err) {
      console.error('Export failed:', err);
      setExportError(String(err));
      setExportStatus('error');
    }
  }, []);

  const handleCancel = () => {
    abortRef.current = true;
    setExportStatus('idle');
    setExportProgress(0);
  };

  const pct      = Math.round(exportProgress * 100);
  const etaSec   = Math.max(0, Math.round((TOTAL_DURATION * (1 - exportProgress / 0.88)) / 1000));
  const logoOp   = currentScene >= 0 && currentScene < 5 ? 0.8 : 0;

  return (
    <>
      {/* ── Export Overlay (outside videoRef → not captured by domToCanvas) ── */}
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-end justify-start p-4">
        {exportStatus === 'idle' && (
          <button onClick={handleExport}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium backdrop-blur-sm hover:bg-white/20 transition-all">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current opacity-70">
              <path d="M8 1a.75.75 0 0 1 .75.75v6.19l1.97-1.97a.75.75 0 0 1 1.06 1.06L8.53 10.28a.75.75 0 0 1-1.06 0L4.22 7.03a.75.75 0 0 1 1.06-1.06L7.25 7.94V1.75A.75.75 0 0 1 8 1zM2 11.75a.75.75 0 0 1 1.5 0v1.5h9v-1.5a.75.75 0 0 1 1.5 0v1.5A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.25v-1.5z"/>
            </svg>
            Exportar MP4
          </button>
        )}

        {(exportStatus === 'capturing' || exportStatus === 'encoding') && (
          <div className="pointer-events-auto flex flex-col gap-2 px-4 py-3 rounded-xl bg-black/90 border border-white/10 backdrop-blur-sm min-w-[230px]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-white text-xs font-medium">
                {exportStatus === 'encoding' ? 'Codificando MP4…' : `Capturando… ${pct}%`}
              </span>
              {exportStatus === 'capturing' && (
                <span className="text-white/40 text-xs tabular-nums">~{etaSec}s restantes</span>
              )}
              <button onClick={handleCancel} className="text-white/30 hover:text-white/60 text-xs transition-colors ml-1">✕</button>
            </div>
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full rounded-full bg-white"
                animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
            </div>
            {exportStatus === 'capturing' && (
              <p className="text-white/25 text-[10px] font-mono">Vídeo tocando em tempo real — animações fiéis</p>
            )}
          </div>
        )}

        {exportStatus === 'done' && (
          <div className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 backdrop-blur-sm">
            <span className="text-white/80 text-xs">✓ MP4 baixado</span>
            <button onClick={() => { setExportStatus('idle'); setExportProgress(0); }}
              className="text-white/40 text-xs hover:text-white/70 transition-colors ml-2">
              Exportar novamente
            </button>
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="pointer-events-auto flex flex-col gap-1 px-4 py-2.5 rounded-xl bg-black/80 border border-red-500/30 backdrop-blur-sm max-w-xs">
            <span className="text-red-400 text-xs font-medium">Erro ao exportar</span>
            <span className="text-white/40 text-[10px] break-all">{exportError}</span>
            <button onClick={() => { setExportStatus('idle'); setExportProgress(0); }}
              className="text-white/40 text-xs hover:text-white/70 transition-colors mt-1 text-left">
              Tentar novamente
            </button>
          </div>
        )}
      </div>

      {/* ── Video Canvas (captured by domToCanvas) ── */}
      <VideoTimeContext.Provider value={NORMAL_CTX}>
        <div ref={videoRef} className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">

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
            <motion.div className="absolute w-[80vw] h-[80vw] rounded-full opacity-5 blur-[100px]"
              style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }}
              animate={{ x: ['-20%', '20%', '-10%'], y: ['-10%', '30%', '-20%'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute w-[60vw] h-[60vw] rounded-full opacity-10 blur-[120px] right-0 bottom-0"
              style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }}
              animate={{ x: ['10%', '-30%', '5%'], y: ['10%', '-40%', '10%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
          </div>

          {/* Corner logo */}
          <motion.img src={logoImage} alt="Robe Systems Logo"
            className="absolute z-40 w-[12vw] max-w-[200px] object-contain top-8 left-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: logoOp }}
            transition={{ duration: 1 }}
          />

          {/* Scenes — full framer-motion animations, no overrides */}
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
      </VideoTimeContext.Provider>
    </>
  );
}
