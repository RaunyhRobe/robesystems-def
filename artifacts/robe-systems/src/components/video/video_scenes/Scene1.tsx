import { motion } from 'framer-motion';
import { useReel } from '@/lib/video/ReelContext';

export function Scene1() {
  const reel = useReel();
  const words = "Seu negócio ainda depende de processos manuais?".split(" ");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="absolute inset-0 overflow-hidden opacity-20 font-mono text-blue-300 leading-tight"
        style={{ fontSize: reel ? '7px' : '0.8vw' }}
      >
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="p-8"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="mb-2">
              <span className="text-blue-500/50">{`0x${(i * 14).toString(16).padStart(4, '0')} `}</span>
              {`const sys_${i} = new Process({ mode: 'manual', status: 'pending' }); await sys_${i}.execute();`}
            </div>
          ))}
        </motion.div>
      </div>

      <div className={`relative z-20 ${reel ? 'max-w-[85%]' : 'max-w-[80vw]'}`}>
        <h1
          className="font-bold text-white leading-[1.1] text-center font-display tracking-tight"
          style={{ fontSize: reel ? '50px' : '5.5vw' }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={{ marginRight: reel ? '8px' : '1.5vw' }}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, delay: i * 0.15 + 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.div
          className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mt-8"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
