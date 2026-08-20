import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, Minus, Plus } from 'lucide-react';
import { Pill, IconTile } from './ui';
import { wordUp, fadeUp, EASE_MODAL, DUR } from '../lib/motion';

const sceneUrl = `${import.meta.env.BASE_URL}hero-umano-ai.png`;

/* due frasi, ognuna sempre sulla sua riga */
const SENTENCES = [
  ['Non', 'compri', 'un', 'gestionale.'],
  ['Te', 'lo', 'costruiamo.'],
];

/* i benefici fluttuano nello sfondo, ognuno in una posizione diversa,
   sopra le mani — mai sopra il titolo. Segnati con − (cala) e + (cresce). */
const FLOATS = [
  { sign: '-', t: 'Tempo perso', pos: { top: '50%', left: '3%' } },
  { sign: '-', t: 'Errori manuali', pos: { top: '70%', left: '12%' } },
  { sign: '-', t: 'Costi fissi', pos: { top: '86%', left: '5%' } },
  { sign: '+', t: 'Margine', pos: { top: '50%', right: '4%' } },
  { sign: '+', t: 'Controllo', pos: { top: '72%', right: '9%' } },
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="home" data-tone="light" className="section hero fx-grain">
      {/* immagine di sfondo — ancorata in basso, sopra il grain */}
      <motion.div
        className="hero__scene"
        style={{ backgroundImage: `url(${sceneUrl})` }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE_MODAL, delay: 0.35 }}
        aria-hidden="true"
      />

      {/* i tre benefici fluttuanti nello sfondo, ognuno in una posizione.
          Il wrapper posiziona; è l'intero contenitore-card che fluttua. */}
      {FLOATS.map(({ sign, t, pos }, i) => (
        <div key={t} className="hero__float" style={pos} aria-hidden="true">
          <motion.div
            className="hero__float-card"
            initial={{ opacity: 0, y: 14 }}
            animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.6, ease: EASE_MODAL, delay: 0.5 + i * 0.12 },
              y: { duration: 5.4 + i * 0.6, ease: 'easeInOut', repeat: Infinity, delay: 0.6 + i * 0.4 },
            }}
          >
            <IconTile icon={sign === '+' ? Plus : Minus} size="sm" accent={sign === '+'} />
            <span>{t}</span>
          </motion.div>
        </div>
      ))}

      <div className="wrap hero__top">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.modal, ease: EASE_MODAL }}>
          <Pill icon={Sparkles}>Software house · gestionali &amp; AI</Pill>
        </motion.div>

        {/* il titolo si compone parola per parola; ogni frase è una riga */}
        <h1 className="t-hero hero__title">
          {SENTENCES.map((words, s) => (
            <span key={s} className="hero__line">
              {words.map((w, i) => {
                const idx = s * 4 + i;
                return (
                  <span
                    key={w + i}
                    className="hero__word"
                    style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
                  >
                    <motion.span
                      style={{ display: 'inline-block' }}
                      variants={wordUp}
                      custom={idx}
                      initial="hidden"
                      animate="show"
                    >
                      {w}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          className="t-body hero__sub"
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="show"
        >
          <span className="hero__sub-accent">Software su misura + AI integrata.</span>
        </motion.p>

        <motion.div
          className="btn-row hero__cta"
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="show"
        >
          <a className="btn btn--primary btn--hero" href="#contatti">
            Prenota una call
            <span className="btn__arrow">
              <ArrowRight size={17} strokeWidth={2} />
            </span>
          </a>
          <a className="btn btn--hero btn--accent" href="#prodotto">
            Scopri come funziona
            <span className="btn__arrow">
              <ArrowRight size={17} strokeWidth={2} />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
