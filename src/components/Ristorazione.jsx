import { useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowUpRight, Boxes, Coins, Truck, Users } from 'lucide-react';
import { Section, Pill, LiveDot, ThemeCtx } from './ui';
import { EASE_MODAL, inView } from '../lib/motion';

const VANTAGGI = [
  { icon: Boxes, t: 'Magazzino sempre esatto: mai un numero calato dal cielo' },
  { icon: Coins, t: 'Food cost reale su ogni piatto, non l’ultimo prezzo pagato' },
  { icon: Truck, t: 'Riordino proposto per fornitore, pronto da inviare' },
  { icon: Users, t: 'Turni, presenze e timbrature nello stesso sistema' },
];

export default function Ristorazione() {
  const theme = useContext(ThemeCtx);
  const cardRef = useRef(null);
  const logoSrc = theme === 'dark' ? './rush-logo-dark.png' : './rush-logo.png';
  const logoSrcSet = theme === 'dark'
    ? './rush-logo-dark-192.png 192w, ./rush-logo-dark-320.png 320w, ./rush-logo-dark.png 800w'
    : './rush-logo-192.png 192w, ./rush-logo-320.png 320w, ./rush-logo.png 800w';

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  return (
    <Section id="ristorazione" large>
      <div className="risto2">
        <motion.div
          className="risto2__text"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.6, ease: EASE_MODAL }}
        >
          <Pill icon={UtensilsCrossed}>Un esempio: Rush Ristorazione</Pill>

          <h2 className="t-sec" style={{ marginTop: 16 }}>
            Lo stesso impianto, verticalizzato per bar e ristoranti
          </h2>

          <p className="t-body" style={{ marginTop: 14 }}>
            È il settore da cui siamo partiti, e quello in cui il nostro gestionale è più maturo:
            legge le fatture fornitore, calcola il costo reale di ogni piatto con il metodo FIFO e
            avvisa quando un prezzo si muove — prima che diventi un problema a bilancio chiuso.
          </p>

          <ul className="risto2__list">
            {VANTAGGI.map(({ icon: Icon, t }) => (
              <li key={t}>
                <span className="risto2__list-ic">
                  <Icon size={15} strokeWidth={1.9} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="risto2__cta-row">
            <a
              className="btn btn--primary btn--hero"
              href="https://ristorazione.rush.it"
              target="_blank"
              rel="noreferrer"
            >
              Scopri Rush Ristorazione
              <span className="btn__badge">
                <ArrowUpRight size={16} strokeWidth={2.2} />
              </span>
            </a>
            <span className="risto2__live">
              <LiveDot />
              Attivo su locali reali
            </span>
          </div>
        </motion.div>

        <motion.div
          ref={cardRef}
          onPointerMove={onMove}
          className="risto2__card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.6, ease: EASE_MODAL, delay: 0.1 }}
        >
          <span className="risto2__card-edge" aria-hidden="true" />
          <span className="risto2__card-wash" aria-hidden="true" />

          <div className="risto2__brand">
            <img
              src={logoSrc}
              srcSet={logoSrcSet}
              sizes="120px"
              alt="Rush"
              width="800"
              height="200"
              loading="lazy"
              className="risto2__brand-logo"
            />
            <span className="risto2__brand-seg">Ristorazione</span>
          </div>

          <div className="risto2__kpi">
            <span className="t-label">Recuperato in un anno · locale singolo</span>
            <span className="t-kpi num">€1.300</span>
            <p className="t-small">
              Solo dal confronto automatico dei listini fornitore, con i rincari intercettati il
              giorno in cui arrivano.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
