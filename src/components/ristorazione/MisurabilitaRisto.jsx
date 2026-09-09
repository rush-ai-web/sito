import { motion } from 'framer-motion';
import { Gauge, Globe, Megaphone, MousePointerClick, CalendarCheck, MapPin, Ticket } from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const METRICHE = [
  { icon: Globe, lab: 'Visite al sito', v: '2.140', sub: 'e cosa hanno cercato di più' },
  { icon: Megaphone, lab: 'Promo utilizzate', v: '340', sub: 'Aperitivo del giovedì' },
  { icon: MousePointerClick, lab: 'Click da ADV', v: '1.240', sub: 'Google Ads, ultimi 30 giorni' },
  { icon: CalendarCheck, lab: 'Prenotazioni da ADV', v: '86', sub: 'generate dalle campagne' },
  { icon: MapPin, lab: 'Richieste indicazioni', v: '412', sub: 'da Google Maps' },
  { icon: Ticket, lab: 'Coupon scaricati', v: '210', sub: 'dalle promozioni attive' },
];

export default function MisurabilitaRisto() {
  return (
    <Section id="misurabilita" large>
      <Head
        icon={Gauge}
        label="Risultati misurabili"
        title={<>Non promesse. Numeri, uno per uno</>}
        className="head--wide-summary"
        sub={
          <>
            <strong>Hai il sito web?</strong> Sai quante persone l'hanno visitato e cosa
            cercavano.
            <br />
            <strong>Fai una promozione?</strong> Sai in tempo reale quante persone l'hanno usata.
            <br />
            <strong>Fai pubblicità?</strong> Sai quanti hanno cliccato, quanti hanno prenotato,
            quanti sono passati a chiedere indicazioni.
            <br />
            <br />
            <strong>Ogni euro investito nella crescita del locale lascia un numero, non un atto
            di fede.</strong>
          </>
        }
      />

      <motion.div
        className="rh-metrics"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.65, ease: EASE_MODAL }}
      >
        <div className="rh-metrics__bar" aria-hidden="true">
          <span className="rh-metrics__dot" />
          <span className="rh-metrics__dot" />
          <span className="rh-metrics__dot" />
          <span className="rh-metrics__title">Rush · Le tue campagne</span>
        </div>

        <div className="rh-metrics__grid">
          {METRICHE.map(({ icon: Icon, lab, v, sub }) => (
            <div className="rh-metrics__tile" key={lab}>
              <span className="rh-metrics__ic">
                <Icon size={16} strokeWidth={2} />
              </span>
              <span className="rh-metrics__lab">{lab}</span>
              <span className="rh-metrics__v num">{v}</span>
              <span className="rh-metrics__sub">{sub}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
