import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL } from '../../lib/motion';

const INCLUSO = [
  { Icon: Boxes, label: 'Gestione magazzino' },
  { Icon: Truck, label: 'Fornitori' },
  { Icon: CalendarClock, label: 'Turni' },
  { Icon: ScanLine, label: 'Fatture' },
  { Icon: Wallet, label: 'Cassa' },
  { Icon: FileBarChart, label: 'Riepilogo di come va il locale, fatto per bene' },
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
            <div className="prezzi2__price-block">
              <span className="prezzi-price__from">a partire da</span>
              <div className="prezzi-price" style={{ alignItems: 'flex-end', gap: 4 }}>
                <span className="prezzi-price__num prezzi-price__num--lg">300</span>
                <span className="prezzi-price__unit">€ / mese</span>
              </div>
              <p className="prezzi-sub">il gestionale del locale, operativo da subito</p>
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

            <p className="prezzi2__variabile">
              Il prezzo varia in base alla complessità del locale.
            </p>

            <a href="#contatti" className="btn btn--primary prezzi-cta">
              Prenota una demo
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
            <strong>Più moduli attivi, più il canone di ciascuno si abbassa.</strong> Il gestionale
            tiene tutto sotto controllo; marketing, prenotazioni, ADV e social lavorano ogni giorno
            per portarti clienti nuovi, non solo per registrare quelli che arrivano da soli.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
