import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { watchSectionProgress } from '../lib/scrollControls';
import { useReducedMotion } from '../lib/preferences';
import { GitBranch, Search, PenTool, Rocket, RefreshCw } from 'lucide-react';
import { Section, Head } from './ui';
import { useIsMobile } from '../lib/hooks';

const PASSI = [
  {
    icon: Search,
    t: 'Capiamo come lavori',
    d: 'Analizziamo strumenti, dati e attività dei reparti. Individuiamo dove le informazioni si fermano e quali passaggi manuali conviene semplificare per primi.',
    side: 'left',
  },
  {
    icon: PenTool,
    t: 'Ti mostriamo come cambia',
    d: 'Disegniamo il tuo centro operativo e ti mostriamo le schermate del prototipo. Valutiamo insieme come rendere più semplice il lavoro quotidiano.',
    side: 'right',
  },
  {
    icon: Rocket,
    t: 'Colleghiamo e mettiamo al lavoro',
    d: 'Attiviamo le integrazioni concordate, importiamo i dati necessari e formiamo il team. RUSH entra nel lavoro quotidiano con un percorso di avvio definito.',
    side: 'left',
  },
  {
    icon: RefreshCw,
    t: 'Cresciamo con la tua attività',
    d: 'Nuovi reparti, nuove esigenze, nuovi strumenti: il tuo centro operativo può evolvere con ulteriori funzioni, automazioni e collegamenti.',
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

/* mobile: linea dritta sulla sinistra, tutti i nodi sulla stessa verticale */
const M_PATH_D = 'M 20 0 L 20 1120';
const M_NODES = NODES.map((n) => ({ cx: 20, cy: n.cy }));

const TOTAL = 1120;
/* frazione di scroll a cui la linea raggiunge ogni nodo (cy / altezza totale).
   Con offset start-center → end-center, a quella frazione il punto è a metà schermo. */
const FRAC = NODES.map((n) => n.cy / TOTAL);

/* Il reveal parte nel momento esatto in cui il riempimento raggiunge il nodo.
   La breve coda mantiene l'entrata laterale fluida senza anticiparla. */
const REVEAL_SPAN = 0.035;

/* NodeDot - appare in sincrono con la linea che lo raggiunge */
function NodeDot({ cx, cy, frac, progress, reduce }) {
  const opacity = useTransform(progress, [frac, frac + REVEAL_SPAN], [0, 1]);
  const scale = useTransform(progress, [frac, frac + REVEAL_SPAN], [0.6, 1]);
  if (reduce) {
    return (
      <circle cx={cx} cy={cy} r="9" fill="var(--accent)" stroke="var(--bg)" strokeWidth="3" />
    );
  }
  return (
    <motion.circle
      cx={cx} cy={cy} r="9"
      fill="var(--accent)"
      stroke="var(--bg)"
      strokeWidth="3"
      style={{ opacity, scale, transformBox: 'fill-box', transformOrigin: 'center' }}
    />
  );
}

/* Ogni card usa lo stesso progresso della linea: resta nascosta fino a quando
   il riempimento raggiunge il suo nodo, poi entra dal lato corrispondente. */
function StepCard({ passo, idx, frac, progress, reduce }) {
  const { icon: Icon, t, d } = passo;
  const opacity = useTransform(progress, [frac, frac + REVEAL_SPAN], [0, 1]);
  const x = useTransform(
    progress,
    [frac, frac + REVEAL_SPAN],
    [passo.side === 'left' ? -32 : 32, 0],
  );
  const style = reduce ? { gridRow: idx + 1 } : { gridRow: idx + 1, opacity, x };

  return (
    <motion.div
      className={`tl-item tl-item--${passo.side}`}
      style={style}
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
  const isMobile = useIsMobile('(max-width: 680px)');

  /* su mobile la linea è dritta a sinistra e più spessa; su desktop resta
     il percorso che serpeggia tra le card alternate */
  const path = isMobile ? M_PATH_D : PATH_D;
  const nodes = isMobile ? M_NODES : NODES;
  const viewBox = isMobile ? '0 0 40 1120' : '0 0 160 1120';
  const clipW = isMobile ? 40 : 160;
  const strokeBase = isMobile ? 3.5 : 2;
  const strokeAccent = isMobile ? 4.5 : 2.5;

  /* Linea, dot e card condividono lo stesso progresso di scroll. */
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    if (reduce) { scrollYProgress.set(1); return; }
    return watchSectionProgress(tlRef.current, value => scrollYProgress.set(value));
  }, [reduce, scrollYProgress]);
  const rectHeight = useTransform(scrollYProgress, [0, 1], [0, TOTAL]);

  return (
    <Section id="metodo" grid>
      <span aria-hidden="true" className="metodo-bulb" />

      <Head
        icon={GitBranch}
        label="Come lavoriamo"
        title="DAL PRIMO INCONTRO AL TUO CENTRO OPERATIVO IN OTTO SETTIMANE"
        sub={
          <>
            <strong>Partiamo dal lavoro che oggi ti costa più tempo.</strong>
            <br />
            Individuiamo la priorità, verifichiamo i collegamenti e realizziamo una prima versione da usare nella tua attività.
          </>
        }
      />

      <div className="tl" ref={tlRef}>
        <div className="tl__track" aria-hidden="true">
          <svg viewBox={viewBox} fill="none" className="tl__svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <clipPath id="metodo-line-clip">
                <motion.rect
                  x="0" y="0" width={clipW}
                  height={reduce ? TOTAL : rectHeight}
                />
              </clipPath>
            </defs>

            <path
              d={path}
              stroke="var(--hairline-strong)"
              strokeWidth={strokeBase}
              strokeLinecap="round"
            />

            <path
              d={path}
              stroke="var(--accent)"
              strokeWidth={strokeAccent}
              strokeLinecap="round"
              clipPath="url(#metodo-line-clip)"
            />

            {nodes.map((node, i) => (
              <NodeDot
                key={i}
                {...node}
                frac={FRAC[i]}
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
            idx={i}
            frac={FRAC[i]}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
      </div>
    </Section>
  );
}
