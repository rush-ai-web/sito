import { motion } from 'framer-motion';
import { Compass, PhoneCall, UploadCloud, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const PASSI = [
  {
    icon: PhoneCall,
    t: 'Ci raccontiamo il locale',
    d: 'Una chiamata di 30 minuti: guardiamo la tua cassa, i fornitori, come lavori oggi. Capiamo insieme se e dove Rush ti fa risparmiare tempo.',
  },
  {
    icon: UploadCloud,
    t: 'Colleghiamo cassa e fornitori',
    d: 'Importiamo lo storico, colleghiamo la cassa e le fatture elettroniche. Il magazzino parte già con i tuoi dati veri, non da zero.',
  },
  {
    icon: GraduationCap,
    t: 'Formiamo chi lo usa ogni giorno',
    d: 'Una sessione pratica con te e il team, sul locale vero. Niente manuali da leggere prima di iniziare.',
  },
  {
    icon: CheckCircle2,
    t: 'Sei operativo, restiamo vicini',
    d: 'Nei primi giorni monitoriamo insieme che tutto torni: cassa, magazzino, turni. Poi il gestionale lavora da solo.',
  },
];

export default function AvvioRisto() {
  return (
    <Section id="avvio" large>
      <Head
        icon={Compass}
        label="Come iniziamo"
        title={<>Dalla chiamata al giorno 1, senza fermare la cassa</>}
        sub={
          <>
            Il timore più comune non è il prezzo, è il cambio gestionale a metà stagione.
            Ecco esattamente cosa succede, passo per passo.
          </>
        }
      />

      <div className="onb">
        {PASSI.map(({ icon, t, d }, i) => (
          <motion.div
            className="onb__step"
            key={t}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.55, ease: EASE_MODAL, delay: i * 0.08 }}
          >
            <div className="onb__head">
              <IconTile icon={icon} size="sm" accent={i === PASSI.length - 1} />
              <span className="onb__num">{i + 1}</span>
            </div>
            <h3 className="onb__t">{t}</h3>
            <p className="onb__d">{d}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
