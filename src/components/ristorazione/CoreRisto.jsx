import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Wallet,
  Boxes,
  ScanLine,
  TrendingUp,
  ChefHat,
  CalendarClock,
  Trophy,
  MessageSquareText,
  FileSpreadsheet,
  Star,
  Puzzle as PuzzleIcon,
  Anvil,
} from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const inViewOnce = { once: true, amount: 0.3 };

function HorseIcon({ size = 15, strokeWidth = 1.75 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-chess-knight"
      aria-hidden="true"
    >
      <path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
      <path d="M16.5 18c1-2 2.5-5 2.5-9a7 7 0 0 0-7-7H6.635a1 1 0 0 0-.768 1.64L7 5l-2.32 5.802a2 2 0 0 0 .95 2.526l2.87 1.456" />
      <path d="m15 5 1.425-1.425" />
      <path d="m17 8 1.53-1.53" />
      <path d="M9.713 12.185 7 18" />
    </svg>
  );
}

function BuildCard({ icon, title, desc, accent = false, wide = false, children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      className={`buildcard card card--lg card--glow ${accent ? 'card--glow-accent buildcard--accent' : ''} ${wide ? 'buildcard--wide' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.6, ease: EASE_MODAL }}
    >
      <span className="buildcard__edge" aria-hidden="true" />
      <span className="buildcard__wash" aria-hidden="true" />
      <div className="buildcard__body">
        <div className="buildcard__head">
          <IconTile icon={icon} size="sm" accent={accent} />
          <h3 className="t-card">{title}</h3>
        </div>
        <p className="t-body buildcard__desc">{desc}</p>
      </div>
      {children ? (
        <div className="buildcard__viz" aria-hidden="true">
          {children}
        </div>
      ) : null}
    </motion.div>
  );
}

/* ── mini-viz: ogni card ha il suo widget, ma tutte condividono la stessa
   sfumatura bassa in accento sul fondo (vedi .buildcard__viz::before) ── */
function VizIncassi() {
  const bars = [52, 61, 48, 72, 66, 88, 79];
  return (
    <div className="rh-bars">
      {bars.map((h, i) => (
        <span key={i} className="rh-bars__b" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function VizMagazzino() {
  const rows = [
    { n: 'Caffè in grani', s: 'ok' },
    { n: 'Gin premium', s: 'warn' },
    { n: 'Burro', s: 'low' },
  ];
  return (
    <div className="rh-stock">
      {rows.map((r) => (
        <div className="rh-stock__row" key={r.n}>
          <span className={`rh-stock__dot rh-stock__dot--${r.s}`} />
          <span className="rh-stock__n">{r.n}</span>
          <span className={`rh-stock__tag rh-stock__tag--${r.s}`}>
            {r.s === 'ok' ? 'in stock' : r.s === 'warn' ? 'in calo' : 'sotto soglia'}
          </span>
        </div>
      ))}
    </div>
  );
}

function VizFatture() {
  const steps = ['Inquadra', 'Lettura AI', 'Conferma', 'Carico'];
  return (
    <div className="rh-flow">
      {steps.map((s, i) => (
        <span className="rh-flow__node" key={s}>
          <span className="rh-flow__num">{i + 1}</span>
          {s}
        </span>
      ))}
    </div>
  );
}

function VizFornitori() {
  const rows = [
    { n: 'Distillerie Rossi', d: '+18%' },
    { n: 'Latteria Bianchi', d: '+11%' },
  ];
  return (
    <div className="rh-alerts">
      {rows.map((r) => (
        <div className="rh-alert" key={r.n}>
          <span className="rh-alert__n">{r.n}</span>
          <span className="rh-alert__d">{r.d}</span>
        </div>
      ))}
    </div>
  );
}

function VizMenu() {
  const cells = [
    { t: 'Stelle', c: 'stella', icon: Star },
    { t: 'Puzzle', c: 'puzzle', icon: PuzzleIcon },
    { t: 'Cavalli', c: 'cavallo', icon: HorseIcon },
    { t: 'Incudini', c: 'incudine', icon: Anvil },
  ];
  return (
    <div className="rh-quad">
      {cells.map(({ t, c, icon: Icon }) => (
        <span key={t} className={`rh-quad__c rh-quad__c--${c}`}>
          <Icon size={14} strokeWidth={2} />
          {t}
        </span>
      ))}
    </div>
  );
}

const TURNI = [
  { who: 'Sara', cells: [1, 0, 2, 0, 1, 2, 0] },
  { who: 'Luca', cells: [0, 2, 0, 1, 0, 1, 2] },
  { who: 'Emma', cells: [2, 1, 0, 2, 0, 0, 1] },
];
function VizTurni() {
  return (
    <div className="rh-turni">
      {TURNI.map((r) => (
        <div className="rh-turni__row" key={r.who}>
          <span className="rh-turni__who">{r.who}</span>
          <span className="rh-turni__cells">
            {r.cells.map((c, i) => (
              <span key={i} className={`rh-turni__c ${c === 1 ? 'is-day' : c === 2 ? 'is-eve' : ''}`} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

/* voci core minori, in una striscia compatta sotto al bento */
const ALTRO = [
  { Icon: Trophy, t: 'Performance camerieri', d: 'scontrino medio, upselling e classifiche dai dati cassa' },
  { Icon: MessageSquareText, t: 'Dashboard + chat AI', d: 'sei KPI in home e una barra AI che risponde su tutto' },
  { Icon: FileSpreadsheet, t: 'Report per il commercialista', d: 'pacchetto mensile, registro fatture, chiusure cassa' },
];

export default function CoreRisto() {
  return (
    <Section id="prodotto" grid large>
      <Head
        icon={LayoutGrid}
        label="Il core · sempre incluso"
        title={<>Tutto il locale in un posto solo, aggiornato da sé</>}
        sub={
          <>
            Le funzioni che Rush fa <strong>sempre</strong>, comprese nel canone base. I moduli
            extra si accendono quando servono.
          </>
        }
      />

      <div className="build">
        <BuildCard icon={Wallet} title="Registra costi e incassi" desc="Si collega alla tua cassa e alle fatture in arrivo: incassi e spese si registrano da soli, così sai sempre quanto guadagni davvero, non a fine mese.">
          <VizIncassi />
        </BuildCard>

        <BuildCard icon={Boxes} title="Magazzino automatico" desc="Si carica dalle fatture e si scarica dalle vendite. Soglie minime, alert e scarti a fine inventario per stanare furti e sprechi.">
          <VizMagazzino />
        </BuildCard>

        <BuildCard icon={ScanLine} title="Fatture con una foto" desc="Le fatture elettroniche arrivano da sole. Le cartacee le fotografi: l'intelligenza artificiale legge articoli e prezzi, tu confermi e il magazzino si aggiorna." accent>
          <VizFatture />
        </BuildCard>

        <BuildCard icon={TrendingUp} title="Fornitori & prezzi" desc="Rush confronta ogni riga fattura con lo storico e ti avvisa quando un fornitore alza i prezzi oltre soglia. Con bozza d'ordine pronta.">
          <VizFornitori />
        </BuildCard>

        <BuildCard icon={ChefHat} title="Ricette, food cost & menu" desc="Costo materie prime per piatto aggiornato a ogni fattura, margini reali e menu engineering: stelle, puzzle, cavalli e incudini, in automatico.">
          <VizMenu />
        </BuildCard>

        <BuildCard icon={CalendarClock} title="Personale & turni AI" desc="Turni generati dall'AI su ore e vincoli, timbrature via QR con check WiFi, richieste ferie e export presenze pronto per le paghe.">
          <VizTurni />
        </BuildCard>
      </div>

      <div className="rh-altro">
        {ALTRO.map(({ Icon, t, d }) => (
          <motion.div
            key={t}
            className="rh-altro__item"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE_MODAL }}
          >
            <span className="rh-altro__ic">
              <Icon size={17} strokeWidth={1.9} />
            </span>
            <span className="rh-altro__tx">
              <strong>{t}</strong>
              {d}
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
