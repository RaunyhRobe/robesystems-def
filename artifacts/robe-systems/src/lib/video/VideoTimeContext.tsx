import { createContext, useContext } from 'react';

export interface VideoTimeCtx {
  sceneElapsed: number | null; // null = normal mode (use useState timers)
  renderMode: boolean;
}

export const VideoTimeContext = createContext<VideoTimeCtx>({
  sceneElapsed: null,
  renderMode: false,
});

export function useSceneTime(): VideoTimeCtx {
  return useContext(VideoTimeContext);
}
