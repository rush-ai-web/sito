import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layers, Blocks, BarChart3, Workflow, Sparkles, Plug, FileText, Bell, Check } from 'lucide-react';
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

/* ── A · Gestionale su misura: moduli che si accendono in griglia ── */
function VizModuli({ reduce }) {
  const TILES = [
    { x: 14, y: 14 }, { x: 106, y: 14 }, { x: 198, y: 14 },
    { x: 14, y: 92 }, { x: 106, y: 92 }, { x: 198, y: 92 },
  ];
  const W = 74, H = 62;
  return (
    <svg className="viz" viewBox="0 0 286 168" fill="none">
      {TILES.map((t, i) => (
        <g key={i}>
          <rect
            x={t.x} y={t.y} width={W} height={H} rx="12"
            fill="var(--surface-top)" stroke="var(--hairline-strong)" strokeWidth="1"
          />
          {/* quadratino icona */}
          <rect x={t.x + 12} y={t.y + 12} width="18" height="18" rx="6"
            fill="var(--accent-soft)" stroke="color-mix(in srgb, var(--accent) 30%, transparent)" strokeWidth="1" />
          {/* due barrette testo */}
          <rect x={t.x + 12} y={t.y + 38} width="46" height="5" rx="2.5" fill="var(--hairline-strong)" />
          <rect x={t.x + 12} y={t.y + 48} width="30" height="5" rx="2.5" fill="var(--hairline)" />
          {/* filo d'accento che pulsa in sequenza: i moduli "si attivano" */}
          <rect x={t.x} y={t.y + H - 3} width={W} height="3" rx="1.5" fill="var(--accent)" opacity="0">
            {!reduce && (
              <animate attributeName="opacity" values="0;0.9;0" dur="4.2s"
                begin={`${i * 0.5}s`} repeatCount="indefinite" />
            )}
          </rect>
        </g>
      ))}
    </svg>
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

/* ── D · Automazioni end-to-end: pipeline orizzontale con dot ── */
function VizFlusso({ reduce }) {
  const cy = 62;
  const NODES = [
    { x: 40, Icon: Sparkles, tone: 'accent' },
    { x: 190, Icon: FileText },
    { x: 340, Icon: Bell },
    { x: 490, Icon: Check, tone: 'done' },
  ];
  const seg = (a, b) => `M ${a + 26} ${cy} L ${b - 26} ${cy}`;
  return (
    <svg className="viz viz--flow" viewBox="0 0 530 124" fill="none">
      {NODES.slice(0, -1).map((n, i) => (
        <g key={i}>
          <DrawPath d={seg(n.x, NODES[i + 1].x)} stroke="var(--hairline-strong)" width={1.5} delay={0.2 + i * 0.15} reduce={reduce} />
          {!reduce && (
            <circle r="3.5" fill="var(--accent)">
              <animateMotion dur="2.4s" begin={`${0.8 + i * 0.3}s`} repeatCount="indefinite"
                path={seg(n.x, NODES[i + 1].x)} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            </circle>
          )}
        </g>
      ))}
      {NODES.map((n, i) => {
        const isAccent = n.tone === 'accent';
        const isDone = n.tone === 'done';
        const ring = isAccent
          ? 'color-mix(in srgb, var(--accent) 50%, transparent)'
          : isDone
          ? 'color-mix(in srgb, var(--pos) 55%, transparent)'
          : 'var(--hairline-strong)';
        const fill = isAccent ? 'var(--accent-soft)' : 'var(--surface-top)';
        return (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={cy} r="26" fill={fill} stroke={ring} strokeWidth="1.5" />
            {isDone && !reduce && (
              <circle cx={n.x} cy={cy} r="26" fill="none" stroke="var(--pos)" strokeWidth="1.5" opacity="0">
                <animate attributeName="r" values="26;33;26" dur="2.6s" begin="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.6s" begin="1.6s" repeatCount="indefinite" />
              </circle>
            )}
            <foreignObject x={n.x - 15} y={cy - 15} width="30" height="30">
              <div className={`viz-node ${isAccent ? 'viz-node--accent' : ''} ${isDone ? 'viz-node--done' : ''}`}>
                <n.Icon size={19} strokeWidth={1.9} />
              </div>
            </foreignObject>
          </g>
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
          icon={Workflow}
          title="Automazioni end-to-end"
          desc="Documenti che si registrano da soli, soglie che avvisano prima del problema, attività che si assegnano da sole. Il lavoro ripetitivo esce dalla giornata."
          wide
        >
          <VizFlusso reduce={reduce} />
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
