import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Pill } from './ui';
import HeroScene from './HeroScene';
import { wordUp, fadeUp, EASE_MODAL, DUR } from '../lib/motion';

/* il titolo si compone parola per parola e va a capo da solo */
const TITLE = ['Un', 'gestionale', 'costruito', 'attorno', 'alla', 'tua', 'azienda.'];

/* cosa cambia quando il gestionale è tuo: ciò che cala e ciò che cresce.
   Scorrono in una striscia sotto l'hero, sempre leggibile. */
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

/* striscia scorrevole sotto l'hero: la lista è duplicata così
   il loop si chiude senza stacco. */
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

export default function Hero() {
  return (
    <section id="home" data-tone="light" className="section hero fx-grain">
      {/* velo di luce che si muove piano dietro a tutto */}
      <span className="hero__aurora" aria-hidden="true" />

      <div className="wrap hero__grid">
        {/* colonna sinistra: quello che diciamo */}
        <div className="hero__text">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.modal, ease: EASE_MODAL }}
          >
            <Pill icon={Sparkles}>Software house · gestionali &amp; AI</Pill>
          </motion.div>

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

          <motion.p
            className="hero__lead"
            variants={fadeUp}
            custom={7}
            initial="hidden"
            animate="show"
          >
            <span className="hero__sub-accent">Software su misura + AI integrata.</span>
          </motion.p>

          <motion.p
            className="t-body hero__sub"
            variants={fadeUp}
            custom={8}
            initial="hidden"
            animate="show"
          >
            Progettiamo il sistema attorno ai tuoi processi, non il contrario. I dati restano
            aggiornati da soli, i documenti si registrano da soli, il lavoro ripetitivo esce dalla
            giornata.
          </motion.p>

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

        {/* colonna destra: il sistema al lavoro */}
        <HeroScene />
      </div>
    </section>
  );
}
