import { motion } from 'framer-motion';
import {
  UtensilsCrossed,
  Factory,
  Truck,
  Store,
  Stethoscope,
  HardHat,
  Building2,
  Scissors,
} from 'lucide-react';
import { Reveal } from './ui';

const SETTORI = [
  { icon: UtensilsCrossed, label: 'Ristorazione' },
  { icon: Factory, label: 'Produzione' },
  { icon: Truck, label: 'Logistica' },
  { icon: Store, label: 'Retail' },
  { icon: Stethoscope, label: 'Studi medici' },
  { icon: HardHat, label: 'Edilizia' },
  { icon: Building2, label: 'Servizi' },
  { icon: Scissors, label: 'Artigianato' },
];

/* Nastro continuo: due copie identiche che scorrono, così il
   ciclo non ha mai un salto visibile. */
export default function Settori() {
  return (
    <section data-tone="light" className="section section--strip">
      <div className="wrap">
        <Reveal as="p" className="t-label" style={{ textAlign: 'center', marginBottom: 28 }}>
          Costruiamo gestionali per
        </Reveal>
      </div>

      <div className="marquee">
        <motion.div
          className="marquee__track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((copy) =>
            SETTORI.map(({ icon: Icon, label }) => (
              <span className="marquee__item" key={`${copy}-${label}`} aria-hidden={copy === 1}>
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </span>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
