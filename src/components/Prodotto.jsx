import { Fragment, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layers, Blocks, BarChart3, CalendarClock, Sparkles, Plug, Wallet, Boxes, Users, Receipt } from 'lucide-react';
import { Section, Head, IconTile } from './ui';
import { EASE_MODAL } from '../lib/motion';

const inViewOnce = { once: true, amount: 0.3 };

/* ------------------------------------------------------------
   Cosa costruiamo — bento animato.
   Cinque tessere in stile "feature grid": intestazione con icona,
   testo, e in basso una piccola scena SVG che vive in loop. Il
   bordo si illumina in accento seguendo il puntatore (glow che
   traccia il cursore), come nel tema di riferimento — ma con i
   token, le icone e i colori del sito.
   Tutte le animazioni si spengono in prefers-reduced-motion.
   ------------------------------------------------------------ */

function BuildCard({ icon, title, desc, accent = false, wide = false, children }) {
  const ref = useRef(null);

  /* il bordo/alone segue il cursore: scriviamo la posizione in due
     custom prop, il resto è CSS (nessun re-render). */
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
      className={`buildcard card card--lg card--glow ${accent ? 'card--glow-accent buildcard--accent' : ''} ${
        wide ? 'buildcard--wide' : ''
      }`}
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
      <div className="buildcard__viz" aria-hidden="true">
        {children}
      </div>
    </motion.div>
  );
}

/* riga SVG che si disegna quando entra in viewport */
function DrawPath({ d, delay = 0, width = 1.5, dash, reduce, ...rest }) {
  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
      whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
      viewport={inViewOnce}
      transition={{ duration: 0.9, ease: EASE_MODAL, delay }}
      {...rest}
    />
  );
}

/* ── A · Gestionale su misura: i moduli che accendi tu ── */
const CFG = [
  { Icon: Wallet, name: 'Cassa' },
  { Icon: Boxes, name: 'Magazzino' },
  { Icon: Users, name: 'Personale' },
  { Icon: Receipt, name: 'Fatturazione' },
];

function VizModuli({ reduce }) {
  return (
    <div className="viz-cfg">
      {CFG.map(({ Icon, name }, i) => (
        <div className="viz-cfg__row" key={name}>
          <span className="viz-cfg__ic">
            <Icon size={15} strokeWidth={1.9} />
          </span>
          <span className="viz-cfg__name">{name}</span>
          <span className={`viz-cfg__tg ${reduce ? 'is-on' : ''}`}>
            <span
              className="viz-cfg__track"
              style={reduce ? undefined : { animationDelay: `${0.4 + i * 0.7}s` }}
            />
            <span
              className="viz-cfg__knob"
              style={reduce ? undefined : { animationDelay: `${0.4 + i * 0.7}s` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── B · Dati reali: mini line-chart con dot che scorre ── */
function VizDati({ reduce }) {
  const line =
    'M18,120 C40,110 52,96 72,98 C92,100 104,116 126,110 C150,103 160,58 184,58 C210,58 220,80 240,74 C262,67 270,40 284,30';
  const area = `${line} L284,150 L18,150 Z`;
  return (
    <svg className="viz" viewBox="0 0 302 158" fill="none">
      <defs>
        <linearGradient id="datiFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[42, 84, 126].map((y) => (
        <line key={y} x1="18" y1={y} x2="284" y2={y} stroke="var(--hairline)" strokeWidth="1" strokeDasharray="3 5" />
      ))}
      {/* area */}
      <motion.path
        d={area} fill="url(#datiFill)" stroke="none"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={reduce ? undefined : { opacity: 1 }}
        viewport={inViewOnce}
        transition={{ duration: 0.9, ease: EASE_MODAL, delay: 0.5 }}
      />
      {/* linea */}
      <DrawPath d={line} id="datiLine" stroke="var(--accent)" width={2} delay={0.15} reduce={reduce} />
      {/* dot che scorre */}
      {!reduce && (
        <circle r="4" fill="var(--accent)" stroke="var(--surface-top)" strokeWidth="1.5">
          <animateMotion dur="3.6s" begin="1s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
            <mpath href="#datiLine" />
          </animateMotion>
        </circle>
      )}
    </svg>
  );
}

/* ── C · AI integrata: nodo centrale con anelli che respirano ── */
function VizAI({ reduce }) {
  const cx = 143, cy = 84;
  return (
    <svg className="viz viz--ai" viewBox="0 0 286 168" fill="none">
      {/* anelli concentrici che pulsano */}
      {[34, 50, 66].map((r, i) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none"
          stroke="color-mix(in srgb, var(--accent) 40%, transparent)" strokeWidth="1">
          {!reduce && (
            <>
              <animate attributeName="r" values={`${r};${r + 8};${r}`} dur="4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </>
          )}
        </circle>
      ))}
      {/* dot in orbita */}
      {!reduce && (
        <circle r="3.5" fill="var(--accent)">
          <animateMotion dur="6s" repeatCount="indefinite"
            path={`M ${cx} ${cy - 50} A 50 50 0 1 1 ${cx - 0.01} ${cy - 50}`} />
        </circle>
      )}
      {/* alone + nodo centrale */}
      <circle cx={cx} cy={cy} r="30" fill="var(--accent-soft)" />
      <circle cx={cx} cy={cy} r="26" fill="var(--surface-top)" stroke="color-mix(in srgb, var(--accent) 45%, transparent)" strokeWidth="1.5" />
      <foreignObject x={cx - 16} y={cy - 16} width="32" height="32">
        <div className="viz-ai__ic"><Sparkles size={22} strokeWidth={1.8} /></div>
      </foreignObject>
    </svg>
  );
}

/* ── D · Automazioni end-to-end: l'AI programma i turni della
   settimana prossima. Griglia giorni × persone: i turni si posano
   da soli, giorno per giorno, in loop perpetuo. ── */
const TURNI_DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const TURNI_ROWS = [
  { who: 'Sara', cells: [1, 0, 2, 0, 1, 0, 0] },
  { who: 'Luca', cells: [0, 2, 0, 1, 0, 2, 0] },
  { who: 'Emma', cells: [0, 1, 0, 2, 0, 1, 2] },
];

/* geometria della griglia (viewBox 520×150) */
const T = {
  gx: 66, // inizio colonne giorni
  colW: 63,
  headY: 20,
  rowY: 42, // primo centro riga
  rowH: 34,
  chipH: 20,
};

function VizTurni({ reduce }) {
  return (
    <svg className="viz viz--turni" viewBox="0 0 520 150" fill="none">
      {/* intestazione giorni */}
      {TURNI_DAYS.map((d, i) => (
        <text
          key={d + i}
          x={T.gx + i * T.colW + T.colW / 2}
          y={T.headY}
          className="viz-turni__day"
          textAnchor="middle"
        >
          {d}
        </text>
      ))}

      {TURNI_ROWS.map((r, ri) => {
        const cy = T.rowY + ri * T.rowH;
        return (
          <Fragment key={r.who}>
            {/* nome persona */}
            <text x={0} y={cy + 4} className="viz-turni__who">
              {r.who}
            </text>
            {/* slot vuoti (binario) */}
            {r.cells.map((c, ci) => (
              <rect
                key={`s${ci}`}
                x={T.gx + ci * T.colW + 5}
                y={cy - T.chipH / 2}
                width={T.colW - 10}
                height={T.chipH}
                rx="6"
                fill="none"
                stroke="var(--hairline)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
            ))}
            {/* turni che l'AI posa, in sequenza (giorno per giorno) */}
            {r.cells.map((c, ci) => {
              if (c === 0) return null;
              const begin = 0.3 + ci * 0.32 + ri * 0.1;
              const isEve = c === 2;
              return (
                <rect
                  key={`c${ci}`}
                  x={T.gx + ci * T.colW + 5}
                  y={cy - T.chipH / 2}
                  width={T.colW - 10}
                  height={T.chipH}
                  rx="6"
                  fill={isEve ? 'var(--accent)' : 'var(--accent-soft)'}
                  fillOpacity={isEve ? 0.9 : 1}
                  stroke="color-mix(in srgb, var(--accent) 45%, transparent)"
                  strokeWidth="1"
                  opacity={reduce ? 1 : 0}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                >
                  {!reduce && (
                    <>
                      <animate
                        attributeName="opacity"
                        values="0;0;1;1;0"
                        keyTimes="0;0.04;0.12;0.82;1"
                        dur="7s"
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                      />
                      <animateTransform
                        attributeName="transform"
                        type="scale"
                        values="0.7;1;1;1"
                        keyTimes="0;0.12;0.82;1"
                        dur="7s"
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                        additive="sum"
                      />
                    </>
                  )}
                </rect>
              );
            })}
          </Fragment>
        );
      })}
    </svg>
  );
}

/* ── E · Si collega: righe di integrazione con sync che pulsa ── */
const LINKS = [
  ['Fatturazione elettronica', 'SDI'],
  ['Sistemi di cassa', 'POS'],
  ['E-commerce e marketplace', 'API'],
  ['Banche e pagamenti', 'PSD2'],
];

function VizLink({ reduce }) {
  return (
    <div className="viz-links">
      {LINKS.map(([k, v], i) => (
        <div className="viz-link" key={v}>
          <span className="viz-link__dot" aria-hidden="true">
            <span className="viz-link__pulse" style={reduce ? undefined : { animationDelay: `${i * 0.6}s` }} />
          </span>
          <span className="viz-link__k">{k}</span>
          <span className="viz-link__v chip">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function Prodotto() {
  const reduce = useReducedMotion();

  return (
    <Section id="prodotto" grid large>
      <Head
        icon={Layers}
        label="Cosa costruiamo"
        title={<>Un solo sistema al posto di sei strumenti scollegati</>}
        sub="Tutto quello che oggi vive in gestionali diversi, fogli di calcolo e messaggi torna in un posto solo — e resta aggiornato da solo."
      />

      <div className="build">
        <BuildCard
          icon={Blocks}
          title="Gestionale su misura"
          desc="Anagrafiche, ordini, magazzino, documenti, presenze: i moduli che ti servono, con i campi e le regole della tua azienda. Nessun compromesso su come lavori."
        >
          <VizModuli reduce={reduce} />
        </BuildCard>

        <BuildCard
          icon={BarChart3}
          title="Dati reali, non report morti"
          desc="Margini, costi, scorte e scadenze aggiornati in continuo. I numeri che contano sono in prima schermata, non in un export da ricostruire ogni volta."
        >
          <VizDati reduce={reduce} />
        </BuildCard>

        <BuildCard
          icon={Sparkles}
          title="AI integrata nel flusso"
          desc="Legge i documenti, controlla le anomalie, risponde alle domande sui tuoi dati. Non un chatbot appiccicato sopra: un livello dentro al gestionale."
          accent
        >
          <VizAI reduce={reduce} />
        </BuildCard>

        <BuildCard
          icon={CalendarClock}
          title="Automazioni end-to-end"
          desc="I turni della settimana prossima programmati da soli, documenti che si registrano, soglie che avvisano prima del problema. Il lavoro ripetitivo esce dalla giornata."
          wide
        >
          <VizTurni reduce={reduce} />
        </BuildCard>

        <BuildCard
          icon={Plug}
          title="Si collega a quello che hai già"
          desc="Cassa, e-commerce, fatturazione elettronica, banca, fornitori. Il gestionale nuovo non cancella gli strumenti che funzionano: li mette in fila."
        >
          <VizLink reduce={reduce} />
        </BuildCard>
      </div>
    </Section>
  );
}
