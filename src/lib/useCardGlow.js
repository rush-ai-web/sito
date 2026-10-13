import { useEffect, useRef } from 'react';

export function useCardGlow() {
  const ref = useRef(null);
  const frame = useRef(0);
  const pointer = useRef(null);
  useEffect(() => () => { cancelAnimationFrame(frame.current); frame.current = 0; }, []);
  const onMove = event => {
    if (event.pointerType === 'touch') return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const card = ref.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      // These values belong to the two light layers. Putting them on the
      // whole card invalidates the style of every text/SVG descendant.
      for (const layer of card.querySelectorAll('.buildcard__edge, .buildcard__wash')) {
        layer.style.setProperty('--gx', `${pointer.current.x - rect.left}px`);
        layer.style.setProperty('--gy', `${pointer.current.y - rect.top}px`);
      }
    });
  };
  return [ref, onMove];
}
