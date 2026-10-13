import { forwardRef, useEffect, useRef } from 'react';
import { observeEntrance } from '../lib/entrances';

/* Plain DOM for one-shot entries. Keep the same distances, timing, thresholds
   and easing as the Motion call sites; interactive/layout motion stays Motion. */
export const Entrance = forwardRef(function Entrance({ as: Tag = 'div', initial, whileInView, transition = {}, viewport = {}, children, ...props }, forwardedRef) {
  const ref = useRef(null);
  const from = JSON.stringify(initial);
  const to = JSON.stringify(whileInView);
  const timing = JSON.stringify(transition);
  const view = JSON.stringify(viewport);
  useEffect(() => {
    if (!initial || !whileInView) return;
    return observeEntrance(ref.current, {
      from: JSON.parse(from), to: JSON.parse(to), ...JSON.parse(timing), ...JSON.parse(view),
    });
  }, [from, to, timing, view]);
  return <Tag {...props} ref={node => {
    ref.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }}>{children}</Tag>;
});
