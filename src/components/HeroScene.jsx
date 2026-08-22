import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { Check, Loader, Zap, Timer, FileCheck2 } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

/* il marchio su fondo bianco per il tema chiaro, su fondo nero per lo scuro */
const logoLight = `${import.meta.env.BASE_URL}rush-logo.png`;
const logoDark = `${import.meta.env.BASE_URL}rush-logo-dark.png`;

/* Gli stessi conti su tre finestre temporali: cambiando periodo
   tutto si ricalcola, che è il punto di avere i dati veri. */
const PERIODI = [
  {
    k: 'Giorno',
    kpi: [
      { lab: 'Utile netto', v: 4280, fmt: 'eur', d: '+12,4%', tone: 'up' },
      { lab: 'Personale', v: 1140, fmt: 'eur', d: '26,6% sui ricavi' },
      { lab: 'Materie prime', v: 28.4, fmt: 'pct', d: '−1,5 pt', tone: 'up' },
    ],
    bars: [42, 58, 36, 70, 52, 88, 64, 76],
    top: 5,
    alert: 'Le materie prime ti costano il 12% in più',
  },
  {
    k: 'Settimana',
    kpi: [
      { lab: 'Utile netto', v: 26500, fmt: 'eur', d: '+8,1%', tone: 'up' },
      { lab: 'Personale', v: 7980, fmt: 'eur', d: '30,1% sui ricavi' },
      { lab: 'Materie prime', v: 27.9, fmt: 'pct', d: '−0,8 pt', tone: 'up' },
    ],
    bars: [55, 40, 72, 48, 84, 60, 92, 68],
    top: 6,
    alert: 'Venerdì scadono 3 fatture da pagare',
  },
  {
    k: 'Mese',
    kpi: [
      { lab: 'Utile netto', v: 112400, fmt: 'eur', d: '+14,2%', tone: 'up' },
      { lab: 'Personale', v: 34200, fmt: 'eur', d: '30,4% sui ricavi' },
      { lab: 'Materie prime', v: 28.1, fmt: 'pct', d: '−2,1 pt', tone: 'up' },
    ],
    bars: [38, 64, 50, 78, 44, 68, 96, 72],
    top: 6,
    alert: 'Stanno finendo 2 prodotti in magazzino',
  },
];

const LOG = [
  { t: 'Distillerie Rossi', s: 'Fattura registrata', v: '−€1.240' },
  { t: 'Turno Marco B.', s: 'Presenze · 8 ore', v: '−€96' },
  { t: 'Campari 1L', s: 'Riordino creato', v: '24 pz', k: 'auto' },
  { t: 'Banca', s: 'Accredito riconciliato', v: '+€2.310', k: 'in' },
  { t: 'Incassi POS', s: 'Chiusura serale', v: '+€3.480', k: 'in' },
  { t: 'Bianchi & Figli', s: 'Documento letto', v: 'ok', k: 'auto' },
];

const FONTI = ['Cassa', 'Banca', 'Fatture', 'Magazzino'];

function useNum(target) {
  const mv = useMotionValue(target);
  const [n, setN] = useState(target);
  useEffect(() => {
    const c = animate(mv, target, { duration: 0.85, ease: EASE_MODAL, onUpdate: setN });
    return () => c.stop();
  }, [target, mv]);
  return n;
}

const fmt = (n, kind) =>
  kind === 'pct'
    ? `${n.toFixed(1).replace('.', ',')}%`
    : `€${Math.round(n).toLocaleString('it-IT')}`;

function Kpi({ lab, v, fmt: kind, d, tone }) {
  const n = useNum(v);
  return (
    <div className="win__kpi">
      <p className="win__kpi-lab">{lab}</p>
      <p className="win__kpi-val num">{fmt(n, kind)}</p>
      <p className={`win__kpi-d num ${tone === 'up' ? 'is-up' : ''}`}>{d}</p>
    </div>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [feed, setFeed] = useState(0);
  const [fonte, setFonte] = useState(2);

  const p = PERIODI[tab];

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTab((t) => (t + 1) % PERIODI.length), 5400);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setFeed((f) => (f + 1) % LOG.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setFonte((s) => (s + 1) % FONTI.length), 3000);
    return () => clearInterval(id);
  }, [reduce]);

  const rows = Array.from({ length: 2 }, (_, k) => {
    const i = (feed + k) % LOG.length;
    return { ...LOG[i], id: `${i}-${Math.floor((feed + k) / LOG.length)}` };
  });

  /* le schede che orbitano attorno alla finestra */
  const sat = (i) => (reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, i % 2 ? 9 : -9, 0] });

  const satT = (i, d) => ({
    opacity: { duration: 0.7, ease: EASE_MODAL, delay: d },
    y: { duration: 9 + i * 1.6, ease: 'easeInOut', repeat: Infinity, delay: d },
  });

  return (
    <div className="scene" aria-hidden="true">
      <span className="scene__mesh" />
      <span className="scene__glow" />

      <motion.div
        className="win"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_MODAL, delay: 0.2 }}
      >
        {/* la cornice: semaforo, marchio, periodo */}
        <div className="win__chrome">
          <span className="win__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="win__brand">
            <img className="win__logo win__logo--l" src={logoLight} alt="" />
            <img className="win__logo win__logo--d" src={logoDark} alt="" />
          </span>
          <span className="win__tabs">
            {PERIODI.map((x, i) => (
              <button
                key={x.k}
                className={`win__tab ${i === tab ? 'is-on' : ''}`}
                onClick={() => setTab(i)}
                tabIndex={-1}
              >
                {i === tab && <motion.span className="win__tab-bg" layoutId="tabbg" />}
                <span>{x.k}</span>
              </button>
            ))}
          </span>
        </div>

        {/* lo schermo, dentro alla cornice */}
        <div className="win__screen">
          <div className="win__kpis">
            {p.kpi.map((k) => (
              <Kpi key={k.lab} {...k} />
            ))}
          </div>

          <div className="win__alert">
            <AnimatePresence mode="wait">
              <motion.span
                key={p.alert}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, ease: EASE_MODAL }}
              >
                {p.alert}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="win__sec">
            <div className="win__hd">
              <span>Utile per giorno</span>
            </div>
            <div className="win__bars">
              {p.bars.map((h, i) => (
                <span className={`win__col ${i === p.top ? 'is-top' : ''}`} key={i}>
                  <motion.i
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.7, ease: EASE_MODAL, delay: i * 0.04 }}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="win__sec win__sec--rows">
            <div className="win__rows">
              <AnimatePresence initial={false} mode="popLayout">
                {rows.map(({ id, t, s, v, k }) => (
                  <motion.div
                    className={`win__row ${k ? `is-${k}` : ''}`}
                    key={id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_MODAL }}
                  >
                    <span className="win__row-t">
                      <b>{t}</b>
                      <em>{s}</em>
                    </span>
                    <span className="win__row-v num">{v}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="win__foot">
            {FONTI.map((f, i) => (
              <span key={f} className={`win__src ${i === fonte ? 'is-run' : ''}`}>
                {i === fonte ? (
                  <Loader size={10} strokeWidth={2.4} className="win__spin" />
                ) : (
                  <Check size={10} strokeWidth={3} />
                )}
                {f}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* quello che succede attorno, senza che tu faccia niente */}
      <motion.div
        className="sat sat--a"
        initial={{ opacity: 0, y: 12 }}
        animate={sat(0)}
        transition={satT(0, 0.7)}
      >
        <span className="sat__ic is-ok">
          <FileCheck2 size={14} strokeWidth={2} />
        </span>
        <span className="sat__t">
          <b>Fattura registrata</b>
          <em>senza toccare niente</em>
        </span>
      </motion.div>

      <motion.div
        className="sat sat--b"
        initial={{ opacity: 0, y: 12 }}
        animate={sat(1)}
        transition={satT(1, 0.9)}
      >
        <span className="sat__ic is-accent">
          <Zap size={14} strokeWidth={2} />
        </span>
        <span className="sat__t">
          <b>Ordine al fornitore</b>
          <em>partito da solo</em>
        </span>
      </motion.div>

      <motion.div
        className="sat sat--c"
        initial={{ opacity: 0, y: 12 }}
        animate={sat(2)}
        transition={satT(2, 1.1)}
      >
        <span className="sat__ic">
          <Timer size={14} strokeWidth={2} />
        </span>
        <span className="sat__t">
          <b className="num">12 ore</b>
          <em>in meno ogni settimana</em>
        </span>
      </motion.div>
    </div>
  );
}
