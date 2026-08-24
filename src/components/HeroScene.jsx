import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import {
  Check,
  Loader,
  LayoutDashboard,
  Receipt,
  Boxes,
  Clock3,
  Truck,
  Zap,
  FileCheck2,
  TrendingUp,
} from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

const logoLight = `${import.meta.env.BASE_URL}rush-logo.png`;
const logoDark = `${import.meta.env.BASE_URL}rush-logo-dark.png`;

const MENU = [
  { icon: LayoutDashboard, t: 'Riepilogo', on: true },
  { icon: Receipt, t: 'Fatture' },
  { icon: Boxes, t: 'Magazzino' },
  { icon: Clock3, t: 'Presenze' },
  { icon: Truck, t: 'Fornitori' },
];

const PERIODI = [
  {
    k: 'Giorno',
    kpi: [
      { lab: 'Utile netto', v: 4280, fmt: 'eur', d: '+12,4%', tone: 'up' },
      { lab: 'Personale', v: 1140, fmt: 'eur', d: '26,6% sui ricavi' },
      { lab: 'Materie prime', v: 28.4, fmt: 'pct', d: '−1,5 pt', tone: 'up' },
    ],
    bars: [42, 58, 36, 70, 52, 88, 64, 76, 60, 82],
    top: 7,
    alert: 'Le materie prime ti costano il 12% in più',
  },
  {
    k: 'Settimana',
    kpi: [
      { lab: 'Utile netto', v: 26500, fmt: 'eur', d: '+8,1%', tone: 'up' },
      { lab: 'Personale', v: 7980, fmt: 'eur', d: '30,1% sui ricavi' },
      { lab: 'Materie prime', v: 27.9, fmt: 'pct', d: '−0,8 pt', tone: 'up' },
    ],
    bars: [55, 40, 72, 48, 84, 60, 92, 68, 76, 88],
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
    bars: [38, 64, 50, 78, 44, 68, 96, 72, 58, 84],
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

  const rows = Array.from({ length: 4 }, (_, k) => {
    const i = (feed + k) % LOG.length;
    return { ...LOG[i], id: `${i}-${Math.floor((feed + k) / LOG.length)}` };
  });

  const float = (up) => (reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: up ? [0, -10, 0] : [0, 10, 0] });

  return (
    <div className="scene">
      <div className="win" aria-hidden="true">
        {/* la cornice: solo il semaforo, fuori dall'applicazione */}
        <div className="win__chrome">
          <span className="win__dots">
            <i />
            <i />
            <i />
          </span>
        </div>

        {/* l'applicazione, dentro alla cornice */}
        <div className="win__app">
          <div className="win__topbar">
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

          <div className="win__body">
          {/* menu laterale */}
          <div className="win__side">
            {MENU.map(({ icon: Icon, t, on }) => (
              <span className={`win__nav ${on ? 'is-on' : ''}`} key={t}>
                <Icon size={14} strokeWidth={1.9} />
                {t}
              </span>
            ))}
            <div className="win__side-foot">
              {FONTI.map((f, i) => (
                <span key={f} className={`win__src ${i === fonte ? 'is-run' : ''}`}>
                  {i === fonte ? (
                    <Loader size={9} strokeWidth={2.6} className="win__spin" />
                  ) : (
                    <Check size={9} strokeWidth={3.2} />
                  )}
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* schermata */}
          <div className="win__main">
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

            <div className="win__split">
              <div className="win__sec">
                <div className="win__hd">Utile per giorno</div>
                <div className="win__bars">
                  {p.bars.map((h, i) => (
                    <span className={`win__col ${i === p.top ? 'is-top' : ''}`} key={i}>
                      <motion.i
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.7, ease: EASE_MODAL, delay: i * 0.035 }}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <div className="win__sec win__sec--rows">
                <div className="win__hd">Ultimi movimenti</div>
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
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* quello che succede da solo, ai lati della finestra */}
      <motion.div
        className="sat sat--l"
        initial={{ opacity: 0, y: 14 }}
        animate={float(true)}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 0.9 },
          y: { duration: 9, ease: 'easeInOut', repeat: Infinity, delay: 0.9 },
        }}
        aria-hidden="true"
      >
        <span className="sat__ic is-ok">
          <FileCheck2 size={15} strokeWidth={2} />
        </span>
        <span className="sat__t">
          <b>Fattura registrata</b>
          <em>senza toccare niente</em>
        </span>
      </motion.div>

      <motion.div
        className="sat sat--r"
        initial={{ opacity: 0, y: 14 }}
        animate={float(false)}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 1.1 },
          y: { duration: 11, ease: 'easeInOut', repeat: Infinity, delay: 1.1 },
        }}
        aria-hidden="true"
      >
        <span className="sat__ic is-accent">
          <Zap size={15} strokeWidth={2} />
        </span>
        <span className="sat__t">
          <b>Ordine al fornitore</b>
          <em>partito da solo</em>
        </span>
      </motion.div>

      <motion.div
        className="sat sat--bl"
        initial={{ opacity: 0, y: 14 }}
        animate={float(true)}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 1.3 },
          y: { duration: 10, ease: 'easeInOut', repeat: Infinity, delay: 1.3 },
        }}
        aria-hidden="true"
      >
        <span className="sat__ic is-ok">
          <TrendingUp size={15} strokeWidth={2} />
        </span>
        <span className="sat__t">
          <b>Margine in crescita</b>
          <em>+14% questo mese</em>
        </span>
      </motion.div>
    </div>
  );
}
