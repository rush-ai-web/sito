import { forwardRef, useEffect, useRef } from 'react';
import { observeEntrance } from '../lib/entrances';
import { columnEntrance, inView } from '../lib/motion';

/* Plain DOM for one-shot entries. Directional columns share a visible-only
   trigger; interactive/layout motion stays Motion. */
export const Entrance = forwardRef(function Entrance({ as: Tag = 'div', direction, initial, whileInView, transition = {}, viewport = {}, group, children, ...props }, forwardedRef) {
  const ref = useRef(null);
  const start = initial === false ? false : columnEntrance[direction] || initial;
  const end = direction ? { opacity: 1, transform: 'none' } : whileInView;
  const from = JSON.stringify(start);
  const to = JSON.stringify(end);
  const timing = JSON.stringify(transition);
  const view = JSON.stringify(direction ? inView : viewport);
  useEffect(() => {
    if (!start || !end) return;
    const target = group?.ref.current || ref.current;
    const index = group ? Math.max(0, Array.from(target.children).indexOf(ref.current)) : 0;
    const timingOptions = JSON.parse(timing);
    return observeEntrance(ref.current, {
      from: JSON.parse(from), to: JSON.parse(to), ...timingOptions, ...JSON.parse(view),
      delay: (timingOptions.delay || 0) + (group ? group.delay + index * group.each : 0),
    }, target);
  }, [from, to, timing, view, group]);
  return <Tag {...props} data-entry-direction={direction} ref={node => {
    ref.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }}>{children}</Tag>;
});
