import { createContext, forwardRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, inView, stagger } from '../lib/motion';
import { useIsMobile } from '../lib/hooks';

export const ThemeCtx = createContext('light');
const SectionMotionCtx = createContext('up');

const MOBILE_MOTION_BY_SECTION = {
  problema: 'left',
  misurabilita: 'left',
  confronto: 'right',
  soluzione: 'left',
  funzioni: 'left',
  metodo: 'left',
  avvio: 'left',
  ecosistema: 'right',
  chat: 'right',
  ristorazione: 'right',
  prezzi: 'right',
};

const mobileReveal = {
  up: fadeUp,
  left: {
    hidden: { opacity: 0, x: -28 },
    show: (i = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.56, ease: [0.16, 1, 0.3, 1], delay: i * 0.045 } }),
  },
  right: {
    hidden: { opacity: 0, x: 28 },
    show: (i = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.56, ease: [0.16, 1, 0.3, 1], delay: i * 0.045 } }),
  },
};

/* ------------------------------------------------------------
   Section - fascia di pagina.
   `invert` alterna chiaro/scuro lungo lo scroll, come nel tema
   di riferimento. `data-tone` dice alla navbar su che fondo si
   trova, così la pillola può invertirsi.
   `grid` e `spot` accendono la maglia di sfondo e il faro.
   ------------------------------------------------------------ */
export function Section({
  id,
  invert = false,
  large = false,
  grid = false,
  spot = false,
  accentSpot = false,
  className = '',
  children,
}) {
  const theme = useContext(ThemeCtx);
  /* niente più alternanza chiaro/scuro: ogni sezione segue il tema.
     `invert` resta accettato come prop per non rompere i call-site, ma
     non cambia più tono né sfondo - lo stravolgimento aurora vive su un
     layer fisso dietro le sezioni, ora trasparenti. */
  const dark = theme === 'dark';
  const fx = [
    grid && 'fx-grid',
    spot && 'fx-spot',
    spot && accentSpot && 'fx-accent-glow',
    large && 'section--lg',
  ]
    .filter(Boolean)
    .join(' ');

  const wantsShine = className.includes('section--shine');

  const mobileMotion = MOBILE_MOTION_BY_SECTION[id] || 'up';
  return (
    <SectionMotionCtx.Provider value={mobileMotion}>
      <section id={id} data-tone={dark ? 'dark' : 'light'} className={`section ${fx} ${className}`}>
        {wantsShine ? <span className="section-shine" aria-hidden="true" /> : null}
        <div className="wrap">{children}</div>
      </section>
    </SectionMotionCtx.Provider>
  );
}

/* ------------------------------------------------------------
   Head - testata di sezione: pillola, titolo, sommario.
   Centrata di default, come ogni sezione del tema.
   ------------------------------------------------------------ */
export function Head({ icon, label, title, sub, left = false, className = '', children }) {
  return (
    <Group className={`head ${left ? 'head--left' : ''} ${className}`} each={0.09}>
      {label ? (
        <Item noMobileMotion>
          <Pill icon={icon}>{label}</Pill>
        </Item>
      ) : null}
      <Item as="h2" className="t-sec" noMobileMotion>
        {title}
      </Item>
      {sub ? (
        <Item as="p" className="t-body" noMobileMotion>
          {sub}
        </Item>
      ) : null}
      {children}
    </Group>
  );
}

/* Reveal - comparsa allo scroll, una sola volta */
export function Reveal({ i = 0, as = 'div', className = '', children, ...rest }) {
  const M = motion[as] || motion.div;
  const isMobile = useIsMobile();
  const profile = useContext(SectionMotionCtx);
  const isStatic = isMobile && profile === 'static';
  return (
    <M
      className={className}
      variants={isMobile ? mobileReveal[profile] || fadeUp : fadeUp}
      custom={i}
      initial={isStatic ? false : 'hidden'}
      whileInView="show"
      viewport={inView}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Group - contenitore che scagliona i figli */
export function Group({ delay = 0, each = 0.07, as = 'div', className = '', children, ...rest }) {
  const M = motion[as] || motion.div;
  const isMobile = useIsMobile();
  const profile = useContext(SectionMotionCtx);
  return (
    <M
      className={className}
      variants={stagger(delay, each)}
      initial={isMobile && profile === 'static' ? false : 'hidden'}
      whileInView="show"
      viewport={inView}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Item - figlio di Group.
   Inoltra il ref: serve a useCountUp, che deve osservare il nodo
   vero per far partire il conteggio quando entra in viewport. */
/* hidden === show: nessun movimento, il figlio resta sempre nel suo
   stato finale. Serve a spegnere l'animazione (titoli/sottotitoli su
   mobile) senza staccare l'elemento dalla propagazione delle varianti
   del Group padre - toglierlo del tutto lascia l'elemento congelato
   sull'ultimo stato applicato invece di renderlo visibile. */
const noMotion = { hidden: { opacity: 1, x: 0, y: 0 }, show: { opacity: 1, x: 0, y: 0 } };

export const Item = forwardRef(function Item({ as = 'div', className = '', children, noMobileMotion = false, ...rest }, ref) {
  const M = motion[as] || motion.div;
  const isMobile = useIsMobile();
  const profile = useContext(SectionMotionCtx);
  /* Titoli e sottotitoli di sezione restano fermi su mobile: niente
     comparsa animata, per alleggerire lo scroll sui dispositivi più
     lenti. Il resto del contenuto continua ad animarsi come prima. */
  const variants = isMobile && noMobileMotion ? noMotion : isMobile ? mobileReveal[profile] || fadeUp : fadeUp;
  return (
    <M ref={ref} className={className} variants={variants} {...rest}>
      {children}
    </M>
  );
});

/* Card che si solleva. Il sollevamento è CSS (`.card--hover`):
   Framer Motion non interpola `var(--sh-2)` e il suo transform
   creava un contesto di impilamento che spegneva il bagliore.
   Qui FM resta responsabile solo della comparsa allo scroll. */
export const LiftCard = forwardRef(function LiftCard({ className = '', children, ...rest }, ref) {
  const isMobile = useIsMobile();
  const profile = useContext(SectionMotionCtx);
  return (
    <motion.div ref={ref} className={`${className} card--hover`} variants={isMobile ? mobileReveal[profile] || fadeUp : fadeUp} {...rest}>
      {children}
    </motion.div>
  );
});

/* ------------------------------------------------------------
   GlowCard - la card del tema: bagliore dietro all'icona,
   riquadro icona, titolo, testo. Si solleva sull'hover.
   ------------------------------------------------------------ */
export function GlowCard({ icon, title, children, accent = false, className = '' }) {
  return (
    <LiftCard className={`card card--lg card--glow ${accent ? 'card--glow-accent' : ''} ${className}`}>
      {icon ? <IconTile icon={icon} accent={accent} /> : null}
      <h3 className="t-card" style={{ marginTop: icon ? 26 : 0, marginBottom: 12 }}>
        {title}
      </h3>
      <p className="t-body">{children}</p>
    </LiftCard>
  );
}

/* ------------------------------------------------------------
   DecoratorCard - card centrata con decorator a griglia dietro
   all'icona (mask radiale che sfuma ai bordi), l'icona sta in un
   piccolo riquadro con bordo top+left in accento. Titolo + testo
   sotto, centrati.
   ------------------------------------------------------------ */
export function DecoratorCard({ icon: Icon, title, children, className = '', ...rest }) {
  return (
    <LiftCard className={`card card--deco ${className}`} {...rest}>
      <div className="card-deco" aria-hidden="true">
        <div className="card-deco__grid" />
        {Icon ? <Icon className="card-deco__ic" size={22} strokeWidth={1.9} /> : null}
      </div>
      <h3 className="t-card card-deco__t">{title}</h3>
      <p className="t-body card-deco__d">{children}</p>
    </LiftCard>
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

export function IconTile({ icon: Icon, size = 'md', ghost = false, accent = false }) {
  const cls = ['icon-tile', size === 'sm' && 'icon-tile--sm', ghost && 'icon-tile--ghost', accent && 'icon-tile--accent']
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls}>
      <Icon size={size === 'sm' ? 17 : 20} strokeWidth={1.75} />
    </span>
  );
}

/* Card-pillola: riquadro icona + due righe. Il mattone ricorrente. */
export function PillCard({ icon: Icon, children, className = '', ...rest }) {
  return (
    <motion.div className={`pillcard ${className}`} {...rest}>
      <IconTile icon={Icon} size="sm" />
      <span>{children}</span>
    </motion.div>
  );
}

/* Dot verde pulsante - signature move */
export function LiveDot() {
  return <span className="livedot" aria-hidden="true" />;
}
