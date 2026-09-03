import { motion, useReducedMotion } from 'framer-motion';
import {
  CreditCard,
  Users,
  Layers,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Sparkles,
  Boxes,
} from 'lucide-react';
import { Section, Head, IconTile } from './ui';
import { EASE_MODAL } from '../lib/motion';
import { useIsMobile } from '../lib/hooks';

/* ------------------------------------------------------------
   Ecosistema - il diagramma "tutto in un unico posto".
   Cinque sistemi frammentati a sinistra convergono nel nodo
   Rush AI, che alimenta un unico gestionale su misura a destra.
   Le coordinate vivono in un sistema condiviso (viewBox 1160×520):
   sia i tracciati SVG sia le card HTML leggono gli stessi numeri,
   così le linee toccano sempre le card, a qualunque scala.
   ------------------------------------------------------------ */

const VB_W = 1160;
const VB_H = 520;

const MODULES = [
  { icon: CreditCard, t: 'Cassa', d: 'Pagamenti & scontrini', y: 52 },
  { icon: Users, t: 'Personale', d: 'Presenze & turni', y: 148 },
  { icon: Layers, t: 'Magazzino', d: 'Stock & movimenti', y: 244 },
  { icon: ClipboardList, t: 'Ordini', d: 'Ciclo attivo & passivo', y: 340 },
  { icon: FileText, t: 'Fatturazione', d: 'Documenti & scadenze', y: 436 },
];

/* geometria condivisa */
const CARD_L = 12; /* x sinistro card modulo */
const CARD_W = 236;
const CARD_H = 72;
const ANCHOR_X = CARD_L + CARD_W; /* 248 - bordo destro da cui parte la linea */
const NODE_CX = 580;
const NODE_CY = 244;
const NODE_R = 60;
const CONV_X = NODE_CX - NODE_R - 6; /* 514 - punto di convergenza a sx del nodo */
const DEST_L = 888; /* bordo sinistro card destinazione */

const pct = (v, total) => `${(v / total) * 100}%`;

/* tracciato di ingresso: dal bordo card al punto di convergenza */
function inPath(y) {
  const c1x = ANCHOR_X + 120;
  const c2x = CONV_X - 120;
  return `M ${ANCHOR_X},${y} C ${c1x},${y} ${c2x},${NODE_CY} ${CONV_X},${NODE_CY}`;
}
/* tracciato di uscita: dal nodo alla card destinazione */
const OUT_PATH = `M ${NODE_CX + NODE_R + 6},${NODE_CY} L ${DEST_L},${NODE_CY}`;

/* ---- Desktop: diagramma completo con linee animate ---- */
function EcosistemaDesktop() {
  const reduce = useReducedMotion();

  return (
    <Section id="ecosistema" large>
      <Head
        icon={Boxes}
        label="Un unico posto"
        title={<>Tutti i tuoi sistemi in un solo gestionale</>}
        sub="Cassa, magazzino, personale, ordini, fatturazione: oggi vivono in strumenti separati che non si parlano. Rush li fa convergere in un unico posto, con l'AI che tiene tutto allineato."
      />

      <div className="eco">
        <div className="eco__stage" aria-hidden="true">
          {/* alone d'accento morbido dietro al nodo: sfondo smooth, non invadente */}
          <span className="eco__halo" />

          {/* linee + puntini che scorrono */}
          <svg
            className="eco__svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* userSpaceOnUse: i tracciati orizzontali hanno bounding box di
                  altezza 0 → un gradiente in objectBoundingBox non si calcola e
                  la linea sparisce. In userSpace il gradiente è sempre valido. */}
              <linearGradient
                id="ecoLine"
                gradientUnits="userSpaceOnUse"
                x1={ANCHOR_X}
                y1={NODE_CY}
                x2={NODE_CX + NODE_R}
                y2={NODE_CY}
              >
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
                <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.72" />
              </linearGradient>
            </defs>

            {MODULES.map((m, i) => (
              <motion.path
                key={m.t}
                id={`eco-in-${i}`}
                d={inPath(m.y)}
                stroke="url(#ecoLine)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: EASE_MODAL, delay: 0.15 + i * 0.12 }}
              />
            ))}

            <motion.path
              id="eco-out"
              d={OUT_PATH}
              stroke="url(#ecoLine)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.8 }}
            />

            {/* plug tondo davanti alla card destinazione */}
            <circle cx={DEST_L - 20} cy={NODE_CY} r="4.5" fill="var(--accent)" />

            {/* puntini che scorrono lungo i tracciati (off in reduced-motion) */}
            {!reduce &&
              MODULES.map((m, i) => (
                <circle key={m.t} r="3" fill="var(--accent)">
                  <animateMotion
                    dur={`${2.6 + i * 0.25}s`}
                    begin={`${1 + i * 0.18}s`}
                    repeatCount="indefinite"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath href={`#eco-in-${i}`} />
                  </animateMotion>
                </circle>
              ))}
            {!reduce && (
              <circle r="3.5" fill="var(--accent)">
                <animateMotion dur="1.8s" begin="1.6s" repeatCount="indefinite">
                  <mpath href="#eco-out" />
                </animateMotion>
              </circle>
            )}
          </svg>

          {/* card modulo (sinistra) */}
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.t}
                className="eco__mod"
                style={{
                  left: pct(CARD_L, VB_W),
                  top: pct(m.y - CARD_H / 2, VB_H),
                  width: pct(CARD_W, VB_W),
                  height: pct(CARD_H, VB_H),
                }}
                initial={reduce ? false : { opacity: 0, x: -22 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, ease: EASE_MODAL, delay: i * 0.1 }}
              >
                <IconTile icon={Icon} size="sm" ghost />
                <span className="eco__mod-t">
                  <b>{m.t}</b>
                  <em>{m.d}</em>
                </span>
              </motion.div>
            );
          })}

          {/* nodo centrale: il logotipo Rush al cuore del sistema */}
          <motion.div
            className="eco__core"
            style={{ left: pct(NODE_CX, VB_W), top: pct(NODE_CY, VB_H) }}
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE_MODAL, delay: 0.5 }}
          >
            <span className="eco__core-ring">
              <span className="eco__core-mark">
                <img src="./rush-logo.png" alt="Rush" className="eco__core-logo eco__core-logo--l" />
                <img
                  src="./rush-logo-dark.png"
                  alt="Rush"
                  className="eco__core-logo eco__core-logo--d"
                />
              </span>
              <span className="eco__core-ai">
                <Sparkles size={12} strokeWidth={2} />
                AI
              </span>
            </span>
          </motion.div>

          {/* card destinazione: la dashboard che ne esce */}
          <motion.div
            className="eco__dest"
            style={{
              left: pct(DEST_L, VB_W),
              top: pct(NODE_CY - 86, VB_H),
              width: pct(VB_W - DEST_L - 12, VB_W),
              height: pct(172, VB_H),
            }}
            initial={reduce ? false : { opacity: 0, x: 22 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE_MODAL, delay: 0.95 }}
          >
            <IconTile icon={LayoutDashboard} accent />
            <b className="eco__dest-t">La tua dashboard</b>
            <span className="eco__dest-sub">Precompilata, aggiornata al secondo, sempre in ordine.</span>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ---- Mobile: stack verticale, stessa storia in colonna ---- */
function EcosistemaMobile() {
  const reduce = useReducedMotion();
  return (
    <Section id="ecosistema" large>
      <Head
        icon={Boxes}
        label="Un unico posto"
        title={<>Tutti i tuoi sistemi in un solo gestionale</>}
        sub="Cassa, magazzino, personale, ordini, fatturazione: oggi vivono in strumenti separati. Rush li fa convergere in un unico posto."
      />

      <div className="eco-m">
        <div className="eco-m__mods">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.t}
                className="eco-m__mod"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease: EASE_MODAL, delay: i * 0.06 }}
              >
                <IconTile icon={Icon} size="sm" ghost />
                <span className="eco__mod-t">
                  <b>{m.t}</b>
                  <em>{m.d}</em>
                </span>
              </motion.div>
            );
          })}
        </div>

        <span className="eco-m__flow" aria-hidden="true" />

        <div className="eco-m__core">
          <span className="eco__core-ring">
            <img src="./rush-logo.png" alt="Rush" className="eco__core-logo eco__core-logo--l" />
            <img src="./rush-logo-dark.png" alt="Rush" className="eco__core-logo eco__core-logo--d" />
          </span>
        </div>

        <span className="eco-m__flow" aria-hidden="true" />

        <div className="eco-m__dest">
          <IconTile icon={LayoutDashboard} accent />
          <b className="eco__dest-t">La tua dashboard</b>
          <span className="eco__dest-sub">Precompilata, aggiornata al secondo, sempre in ordine.</span>
        </div>
      </div>
    </Section>
  );
}

export default function Ecosistema() {
  const isMobile = useIsMobile();
  return isMobile ? <EcosistemaMobile /> : <EcosistemaDesktop />;
}
