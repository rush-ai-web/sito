import { forwardRef, useEffect, useRef } from 'react';
import { observeEntrance } from '../lib/entrances';

/* Plain DOM for one-shot entries. Keep the same distances, timing, thresholds
   and easing as the Motion call sites; interactive/layout motion stays Motion. */
export const Entrance = forwardRef(function Entrance({ as: Tag = 'div', initial, whileInView, transition = {}, viewport = {}, group, children, ...props }, forwardedRef) {
  const ref = useRef(null);
  const from = JSON.stringify(initial);
  const to = JSON.stringify(whileInView);
  const timing = JSON.stringify(transition);
  const view = JSON.stringify(viewport);
  useEffect(() => {
    if (!initial || !whileInView) return;
    const target = group?.ref.current || ref.current;
    const index = group ? Math.max(0, Array.from(target.children).indexOf(ref.current)) : 0;
    const timingOptions = JSON.parse(timing);
    return observeEntrance(ref.current, {
      from: JSON.parse(from), to: JSON.parse(to), ...timingOptions, ...JSON.parse(view),
      delay: (timingOptions.delay || 0) + (group ? group.delay + index * group.each : 0),
    }, target);
  }, [from, to, timing, view, group]);
  return <Tag {...props} ref={node => {
    ref.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }}>{children}</Tag>;
});
