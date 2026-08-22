import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Receipt, Package, CreditCard, Landmark } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

/* Una curva che si ripete identica dopo 300 unità: scorrendola di
   metà larghezza il movimento non ha mai un punto di stacco. */
const LINE =
  'M 0 78 C 25 62, 45 50, 70 56 C 95 62, 110 88, 135 90 C 158 92, 172 66, 196 58 ' +
  'C 220 50, 240 70, 262 76 C 280 81, 292 80, 300 78 ' +
  'C 325 62, 345 50, 370 56 C 395 62, 410 88, 435 90 C 458 92, 472 66, 496 58 ' +
  'C 520 50, 540 70, 562 76 C 580 81, 592 80, 600 78';

const AREA = `${LINE} L 600 120 L 0 120 Z`;

/* movimenti ordinari di una settimana qualsiasi */
const ROWS = [
  { icon: Receipt, t: 'Distillerie Rossi', d: 'Fattura registrata', v: '€1.240' },
  { icon: Package, t: 'Ordine #4821', d: 'Fornitore Marchesi', v: '17 righe' },
  { icon: CreditCard, t: 'Incassi POS', d: 'Sabato 12', v: '€3.480' },
  { icon: Landmark, t: 'Banca', d: 'Movimenti riconciliati', v: '38' },
  { icon: Package, t: 'Magazzino', d: 'Riordino Campari', v: '24 pz' },
  { icon: Receipt, t: 'Bianchi & Figli', d: 'Nota di credito', v: '€310' },
];

function useRows(size = 3, ms = 4200) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % ROWS.length), ms);
    return () => clearInterval(id);
  }, [reduce, ms]);

  return Array.from({ length: size }, (_, k) => {
    const idx = (i + k) % ROWS.length;
    return { ...ROWS[idx], id: `${idx}-${Math.floor((i + k) / ROWS.length)}` };
  });
}

/* il margine sale piano, come lo vedresti salire davvero */
function useMargine(from = 28.4) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(from);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setV((n) => {
        const next = n + (Math.random() * 0.4 - 0.12);
        return Math.min(31.5, Math.max(27, next));
      });
    }, 3400);
    return () => clearInterval(id);
  }, [reduce]);

  return v.toFixed(1).replace('.', ',');
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const rows = useRows();
  const margine = useMargine();

  const drift = reduce ? {} : { y: [0, -7, 0] };

  return (
    <div className="scene" aria-hidden="true">
      <motion.div
        className="scene__panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_MODAL, delay: 0.2 }}
      >
        <motion.div
          className="scene__panel-in"
          animate={drift}
          transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}
        >
          <div className="scene__top">
            <div>
              <p className="scene__lab">Margine operativo</p>
              <p className="scene__kpi num">{margine}%</p>
            </div>
            <span className="scene__delta num">+1,8 pt</span>
          </div>

          {/* la curva scorre piano, senza inizio né fine */}
          <div className="scene__chart">
            <svg viewBox="0 0 600 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="scFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="scene__area" d={AREA} fill="url(#scFill)" />
              <path
                className="scene__line"
                d={LINE}
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="scene__rows">
            <AnimatePresence initial={false} mode="popLayout">
              {rows.map(({ id, icon: Icon, t, d, v }) => (
                <motion.div
                  className="scene__row"
                  key={id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_MODAL }}
                >
                  <span className="scene__row-ic">
                    <Icon size={13} strokeWidth={1.8} />
                  </span>
                  <span className="scene__row-txt">
                    <b>{t}</b>
                    <em>{d}</em>
                  </span>
                  <span className="scene__row-v num">{v}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* una scheda che galleggia accanto, per dare profondità */}
      <motion.div
        className="scene__chip"
        initial={{ opacity: 0, y: 16 }}
        animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.8, ease: EASE_MODAL, delay: 0.6 },
          y: { duration: 11, ease: 'easeInOut', repeat: Infinity, delay: 0.6 },
        }}
      >
        <span className="scene__chip-k">Ore recuperate</span>
        <span className="scene__chip-v num">12 / sett.</span>
      </motion.div>
    </div>
  );
}
