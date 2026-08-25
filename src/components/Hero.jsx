import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Zap, TrendingUp } from 'lucide-react';
import HeroScene from './HeroScene';
import { wordUp, fadeUp, EASE_MODAL } from '../lib/motion';

/* prima riga del titolo, fissa */
const L1 = ['Il', 'tuo', 'gestionale', 'su', 'misura,'];

/* seconda riga che ruota: copre AI + posto unico + automazione + risultato.
   Ogni frase ha un'icona che le sta accanto per farla riconoscere subito. */
const ROTATE = [
  { t: 'con AI integrata', Icon: Sparkles },
  { t: 'tutto in un posto', Icon: Layers },
  { t: 'che lavora da solo', Icon: Zap },
  { t: 'che ti fa crescere', Icon: TrendingUp },
];

/* la riga alta di categorie */
const COSE = ['Gestionali su misura', 'Automazioni end-to-end', 'AI dentro al flusso'];

/* cosa cambia quando il gestionale è tuo: ciò che cala e ciò che cresce. */
const OUTCOMES = [
  { sign: '−', t: 'Tempo perso' },
  { sign: '+', t: 'Margine' },
  { sign: '−', t: 'Errori manuali' },
  { sign: '+', t: 'Controllo sui dati' },
  { sign: '−', t: 'Costi fissi' },
  { sign: '+', t: 'Automazioni' },
  { sign: '−', t: 'Doppi inserimenti' },
  { sign: '+', t: 'Decisioni sui numeri veri' },
];

export function OutcomeTicker() {
  return (
    <div className="ticker" aria-label="Cosa cambia con un gestionale su misura">
      <div className="ticker__track">
        {[0, 1].map((copy) => (
          <div className="ticker__group" key={copy} aria-hidden={copy === 1}>
            {OUTCOMES.map(({ sign, t }) => (
              <span className={`oc ${sign === '+' ? 'is-up' : 'is-down'}`} key={t}>
                <span className="oc__sign">{sign}</span>
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Word({ w, i }) {
  return (
    <span className="hero__word">
      <motion.span
        style={{ display: 'inline-block' }}
        variants={wordUp}
        custom={i}
        initial="hidden"
        animate="show"
      >
        {w}
      </motion.span>
    </span>
  );
}

/* la pill che cambia: icona + testo animano insieme, la larghezza
   segue il contenuto grazie a layout, il testo entra lettera per lettera. */
function RotatingSlot() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    /* 4.6s: lento e leggibile, non un ticker */
    const id = setInterval(() => setI((v) => (v + 1) % ROTATE.length), 4600);
    return () => clearInterval(id);
  }, [reduce]);

  const { t, Icon } = ROTATE[i];
  const chars = Array.from(t);

  return (
    <motion.span
      className="hero__pill"
      layout
      transition={{ type: 'spring', damping: 30, stiffness: 260 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="hero__pill-in"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: EASE_MODAL }}
        >
          <span className="hero__pill-t">
            {chars.map((c, cIdx) => (
              <span key={cIdx} className="hero__pill-c-wrap">
                <motion.span
                  className="hero__pill-c"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-120%', opacity: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 26,
                    stiffness: 340,
                    delay: cIdx * 0.028,
                  }}
                >
                  {c === ' ' ? ' ' : c}
                </motion.span>
              </span>
            ))}
          </span>
          <motion.span
            className="hero__pill-ic"
            initial={{ rotate: 25, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -20, scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          >
            <Icon size={30} strokeWidth={2} />
          </motion.span>
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

export default function Hero() {
  return (
    <section id="home" data-tone="light" className="section hero fx-grain">
      <span className="hero__aurora" aria-hidden="true" />

      <div className="wrap hero__wrap">
        <motion.div
          className="hero__logo-eyebrow"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <img src="./rush-logo.png" alt="Rush" className="hero__logo-img hero__logo-img--l" />
          <img src="./rush-logo-dark.png" alt="Rush" className="hero__logo-img hero__logo-img--d" />
        </motion.div>

        <h1 className="hero__title">
          <span className="hero__line">
            {L1.map((w, i) => (
              <span key={w + i} style={{ display: 'contents' }}>
                {i === 3 && <span className="hero__br" aria-hidden="true" />}
                <Word w={w} i={i} />
              </span>
            ))}
          </span>
          <span className="hero__line hero__line--slot">
            <RotatingSlot />
          </span>
        </h1>

        <motion.p
          className="hero__note"
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="show"
        >
          Costruito attorno alla tua azienda: i dati restano aggiornati da soli, i documenti si
          registrano da soli, il lavoro ripetitivo esce dalla giornata.
        </motion.p>

        <motion.div
          className="btn-row hero__cta"
          variants={fadeUp}
          custom={9}
          initial="hidden"
          animate="show"
        >
          <a className="btn btn--hero btn--accent" href="#contatti">
            Prenota una call
            <span className="btn__badge">
              <ArrowRight size={16} strokeWidth={2.2} />
            </span>
          </a>
          <a className="btn btn--primary btn--hero" href="#prodotto">
            Scopri come funziona
            <span className="btn__badge">
              <ArrowRight size={16} strokeWidth={2.2} />
            </span>
          </a>
        </motion.div>
      </div>

      <motion.div
        className="hero__stage"
        initial={{ opacity: 0, y: 44 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_MODAL, delay: 0.4 }}
      >
        <span className="hero__beam" aria-hidden="true" />
        <div className="wrap">
          <HeroScene />
        </div>
      </motion.div>
    </section>
  );
}
