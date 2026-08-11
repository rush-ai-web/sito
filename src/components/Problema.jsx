import { motion } from 'framer-motion';
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { EASE_MODAL, fadeUp, inView } from '../lib/motion';
import { Group, IconTile, Item, Reveal, Section } from './ui';

const FRASE =
  'I tuoi dati esistono già. Sono solo in sette posti diversi, e nessuno di quei posti parla con gli altri.';

const SINTOMI = [
  {
    icon: TrendingDown,
    t: 'Il margine vero non lo sa nessuno',
    d: 'Il costo di un piatto cambia ogni volta che entra una fattura. Se il ricettario non si aggiorna da solo, il food cost che hai in testa è quello di sei mesi fa.',
  },
  {
    icon: AlertTriangle,
    t: 'Gli aumenti passano inosservati',
    d: 'Un fornitore ritocca il prezzo del 7% e nessuno se ne accorge, perché nessuno confronta riga per riga ogni fattura con lo storico.',
  },
  {
    icon: Clock,
    t: 'Le risposte arrivano a fine mese',
    d: 'Quando il commercialista chiude i conti, il mese è finito da un pezzo. Le decisioni che contavano andavano prese trenta giorni prima.',
  },
];

/* la frase si accende parola per parola mentre la sezione scorre */
function FraseChiave({ testo }) {
  const parole = testo.split(' ');
  return (
    <motion.h2
      className="t-sec"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={{ show: { transition: { staggerChildren: 0.035 } } }}
      style={{ maxWidth: 940 }}
    >
      {parole.map((p, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block' }}
          variants={{
            hidden: { opacity: 0.16, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_MODAL } },
          }}
        >
          {p}
          {i < parole.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.h2>
  );
}

export default function Problema() {
  return (
    <Section id="problema" invert large>
      <Reveal>
        <p className="t-label" style={{ marginBottom: 22 }}>
          Il problema
        </p>
      </Reveal>

      <FraseChiave testo={FRASE} />

      <motion.p
        className="t-body"
        style={{ maxWidth: 620, marginTop: 28 }}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        Non è un problema di software mancante: di gestionali ne hai già. È un problema di
        traduzione tra sistemi che non sono mai stati pensati per stare nella stessa frase.
      </motion.p>

      <Group className="grid grid-3" delay={0.1} style={{ marginTop: 'var(--s-block)' }}>
        {SINTOMI.map((s) => (
          <Item key={s.t} className="card">
            <IconTile icon={s.icon} />
            <h3 className="t-card" style={{ marginTop: 22 }}>
              {s.t}
            </h3>
            <p className="t-small" style={{ marginTop: 12 }}>
              {s.d}
            </p>
          </Item>
        ))}
      </Group>
    </Section>
  );
}
