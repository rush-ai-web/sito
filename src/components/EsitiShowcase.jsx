import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Gauge, ShieldCheck, Sparkles, CalendarClock, Boxes, Receipt, TrendingDown, Lightbulb } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

const ROTATE_MS = 6000;

/* ============================================================
   Esiti - showcase interattivo.
   A sinistra tre esiti selezionabili (auto-avanzano con una barra
   di avanzamento); a destra un palco che mostra una scena viva per
   l'esito attivo. Le scene sono costruite in HTML + un piccolo SVG
   per i grafici, così restano allineate al pixel e nei bordi.
   Tutto sui token del sito, coerente light/dark, fermo in
   prefers-reduced-motion.
   ============================================================ */

/* ── scena 1 · L'azienda a colpo d'occhio (mini dashboard live) ── */
function SceneDash({ reduce }) {
  const line =
    'M0,74 C44,68 60,46 96,50 C134,54 148,74 186,66 C222,58 236,30 276,24 C288,20 296,24 300,22';
  const area = `${line} L300,92 L0,92 Z`;
  return (
    <div className="sc-dash">
      <div className="sc-dash__tiles">
        <div className="sc-stat">
          <span className="sc-stat__k">Margine</span>
          <span className="sc-stat__v sc-accent">+18%</span>
          <span className="sc-stat__s">vs mese scorso</span>
        </div>
        <div className="sc-stat">
          <span className="sc-stat__k">Incassi mese</span>
          <span className="sc-stat__v">€ 42,8k</span>
          <span className="sc-stat__s">aggiornato ora</span>
        </div>
      </div>
      <div className="sc-dash__chart">
        <svg viewBox="0 0 300 100" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 52, 74].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="var(--hairline)" strokeWidth="1" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
          ))}
          <motion.path
            d={area}
            fill="url(#dashFill)"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? {} : { opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.4 }}
          />
          <motion.path
            id="dashLine"
            d={line}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? {} : { opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE_MODAL, delay: 0.15 }}
          />
          {!reduce && (
            <circle r="3.4" fill="var(--accent)" stroke="var(--surface-top)" strokeWidth="1.4" vectorEffect="non-scaling-stroke">
              <animateMotion dur="3.4s" begin="1s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                <mpath href="#dashLine" />
              </animateMotion>
            </circle>
          )}
        </svg>
      </div>
    </div>
  );
}

/* ── scena 2 · Niente più cose che sfuggono (il sistema vigila) ── */
const AROWS = [
  { Icon: CalendarClock, t: 'Scadenza F24', s: 'tra 6 giorni', state: 'ok' },
  { Icon: Boxes, t: 'Scorta caffè', s: 'sotto soglia', state: 'alert' },
  { Icon: Receipt, t: 'Fattura #182', s: 'registrata da sola', state: 'ok' },
];

function SceneWatch({ reduce }) {
  return (
    <div className="sc-watch">
      {AROWS.map(({ Icon, t, s, state }, i) => (
        <div
          className={`sc-row ${state === 'alert' ? 'sc-row--alert' : ''}`}
          key={t}
          style={reduce ? undefined : { animation: `scRowIn .5s ${0.15 + i * 0.16}s both var(--e-lift)` }}
        >
          <span className="sc-row__ic">
            <Icon size={16} strokeWidth={1.9} />
          </span>
          <span className="sc-row__tx">
            <b>{t}</b>
            <em>{s}</em>
          </span>
          {state === 'alert' ? (
            <span className="sc-row__flag">
              <span className="sc-row__pulse" />
              da rifornire
            </span>
          ) : (
            <span className="sc-row__ok">
              <ShieldCheck size={15} strokeWidth={2} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── scena 3 · Testa solo al business (l'AI trova e suggerisce) ── */
function SceneAI({ reduce }) {
  const drop = 'M8,12 C34,16 46,22 66,28 C88,34 102,40 128,46 C150,51 168,54 192,58';
  return (
    <div className="sc-ai">
      <div className="sc-ai__head">
        <span className="sc-ai__badge">
          <Sparkles size={14} strokeWidth={2} />
          Rush AI
        </span>
        <span className="sc-ai__status">
          {!reduce && <span className="sc-ai__ping" />}
          ha analizzato i tuoi numeri
        </span>
      </div>

      <div className="sc-ai__insight">
        <div className="sc-ai__insight-tx">
          <span className="sc-ai__insight-k">Margine · Reparto bar</span>
          <span className="sc-ai__insight-v">
            <TrendingDown size={15} strokeWidth={2.2} />
            −6% questo mese
          </span>
        </div>
        <svg className="sc-ai__spark" viewBox="0 0 200 70" fill="none" preserveAspectRatio="none">
          <motion.path
            d={drop}
            stroke="var(--neg)"
            strokeWidth="2.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? {} : { opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE_MODAL, delay: 0.25 }}
          />
          <circle cx="192" cy="58" r="3.4" fill="var(--neg)" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="sc-ai__suggest">
        <span className="sc-ai__suggest-ic">
          <Lightbulb size={15} strokeWidth={2} />
        </span>
        <span>
          <b>Guarda qui:</b> i costi del bar salgono più dei ricavi. Rivedi i prezzi o i fornitori.
        </span>
      </div>
    </div>
  );
}

const ESITI = [
  {
    icon: Gauge,
    t: 'L’azienda a colpo d’occhio',
    d: 'Margini, incassi e scorte sempre aggiornati: sai come stai andando quando vuoi, senza aspettare la chiamata del commercialista.',
    Scene: SceneDash,
  },
  {
    icon: ShieldCheck,
    t: 'Niente più cose che sfuggono',
    d: 'Scadenze, errori e scorte sotto soglia li nota il sistema prima di te. Meno stress da dimenticanze, più notti tranquille.',
    Scene: SceneWatch,
  },
  {
    icon: Sparkles,
    t: 'Testa solo al business',
    d: 'Prendi le decisioni che contano con l’AI che analizza i numeri insieme a te e ti dice, in chiaro, dove intervenire.',
    Scene: SceneAI,
    accent: true,
  },
];

export default function EsitiShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % ESITI.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce, active]);

  const Scene = ESITI[active].Scene;

  return (
    <motion.div
      className="esiti"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE_MODAL }}
    >
      <div className="esiti__list" role="tablist" aria-label="Cosa cambia per chi guida l'azienda">
        {ESITI.map((e, i) => {
          const on = i === active;
          return (
            <button
              key={e.t}
              type="button"
              role="tab"
              aria-selected={on}
              className={`esiti__item ${on ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="esiti__ic">
                <e.icon size={18} strokeWidth={1.9} />
              </span>
              <span className="esiti__tx">
                <b>{e.t}</b>
                <em>{e.d}</em>
              </span>
              {on && !reduce && (
                <motion.span
                  className="esiti__prog"
                  key={active}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: ROTATE_MS / 1000, ease: 'linear' }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="esiti__stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="esiti__scene"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: 0.6, ease: EASE_MODAL }}
          >
            <Scene reduce={reduce} />
          </motion.div>
        </AnimatePresence>
        <span className="esiti__stage-glow" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
