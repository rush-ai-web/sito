import { motion } from 'framer-motion';
import {
  Banknote,
  Boxes,
  Truck,
  CalendarClock,
  ScanLine,
  Wallet,
  FileBarChart,
  Sparkles,
  Headphones,
  Ban,
  Users,
  FileCheck,
  ArrowRight,
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

/* stessi vantaggi della home (Confronto), riformulati per il verticale */
const VANTAGGI = [
  { Icon: Headphones, label: 'Supporto diretto con chi sviluppa' },
  { Icon: Ban, label: 'Nessun ticket a terzi: parli con chi ha costruito il tuo sistema' },
  { Icon: Users, label: 'Team stabile, continuità nel tempo' },
  { Icon: FileCheck, label: 'Preventivo chiaro, nessuna sorpresa' },
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
              Il prezzo varia in base alla complessità del locale e ai moduli scelti.
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
          <div className="rh-strategy">
            <span className="rh-strategy__ic">
              <Sparkles size={18} strokeWidth={1.9} />
            </span>
            <p className="rh-strategy__lead">
              Il gestionale da solo tiene tutto sotto controllo. Ma il vero salto si fa quando ha
              una strategia che lo segue: promozioni, prenotazioni, ADV, social - una macchina che
              lavora ogni giorno per portarti clienti, non solo per registrarli.
            </p>
            <p className="rh-strategy__note">
              <strong>Più moduli attivi, più il canone di ciascuno si abbassa.</strong> Il modo più
              conveniente di usare Rush Ristorazione è usarlo davvero, in profondità.
            </p>
            <a href="#moduli" className="rh-strategy__link">
              Scopri i moduli
              <ArrowRight size={15} strokeWidth={2.2} />
            </a>
          </div>

          <ul className="prezzi-features" style={{ marginTop: 28 }}>
            {VANTAGGI.map(({ Icon, label }) => (
              <li key={label}>
                <span className="prezzi-feat-ic">
                  <Icon size={14} strokeWidth={1.9} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}
