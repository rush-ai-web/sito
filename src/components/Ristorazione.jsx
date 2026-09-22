import { useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, UtensilsCrossed, Boxes, Coins, Users, Megaphone, Check } from 'lucide-react';
import { Section, Pill, ThemeCtx } from './ui';
import { EASE_MODAL, inView } from '../lib/motion';

const VANTAGGI = [
  { icon: Boxes, t: 'Controlli le scorte dai dati collegati di acquisto e consumo.' },
  { icon: Coins, t: 'Leggi il margine di ogni piatto a partire dai costi delle ricette.' },
  { icon: Users, t: 'Riunisci turni e presenze del team nello stesso ambiente.' },
  { icon: Megaphone, t: 'Coordini marketing, promozioni e fidelizzazione dal tuo centro operativo.' },
];

/* volutamente diverse dai vantaggi elencati a sinistra: lì il "cosa ci
   guadagni", qui funzioni concrete che non sono già citate */
const INCLUSO = [
  'Fatture cartacee registrate con una foto',
  'Avviso quando un fornitore alza i prezzi',
  'Menu engineering: quali piatti spingere',
  'Timbrature con QR e richieste ferie',
  'Import automatico delle fatture fornitore',
  'Calcolo dei costi FIFO su ogni ricetta',
  'App per timbrature e turni dello staff',
];

export default function Ristorazione() {
  const theme = useContext(ThemeCtx);
  const cardRef = useRef(null);
  /* La card è volutamente inversa rispetto alla pagina. */
  const logoSrc = theme === 'dark'
    ? './rush-logo-orange.webp'
    : './rush-logo-orange-dark.webp';

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  return (
    <Section id="ristorazione" large className="risto-orange">
      <span aria-hidden="true" className="ristorazione-bulb" />
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
            IL TUO LOCALE LAVORA. TU VEDI DOVE GUADAGNA.
          </h2>

          <p className="t-body" style={{ marginTop: 14 }}>
            RUSH collega i dati di cassa, acquisti, magazzino e personale. Hai un quadro più chiaro del margine sui piatti, degli aumenti dei fornitori e delle scorte da riordinare.
          </p>

          <ul className="risto2__list">
            {VANTAGGI.map(({ icon: Icon, t }) => (
              <li key={t}>
                <span className="icon-tile icon-tile--sm risto2__list-ic">
                  <Icon size={16} strokeWidth={1.9} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="risto2__cta-row">
            <a className="btn btn--accent btn--hero risto-discover" href="./ristorazione.html">
              Scopri RUSH Ristorazione
              <span className="btn__badge" aria-hidden="true">
                <ArrowRight size={18} strokeWidth={2} />
              </span>
            </a>
          </div>
        </motion.div>

        <motion.div
          ref={cardRef}
          onPointerMove={onMove}
          className="risto2__card contrast-card restaurant-card"
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
              alt="Logo Rush Ristorazione"
              width="1668"
              height="943"
              loading="lazy"
              className="risto2__brand-logo"
            />
            <span className="risto-brand-icon risto-brand-icon--card" aria-hidden="true">
              <UtensilsCrossed size={17} strokeWidth={2.15} />
            </span>
          </div>

          <div className="risto2__kpi">
            <span className="t-label">Più locali, un unico centro operativo</span>
            <p className="t-body" style={{ marginTop: 10 }}>
              Un bar, un ristorante e una panineria? Riunisci i dati delle tre attività in RUSH. Tu hai una visione complessiva, ogni responsabile segue la propria sede.
            </p>
          </div>

          <div className="risto2__incluso">
            <span className="t-label">Cosa include</span>
            <ul>
              {INCLUSO.map((v) => (
                <li key={v}>
                  <Check size={14} strokeWidth={2.4} />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
