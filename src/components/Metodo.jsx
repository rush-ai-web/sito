import { useRef } from 'react';
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

/* ─── SVG path ─────────────────────────────────────────────────
   ViewBox 100 × 960 — 4 righe da 240px.
   Nodi: sinistra x=12, destra x=88 — swing ampio e organico.
   ─────────────────────────────────────────────────────────────── */
const PATH_D = [
  'M 50 0',
  'C 50 50 12 72 12 120',      // → nodo 1  sinistra  y=120
  'C 12 168 60 200 50 240',    // cross
  'C 40 280 88 312 88 360',    // → nodo 2  destra    y=360
  'C 88 408 38 440 50 480',    // cross
  'C 62 520 12 552 12 600',    // → nodo 3  sinistra  y=600
  'C 12 648 62 680 50 720',    // cross
  'C 38 760 88 792 88 840',    // → nodo 4  destra    y=840
  'C 88 888 50 940 50 960',    // fine
].join(' ');

/* coordinate dei nodi nel viewBox */
const NODES = [
  { cx: 12, cy: 120 },
  { cx: 88, cy: 360 },
  { cx: 12, cy: 600 },
  { cx: 88, cy: 840 },
];

/* threshold abbassati: step 4 compare al 68% dello scroll, non all'86% */
const THRESHOLDS = [0.08, 0.28, 0.48, 0.68];

/* ─── NodeDot ─── */
function NodeDot({ cx, cy, pathProgress, threshold, reduce }) {
  const opacity = useTransform(
    pathProgress,
    [Math.max(0, threshold - 0.02), Math.min(1, threshold + 0.06)],
    [0, 1]
  );
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="5"
      fill="var(--accent)"
      stroke="var(--bg)"
      strokeWidth="3"
      vectorEffect="non-scaling-stroke"
      style={reduce ? undefined : { opacity }}
    />
  );
}

/* ─── StepCard ─── */
function StepCard({ passo, idx, pathProgress, threshold, reduce }) {
  const isLeft = passo.side === 'left';
  const opacity = useTransform(
    pathProgress,
    [Math.max(0, threshold - 0.04), Math.min(1, threshold + 0.12)],
    [0, 1]
  );
  const x = useTransform(
    pathProgress,
    [Math.max(0, threshold - 0.04), Math.min(1, threshold + 0.12)],
    [isLeft ? -22 : 22, 0]
  );

  const { icon: Icon, n, t, d } = passo;

  return (
    <motion.div
      className={`tl-item tl-item--${passo.side}`}
      style={{ gridRow: idx + 1, ...(reduce ? {} : { opacity, x }) }}
    >
      <span className="tl-item__n">{n}</span>
      <h3 className="tl-item__t">{t}</h3>
      <p className="tl-item__d">{d}</p>
    </motion.div>
  );
}

/* ─── Metodo ─── */
export default function Metodo() {
  const trackRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.9', 'end 0.6'],
  });

  return (
    <Section id="metodo" grid>
      <Head
        icon={GitBranch}
        label="Come lavoriamo"
        title="Dal primo incontro alla produzione in otto settimane"
        sub="Niente capitolati da trecento pagine. Si parte da un modulo che risolve il problema più caro, e da lì si cresce."
      />

      <div className="tl" ref={trackRef}>
        {/* colonna centrale con il tracciato SVG */}
        <div className="tl__track" aria-hidden="true">
          <svg viewBox="0 0 60 960" fill="none" className="tl__svg">
            {/* ghost path di sfondo */}
            <path
              d={PATH_D}
              stroke="var(--hairline-strong)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* tracciato animato con il fill d'accento */}
            <motion.path
              d={PATH_D}
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduce ? 1 : scrollYProgress }}
            />
            {/* puntini ai nodi */}
            {NODES.map((node, i) => (
              <NodeDot
                key={i}
                {...node}
                pathProgress={scrollYProgress}
                threshold={THRESHOLDS[i]}
                reduce={reduce}
              />
            ))}
          </svg>
        </div>

        {/* card destra/sinistra alternati */}
        {PASSI.map((passo, i) => (
          <StepCard
            key={passo.n}
            passo={passo}
            idx={i}
            pathProgress={scrollYProgress}
            threshold={THRESHOLDS[i]}
            reduce={reduce}
          />
        ))}
      </div>
    </Section>
  );
}
