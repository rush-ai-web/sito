import { motion, useReducedMotion } from 'framer-motion';
import {
  Banknote,
  Check,
  FileText,
  Package,
  Receipt,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { EASE_MODAL, floatIn, wordUp } from '../lib/motion';
import { IconTile } from './ui';

const TITOLO = 'Il cervello che manca al tuo gestionale';

/* i sistemi che il locale ha già, disposti attorno al titolo */
const SISTEMI = [
  { icon: Banknote, label: 'Cassa', sub: 'Zucchetti · TCPos · Scloby', pos: { top: '21%', left: '2%' } },
  { icon: Wallet, label: 'Cassetto contante', sub: 'riconciliazione scarti', pos: { top: '46%', left: '6%' } },
  { icon: Package, label: 'Magazzino', sub: '~400 SKU, soglie minime', pos: { top: '71%', left: '3%' } },
  { icon: Receipt, label: 'Fatture elettroniche', sub: 'SDI · Doceasy · Aruba', pos: { top: '20%', right: '2%' } },
  { icon: FileText, label: 'Fatture cartacee', sub: 'foto, OCR, quattro passi', pos: { top: '45%', right: '6%' } },
  { icon: Users, label: 'Personale', sub: 'ore, turni, costo reale', pos: { top: '70%', right: '3%' } },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const parole = TITOLO.split(' ');

  return (
    <section id="top" data-tone="light" className="section hero">
      {/* i sistemi orbitano: entrano scaglionati e poi respirano piano */}
      <div className="orbit" aria-hidden="true">
        {SISTEMI.map((s, i) => (
          <motion.div
            key={s.label}
            className="orbit__card"
            style={s.pos}
            variants={floatIn}
            custom={i}
            initial="hidden"
            animate="show"
          >
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: 11 }}
              animate={reduce ? {} : { y: [0, -6, 0] }}
              transition={
                reduce
                  ? {}
                  : { duration: 6 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }
              }
            >
              <IconTile icon={s.icon} size="sm" />
              <div>
                {s.label}
                <span>{s.sub}</span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="wrap">
        <div className="hero__inner stack">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_MODAL }}
          >
            <span className="chip chip--surface">
              <Sparkles size={14} strokeWidth={1.75} />
              Gestionale intelligente per bar e ristoranti
            </span>
          </motion.div>

          {/* il titolo si compone parola per parola */}
          <h1 className="t-hero" style={{ marginTop: 26 }}>
            {parole.map((p, i) => (
              <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
                <motion.span
                  style={{ display: 'inline-block' }}
                  variants={wordUp}
                  custom={i}
                  initial="hidden"
                  animate="show"
                >
                  {p}
                </motion.span>
                {i < parole.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>

          <motion.p
            className="t-body hero__sub"
            style={{ marginTop: 24 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.42 }}
          >
            Non ti chiediamo di buttare la cassa che usi da anni. Rush mette in dialogo i sistemi
            che hai già — cassa, fatture, magazzino, contabilità — e ci aggiunge sopra un layer di
            intelligenza artificiale che trasforma dati sparsi in decisioni.
          </motion.p>

          <motion.div
            className="btn-row"
            style={{ justifyContent: 'center', marginTop: 32 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.52 }}
          >
            <a className="btn btn--primary" href="#accesso">
              Richiedi accesso
            </a>
            <a className="btn btn--secondary" href="#prodotto">
              Guarda come funziona
            </a>
          </motion.div>

          <motion.div
            className="hero__trust"
            style={{ marginTop: 30 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.66 }}
          >
            {[
              'Infrastruttura europea, GDPR',
              'Si integra, non sostituisce',
              'Ogni cliente vede solo i suoi dati',
            ].map((t) => (
              <span key={t}>
                <Check size={15} strokeWidth={1.75} />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
