import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote,
  Boxes,
  Truck,
  CalendarClock,
  ScanLine,
  Wallet,
  FileBarChart,
  Headphones,
  Ban,
  Users,
  FileCheck,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL } from '../../lib/motion';

const INCLUSO = [
  { Icon: Boxes, label: 'Gestione magazzino' },
  { Icon: Truck, label: 'Fornitori' },
  { Icon: CalendarClock, label: 'Turni' },
  { Icon: ScanLine, label: 'Fatture' },
  { Icon: Wallet, label: 'Cassa' },
  { Icon: FileBarChart, label: 'Riepilogo e report del tuo locale' },
];

/* stessa struttura "come funziona" della home, riformulata sui vantaggi
   concreti di lavorare con Rush invece che con un fornitore qualsiasi. */
const VANTAGGI = [
  {
    Icon: Headphones,
    t: 'Supporto diretto con chi sviluppa',
    d: 'Scrivi a chi ha costruito il tuo sistema, non a un centralino: risposte rapide, da chi conosce già il tuo locale.',
  },
  {
    Icon: Ban,
    t: 'Nessun ticket a terzi',
    d: 'Niente rimpalli tra fornitori diversi per cassa, fatture e magazzino: un solo referente per tutto quello che vedi in Rush.',
  },
  {
    Icon: Users,
    t: 'Team stabile nel tempo',
    d: 'La stessa squadra segue il tuo locale dal primo giorno, non un giro di consulenti che ripartono ogni volta da zero.',
  },
  {
    Icon: FileCheck,
    t: 'Preventivo chiaro',
    d: 'Sai da subito cosa include il canone e cosa costano i moduli aggiuntivi: nessuna sorpresa in fattura.',
  },
];

export default function PrezziRisto() {
  const [yearly, setYearly] = useState(true);

  return (
    <Section id="prezzi" large>
      <Head
        icon={Banknote}
        label="Prezzi"
        title="Il canone copre l'operatività. La strategia fa la differenza"
        sub={
          <>
            <strong>Un canone chiaro</strong>, che tiene in piedi il locale ogni giorno. Il vero
            salto lo fa la strategia che ci costruisci sopra.
          </>
        }
      />

      <div className="prezzi2">
        <motion.div
          className="prezzi2__frame"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_MODAL }}
        >
          <span className="prezzi2__frame-glow" aria-hidden="true" />
          <div className="prezzi2__card">
            <div className="prezzi-toggle">
              {[
                { id: false, label: 'Trimestrale' },
                { id: true, label: 'Annuale', tag: '13% di sconto' },
              ].map(({ id, label, tag }) => (
                <button
                  key={String(id)}
                  type="button"
                  className={`prezzi-toggle__btn${yearly === id ? ' is-active' : ''}`}
                  onClick={() => setYearly(id)}
                  aria-pressed={yearly === id}
                >
                  {tag && <span className="prezzi-toggle__tag">{tag}</span>}
                  {yearly === id && (
                    <motion.span
                      layoutId="prezzi-risto-pill"
                      className="prezzi-toggle__pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="prezzi-toggle__label">{label}</span>
                </button>
              ))}
            </div>

            <div className="prezzi2__price-block">
              <span className="prezzi-price__from">a partire da</span>
              <div className="prezzi-price" style={{ alignItems: 'flex-end', gap: 4 }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={yearly ? 'y' : 'm'}
                    className="prezzi-price__num prezzi-price__num--lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: EASE_MODAL }}
                  >
                    {yearly ? '261' : '300'}
                  </motion.span>
                </AnimatePresence>
                <span className="prezzi-price__unit">€ / mese</span>
              </div>
              <p className="prezzi-sub">
                {yearly ? 'fatturato annualmente · minimo 12 mesi' : 'fatturato ogni 3 mesi'}
              </p>
            </div>

            <span className="prezzi2__divider" aria-hidden="true" />

            <ul className="prezzi-features">
              {INCLUSO.map(({ Icon, label }) => (
                <li key={label}>
                  <span className="prezzi-feat-ic">
                    <Icon size={14} strokeWidth={1.9} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <a href="#funzioni" className="prezzi2__detail-link prezzi2__detail-link--up">
              <ChevronUp size={14} strokeWidth={2.2} />
              Rivedi i moduli aggiuntivi
            </a>

            <a href="#contatti" className="btn btn--primary prezzi-cta">
              Prenota una demo
            </a>

            <a href="#prodotto" className="prezzi2__detail-link">
              Vedi nel dettaglio cosa include il canone
              <ChevronDown size={14} strokeWidth={2.2} />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="prezzi2__info"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_MODAL, delay: 0.1 }}
        >
          <div className="prezzi2__steps">
            {VANTAGGI.map(({ Icon, t, d }) => (
              <div key={t} className="prezzi2__step">
                <div className="prezzi2__step-track">
                  <span className="prezzi2__step-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.9} />
                  </span>
                  <span className="prezzi2__step-line" aria-hidden="true" />
                </div>
                <div className="prezzi2__step-body">
                  <p className="prezzi2__step-t">{t}</p>
                  <p className="prezzi2__step-d">{d}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="prezzi2__note">
            Il gestionale tiene tutto sotto controllo; marketing, prenotazioni, ADV e social
            lavorano ogni giorno per portarti clienti nuovi, non solo per registrare quelli che
            arrivano da soli. Il prezzo varia in base ai moduli che vuoi aggiungere e a eventuali
            automazioni o funzioni particolari fatte su misura per il tuo locale.
          </p>
          <p className="prezzi2__note">
            Il prezzo dei moduli aggiuntivi è <strong>su preventivo</strong>: così paghi solo le
            funzioni che ti servono davvero, e{' '}
            <strong>più moduli attivi, più il canone di ciascuno si abbassa</strong>.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
