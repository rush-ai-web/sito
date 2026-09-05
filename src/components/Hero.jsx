import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Sparkles, Layers, Zap, TrendingUp } from 'lucide-react';
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
  /* al primo mount evitiamo la spring per carattere (pesa 15+ animazioni
     simultanee): letters entrano in blocco con la pill. Dopo la prima
     rotazione torna sempre la spring per lettera, anche quando il ciclo
     torna alla prima frase, così il giro è smooth come gli altri cambi. */
  const [started, setStarted] = useState(false);
  const useBlock = i === 0 && !started;

  /* layout OFF durante l'entrata: al mount il font Horizon (font-display
     block) non ha ancora disposto il titolo, così `layout` misurerebbe la
     pill nel posto sbagliato e la farebbe slittare sopra il titolo. Lo
     accendiamo solo dopo l'assestamento, per animare la larghezza ai cambi
     frase. */
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    if (reduce) return undefined;
    const settle = setTimeout(() => setLayoutReady(true), 1300);
    const id = setInterval(() => {
      setStarted(true);
      setI((v) => (v + 1) % ROTATE.length);
    }, 4600);
    return () => {
      clearTimeout(settle);
      clearInterval(id);
    };
  }, [reduce]);

  const { t, Icon } = ROTATE[i];
  const chars = Array.from(t);

  return (
    <motion.span
      className="hero__pill"
      layout={layoutReady}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? {} : { opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.7, ease: EASE_MODAL, delay: 0.35 },
        y: { duration: 0.75, ease: EASE_MODAL, delay: 0.35 },
        layout: { type: 'spring', damping: 32, stiffness: 240 },
      }}
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
            {useBlock || reduce
              ? chars.map((c, cIdx) => (
                  <span key={cIdx} className="hero__pill-c-wrap">
                    <span className="hero__pill-c">{c === ' ' ? ' ' : c}</span>
                  </span>
                ))
              : chars.map((c, cIdx) => (
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
          {useBlock || reduce ? (
            <span className="hero__pill-ic">
              <Icon size={30} strokeWidth={2} />
            </span>
          ) : (
            <motion.span
              className="hero__pill-ic"
              initial={{ rotate: 25, scale: 0.7, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -20, scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            >
              <Icon size={30} strokeWidth={2} />
            </motion.span>
          )}
        </motion.span>
      </AnimatePresence>

      {/* riflesso premium: banda diagonale che attraversa TUTTA l'area
         accento. Keyed su i → rimonta e riparte ad ogni cambio frase.
         Animato in transform (GPU), non in background-position. */}
      {!reduce && <span className="hero__pill-shine" key={`shine-${i}`} aria-hidden="true" />}
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
          <img
            src="./rush-logo.png"
            srcSet="./rush-logo-192.png 192w, ./rush-logo-320.png 320w, ./rush-logo.png 800w"
            sizes="144px"
            alt="Rush"
            width="800"
            height="200"
            className="hero__logo-img hero__logo-img--l"
          />
          <img
            src="./rush-logo-dark.png"
            srcSet="./rush-logo-dark-192.png 192w, ./rush-logo-dark-320.png 320w, ./rush-logo-dark.png 800w"
            sizes="144px"
            alt="Rush"
            width="800"
            height="200"
            className="hero__logo-img hero__logo-img--d"
          />
        </motion.div>

        <h1 className="hero__title">
          <span className="hero__line">
            {L1.slice(0, 3).map((w, i) => <Word key={w + i} w={w} i={i} />)}
            <span className="hero__br" aria-hidden="true" />
            {L1.slice(3).map((w, i) => <Word key={w + i + 3} w={w} i={i + 3} />)}
          </span>
          <span className="hero__line hero__line--slot">
            <RotatingSlot />
          </span>
        </h1>

        <motion.p
          className="hero__note"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <strong>Il gestionale si adatta alla tua azienda, non il contrario.</strong>{' '}
          Collega processi e strumenti e automatizza il lavoro ripetitivo.
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
              <ArrowDown size={16} strokeWidth={2.2} />
            </span>
          </a>
          <a className="btn btn--primary btn--hero" href="#ecosistema">
            Scopri come funziona
            <span className="btn__badge">
              <ArrowDown size={16} strokeWidth={2.2} />
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
