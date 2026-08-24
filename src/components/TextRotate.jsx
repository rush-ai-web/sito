import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* Text rotator adattato dal componente 21st.dev.
   Ogni parola entra dal basso lettera per lettera, esce verso l'alto. */
const TextRotate = forwardRef(function TextRotate(
  {
    texts,
    transition = { type: 'spring', damping: 26, stiffness: 320 },
    initial = { y: '100%', opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2800,
    staggerDuration = 0.022,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName = '',
    splitLevelClassName = '',
    elementLevelClassName = '',
  },
  ref
) {
  const [i, setI] = useState(0);

  const splitChars = (t) => {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const seg = new Intl.Segmenter('it', { granularity: 'grapheme' });
      return Array.from(seg.segment(t), ({ segment }) => segment);
    }
    return Array.from(t);
  };

  const elements = useMemo(() => {
    const cur = texts[i];
    if (splitBy === 'characters') {
      const words = cur.split(' ');
      return words.map((w, idx) => ({
        characters: splitChars(w),
        needsSpace: idx !== words.length - 1,
      }));
    }
    return splitBy === 'words' ? cur.split(' ') : cur.split(splitBy);
  }, [texts, i, splitBy]);

  const totalChars =
    splitBy === 'characters'
      ? elements.reduce((s, w) => s + w.characters.length, 0)
      : elements.length;

  const staggerDelay = useCallback(
    (idx) => {
      if (staggerFrom === 'first') return idx * staggerDuration;
      if (staggerFrom === 'last') return (totalChars - 1 - idx) * staggerDuration;
      if (staggerFrom === 'center') {
        const c = Math.floor(totalChars / 2);
        return Math.abs(c - idx) * staggerDuration;
      }
      return Math.abs((staggerFrom || 0) - idx) * staggerDuration;
    },
    [staggerFrom, staggerDuration, totalChars]
  );

  const setIdx = useCallback(
    (n) => {
      setI(n);
      onNext?.(n);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const n = i === texts.length - 1 ? (loop ? 0 : i) : i + 1;
    if (n !== i) setIdx(n);
  }, [i, texts.length, loop, setIdx]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous: () => setIdx(i === 0 ? (loop ? texts.length - 1 : 0) : i - 1),
      jumpTo: (n) => setIdx(Math.max(0, Math.min(n, texts.length - 1))),
      reset: () => setIdx(0),
    }),
    [next, i, loop, texts.length, setIdx]
  );

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(next, rotationInterval);
    return () => clearInterval(id);
  }, [auto, next, rotationInterval]);

  return (
    <motion.span className={`tr ${mainClassName}`} layout transition={transition}>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.div key={i} className="tr__group" layout aria-hidden="true">
          {(splitBy === 'characters'
            ? elements
            : elements.map((el, idx) => ({
                characters: [el],
                needsSpace: idx !== elements.length - 1,
              }))
          ).map((wo, wIdx, arr) => {
            const prev = arr.slice(0, wIdx).reduce((s, w) => s + w.characters.length, 0);
            return (
              <span key={wIdx} className={`tr__word ${splitLevelClassName}`}>
                {wo.characters.map((c, cIdx) => (
                  <motion.span
                    key={cIdx}
                    className={`tr__c ${elementLevelClassName}`}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{ ...transition, delay: staggerDelay(prev + cIdx) }}
                  >
                    {c}
                  </motion.span>
                ))}
                {wo.needsSpace && <span className="tr__sp"> </span>}
              </span>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.span>
  );
});

export default TextRotate;
