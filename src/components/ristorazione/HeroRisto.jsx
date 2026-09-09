import { motion } from 'framer-motion';
import { ArrowDown, UtensilsCrossed } from 'lucide-react';
import { fadeUp, EASE_MODAL } from '../../lib/motion';
import HeroSceneRisto from './HeroSceneRisto';

export default function HeroRisto() {
  return (
    <section id="home" data-tone="light" className="section hero fx-grain">
      <span className="hero__aurora" aria-hidden="true" />

      <div className="wrap hero__wrap">
        <motion.div className="hero__logo-eyebrow hero__logo-eyebrow--risto" variants={fadeUp} custom={0} initial="hidden" animate="show">
          <img
            src="./rush-logo-orange.webp"
            alt="Logo Rush Ristorazione"
            width="800"
            height="200"
            className="hero__logo-img hero__logo-img--l"
          />
          <img
            src="./rush-logo-orange-dark.webp"
            alt=""
            aria-hidden="true"
            width="800"
            height="200"
            className="hero__logo-img hero__logo-img--d"
          />
          <span className="risto-brand-icon risto-brand-icon--hero" aria-hidden="true">
            <UtensilsCrossed size={19} strokeWidth={2.15} />
          </span>
        </motion.div>

        <motion.h1 className="hero__title" variants={fadeUp} custom={1} initial="hidden" animate="show">
          Un solo cervello per <span className="hero-accent">tutto il locale</span>.
        </motion.h1>

        <motion.p className="hero__note" variants={fadeUp} custom={2} initial="hidden" animate="show">
          <strong>Magazzino, fatture, turni e incassi. Marketing, prenotazioni, sito e recensioni.</strong>{' '}
          <br className="hero-note-break" />
          Rush Ristorazione tiene insieme tutto quello che serve per far crescere il locale, in un
          solo posto.
        </motion.p>

        <motion.div className="btn-row hero__cta" variants={fadeUp} custom={3} initial="hidden" animate="show">
          <a className="btn btn--hero btn--accent" href="#contatti">
            Prenota una demo
            <span className="btn__badge">
              <ArrowDown size={16} strokeWidth={2.2} />
            </span>
          </a>
          <a className="btn btn--primary btn--hero" href="#funzioni">
            Scopri tutte le funzioni
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
          <HeroSceneRisto />
        </div>
      </motion.div>
    </section>
  );
}
