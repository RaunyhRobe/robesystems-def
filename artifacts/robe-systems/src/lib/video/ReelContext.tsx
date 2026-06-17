import { createContext, useContext } from 'react';

const ReelContext = createContext(false);

export function useReel(): boolean {
  return useContext(ReelContext);
}

export { ReelContext };
