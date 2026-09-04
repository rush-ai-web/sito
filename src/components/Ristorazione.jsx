import { useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight, Boxes, Coins, Users, Megaphone, Check } from 'lucide-react';
import { Section, Pill, ThemeCtx } from './ui';
import { EASE_MODAL, inView } from '../lib/motion';

const VANTAGGI = [
  { icon: Boxes, t: 'Sai sempre cosa hai in magazzino, senza fare l’inventario a mano' },
  { icon: Coins, t: 'Vedi il margine reale di ogni piatto, non una stima a occhio' },
  { icon: Users, t: 'Turni e presenze del team, senza fogli Excel e messaggi in chat' },
  { icon: Megaphone, t: 'Marketing, promozioni e fidelizzazione clienti dallo stesso sistema' },
];

const INCLUSO = [
  'Import automatico delle fatture fornitore',
  'Costing FIFO su ogni ricetta',
  'App per timbrature e turni dello staff',
];

export default function Ristorazione() {
  const theme = useContext(ThemeCtx);
  const cardRef = useRef(null);
  /* La card è volutamente inversa rispetto alla pagina. */
  const logoSrc = theme === 'dark'
    ? './Rush%20ristorazione%20logo.png'
    : './Rush%20ristorazione%20logo%20con%20sfondo%20scuro.png';

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  return (
    <Section id="ristorazione" large>
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
            Il gestionale perfetto per bar e ristoranti
          </h2>

          <p className="t-body" style={{ marginTop: 14 }}>
            Per chi manda avanti il locale, non solo per chi lo tiene in ordine: sai a colpo
            d'occhio quanto margine fai su ogni piatto, quando un fornitore alza i prezzi e cosa
            sta per finire in magazzino.
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
            <a
              className="btn btn--primary btn--hero"
              href="https://ristorazione.rush.it"
              target="_blank"
              rel="noreferrer"
            >
              Scopri Rush Ristorazione
              <span className="btn__badge">
                <ArrowRight size={16} strokeWidth={2.2} />
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
              alt="Rush"
              width="1668"
              height="943"
              loading="lazy"
              className="risto2__brand-logo"
            />
            <span className="risto2__brand-seg">Ristorazione</span>
          </div>

          <div className="risto2__kpi">
            <span className="t-label">Pensato per crescere</span>
            <p className="t-body" style={{ marginTop: 10 }}>
              Un bar, un ristorante e una panineria? Non tre login separati: un unico gestionale
              con più sedi, dove il titolare vede tutto e ogni responsabile solo la sua.
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
