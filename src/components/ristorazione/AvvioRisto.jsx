import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, PhoneCall, UploadCloud, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { EASE_MODAL } from '../../lib/motion';

const STEP_DURATION = 1900;
const DESKTOP_ROUTE_PROGRESS = [0, 0.339, 0.67, 1];
const MOBILE_ROUTE_PROGRESS = [0, 1 / 3, 2 / 3, 1];

const PASSI = [
  {
    icon: PhoneCall,
    t: 'Individuiamo la priorità',
    d: 'In una chiamata di 30 minuti ci racconti il locale, gli strumenti che usi e ciò che ti porta via tempo. Scegliamo il primo problema da affrontare e avviamo la verifica dei collegamenti.',
  },
  {
    icon: UploadCloud,
    t: 'Colleghiamo e verifichiamo i dati',
    d: 'Configuriamo le integrazioni concordate e importiamo lo storico disponibile. Controlliamo articoli, ricette e giacenze iniziali per costruire una base coerente.',
  },
  {
    icon: GraduationCap,
    t: 'Accompagniamo il team',
    d: 'Ti mostriamo come usare RUSH nelle operazioni quotidiane. Ogni persona impara le funzioni utili al proprio ruolo attraverso una sessione pratica.',
  },
  {
    icon: CheckCircle2,
    t: 'Partiamo e seguiamo i flussi',
    d: 'Nei primi giorni controlliamo insieme che i dati arrivino correttamente. Seguiamo le anomalie e restiamo il tuo riferimento per il lavoro gestito in RUSH.',
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
        label="Come partiamo"
        title={<>Partiamo dal tuo modo di lavorare e colleghiamo ciò che oggi è separato.</>}
        sub={
          <>
            Analizziamo gli strumenti del locale, configuriamo i flussi e accompagniamo il team
            nell’utilizzo di RUSH. Quattro passaggi per portare il centro operativo nel lavoro quotidiano.
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
            <article
              className={`onb__step${activeStep === i ? ' is-active' : ''}`}
              key={t}
            >
              <div className="onb__meta">
                <IconTile icon={Icon} size="sm" />
                <h3 className="onb__t">{t}</h3>
              </div>
              <p className="onb__d">{d}</p>
              <span className="onb__num" aria-hidden="true">{i + 1}</span>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
