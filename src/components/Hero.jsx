import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Timer, PiggyBank, TrendingUp } from 'lucide-react';
import { Pill } from './ui';
import { wordUp, fadeUp, EASE_MODAL, DUR } from '../lib/motion';

const sceneUrl = `${import.meta.env.BASE_URL}hero-umano-ai.png`;

/* due frasi, ognuna sempre sulla sua riga */
const SENTENCES = [
  ['Non', 'compri', 'un', 'gestionale.'],
  ['Te', 'lo', 'costruiamo.'],
];

export default function Hero() {
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

        {/* i tre benefici: icona in piastrella soft-accent + testo, in fila */}
        <motion.div
          className="hero__wins"
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="show"
        >
          {[
            [Timer, 'Meno tempo perso'],
            [PiggyBank, 'Meno costi'],
            [TrendingUp, 'Più margine'],
          ].map(([Icon, label]) => (
            <span className="hero__win" key={label}>
              <span className="hero__win__ic">
                <Icon size={17} strokeWidth={2} />
              </span>
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="btn-row hero__cta"
          variants={fadeUp}
          custom={9}
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
