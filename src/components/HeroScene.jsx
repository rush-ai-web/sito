import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Receipt,
  Users,
  Wallet,
  ClipboardList,
  BarChart3,
  Sparkles,
  Moon,
  Bell,
  TrendingUp,
  TrendingDown,
  FileCheck2,
  Zap,
  MapPin,
  ChevronUp,
} from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

const logoLight = `${import.meta.env.BASE_URL}rush-logo.png`;
const logoDark = `${import.meta.env.BASE_URL}rush-logo-dark.png`;
const logoLightSrcSet = `${import.meta.env.BASE_URL}rush-logo-192.png 192w, ${import.meta.env.BASE_URL}rush-logo-320.png 320w, ${logoLight} 800w`;
const logoDarkSrcSet = `${import.meta.env.BASE_URL}rush-logo-dark-192.png 192w, ${import.meta.env.BASE_URL}rush-logo-dark-320.png 320w, ${logoDark} 800w`;

const NAV = [
  { icon: LayoutDashboard, t: 'Dashboard' },
  { icon: Boxes, t: 'Magazzino', badge: 3 },
  { icon: Truck, t: 'Fornitori', badge: 3 },
  { icon: Receipt, t: 'Fatture', badge: 2 },
  { icon: Users, t: 'Personale' },
  { icon: Wallet, t: 'Cassa' },
  { icon: ClipboardList, t: 'Ordini' },
  { icon: BarChart3, t: 'Report' },
];

const PERIODS = [
  {
    label: 'Giorno',
    xLabels: ['10h', '12h', '14h', '16h', '18h', '20h'],
    kpi: [
      { lab: 'Incassi · oggi', v: 1240, fmt: 'eur', d: '+18% vs ieri', dir: 'up', tone: 'pos' },
      { lab: 'Spese · oggi', v: 760, fmt: 'eur', d: '+6% vs ieri', dir: 'up', tone: 'neg' },
      { lab: 'Margine lordo', v: 38.7, fmt: 'pct', d: '1,4pt', dir: 'up', tone: 'pos' },
      { lab: 'Costo personale', v: 310, fmt: 'eur', d: '25% sui ricavi' },
      { lab: 'Costo acquisti', v: 29.2, fmt: 'pct', d: '0,8pt', dir: 'up', tone: 'neg' },
      { lab: 'Valore magazzino', v: 24800, fmt: 'eur', d: '−3% vs ieri', dir: 'down', tone: 'pos' },
    ],
    inc: [22, 48, 72, 56, 84, 96],
    spe: [16, 30, 44, 34, 52, 58],
  },
  {
    label: 'Settimana',
    xLabels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    kpi: [
      { lab: 'Incassi · settimana', v: 8640, fmt: 'eur', d: '+11% vs sett. prec.', dir: 'up', tone: 'pos' },
      { lab: 'Spese · settimana', v: 5080, fmt: 'eur', d: '+4% vs sett. prec.', dir: 'up', tone: 'neg' },
      { lab: 'Margine lordo', v: 41.2, fmt: 'pct', d: '3,8pt', dir: 'up', tone: 'pos' },
      { lab: 'Costo personale', v: 2180, fmt: 'eur', d: '25% sui ricavi' },
      { lab: 'Costo acquisti', v: 27.8, fmt: 'pct', d: '2,6pt', dir: 'down', tone: 'pos' },
      { lab: 'Valore magazzino', v: 26200, fmt: 'eur', d: '+2% vs sett. prec.', dir: 'up', tone: 'neg' },
    ],
    inc: [62, 74, 56, 68, 88, 96],
    spe: [40, 48, 36, 44, 54, 60],
  },
  {
    label: 'Mese',
    xLabels: ['Dic', 'Gen', 'Feb', 'Mar', 'Apr', 'Mag'],
    kpi: [
      { lab: 'Incassi · mese', v: 19240, fmt: 'eur', d: '14% vs apr', dir: 'up', tone: 'pos' },
      { lab: 'Spese · mese', v: 11510, fmt: 'eur', d: '5% vs apr', dir: 'up', tone: 'neg' },
      { lab: 'Margine lordo', v: 36.8, fmt: 'pct', d: '2,9pt', dir: 'up', tone: 'pos' },
      { lab: 'Costo personale', v: 4480, fmt: 'eur', d: '24% sui ricavi' },
      { lab: 'Costo acquisti', v: 27.4, fmt: 'pct', d: '2,1pt', dir: 'down', tone: 'pos' },
      { lab: 'Valore magazzino', v: 25400, fmt: 'eur', d: '−1% vs apr', dir: 'down', tone: 'pos' },
    ],
    inc: [60, 56, 64, 70, 80, 96],
    spe: [38, 42, 40, 44, 44, 48],
  },
];

const ALERT_POOL = [
  { id: 0, k: 'red',   t: 'Codice A-238: ultime 2 unità a scorta',   s: 'Consumo 4 pz/sett · riordina oggi' },
  { id: 1, k: 'amber', t: 'Prezzo acquisto +18% - Fornitore Rossi',  s: 'Fattura n.245 del 12 mag' },
  { id: 2, k: 'blue',  t: '2 fatture in scadenza entro 5 giorni',    s: '€1.840 · 2 fornitori' },
  { id: 3, k: 'amber', t: 'Costo acquisti +3,2pt rispetto al target', s: 'Mese in corso · verifica i fornitori' },
  { id: 4, k: 'red',   t: 'Fornitore Bianchi: nessuna consegna da 8 gg', s: 'Ordine sospeso · contatta il fornitore' },
  { id: 5, k: 'blue',  t: '2 turni scoperti nel weekend',            s: 'Sabato · nessuna conferma ricevuta' },
  { id: 6, k: 'amber', t: 'Margine su una linea sotto il 20%',       s: 'Ultimi 7 gg · controlla i prezzi di vendita' },
  { id: 7, k: 'red',   t: 'Differenza cassa: −€48 vs POS',           s: 'Rilevata ieri sera · riconciliazione richiesta' },
];

const QUERIES = [
  'chi mi ha alzato i prezzi?',
  'quanto ho speso in fornitori questo mese?',
  'quali fatture scadono a breve?',
];

function useNum(target) {
  const mv = useMotionValue(target);
  const [n, setN] = useState(target);
  const previous = useRef(target);
  useEffect(() => {
    const from = previous.current;
    previous.current = target;
    if (from === target) return undefined;
    mv.set(from);
    const c = animate(mv, target, { duration: 0.85, ease: EASE_MODAL, onUpdate: setN });
    return () => c.stop();
  }, [target, mv]);
  return n;
}

const fmt = (n, kind) =>
  kind === 'pct'
    ? `${n.toFixed(1).replace('.', ',')}%`
    : `€${Math.round(n).toLocaleString('it-IT')}`;

function Kpi({ lab, v, fmt: kind, d, dir, tone }) {
  const n = useNum(v);
  return (
    <div className="dash__kpi">
      <p className="dash__kpi-lab">{lab}</p>
      <p className="dash__kpi-val num">{fmt(n, kind)}</p>
      <span className={`dash__kpi-d ${tone ? `is-${tone}` : 'is-flat'}`}>
        {dir === 'up' && <TrendingUp size={11} strokeWidth={2.4} />}
        {dir === 'down' && <TrendingDown size={11} strokeWidth={2.4} />}
        {d}
      </span>
    </div>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const [period, setPeriod] = useState(0);
  const [alerts, setAlerts] = useState(ALERT_POOL.slice(0, 3));
  const alertIdx = useRef(3);
  const [q, setQ] = useState(0);

  const p = PERIODS[period];

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setPeriod((v) => (v + 1) % PERIODS.length), 4200);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      const next = ALERT_POOL[alertIdx.current % ALERT_POOL.length];
      alertIdx.current += 1;
      setAlerts((prev) => [next, ...prev].slice(0, 3));
    }, 3200);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setQ((v) => (v + 1) % QUERIES.length), 3600);
    return () => clearInterval(id);
  }, [reduce]);

  const maxBar = Math.max(...p.inc, ...p.spe);

  return (
    <div className="scene">
      <div className="win" aria-hidden="true">
        <div className="win__chrome">
          <span className="win__dots"><i /><i /><i /></span>
        </div>

        <div className="win__app">
          <div className="dash">
            {/* menu laterale */}
            <aside className="dash__side">
              <div className="dash__brand">
                <img className="dash__brand-logo win__logo--l" src={logoLight} srcSet={logoLightSrcSet} sizes="76px" alt="" width="800" height="200" />
                <img className="dash__brand-logo win__logo--d" src={logoDark} srcSet={logoDarkSrcSet} sizes="76px" alt="" width="800" height="200" />
                <span className="dash__brand-label">LA TUA ATTIVITÀ</span>
              </div>

              <nav className="dash__nav">
                {NAV.map(({ icon: Icon, t, badge }, i) => (
                  <span key={t} className={`dash__navitem ${i === 0 ? 'is-on' : ''}`}>
                    {i === 0 && (
                      <motion.span
                        className="dash__navhi"
                        layoutId="navhi"
                        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                      />
                    )}
                    <Icon size={15} strokeWidth={1.9} />
                    <b>{t}</b>
                    {badge && <em className="dash__badge">{badge}</em>}
                  </span>
                ))}
              </nav>

              <div className="dash__sede-sel">
                <div className="dash__sede-pop">
                  <span className="dash__sede-opt is-on"><i className="dash__sedi-dot" />Sede principale</span>
                  <span className="dash__sede-opt"><i className="dash__sedi-dot" />Filiale Via Roma</span>
                </div>
                <MapPin size={12} strokeWidth={2} />
                <span className="dash__sede-name">Sedi</span>
                <ChevronUp size={11} strokeWidth={2.5} className="dash__sede-chev" />
              </div>

              <div className="dash__user">
                <span className="dash__ava">M</span>
                <b>Mario</b>
              </div>
            </aside>

            {/* schermata principale */}
            <div className="dash__main">
              <div className="dash__top">
                <div className="dash__search">
                  <Sparkles size={14} strokeWidth={2} />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={q}
                      className="dash__search-q"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3, ease: EASE_MODAL }}
                    >
                      "{QUERIES[q]}"
                    </motion.span>
                  </AnimatePresence>
                </div>

<span className="dash__ticon"><Moon size={16} strokeWidth={1.9} /></span>
                <span className="dash__ticon dash__ticon--notif">
                  <Bell size={16} strokeWidth={1.9} />
                  <span className="dash__notif-badge">3</span>
                </span>
              </div>

              <div className="dash__scroll">
                <div className="dash__greet">
                  <h4>Buongiorno, Mario</h4>
                  <p>Maggio 2026 · ecco come va la tua attività in questo momento</p>
                </div>

                <div className="dash__kpis">
                  {p.kpi.map((k) => (
                    <Kpi key={k.lab} {...k} />
                  ))}
                </div>

                <div className="dash__grid">
                  {/* grafico */}
                  <div className="dash__panel">
                    <div className="dash__panel-hd">
                      <h5>Incassi vs spese - ultimi 6 periodi</h5>
                      <span className="dash__legend">
                        <span className="dash__leg is-inc"><i />Incassi</span>
                        <span className="dash__leg is-spe"><i />Spese</span>
                      </span>
                    </div>
                    <div className="dash__chart">
                      {p.xLabels.map((m, i) => (
                        <div
                          className={`dash__month ${i === p.xLabels.length - 1 ? 'is-on' : ''}`}
                          key={`${period}-${m}`}
                        >
                          <div className="dash__pair">
                            <motion.span
                              className="dash__bar is-inc"
                              initial={false}
                              animate={{ height: `${(p.inc[i] / maxBar) * 100}%` }}
                              transition={{ duration: 0.7, ease: EASE_MODAL, delay: i * 0.04 }}
                            />
                            <motion.span
                              className="dash__bar is-spe"
                              initial={false}
                              animate={{ height: `${(p.spe[i] / maxBar) * 100}%` }}
                              transition={{ duration: 0.7, ease: EASE_MODAL, delay: i * 0.04 + 0.05 }}
                            />
                          </div>
                          <span className="dash__month-l">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* alert */}
                  <div className="dash__panel">
                    <div className="dash__panel-hd">
                      <h5>Alert e anomalie - da gestire</h5>
                    </div>
                    <div className="dash__alerts">
                      <AnimatePresence initial={false} mode="popLayout">
                        {alerts.map(({ id, k, t, s: sub }) => (
                          <motion.div
                            className={`dash__alert is-${k}`}
                            key={id}
                            layout
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.34, ease: EASE_MODAL }}
                          >
                            <span className="dash__alert-dot" />
                            <span className="dash__alert-t">
                              <b>{t}</b>
                              <em>{sub}</em>
                            </span>
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
      </div>

      {/* schede fluttuanti */}
      <motion.div
        className="sat sat--l"
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [-7, 7] }}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 0.9 },
          y: { duration: 4.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 0.9 },
        }}
        aria-hidden="true"
      >
        <span className="sat__ic is-ok"><FileCheck2 size={15} strokeWidth={2} /></span>
        <span className="sat__t">
          <b>Margine netto +14%</b>
          <em>miglior mese dell'anno</em>
        </span>
      </motion.div>

      <motion.div
        className="sat sat--r"
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [7, -7] }}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 1.1 },
          y: { duration: 5.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 1.1 },
        }}
        aria-hidden="true"
      >
        <span className="sat__ic is-accent"><Zap size={15} strokeWidth={2} /></span>
        <span className="sat__t">
          <b>Fornitore sincronizzato</b>
          <em>listino aggiornato in automatico</em>
        </span>
      </motion.div>

      <motion.div
        className="sat sat--bl"
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [5, -5] }}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 1.3 },
          y: { duration: 5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: 1.3 },
        }}
        aria-hidden="true"
      >
        <span className="sat__ic is-warn"><TrendingDown size={15} strokeWidth={2} /></span>
        <span className="sat__t">
          <b>Riordino urgente</b>
          <em>3 articoli sotto soglia minima</em>
        </span>
      </motion.div>
    </div>
  );
}
