import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Pill } from './ui';
import { wordUp, fadeUp, EASE_MODAL, DUR } from '../lib/motion';

const sceneUrl = `${import.meta.env.BASE_URL}sfondo-umano-ai.png`;

const TITLE = ['Gestionali', 'su', 'misura,', 'con', "l'AI", 'dentro.'];

export default function Hero() {
  return (
    <section id="home" data-tone="light" className="section hero fx-grain">
      <div className="wrap hero__top">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.modal, ease: EASE_MODAL }}>
          <Pill icon={Sparkles}>Software house · gestionali &amp; AI</Pill>
        </motion.div>

        {/* il titolo si compone parola per parola */}
        <h1 className="t-hero hero__title">
          {TITLE.map((w, i) => (
            <span key={w + i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
              <motion.span
                style={{ display: 'inline-block' }}
                variants={wordUp}
                custom={i}
                initial="hidden"
                animate="show"
              >
                {w}
              </motion.span>
              {i < TITLE.length - 1 ? ' ' : ''}
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
          <a className="btn btn--primary" href="#contatti">
            Parliamone
            <ArrowRight size={17} strokeWidth={1.75} />
          </a>
          <a className="hero__link" href="#prodotto">
            <ArrowUpRight size={16} strokeWidth={1.75} />
            Cosa costruiamo
          </a>
        </motion.div>
      </div>

      {/* immagine di apertura — sotto il testo, mai sovrapposta */}
      <motion.div
        className="hero__scene"
        style={{ backgroundImage: `url(${sceneUrl})` }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE_MODAL, delay: 0.35 }}
        aria-hidden="true"
      />
    </section>
  );
}
