import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, PhoneCall, UploadCloud, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const STEP_DURATION = 1900;
const DESKTOP_ROUTE_PROGRESS = [0, 0.339, 0.67, 1];
const MOBILE_ROUTE_PROGRESS = [0, 1 / 3, 2 / 3, 1];

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
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveStep((step) => (step + 1) % PASSI.length);
    }, STEP_DURATION);

    return () => window.clearInterval(intervalId);
  }, [reduceMotion]);

  return (
    <Section id="avvio" large>
      <Head
        icon={Compass}
        label="Come lavoriamo"
        title={<>Rush entra nel locale senza fermarlo</>}
        sub={
          <>
            Partiamo da come lavori già, colleghiamo i dati e accompagniamo il team fino a quando tutto gira.
            Quattro passaggi chiari, senza salti nel vuoto.
          </>
        }
      />

      <div className="onb" aria-label="Le quattro fasi di attivazione di Rush">
        <svg className="onb__route onb__route--desktop" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="onb__route-base"
            d="M 460 110 H 750 Q 770 110 770 130 V 350 Q 770 370 750 370 H 250 Q 230 370 230 390 V 610 Q 230 630 250 630 H 750 Q 770 630 770 650 V 870 Q 770 890 750 890 H 540"
          />
          <motion.path
            className="onb__route-pulse"
            d="M 460 110 H 750 Q 770 110 770 130 V 350 Q 770 370 750 370 H 250 Q 230 370 230 390 V 610 Q 230 630 250 630 H 750 Q 770 630 770 650 V 870 Q 770 890 750 890 H 540"
            initial={false}
            animate={{ pathLength: reduceMotion ? 0 : DESKTOP_ROUTE_PROGRESS[activeStep] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.58, ease: EASE_MODAL }}
          />
        </svg>

        <svg className="onb__route onb__route--mobile" viewBox="0 0 60 1000" preserveAspectRatio="none" aria-hidden="true">
          <path className="onb__route-base" d="M 26 80 L 26 920" />
          <motion.path
            className="onb__route-pulse"
            d="M 26 80 L 26 920"
            initial={false}
            animate={{ pathLength: reduceMotion ? 0 : MOBILE_ROUTE_PROGRESS[activeStep] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.58, ease: EASE_MODAL }}
          />
        </svg>

        <div className="onb__steps">
          {PASSI.map(({ icon: Icon, t, d }, i) => (
            <motion.article
              className={`onb__step${activeStep === i ? ' is-active' : ''}`}
              key={t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.55, ease: EASE_MODAL, delay: i * 0.08 }}
            >
              <div className="onb__meta">
                <IconTile icon={Icon} size="sm" />
                <span className="onb__kicker">Passo {i + 1}</span>
              </div>
              <h3 className="onb__t">{t}</h3>
              <p className="onb__d">{d}</p>
              <span className="onb__num" aria-hidden="true">{i + 1}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
