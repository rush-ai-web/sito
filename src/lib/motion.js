/* ============================================================
   Varianti Framer Motion condivise.
   Durate ed easing arrivano dalla guida al brand: sempre
   decelerazione, mai linear, mai un rimbalzo elastico.
   ============================================================ */

export const EASE_OUT = [0, 0, 0.2, 1];
export const EASE_LIFT = [0.2, 0.8, 0.2, 1];
export const EASE_MODAL = [0.16, 1, 0.3, 1];

export const DUR = {
  micro: 0.12,
  hover: 0.15,
  lift: 0.18,
  pop: 0.22,
  modal: 0.3,
  reveal: 0.62,
};

/* quando entra in viewport: una sola volta, con un margine che
   fa partire l'animazione poco prima che l'elemento sia visibile */
export const inView = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' };

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.reveal, ease: EASE_MODAL, delay: i * 0.06 },
  }),
};

export const fade = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({
    opacity: 1,
    transition: { duration: DUR.reveal, ease: EASE_OUT, delay: i * 0.06 },
  }),
};

/* le card orbitanti entrano dal centro verso la loro posizione */
export const floatIn = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE_MODAL, delay: 0.28 + i * 0.075 },
  }),
};

/* contenitore che scagliona i figli */
export const stagger = (delay = 0, each = 0.07) => ({
  hidden: {},
  show: { transition: { delayChildren: delay, staggerChildren: each } },
});

/* sollevamento card: 180ms, cubic-bezier(.2,.8,.2,1) */
export const liftHover = {
  y: -4,
  boxShadow: 'var(--sh-2)',
  transition: { duration: DUR.lift, ease: EASE_LIFT },
};

/* il titolo hero si compone parola per parola */
export const wordUp = {
  hidden: { opacity: 0, y: '0.42em' },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_MODAL, delay: 0.06 + i * 0.055 },
  }),
};
