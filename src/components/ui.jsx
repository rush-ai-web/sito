import { createContext, forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, inView, stagger } from '../lib/motion';

export const ThemeCtx = createContext('light');

/* ------------------------------------------------------------
   Section — fascia di pagina.
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
  const dark = invert ? theme !== 'dark' : theme === 'dark';
  const fx = [
    grid && 'fx-grid',
    spot && 'fx-spot',
    spot && accentSpot && 'fx-accent-glow',
    invert && 'invert',
    large && 'section--lg',
  ]
    .filter(Boolean)
    .join(' ');

  /* variante shine: aggiunge .in-view quando la sezione entra in viewport,
     così il keyframe della banda diagonale parte una sola volta. */
  const ref = useRef(null);
  const [inViewShine, setInViewShine] = useState(false);
  const wantsShine = className.includes('section--shine');
  useEffect(() => {
    if (!wantsShine || inViewShine) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInViewShine(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wantsShine, inViewShine]);

  const inViewCls = wantsShine && inViewShine ? ' in-view' : '';

  return (
    <section
      id={id}
      ref={ref}
      data-tone={dark ? 'dark' : 'light'}
      className={`section ${fx} ${className}${inViewCls}`}
    >
      {wantsShine ? <span className="section-shine" aria-hidden="true" /> : null}
      <div className="wrap">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------
   Head — testata di sezione: pillola, titolo, sommario.
   Centrata di default, come ogni sezione del tema.
   ------------------------------------------------------------ */
export function Head({ icon, label, title, sub, left = false, children }) {
  return (
    <Group className={`head ${left ? 'head--left' : ''}`} each={0.09}>
      {label ? (
        <Item>
          <Pill icon={icon}>{label}</Pill>
        </Item>
      ) : null}
      <Item as="h2" className="t-sec">
        {title}
      </Item>
      {sub ? (
        <Item as="p" className="t-body">
          {sub}
        </Item>
      ) : null}
      {children}
    </Group>
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
export function Group({ delay = 0, each = 0.07, as = 'div', className = '', children, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      variants={stagger(delay, each)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Item — figlio di Group.
   Inoltra il ref: serve a useCountUp, che deve osservare il nodo
   vero per far partire il conteggio quando entra in viewport. */
export const Item = forwardRef(function Item({ as = 'div', className = '', children, ...rest }, ref) {
  const M = motion[as] || motion.div;
  return (
    <M ref={ref} className={className} variants={fadeUp} {...rest}>
      {children}
    </M>
  );
});

/* Card che si solleva. Il sollevamento è CSS (`.card--hover`):
   Framer Motion non interpola `var(--sh-2)` e il suo transform
   creava un contesto di impilamento che spegneva il bagliore.
   Qui FM resta responsabile solo della comparsa allo scroll. */
export const LiftCard = forwardRef(function LiftCard({ className = '', children, ...rest }, ref) {
  return (
    <motion.div ref={ref} className={`${className} card--hover`} variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  );
});

/* ------------------------------------------------------------
   GlowCard — la card del tema: bagliore dietro all'icona,
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
   DecoratorCard — card centrata con decorator a griglia dietro
   all'icona (mask radiale che sfuma ai bordi), l'icona sta in un
   piccolo riquadro con bordo top+left in accento. Titolo + testo
   sotto, centrati.
   ------------------------------------------------------------ */
export function DecoratorCard({ icon: Icon, title, children, className = '' }) {
  return (
    <LiftCard className={`card card--deco ${className}`}>
      <div className="card-deco" aria-hidden="true">
        <div className="card-deco__grid" />
        {Icon ? <Icon className="card-deco__ic" size={30} strokeWidth={1.8} /> : null}
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

/* Dot verde pulsante — signature move */
export function LiveDot() {
  return <span className="livedot" aria-hidden="true" />;
}
