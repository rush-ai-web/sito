import { motion } from 'framer-motion';
import {
  Puzzle,
  Globe,
  CalendarCheck,
  QrCode,
  Megaphone,
  MessageCircle,
  Users,
  Wallet,
  TrendingUp,
  Share2,
  MapPin,
  Star,
  Phone,
  Check,
} from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

/* moduli opzionali raggruppati in 3 cluster strategici, non in tante
   tessere sparse: ogni cluster è un pezzo dello stesso motore, e il CRM
   (dati clienti) è il perno che li tiene insieme. */
const CLUSTER = [
  {
    icon: Globe,
    t: 'Presenza digitale',
    d: "Il locale online nasce dagli stessi dati del backend: aggiorni una volta, si vede ovunque.",
    items: [
      { icon: Globe, t: 'Sito web collegato', d: 'Anche multilingua, con menu e disponibilità sempre aggiornati' },
      { icon: CalendarCheck, t: 'Prenotazioni', d: 'Da backend e da sito, stesso calendario: niente doppi inserimenti' },
      { icon: QrCode, t: 'Menu con QR code', d: 'Multilingua, lo aggiorni da backend e il cliente lo vede subito' },
    ],
  },
  {
    icon: Users,
    t: 'Marketing e fidelizzazione',
    d: 'Promozioni, messaggi e premi nascono dagli stessi dati clienti nel CRM, non da fogli sparsi.',
    items: [
      { icon: Megaphone, t: 'Promozioni da backend', d: 'Sul sito, o autonome in sala: mostri il QR e sblocchi la promo' },
      { icon: MessageCircle, t: 'WhatsApp marketing', d: 'Messaggi mirati sui segmenti del CRM, non a pioggia' },
      { icon: Users, t: 'CRM clienti', d: 'Visite, spesa, preferenze: chi torna spesso e chi rischia di sparire' },
      { icon: Wallet, t: 'Card fedeltà digitale', d: 'Punti e premi sul telefono del cliente, senza tessere di carta' },
    ],
  },
  {
    icon: TrendingUp,
    t: 'Visibilità e assistenza',
    d: "Fatti trovare da chi cerca un locale come il tuo, e rispondi sempre - anche a sala piena.",
    items: [
      { icon: MapPin, t: 'ADV su Maps, Google e Meta', d: 'Campagne mirate su chi sta cercando un locale in zona' },
      { icon: Share2, t: 'Pagine social gestite', t2: '(agenzia partner Aletheia Marketing)', d: 'Contenuti e programmazione affidati a chi lo fa di mestiere' },
      { icon: Star, t: 'Scheda Google Business + recensioni', d: 'Orari, foto e risposte alle recensioni sempre aggiornati' },
      { icon: Phone, t: 'Assistenza AI su chiamate e chat', d: 'Risponde ai clienti quando il team è impegnato in sala' },
    ],
  },
];

export default function ModuliRisto() {
  return (
    <Section id="moduli" grid large>
      <Head
        icon={Puzzle}
        label="Moduli opzionali"
        title={<>Cresci un pezzo alla volta, con un'unica strategia dietro</>}
        sub={
          <>
            Il core copre l'operatività. <strong>I moduli extra si accendono a scelta</strong> e
            lavorano tutti sugli stessi dati del CRM, così ogni promozione, messaggio o campagna
            parte da chi sono davvero i tuoi clienti - non da un tentativo isolato.
          </>
        }
      />

      <div className="rh-mod-grid">
        {CLUSTER.map(({ icon: Icon, t, d, items }, ci) => (
          <motion.div
            key={t}
            className="card card--lg card--glow rh-mod-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.6, ease: EASE_MODAL, delay: ci * 0.08 }}
          >
            <IconTile icon={Icon} accent />
            <h3 className="t-card" style={{ marginTop: 18, marginBottom: 8 }}>
              {t}
            </h3>
            <p className="t-body" style={{ marginBottom: 18 }}>
              {d}
            </p>

            <ul className="rh-mod-list">
              {items.map(({ icon: ItemIcon, t: it, t2, d: id }) => (
                <li key={it}>
                  <span className="rh-mod-list__ic">
                    <ItemIcon size={14} strokeWidth={2} />
                  </span>
                  <span>
                    <strong>
                      {it}
                      {t2 ? <span className="rh-mod-list__tag"> {t2}</span> : null}
                    </strong>
                    <span className="rh-mod-list__d">{id}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <p className="rh-mod-note">
        <Check size={14} strokeWidth={2.4} />
        E non finisce qui: nuovi moduli nascono dalle richieste dei primi locali che li usano - se
        ti serve qualcosa che non vedi, ne parliamo in demo.
      </p>
    </Section>
  );
}
