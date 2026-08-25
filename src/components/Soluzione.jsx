import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Lightbulb,
  Blocks,
  Activity,
  Workflow,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { Section, Head, IconTile } from './ui';
import { EASE_MODAL } from '../lib/motion';

/* le sei pill che orbitano attorno al titolo. Cliccando si aprono
   con una scheda che espone il dettaglio. Sotto i 1160px l'orbita
   si spegne e diventano una griglia (fallback in CSS). */
const ORBIT = [
  {
    id: 1,
    icon: Blocks,
    t: 'Costruito sui tuoi\nprocessi reali',
    body: "Nessun template preconfezionato: i moduli, i campi e i flussi seguono come lavori davvero oggi.",
    related: [2, 6],
  },
  {
    id: 2,
    icon: Activity,
    t: 'Dati aggiornati\nal secondo',
    body: 'Ogni movimento — vendita, carico, pagamento — arriva subito nei report. Niente foglio Excel di fine mese.',
    related: [1, 3],
  },
  {
    id: 3,
    icon: Workflow,
    t: 'Automazioni al posto\ndel lavoro manuale',
    body: 'Registrazioni, riordini, promemoria e conciliazioni girano da soli. Tu decidi, il gestionale esegue.',
    related: [2, 4],
  },
  {
    id: 4,
    icon: Sparkles,
    t: 'AI integrata\ndove serve davvero',
    body: 'Non un chatbot appiccicato: l\'AI legge i tuoi dati e risponde con numeri veri, non con teorie.',
    related: [3, 5],
  },
  {
    id: 5,
    icon: ShieldCheck,
    t: 'Il software resta\ntuo, non in affitto',
    body: 'Nessuna licenza mensile che sale ogni anno. Il gestionale è tuo, per sempre, con supporto continuo.',
    related: [4, 6],
  },
  {
    id: 6,
    icon: Smartphone,
    t: 'Stessa esperienza\nda desktop e mobile',
    body: "Interfaccia identica in ufficio e in movimento: apri, cerchi, aggiorni — senza doverlo reimparare.",
    related: [5, 1],
  },
];

/* orbita ellittica: più larga che alta, così le pill non si sovrappongono
   al titolo e c'è spazio per contenuto largo. */
const RADIUS_X = 560;
const RADIUS_Y = 320;
const SPEED = 0.15;
const STEP = 360 / ORBIT.length;

export default function Soluzione() {
  const reduce = useReducedMotion();
  const [angle, setAngle] = useState(0);
  const [openId, setOpenId] = useState(null);
  const rafRef = useRef(null);
  const autoRotate = openId === null && !reduce;

  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      setAngle((a) => (a + SPEED) % 360);
    }, 50);
    rafRef.current = id;
    return () => clearInterval(id);
  }, [autoRotate]);

  const focusNode = (id) => {
    const idx = ORBIT.findIndex((o) => o.id === id);
    if (idx < 0) return;
    /* -90° = alto. Vogliamo idx*STEP + angle ≡ -90 (mod 360) */
    let target = -90 - idx * STEP;
    target = ((target % 360) + 360) % 360;
    setAngle(target);
  };

  const openItem = ORBIT.find((o) => o.id === openId);
  const relatedIds = openItem ? openItem.related : [];

  const onContainerClick = (e) => {
    if (e.target.closest('.orbit__card') || e.target.closest('.orbit-card')) return;
    setOpenId(null);
  };

  return (
    <Section id="soluzione" large spot>
      <div className="orbit orbit--radial" onClick={onContainerClick}>
        {/* pista orbitale */}
        <span className="orbit__ring" aria-hidden="true" />
        <span className="orbit__ring orbit__ring--in" aria-hidden="true" />

        {/* nucleo con il titolo */}
        <div className="orbit__core">
          <Head
            icon={Lightbulb}
            label="La soluzione"
            title={
              <>
                Un gestionale disegnato attorno a come lavori già
              </>
            }
            sub="Partiamo dai tuoi processi, non da un template. Quello che serve c'è, quello che non serve non lo paghi."
          />
        </div>

        {/* pill orbitanti */}
        {ORBIT.map((item, idx) => {
          const a = ((idx * STEP) + angle) % 360;
          const rad = (a * Math.PI) / 180;
          const x = Math.cos(rad) * RADIUS_X;
          const y = Math.sin(rad) * RADIUS_Y;
          const isOpen = openId === item.id;
          const isRelated = relatedIds.includes(item.id);
          const isDim = openId !== null && !isOpen && !isRelated;
          const Icon = item.icon;

          return (
            <motion.button
              type="button"
              key={item.id}
              className={`orbit__card orbit-card${isOpen ? ' is-open' : ''}${isRelated ? ' is-related' : ''}${isDim ? ' is-dim' : ''}`}
              style={{
                left: '50%',
                top: '50%',
                x,
                y,
                translateX: '-50%',
                translateY: '-50%',
              }}
              transition={{ type: 'tween', ease: [0.22, 0.68, 0.28, 1], duration: openId !== null ? 0.7 : 0.05 }}
              onClick={(e) => {
                e.stopPropagation();
                if (openId === item.id) {
                  setOpenId(null);
                } else {
                  focusNode(item.id);
                  setOpenId(item.id);
                }
              }}
              aria-expanded={isOpen}
            >
              <div className="orbit-card__row">
                <IconTile icon={Icon} size="sm" />
                <span className="orbit-card__t">
                  {item.t.split('\n').map((line, k) => (
                    <span key={k} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                </span>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="orbit-card__pop"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: EASE_MODAL }}
                  >
                    <p>{item.body}</p>
                    <span className="orbit-card__chev">
                      <ArrowRight size={14} strokeWidth={2.2} />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </Section>
  );
}
