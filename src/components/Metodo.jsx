import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { GitBranch, Search, PenTool, Rocket, RefreshCw } from 'lucide-react';
import { Section, Head } from './ui';

const PASSI = [
  {
    n: '01',
    icon: Search,
    t: 'Analisi sul campo',
    d: 'Veniamo a vedere come lavori davvero: chi fa cosa, dove si perde tempo, quali dati esistono già e dove sono fermi.',
    side: 'left',
  },
  {
    n: '02',
    icon: PenTool,
    t: 'Progetto e prototipo',
    d: 'Disegniamo il sistema e ti mostriamo le schermate vere prima di scrivere il codice definitivo. Si corregge lì, non dopo.',
    side: 'right',
  },
  {
    n: '03',
    icon: Rocket,
    t: 'Sviluppo e messa in linea',
    d: 'Costruiamo, importiamo i tuoi dati storici, colleghiamo i sistemi esistenti e formiamo chi lo userà ogni giorno.',
    side: 'left',
  },
  {
    n: '04',
    icon: RefreshCw,
    t: 'Evoluzione continua',
    d: "L'azienda cambia e il gestionale la segue: nuovi moduli, nuove automazioni, nuove integrazioni quando servono.",
    side: 'right',
  },
];

/* ── SVG path ─────────────────────────────────────────────────────
   ViewBox 200 × 960, righe fisse da 240px.
   Nodi a x=20 (sx) e x=180 (dx) — swing di 160px su 200.
   I control point dei segmenti di cross vanno fino a x=4 e x=196,
   creando curve molto pronunciate a S tra un nodo e l'altro.
   ──────────────────────────────────────────────────────────────── */
const PATH_D = [
  'M 100 0',
  'C 100 30 20 75 20 120',      // → nodo 1  sx  y=120
  'C 4 210 196 290 180 360',    // S molto ampia → nodo 2  dx  y=360
  'C 196 450 4 530 20 600',     // S molto ampia → nodo 3  sx  y=600
  'C 4 690 196 770 180 840',    // S molto ampia → nodo 4  dx  y=840
  'C 196 910 100 940 100 960',  // fine
].join(' ');

const NODES = [
  { cx: 20,  cy: 120 },
  { cx: 180, cy: 360 },
  { cx: 20,  cy: 600 },
  { cx: 180, cy: 840 },
];

/* step 4 compare al 68% dello scroll */
const THRESHOLDS = [0.08, 0.28, 0.48, 0.68];

/* ── NodeDot ── */
function NodeDot({ cx, cy, progress, threshold, reduce }) {
  const opacity = useTransform(
    progress,
    [Math.max(0, threshold - 0.02), Math.min(1, threshold + 0.06)],
    [0, 1]
  );
  return (
    <motion.circle
      cx={cx} cy={cy} r="5"
      fill="var(--accent)"
      stroke="var(--bg)"
      strokeWidth="3"
      style={reduce ? undefined : { opacity }}
    />
  );
}

/* ── StepCard ── */
function StepCard({ passo, idx, progress, threshold, reduce }) {
  const isLeft = passo.side === 'left';
  const opacity = useTransform(
    progress,
    [Math.max(0, threshold - 0.04), Math.min(1, threshold + 0.12)],
    [0, 1]
  );
  const x = useTransform(
    progress,
    [Math.max(0, threshold - 0.04), Math.min(1, threshold + 0.12)],
    [isLeft ? -22 : 22, 0]
  );
  const { n, icon: Icon, t, d } = passo;
  return (
    <motion.div
      className={`tl-item tl-item--${passo.side}`}
      style={{ gridRow: idx + 1, ...(reduce ? {} : { opacity, x }) }}
    >
      <span className="tl-item__icon"><Icon size={20} strokeWidth={1.75} /></span>
      <span className="tl-item__n">{n}</span>
      <h3 className="tl-item__t">{t}</h3>
      <p className="tl-item__d">{d}</p>
    </motion.div>
  );
}

/* ── Metodo ── */
export default function Metodo() {
  const trackRef = useRef(null);
  const measureRef = useRef(null);
  const reduce = useReducedMotion();

  /* lunghezza reale del path — evita il bug pathLength+vectorEffect */
  const [totalLen, setTotalLen] = useState(1200);
  useEffect(() => {
    if (measureRef.current) setTotalLen(measureRef.current.getTotalLength());
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.9', 'end 0.6'],
  });

  /* dashOffset da totalLen (nascosta) a 0 (piena) */
  const dashOffset = useTransform(scrollYProgress, [0, 1], [totalLen, 0]);

  return (
    <Section id="metodo" grid>
      <Head
        icon={GitBranch}
        label="Come lavoriamo"
        title="Dal primo incontro alla produzione in otto settimane"
        sub="Niente capitolati da trecento pagine. Si parte da un modulo che risolve il problema più caro, e da lì si cresce."
      />

      <div className="tl" ref={trackRef}>
        {/* colonna centrale con il tracciato */}
        <div className="tl__track" aria-hidden="true">
          <svg viewBox="0 0 200 960" fill="none" className="tl__svg">
            {/* path invisibile solo per misurare la lunghezza */}
            <path ref={measureRef} d={PATH_D} stroke="none" />

            {/* ghost path grigio */}
            <path
              d={PATH_D}
              stroke="var(--hairline-strong)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* path accent animato con dashOffset */}
            <motion.path
              d={PATH_D}
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={totalLen}
              style={reduce ? undefined : { strokeDashoffset: dashOffset }}
            />

            {/* pallini ai nodi */}
            {NODES.map((node, i) => (
              <NodeDot
                key={i}
                {...node}
                progress={scrollYProgress}
                threshold={THRESHOLDS[i]}
                reduce={reduce}
              />
            ))}
          </svg>
        </div>

        {/* card sinistra/destra alternati */}
        {PASSI.map((passo, i) => (
          <StepCard
            key={passo.n}
            passo={passo}
            idx={i}
            progress={scrollYProgress}
            threshold={THRESHOLDS[i]}
            reduce={reduce}
          />
        ))}
      </div>
    </Section>
  );
}
