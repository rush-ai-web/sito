import { useRef, useState, useEffect } from 'react';
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
  'M 100 0',
  'C 100 45 20 95 20 140',
  'C 4 230 196 330 180 420',
  'C 196 510 4 610 20 700',
  'C 4 790 196 890 180 980',
  'C 196 1065 100 1095 100 1120',
].join(' ');

const NODES = [
  { cx: 20,  cy: 140, frac: 0.125 },
  { cx: 180, cy: 420, frac: 0.375 },
  { cx: 20,  cy: 700, frac: 0.625 },
  { cx: 180, cy: 980, frac: 0.875 },
];

/* ── NodeDot — opacity agganciata al progresso della linea (bidirezionale) ── */
function NodeDot({ cx, cy, frac, progress, reduce }) {
  const opacity = useTransform(progress, [frac - 0.02, frac + 0.04], [0, 1]);
  return (
    <motion.circle
      cx={cx} cy={cy} r="8"
      fill="var(--accent)"
      stroke="var(--bg)"
      strokeWidth="3"
      style={reduce ? undefined : { opacity }}
    />
  );
}

/* ── StepCard — useInView per-card, compare e scompare con lo scroll ── */
function StepCard({ passo, idx, reduce }) {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: 0.4 }); // once: false di default
  const isLeft = passo.side === 'left';
  const { icon: Icon, t, d } = passo;
  return (
    <motion.div
      ref={ref}
      className={`tl-item tl-item--${passo.side}`}
      style={{ gridRow: idx + 1 }}
      initial={false}
      animate={
        reduce
          ? {}
          : { opacity: visible ? 1 : 0, x: visible ? 0 : isLeft ? -24 : 24 }
      }
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
}

/* ── Metodo ── */
export default function Metodo() {
  const tlRef = useRef(null);
  const measureRef = useRef(null);
  const reduce = useReducedMotion();

  const [totalLen, setTotalLen] = useState(1500);
  useEffect(() => {
    if (measureRef.current) setTotalLen(measureRef.current.getTotalLength());
  }, []);

  /* la linea si riempie mentre .tl attraversa il centro dello schermo:
     progress 0 = prima card al centro (linea vuota), progress 1 = ultima card al centro */
  const { scrollYProgress } = useScroll({
    target: tlRef,
    offset: ['start center', 'end center'],
  });
  const dashOffset = useTransform(scrollYProgress, [0, 1], [totalLen, 0]);

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
          <svg viewBox="0 0 200 1120" fill="none" className="tl__svg">
            <path ref={measureRef} d={PATH_D} stroke="none" />

            <path
              d={PATH_D}
              stroke="var(--hairline-strong)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <motion.path
              d={PATH_D}
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={totalLen}
              style={reduce ? undefined : { strokeDashoffset: dashOffset }}
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
          <StepCard key={i} passo={passo} idx={i} reduce={reduce} />
        ))}
      </div>
    </Section>
  );
}
