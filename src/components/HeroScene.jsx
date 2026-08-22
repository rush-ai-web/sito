import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

/* Gli stessi numeri visti su tre finestre temporali: cambiando
   periodo tutto si ricalcola, che è il punto di avere i dati veri. */
const PERIODI = [
  {
    k: 'Oggi',
    kpi: [
      { lab: 'Utile netto', v: 4280, fmt: 'eur', d: '+12,4%', tone: 'up' },
      { lab: 'Costo personale', v: 1140, fmt: 'eur', d: '26,6% ric.', tone: 'flat' },
      { lab: 'Materie prime', v: 28.4, fmt: 'pct', d: '−1,5 pt', tone: 'up' },
    ],
    bars: [42, 58, 36, 70, 52, 88, 64],
  },
  {
    k: 'Settimana',
    kpi: [
      { lab: 'Utile netto', v: 26500, fmt: 'eur', d: '+8,1%', tone: 'up' },
      { lab: 'Costo personale', v: 7980, fmt: 'eur', d: '30,1% ric.', tone: 'flat' },
      { lab: 'Materie prime', v: 27.9, fmt: 'pct', d: '−0,8 pt', tone: 'up' },
    ],
    bars: [55, 40, 72, 48, 84, 60, 92],
  },
  {
    k: 'Mese',
    kpi: [
      { lab: 'Utile netto', v: 112400, fmt: 'eur', d: '+14,2%', tone: 'up' },
      { lab: 'Costo personale', v: 34200, fmt: 'eur', d: '30,4% ric.', tone: 'flat' },
      { lab: 'Materie prime', v: 28.1, fmt: 'pct', d: '−2,1 pt', tone: 'up' },
    ],
    bars: [38, 64, 50, 78, 44, 68, 96],
  },
];

/* il flusso che entra nel sistema mentre guardi */
const LOG = [
  { t: 'POS · scontrino #4821', v: '+€180', k: 'in' },
  { t: 'Distillerie Rossi · fatt. 1204', v: '−€1.240', k: 'out' },
  { t: 'Turno Marco B. · 8h', v: '−€96', k: 'out' },
  { t: 'Campari 1L · sotto soglia', v: 'riordino', k: 'auto' },
  { t: 'Banca · accredito', v: '+€2.310', k: 'in' },
  { t: 'Energia · bolletta 07', v: '−€430', k: 'out' },
  { t: 'POS · scontrino #4822', v: '+€64', k: 'in' },
  { t: 'Bianchi & Figli · DDT', v: '17 righe', k: 'auto' },
];

const SYNC = ['Cassa', 'Banca', 'Fatture', 'Magazzino', 'Presenze'];

/* numero che corre verso il nuovo valore quando cambia periodo */
function useNum(target) {
  const mv = useMotionValue(target);
  const [n, setN] = useState(target);

  useEffect(() => {
    const c = animate(mv, target, {
      duration: 0.85,
      ease: EASE_MODAL,
      onUpdate: (v) => setN(v),
    });
    return () => c.stop();
  }, [target, mv]);

  return n;
}

function fmt(n, kind) {
  return kind === 'pct'
    ? `${n.toFixed(1).replace('.', ',')}%`
    : `€${Math.round(n).toLocaleString('it-IT')}`;
}

function Kpi({ lab, v, fmt: kind, d, tone }) {
  const n = useNum(v);
  return (
    <div className="win__kpi">
      <p className="win__kpi-lab">{lab}</p>
      <p className="win__kpi-val num">{fmt(n, kind)}</p>
      <p className={`win__kpi-d num is-${tone}`}>{d}</p>
    </div>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [hot, setHot] = useState(5);
  const [feed, setFeed] = useState(0);
  const [syncI, setSyncI] = useState(3);

  const periodo = PERIODI[tab];

  /* i tab girano da soli: ogni periodo si mostra a turno */
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTab((t) => (t + 1) % PERIODI.length), 5200);
    return () => clearInterval(id);
  }, [reduce]);

  /* la colonna evidenziata si sposta */
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setHot((h) => (h + 3) % 7), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  /* il registro scorre in continuo */
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setFeed((f) => (f + 1) % LOG.length), 1900);
    return () => clearInterval(id);
  }, [reduce]);

  /* la sincronizzazione avanza da una fonte all'altra */
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setSyncI((s) => (s + 1) % SYNC.length), 2800);
    return () => clearInterval(id);
  }, [reduce]);

  const rows = Array.from({ length: 5 }, (_, k) => {
    const i = (feed + k) % LOG.length;
    return { ...LOG[i], id: `${i}-${Math.floor((feed + k) / LOG.length)}` };
  });

  return (
    <div className="scene" aria-hidden="true">
      <span className="scene__glow" />

      <motion.div
        className="win"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_MODAL, delay: 0.2 }}
      >
        {/* barra della finestra */}
        <div className="win__bar">
          <span className="win__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="win__path">
            rush<em>/</em>conto economico<span className="win__caret" />
          </span>
          <span className="win__tabs">
            {PERIODI.map((p, i) => (
              <button
                key={p.k}
                className={`win__tab ${i === tab ? 'is-on' : ''}`}
                onClick={() => setTab(i)}
                tabIndex={-1}
              >
                {i === tab && <motion.span className="win__tab-bg" layoutId="tabbg" />}
                <span>{p.k}</span>
              </button>
            ))}
          </span>
        </div>

        {/* i numeri che contano davvero */}
        <div className="win__kpis">
          {periodo.kpi.map((k) => (
            <Kpi key={k.lab} {...k} />
          ))}
        </div>

        <div className="win__body">
          {/* andamento */}
          <div className="win__chart">
            <div className="win__chart-hd">
              <span>Utile per giorno</span>
              <span className="num">{periodo.k.toLowerCase()}</span>
            </div>
            <div className="win__bars">
              {periodo.bars.map((h, i) => (
                <span className={`win__bar-w ${i === hot ? 'is-hot' : ''}`} key={i}>
                  {i === hot && (
                    <motion.span className="win__tip num" layoutId="tip">
                      €{(h * 62).toLocaleString('it-IT')}
                    </motion.span>
                  )}
                  <motion.i
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.7, ease: EASE_MODAL, delay: i * 0.035 }}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* registro live */}
          <div className="win__log">
            <div className="win__chart-hd">
              <span>Movimenti</span>
              <span className="win__live">live</span>
            </div>
            <div className="win__log-rows">
              <AnimatePresence initial={false} mode="popLayout">
                {rows.map(({ id, t, v, k }) => (
                  <motion.div
                    className={`win__lr is-${k}`}
                    key={id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.34, ease: EASE_MODAL }}
                  >
                    <span className="win__lr-t">{t}</span>
                    <span className="win__lr-v num">{v}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* le fonti che restano allineate */}
        <div className="win__foot">
          {SYNC.map((s, i) => (
            <span key={s} className={`win__src ${i === syncI ? 'is-run' : ''}`}>
              {i === syncI ? (
                <Loader size={10} strokeWidth={2.4} className="win__spin" />
              ) : (
                <Check size={10} strokeWidth={3} />
              )}
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      {/* schede che galleggiano fuori dalla finestra */}
      <motion.div
        className="fcard fcard--a"
        initial={{ opacity: 0, y: 14 }}
        animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -9, 0] }}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 0.7 },
          y: { duration: 9, ease: 'easeInOut', repeat: Infinity, delay: 0.7 },
        }}
      >
        <span className="fcard__k">Ore recuperate</span>
        <span className="fcard__v num">12 / sett.</span>
      </motion.div>

      <motion.div
        className="fcard fcard--b"
        initial={{ opacity: 0, y: 14 }}
        animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 0.9 },
          y: { duration: 11, ease: 'easeInOut', repeat: Infinity, delay: 0.9 },
        }}
      >
        <span className="fcard__dot" />
        <span className="fcard__k">
          Riordino avviato
          <b>Campari 1L · 24 pz</b>
        </span>
      </motion.div>
    </div>
  );
}
