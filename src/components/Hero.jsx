import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Pill } from './ui';
import { wordUp, fadeUp, EASE_MODAL, DUR } from '../lib/motion';

const sceneUrl = `${import.meta.env.BASE_URL}hero-umano-ai.png`;

const TITLE = ['Gestionali', 'su', 'misura,', 'resi', 'intelligenti', "dall'AI."];

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

        {/* il titolo si compone parola per parola */}
        <h1 className="t-hero hero__title">
          {TITLE.map((w, i) => (
            <span
              key={w + i}
              className="hero__word"
              style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
            >
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
          ))}
        </h1>

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
          <a className="btn btn--secondary btn--hero" href="#prodotto">
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
