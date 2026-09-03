import { forwardRef, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { GitBranch, Search, PenTool, Rocket, RefreshCw } from 'lucide-react';
import { Section, Head } from './ui';

const PASSI = [
  {
    icon: Search,
    t: 'Analisi sul campo',
    d: 'Veniamo a vedere come lavori davvero: chi fa cosa, dove si perde tempo, quali dati esistono già e dove sono fermi.',
    side: 'left',
  },
  {
    icon: PenTool,
    t: 'Progetto e prototipo',
    d: 'Disegniamo il sistema e ti mostriamo le schermate vere prima di scrivere il codice definitivo. Si corregge lì, non dopo.',
    side: 'right',
  },
  {
    icon: Rocket,
    t: 'Sviluppo e messa in linea',
    d: 'Costruiamo, importiamo i tuoi dati storici, colleghiamo i sistemi esistenti e formiamo chi lo userà ogni giorno.',
    side: 'left',
  },
  {
    icon: RefreshCw,
    t: 'Evoluzione continua',
    d: "L'azienda cambia e il gestionale la segue: nuovi moduli, nuove automazioni, nuove integrazioni quando servono.",
    side: 'right',
  },
];

const PATH_D = [
  'M 80 0',
  'C 80 45 16 95 16 140',
  'C 3 230 157 330 144 420',
  'C 157 510 3 610 16 700',
  'C 3 790 157 890 144 980',
  'C 157 1065 80 1095 80 1120',
].join(' ');

const NODES = [
  { cx: 16,  cy: 140 },
  { cx: 144, cy: 420 },
  { cx: 16,  cy: 700 },
  { cx: 144, cy: 980 },
];

/* NodeDot — visibilità legata alla card (viewport-based, non alla linea) */
function NodeDot({ cx, cy, visible, reduce }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r="9"
      fill="var(--accent)"
      stroke="var(--bg)"
      strokeWidth="3"
      initial={reduce ? undefined : { opacity: 0, scale: 0.6 }}
      animate={reduce ? undefined : { opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
    />
  );
}

/* StepCard — forwardRef così il parent può attaccare l'useInView direttamente
   sul nodo motion senza wrapper aggiuntivi */
const StepCard = forwardRef(function StepCard({ passo, idx, visible, reduce }, ref) {
  const isLeft = passo.side === 'left';
  const { icon: Icon, t, d } = passo;
  return (
    <motion.div
      ref={ref}
      className={`tl-item tl-item--${passo.side}`}
      style={{ gridRow: idx + 1 }}
      initial={reduce ? undefined : { opacity: 0, x: isLeft ? -20 : 20 }}
      animate={reduce ? undefined : { opacity: visible ? 1 : 0, x: visible ? 0 : isLeft ? -20 : 20 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="tl-item__header">
        <span className="icon-tile icon-tile--sm">
          <Icon size={17} strokeWidth={1.75} />
        </span>
        <h3 className="tl-item__t">{t}</h3>
      </div>
      <p className="tl-item__d">{d}</p>
    </motion.div>
  );
});

export default function Metodo() {
  const tlRef = useRef(null);
  const reduce = useReducedMotion();

  /* 4 refs + 4 useInView, hooks fissi al livello top-level (regola React) */
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const IV = { amount: 0.35, margin: '0px 0px -10% 0px' };
  const v0 = useInView(ref0, IV);
  const v1 = useInView(ref1, IV);
  const v2 = useInView(ref2, IV);
  const v3 = useInView(ref3, IV);
  const refs = [ref0, ref1, ref2, ref3];
  const visible = [v0, v1, v2, v3];

  /* linea: sempre scroll-driven, indipendente dalla comparsa di card/dot */
  const { scrollYProgress } = useScroll({
    target: tlRef,
    offset: ['start center', 'end center'],
  });
  const rectHeight = useTransform(scrollYProgress, [0, 1], [0, 1120]);

  return (
    <Section id="metodo" grid>
      <span aria-hidden="true" className="metodo-bulb" />

      <Head
        icon={GitBranch}
        label="Come lavoriamo"
        title="Dal primo incontro alla produzione in otto settimane"
        sub="Niente capitolati da trecento pagine. Si parte da un modulo che risolve il problema più caro, e da lì si cresce."
      />

      <div className="tl" ref={tlRef}>
        <div className="tl__track" aria-hidden="true">
          <svg viewBox="0 0 160 1120" fill="none" className="tl__svg">
            <defs>
              <clipPath id="metodo-line-clip">
                <motion.rect
                  x="0" y="0" width="160"
                  height={reduce ? 1120 : rectHeight}
                />
              </clipPath>
            </defs>

            <path
              d={PATH_D}
              stroke="var(--hairline-strong)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d={PATH_D}
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              clipPath="url(#metodo-line-clip)"
            />

            {NODES.map((node, i) => (
              <NodeDot
                key={i}
                {...node}
                visible={visible[i]}
                reduce={reduce}
              />
            ))}
          </svg>
        </div>

        {PASSI.map((passo, i) => (
          <StepCard
            key={i}
            ref={refs[i]}
            passo={passo}
            idx={i}
            visible={visible[i]}
            reduce={reduce}
          />
        ))}
      </div>
    </Section>
  );
}
