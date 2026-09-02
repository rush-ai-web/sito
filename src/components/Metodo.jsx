import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
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
  { cx: 16,  cy: 140,  frac: 0.125 },
  { cx: 144, cy: 420,  frac: 0.375 },
  { cx: 16,  cy: 700,  frac: 0.625 },
  { cx: 144, cy: 980,  frac: 0.875 },
];

/* NodeDot — opacity agganciata al progresso dello scroll */
function NodeDot({ cx, cy, frac, progress, reduce }) {
  const opacity = useTransform(progress, [frac - 0.02, frac + 0.04], [0, 1]);
  return (
    <motion.circle
      cx={cx} cy={cy} r="9"
      fill="var(--accent)"
      stroke="var(--bg)"
      strokeWidth="3"
      style={reduce ? undefined : { opacity }}
    />
  );
}

/* StepCard — compare in sincronia con il nodo corrispondente della linea */
function StepCard({ passo, frac, progress, reduce }) {
  const isLeft = passo.side === 'left';
  const { icon: Icon, t, d } = passo;

  /* stessa soglia del NodeDot: la card appare mentre la linea raggiunge il punto */
  const opacity = useTransform(progress, [frac - 0.02, frac + 0.08], [0, 1]);
  const x = useTransform(
    progress,
    [frac - 0.02, frac + 0.08],
    [isLeft ? -20 : 20, 0],
  );

  return (
    <motion.div
      className={`tl-item tl-item--${passo.side}`}
      style={reduce ? undefined : { opacity, x }}
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
}

export default function Metodo() {
  const tlRef = useRef(null);
  const reduce = useReducedMotion();

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
                progress={scrollYProgress}
                reduce={reduce}
              />
            ))}
          </svg>
        </div>

        {PASSI.map((passo, i) => (
          <StepCard
            key={i}
            passo={passo}
            frac={NODES[i].frac}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
      </div>
    </Section>
  );
}
