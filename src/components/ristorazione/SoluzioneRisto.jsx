import { motion } from 'framer-motion';
import { Lightbulb, Plug, Brain, MessageSquareText } from 'lucide-react';
import { Section, Head, Group, GlowCard } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const PASSI = [
  {
    icon: Plug,
    t: 'Collega quello che hai già',
    d: 'Cassa, cassetto contante, fatturazione elettronica, contabilità. Rush si aggancia in sola lettura e non tocca i sistemi che usi da anni.',
  },
  {
    icon: Brain,
    t: 'Capisce i tuoi dati',
    d: 'Legge vendite, fatture, magazzino e ricette e li mette in relazione: margini reali, food cost, aumenti fornitori, scarti. Aggiornato in continuo.',
    accent: true,
  },
  {
    icon: MessageSquareText,
    t: 'Risponde in italiano',
    d: 'Gli chiedi qualsiasi cosa a parole tue e ti risponde con numeri veri e le fonti. Niente report da ricostruire, niente formule.',
  },
];

/* sistemi con cui Rush dialoga - concretezza */
const SISTEMI = ['Zucchetti ilConto', 'Cassa in Cloud', 'Scloby', 'SDI / Fatture in Cloud', 'Cashmatic', 'Aruba'];

export default function SoluzioneRisto() {
  return (
    <Section id="soluzione" large>
      <span aria-hidden="true" className="soluzione-bulb" />
      <Head
        icon={Lightbulb}
        label="La soluzione"
        title={<>Un cervello che collega, capisce e risponde</>}
        sub={
          <>
            <strong>Rush non è un'altra cassa da imparare.</strong> È il layer di intelligenza che
            sta sopra i tuoi sistemi e trasforma dati sparsi in decisioni.
          </>
        }
      />

      <Group className="grid grid-3" each={0.09}>
        {PASSI.map(({ icon, t, d, accent }) => (
          <GlowCard key={t} icon={icon} title={t} accent={accent}>
            {d}
          </GlowCard>
        ))}
      </Group>

      <motion.div
        className="rh-compat"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.6, ease: EASE_MODAL }}
      >
        <span className="rh-compat__label">Si integra con</span>
        <div className="rh-compat__chips">
          {SISTEMI.map((s) => (
            <span className="chip chip--surface" key={s}>
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
