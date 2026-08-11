import { createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, inView, liftHover, stagger } from '../lib/motion';

export const ThemeCtx = createContext('light');

/* ------------------------------------------------------------
   Section — fascia di pagina.
   `invert` alterna chiaro/scuro lungo lo scroll, come nel tema
   di riferimento. `data-tone` dice alla navbar su che fondo si
   trova, così la pillola può invertirsi.
   ------------------------------------------------------------ */
export function Section({ id, invert = false, large = false, className = '', children }) {
  const theme = useContext(ThemeCtx);
  const dark = invert ? theme !== 'dark' : theme === 'dark';
  return (
    <section
      id={id}
      data-tone={dark ? 'dark' : 'light'}
      className={`section ${large ? 'section--lg' : ''} ${invert ? 'invert' : ''} ${className}`}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}

/* Reveal — comparsa allo scroll, una sola volta */
export function Reveal({ i = 0, as = 'div', className = '', children, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      variants={fadeUp}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Group — contenitore che scagliona i figli */
export function Group({ delay = 0, each = 0.07, className = '', children, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={stagger(delay, each)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* Item — figlio di Group */
export function Item({ className = '', children, ...rest }) {
  return (
    <motion.div className={className} variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  );
}

/* Card che si solleva: mai un cambio di colore netto, solo un
   leggero sollevamento con l'easing di decelerazione */
export function LiftCard({ className = '', children, ...rest }) {
  return (
    <motion.div className={className} whileHover={liftHover} {...rest}>
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }) {
  return <p className="t-label">{children}</p>;
}

/* Pillola-etichetta di sezione, con icona Lucide */
export function Pill({ icon: Icon, children, tone = 'surface' }) {
  return (
    <span className={`chip ${tone === 'surface' ? 'chip--surface' : ''}`}>
      {Icon ? <Icon size={14} strokeWidth={1.75} /> : null}
      {children}
    </span>
  );
}

export function IconTile({ icon: Icon, size = 'md', ghost = false }) {
  return (
    <span
      className={`icon-tile ${size === 'sm' ? 'icon-tile--sm' : ''} ${
        ghost ? 'icon-tile--ghost' : ''
      }`}
    >
      <Icon size={size === 'sm' ? 17 : 20} strokeWidth={1.75} />
    </span>
  );
}

/* Dot verde pulsante — signature move */
export function LiveDot() {
  return <span className="livedot" aria-hidden="true" />;
}
