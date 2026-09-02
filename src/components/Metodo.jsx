import { useRef } from 'react';
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

/* viewBox 160×1120 = stesso aspect ratio del container (160px × 1120px)
   → nessun letterboxing e i cerchi restano rotondi (scala uniforme). */
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

/* NodeDot — opacity agganciata al progresso dello scroll (composited) */
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

/* StepCard — compare e scompare bidirezionalmente con lo scroll */
function StepCard({ passo, idx, reduce }) {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: 0.4 });
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

/* Metodo */
export default function Metodo() {
  const tlRef = useRef(null);
  const reduce = useReducedMotion();

  /* progress 0 = start di tlRef al centro del viewport, 1 = end di tlRef al centro */
  const { scrollYProgress } = useScroll({
    target: tlRef,
    offset: ['start center', 'end center'],
  });

  /* animiamo l'attributo height del rect (SVG-native, sempre affidabile,
     nessun problema di transform-origin o preserveAspectRatio) */
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
              {/*
                Il colored path è rivelato progressivamente da un clipPath
                che contiene un rect la cui height cresce dallo 0 a 1120 in
                base allo scroll. Height è un attributo SVG nativo: nessun
                stroke-dashoffset (evita ricalcoli lungo il path) e nessun
                transform CSS (evita ambiguità di transform-origin sui rect).
              */}
              <clipPath id="metodo-line-clip">
                <motion.rect
                  x="0" y="0" width="160"
                  height={reduce ? 1120 : rectHeight}
                />
              </clipPath>
            </defs>

            {/* traccia di sfondo sempre visibile */}
            <path
              d={PATH_D}
              stroke="var(--hairline-strong)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* traccia colorata rivelata dal clipPath */}
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
          <StepCard key={i} passo={passo} idx={i} reduce={reduce} />
        ))}
      </div>
    </Section>
  );
}
