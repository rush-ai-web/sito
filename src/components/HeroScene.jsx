import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  CreditCard,
  Receipt,
  Boxes,
  Landmark,
  Sparkles,
  FileText,
  Zap,
  Link2,
} from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

/* Le fonti scollegate che oggi vivono ognuna per conto suo.
   Stanno in alto, leggermente fuori asse: è il "prima". */
const SOURCES = [
  { icon: CreditCard, t: 'Cassa', x: 88, tilt: -2.5 },
  { icon: Receipt, t: 'Fatture', x: 208, tilt: 1.8 },
  { icon: Boxes, t: 'Magazzino', x: 320, tilt: -1.4 },
  { icon: Landmark, t: 'Banca', x: 440, tilt: 2.2 },
];

/* I fili che portano ogni fonte dentro al nucleo, più il tronco
   che scende verso i risultati. Coordinate sul viewBox 520×470. */
const WIRES = [
  'M 88 82 C 88 140, 200 158, 246 180',
  'M 208 82 C 208 132, 236 158, 254 180',
  'M 320 82 C 320 132, 288 158, 266 180',
  'M 440 82 C 440 140, 328 158, 274 180',
];

/* Quello che esce dal sistema: documenti letti dall'AI, automazioni
   che scattano, sistemi che restano allineati. Scorre all'infinito. */
const EVENTS = [
  { k: 'ai', icon: FileText, t: 'Fattura Rossi SRL · letta e registrata', v: '€1.240' },
  { k: 'auto', icon: Zap, t: 'Campari sotto soglia · ordine creato', v: 'auto' },
  { k: 'sync', icon: Link2, t: 'Incassi POS · sincronizzati', v: '38 mov.' },
  { k: 'ai', icon: FileText, t: 'DDT Bianchi · anomalia prezzo', v: '+8%' },
  { k: 'auto', icon: Zap, t: 'Scadenza fornitore · promemoria', v: '3 gg' },
  { k: 'sync', icon: Link2, t: 'Estratto conto · riconciliato', v: '12 mov.' },
  { k: 'ai', icon: FileText, t: 'Ordine #4821 · dati estratti', v: '17 righe' },
  { k: 'auto', icon: Zap, t: 'Turni coperti · squadra avvisata', v: 'ok' },
];

/* tre righe alla volta, che si rinnovano una dopo l'altra */
function useEventFeed(size = 3, ms = 2300) {
  const reduce = useReducedMotion();
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStart((i) => (i + 1) % EVENTS.length), ms);
    return () => clearInterval(id);
  }, [reduce, ms]);

  return Array.from({ length: size }, (_, k) => {
    const i = (start + k) % EVENTS.length;
    return { ...EVENTS[i], id: `${i}-${Math.floor((start + k) / EVENTS.length)}` };
  });
}

/* contatore che sale piano: il sistema sta lavorando anche adesso */
function useTicker(from = 1284) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(from);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setN((v) => v + 1 + Math.floor(Math.random() * 2)), 2100);
    return () => clearInterval(id);
  }, [reduce]);

  return n;
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const feed = useEventFeed();
  const elaborati = useTicker();

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_MODAL, delay: 0.25 }}
      aria-hidden="true"
    >
      {/* maglia di fondo e passata di luce */}
      <span className="scene__mesh" />
      <span className="scene__scan" />

      {/* etichetta di stato */}
      <div className="scene__head">
        <span className="scene__dot" />
        Sistema in funzione
      </div>

      {/* i fili che collegano fonti → nucleo → risultati */}
      <svg className="scene__wires" viewBox="0 0 520 470" fill="none">
        {WIRES.map((d, i) => (
          <g key={d}>
            <path className="wire" d={d} pathLength="100" />
            <path
              className="wire wire--pulse"
              d={d}
              pathLength="100"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          </g>
        ))}
        <path className="wire" d="M 260 268 L 260 306" pathLength="100" />
        <path
          className="wire wire--pulse wire--trunk"
          d="M 260 268 L 260 306"
          pathLength="100"
        />
      </svg>

      {/* le fonti: sparse e fuori asse, ognuna col suo respiro */}
      {SOURCES.map(({ icon: Icon, t, x, tilt }, i) => (
        <motion.div
          key={t}
          className="scene__src"
          style={{ left: `${(x / 520) * 100}%`, rotate: `${tilt}deg` }}
          animate={reduce ? {} : { y: [0, -4, 0] }}
          transition={{ duration: 4.6 + i * 0.5, ease: 'easeInOut', repeat: Infinity, delay: i * 0.4 }}
        >
          <span className="scene__src-ic" style={{ animationDelay: `${i * 0.8}s` }}>
            <Icon size={13} strokeWidth={1.9} />
          </span>
          {t}
        </motion.div>
      ))}

      {/* il nucleo: anello d'accento che gira, aloni che si espandono */}
      <div className="scene__core">
        <span className="scene__ring" />
        <span className="scene__halo" />
        <span className="scene__halo scene__halo--2" />
        <span className="scene__core-in">
          <Sparkles size={20} strokeWidth={1.75} />
        </span>
      </div>

      {/* i risultati: ordinati, uno dopo l'altro, sempre */}
      <div className="scene__feed">
        <AnimatePresence initial={false} mode="popLayout">
          {feed.map(({ id, k, icon: Icon, t, v }) => (
            <motion.div
              key={id}
              className={`scene__row is-${k}`}
              layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.42, ease: EASE_MODAL }}
            >
              <span className="scene__row-ic">
                <Icon size={12} strokeWidth={2} />
              </span>
              <span className="scene__row-t">{t}</span>
              <span className="scene__row-v num">{v}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* piede: quanto ha già macinato, e il polso del sistema */}
      <div className="scene__foot">
        <span>
          Elaborati oggi <b className="num">{elaborati.toLocaleString('it-IT')}</b>
        </span>
        <span className="scene__bars">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
    </motion.div>
  );
}
