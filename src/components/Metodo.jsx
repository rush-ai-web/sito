import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { GitBranch, Search, PenTool, Rocket, RefreshCw } from 'lucide-react';
import { Section, Head } from './ui';
import { inView } from '../lib/motion';

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
  { cx: 20,  cy: 140 },
  { cx: 180, cy: 420 },
  { cx: 20,  cy: 700 },
  { cx: 180, cy: 980 },
];

/* ritardi per i dot basati sulla posizione approssimativa sul path */
const DOT_DELAYS = [0.3, 0.9, 1.5, 2.0];

/* ── StepCard ── */
function StepCard({ passo, idx }) {
  const isLeft = passo.side === 'left';
  const { icon: Icon, t, d } = passo;
  return (
    <motion.div
      className={`tl-item tl-item--${passo.side}`}
      style={{ gridRow: idx + 1 }}
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ ...inView, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
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
  const trackRef = useRef(null);
  const measureRef = useRef(null);
  const reduce = useReducedMotion();

  /* lunghezza reale del path */
  const [totalLen, setTotalLen] = useState(1500);
  useEffect(() => {
    if (measureRef.current) setTotalLen(measureRef.current.getTotalLength());
  }, []);

  /* scroll-driven: solo 1 motion value per il path — nessun overhead sullo scroll */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.95', 'end 0.55'],
  });
  const dashOffset = useTransform(scrollYProgress, [0, 1], [totalLen, 0]);

  /* dot: appaiono con useInView, senza binding allo scroll */
  const dotsRef = useRef(null);
  const dotsVisible = useInView(dotsRef, { once: true, amount: 0.05 });

  return (
    <Section id="metodo" grid>
      <span aria-hidden="true" className="metodo-bulb" />

      <Head
        icon={GitBranch}
        label="Come lavoriamo"
        title="Dal primo incontro alla produzione in otto settimane"
        sub="Niente capitolati da trecento pagine. Si parte da un modulo che risolve il problema più caro, e da lì si cresce."
      />

      <div className="tl" ref={trackRef}>
        <div className="tl__track" aria-hidden="true">
          <svg viewBox="0 0 200 1120" fill="none" className="tl__svg" ref={dotsRef}>
            <path ref={measureRef} d={PATH_D} stroke="none" />

            {/* ghost grigio statico */}
            <path
              d={PATH_D}
              stroke="var(--hairline-strong)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* accent — fill scroll-driven, solo 1 motion value */}
            <motion.path
              d={PATH_D}
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={totalLen}
              style={reduce ? undefined : { strokeDashoffset: dashOffset }}
            />

            {/* dot — useInView, temporizzati con la durata della linea */}
            {NODES.map((node, i) => (
              <motion.circle
                key={i}
                cx={node.cx} cy={node.cy} r="8"
                fill="var(--accent)"
                stroke="var(--bg)"
                strokeWidth="3"
                initial={false}
                animate={reduce ? {} : { opacity: dotsVisible ? 1 : 0 }}
                transition={{ duration: 0.35, delay: DOT_DELAYS[i] }}
              />
            ))}
          </svg>
        </div>

        {PASSI.map((passo, i) => (
          <StepCard key={i} passo={passo} idx={i} />
        ))}
      </div>
    </Section>
  );
}
