import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Gauge, ShieldCheck, Sparkles, CalendarClock, Boxes, Receipt, TrendingUp, ArrowDownRight } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

const ROTATE_MS = 5000;

/* ============================================================
   Esiti — showcase interattivo.
   A sinistra tre esiti selezionabili (auto-avanzano con una barra
   di avanzamento); a destra un palco che mostra una scena SVG viva
   per l'esito attivo. Tutto sui token del sito, coerente light/dark,
   fermo in prefers-reduced-motion.
   ============================================================ */

/* ── scena 1 · L'azienda a colpo d'occhio (mini dashboard live) ── */
function SceneDash({ reduce }) {
  const line =
    'M30,150 C58,144 74,120 104,124 C136,128 150,150 182,142 C214,134 226,104 262,96 C292,89 304,100 318,92';
  const area = `${line} L318,182 L30,182 Z`;
  return (
    <svg className="scene" viewBox="0 0 348 224" fill="none">
      <defs>
        <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* due stat tile */}
      <rect x="6" y="6" width="164" height="64" rx="13" fill="var(--surface-top)" stroke="var(--hairline-strong)" />
      <foreignObject x="6" y="6" width="164" height="64">
        <div className="sc-tile">
          <span className="sc-tile__k">Margine</span>
          <span className="sc-tile__v sc-accent">+18%</span>
          <span className="sc-tile__s">vs mese scorso</span>
        </div>
      </foreignObject>
      <rect x="178" y="6" width="164" height="64" rx="13" fill="var(--surface-top)" stroke="var(--hairline-strong)" />
      <foreignObject x="178" y="6" width="164" height="64">
        <div className="sc-tile">
          <span className="sc-tile__k">Incassi mese</span>
          <span className="sc-tile__v">€ 42,8k</span>
          <span className="sc-tile__s">aggiornato ora</span>
        </div>
      </foreignObject>

      {/* card grafico */}
      <rect x="6" y="80" width="336" height="138" rx="13" fill="var(--surface-top)" stroke="var(--hairline-strong)" />
      {[112, 148, 184].map((y) => (
        <line key={y} x1="30" y1={y} x2="318" y2={y} stroke="var(--hairline)" strokeWidth="1" strokeDasharray="3 5" />
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
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={reduce ? {} : { pathLength: 1 }}
        transition={{ duration: 1, ease: EASE_MODAL, delay: 0.1 }}
      />
      {!reduce && (
        <circle r="4" fill="var(--accent)" stroke="var(--surface-top)" strokeWidth="1.5">
          <animateMotion dur="3.4s" begin="1s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
            <mpath href="#dashLine" />
          </animateMotion>
        </circle>
      )}
    </svg>
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

/* ── scena 3 · Testa solo al business (l'AI ti indica dove guardare) ── */
function SceneAI({ reduce }) {
  const ax = 70;
  const ay = 118;
  const px = 244;
  const py = 96;
  const link = `M ${ax + 28} ${ay} C 150 ${ay} 168 ${py} ${px - 6} ${py}`;
  return (
    <svg className="scene" viewBox="0 0 348 224" fill="none">
      {/* punti dato sparsi */}
      {[[190, 150], [214, 176], [286, 150], [300, 108], [240, 128]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--text-3)" opacity="0.5" />
      ))}

      {/* collegamento AI → punto evidenziato */}
      <path d={link} stroke="color-mix(in srgb, var(--accent) 45%, transparent)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      {!reduce && (
        <circle r="3.5" fill="var(--accent)">
          <animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite" path={link} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
        </circle>
      )}

      {/* anelli attorno al nodo AI */}
      {[30, 46].map((r, i) =>
        reduce ? (
          <circle key={r} cx={ax} cy={ay} r={r} fill="none" stroke="color-mix(in srgb, var(--accent) 30%, transparent)" strokeWidth="1" />
        ) : (
          <circle key={r} cx={ax} cy={ay} r={r} fill="none" stroke="color-mix(in srgb, var(--accent) 40%, transparent)" strokeWidth="1">
            <animate attributeName="r" values={`${r};${r + 7};${r}`} dur="4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          </circle>
        )
      )}
      {/* nodo AI */}
      <circle cx={ax} cy={ay} r="26" fill="var(--accent-soft)" />
      <circle cx={ax} cy={ay} r="22" fill="var(--surface-top)" stroke="color-mix(in srgb, var(--accent) 45%, transparent)" strokeWidth="1.5" />
      <foreignObject x={ax - 14} y={ay - 14} width="28" height="28">
        <div className="sc-ai__ic"><Sparkles size={19} strokeWidth={1.8} /></div>
      </foreignObject>

      {/* punto evidenziato + callout */}
      {!reduce && (
        <circle cx={px} cy={py} r="8" fill="none" stroke="var(--accent)" strokeWidth="1.5">
          <animate attributeName="r" values="7;13;7" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.15;0.9" dur="2.2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={px} cy={py} r="4.5" fill="var(--accent)" />
      <foreignObject x={px - 156} y={py - 52} width="176" height="44">
        <div className="sc-callout">
          <ArrowDownRight size={13} strokeWidth={2.2} />
          Qui il margine cala
        </div>
      </foreignObject>
    </svg>
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
    d: 'Prendi le decisioni che contano con l’AI che analizza i numeri insieme a te e ti segnala esattamente dove guardare.',
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
              className={`esiti__item ${on ? 'is-active' : ''} ${e.accent ? 'esiti__item--accent' : ''}`}
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
            transition={{ duration: 0.4, ease: EASE_MODAL }}
          >
            <Scene reduce={reduce} />
          </motion.div>
        </AnimatePresence>
        <span className="esiti__stage-glow" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
