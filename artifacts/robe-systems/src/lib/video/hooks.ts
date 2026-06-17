import { useState, useEffect } from 'react';

export function useVideoPlayer({
  durations,
  enabled = true,
  resetKey = 0,
}: {
  durations: Record<string, number>;
  enabled?: boolean;
  resetKey?: number;
}) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const keys = Object.keys(durations);

  useEffect(() => {
    setCurrentSceneIndex(0);
  }, [resetKey]);

  useEffect(() => {
    if (!enabled) return;
    let timeout: ReturnType<typeof setTimeout>;
    const currentKey = keys[currentSceneIndex];
    const duration = durations[currentKey];
    if (duration) {
      timeout = setTimeout(() => {
        const next = currentSceneIndex + 1;
        setCurrentSceneIndex(next >= keys.length ? 0 : next);
      }, duration);
    }
    return () => clearTimeout(timeout);
  }, [currentSceneIndex, durations, keys, enabled]);

  return { currentScene: currentSceneIndex };
}
