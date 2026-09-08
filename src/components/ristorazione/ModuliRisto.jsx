import { motion } from 'framer-motion';
import {
  Puzzle,
  Globe,
  CalendarCheck,
  QrCode,
  Megaphone,
  Star,
  Wallet,
  MapPin,
  Share2,
  Phone,
  Store,
} from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

/* ogni modulo è un prodotto a sé: nome, cosa fa, prezzo indicativo.
   Nessun raggruppamento - li attivi uno alla volta, a scelta. */
const MODULI = [
  {
    icon: Globe,
    t: 'Sito web collegato',
    d: "Anche multilingua, aggiornato dagli stessi dati del gestionale: menu, orari, disponibilità.",
  },
  {
    icon: Megaphone,
    t: 'Marketing e CRM clienti',
    d: 'Promozioni da backend - sul sito o via QR in sala - WhatsApp marketing e un CRM che segmenta chi torna e chi rischia di sparire.',
  },
  {
    icon: CalendarCheck,
    t: 'Prenotazioni',
    d: 'Calendario unico tra backend e sito: il personale prenota da Rush, il cliente prenota online, mai un doppio inserimento.',
  },
  {
    icon: QrCode,
    t: 'Menu con QR code',
    d: 'Multilingua, aggiornato da backend: quando un piatto finisce, sparisce dal menu in tempo reale.',
  },
  {
    icon: Star,
    t: 'Monitoraggio recensioni',
    d: 'Google, TripAdvisor e Facebook in un posto solo, con notifica appena arriva una recensione negativa.',
  },
  {
    icon: Wallet,
    t: 'Card fedeltà digitale',
    d: 'Punti e premi sul telefono del cliente: come una tessera, ma senza il portafoglio pieno di plastica.',
  },
  {
    icon: MapPin,
    t: 'ADV su Maps, Google e Meta',
    d: 'Campagne mirate su chi sta cercando un locale come il tuo, in zona, adesso.',
  },
  {
    icon: Share2,
    t: 'Pagine social gestite',
    d: "A cura dell'agenzia partner Aletheia Marketing: contenuti e programmazione affidati a chi lo fa di mestiere.",
  },
  {
    icon: Phone,
    t: 'Assistenza AI su chiamate e chat',
    d: 'Risponde ai clienti anche quando il team è impegnato in sala, senza far squillare a vuoto.',
  },
  {
    icon: Store,
    t: 'Cura Google Business Profile',
    d: 'Orari, foto e risposte alle recensioni: la tua scheda Google sempre aggiornata, senza doverci pensare.',
  },
];

export default function ModuliRisto() {
  return (
    <Section id="moduli" grid large>
      <Head
        icon={Puzzle}
        label="Moduli opzionali"
        title={<>I moduli che fanno crescere il locale, uno alla volta</>}
        sub={
          <>
            Il gestionale resta semplice: quello che vedi sopra basta da solo.{' '}
            <strong>Questi si aggiungono quando vuoi far crescere il locale</strong>, non solo
            mandarlo avanti - li scegli tu, uno alla volta.
          </>
        }
      />

      <div className="rh-mods">
        {MODULI.map(({ icon: Icon, t, d }, i) => (
          <motion.div
            key={t}
            className="card card--lg card--glow rh-mod-tile"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE_MODAL, delay: (i % 3) * 0.07 }}
          >
            <IconTile icon={Icon} size="sm" />
            <h3 className="t-card" style={{ marginTop: 16, marginBottom: 8 }}>
              {t}
            </h3>
            <p className="t-body">{d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
