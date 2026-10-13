import { useSyncExternalStore } from 'react';

const stores = new Map();
const serverSnapshot = () => false;

export function useMediaQuery(query) {
  let store = stores.get(query);
  if (!store) {
    let media;
    const listeners = new Set();
    const getMedia = () => media ||= window.matchMedia(query);
    const notify = () => listeners.forEach(listener => listener());
    store = {
      getSnapshot: () => getMedia().matches,
      subscribe(listener) {
        const mq = getMedia();
        if (!listeners.size) {
          if (mq.addEventListener) mq.addEventListener('change', notify);
          else mq.addListener(notify);
        }
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
          if (!listeners.size) {
            if (mq.removeEventListener) mq.removeEventListener('change', notify);
            else mq.removeListener(notify);
          }
        };
      },
    };
    stores.set(query, store);
  }
  // Hydration starts with the server value, then follows the real preference.
  // Otherwise conditional SVG/letter markup differs and React rebuilds it all.
  return useSyncExternalStore(store.subscribe, store.getSnapshot, serverSnapshot);
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
