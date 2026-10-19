import { useEffect, useRef, useState } from 'react';
import { Entrance } from '../Entrance';
import { useReducedMotion } from '../../lib/preferences';
import { Compass, PhoneCall, UploadCloud, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { EASE_MODAL } from '../../lib/motion';
import { useAnimationActivity, useIsMobile } from '../../lib/hooks';

const STEP_DURATION = 1900;
const DESKTOP_ROUTE_PROGRESS = [0, 0.339, 0.67, 1];
const MOBILE_ROUTE_PROGRESS = [0, 1 / 3, 2 / 3, 1];
const DESKTOP_ROUTE = 'M 460 110 H 750 Q 770 110 770 130 V 350 Q 770 370 750 370 H 250 Q 230 370 230 390 V 610 Q 230 630 250 630 H 750 Q 770 630 770 650 V 870 Q 770 890 750 890 H 540';
const MOBILE_ROUTE = 'M 26 80 L 26 920';

// Native stroke animation: pause the existing effect during card entrances
// and offscreen, then continue at the same position instead of jumping/resetting.
function RoutePulse({ d, progress, active, reduce }) {
  const ref = useRef(null);
  const animation = useRef(null);
  const previous = useRef(progress);
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const from = previous.current;
    previous.current = progress;
    if (reduce || from === progress || !ref.current?.animate) return;
    const effect = ref.current.animate([
      { strokeDashoffset: 1 - from },
      { strokeDashoffset: 1 - progress },
    ], { duration: 580, easing: `cubic-bezier(${EASE_MODAL.join(',')})`, fill: 'backwards' });
    animation.current = effect;
    if (!activeRef.current) effect.pause();
    return () => { effect.cancel(); animation.current = null; };
  }, [progress, reduce]);
  useEffect(() => {
    const effect = animation.current;
    if (!effect || effect.playState === 'finished') return;
    if (active) effect.play();
    else effect.pause();
  }, [active]);
  return <path ref={ref} className="onb__route-pulse" d={d}
    pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} />;
}

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
  const [stepsRef, active] = useAnimationActivity({ pauseDuringEntrance: true });
  const compact = useIsMobile();
  const [activeStep, setActiveStep] = useState(0);
  const route = compact ? MOBILE_ROUTE : DESKTOP_ROUTE;
  const progress = (compact ? MOBILE_ROUTE_PROGRESS : DESKTOP_ROUTE_PROGRESS)[activeStep];

  useEffect(() => {
    if (reduceMotion || !active) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveStep((step) => (step + 1) % PASSI.length);
    }, STEP_DURATION);

    return () => window.clearInterval(intervalId);
  }, [reduceMotion, active]);

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

      <div className="onb" ref={stepsRef} aria-label="Le quattro fasi di attivazione di Rush">
        <svg className={`onb__route onb__route--${compact ? 'mobile' : 'desktop'}`}
          viewBox={compact ? '0 0 60 1000' : '0 0 1000 1000'} preserveAspectRatio="none" aria-hidden="true">
          <path className="onb__route-base" d={route} />
          <RoutePulse d={route} progress={reduceMotion ? 0 : progress}
            active={active} reduce={reduceMotion} />
        </svg>

        <div className="onb__steps">
          {PASSI.map(({ icon: Icon, t, d }, i) => (
            <Entrance as="article" direction={i % 2 === 0 ? 'left' : 'right'}
              className={`onb__step${activeStep === i ? ' is-active' : ''}`}
              key={t}
            >
              <div className="onb__meta">
                <IconTile icon={Icon} size="sm" />
                <h3 className="onb__t">{t}</h3>
              </div>
              <p className="onb__d">{d}</p>
              <span className="onb__num" aria-hidden="true">{i + 1}</span>
            </Entrance>
          ))}
        </div>
      </div>
    </Section>
  );
}
