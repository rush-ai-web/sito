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
   ViewBox 60 × 960 — 4 righe da 240px.
   Nodi alternati: sinistra x=14, destra x=46, centrati y=120/360/600/840.
   Le curve sono deliberatamente irregolari (i punti di controllo
   non sono simmetrici) per dare carattere organico.
   ─────────────────────────────────────────────────────────────── */
const PATH_D = [
  'M 30 0',
  'C 30 55 14 78 14 120',      // → nodo 1  sinistra  y=120
  'C 14 162 38 195 30 240',    // cross centre
  'C 22 285 46 308 46 360',    // → nodo 2  destra    y=360
  'C 46 412 20 445 30 480',    // cross centre
  'C 40 515 14 538 14 600',    // → nodo 3  sinistra  y=600
  'C 14 642 44 675 30 720',    // cross centre
  'C 16 765 46 788 46 840',    // → nodo 4  destra    y=840
  'C 46 882 30 940 30 960',    // fine
].join(' ');

/* coordinate dei nodi nel viewBox */
const NODES = [
  { cx: 14, cy: 120 },
  { cx: 46, cy: 360 },
  { cx: 14, cy: 600 },
  { cx: 46, cy: 840 },
];

/* a che fraction dello scroll appare ogni nodo */
const THRESHOLDS = [0.11, 0.36, 0.61, 0.86];

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
    offset: ['start 0.82', 'end 0.18'],
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
