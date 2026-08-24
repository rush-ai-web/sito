import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroScene from './HeroScene';
import TextRotate from './TextRotate';
import { wordUp, fadeUp, EASE_MODAL } from '../lib/motion';

/* prima riga del titolo, fissa */
const L1 = ['Il', 'tuo', 'gestionale', 'su', 'misura,'];

/* seconda riga che ruota: copre AI + posto unico + automazione + risultato */
const ROTATE = ['con AI integrata', 'tutto in un posto', 'che lavora da solo', 'che ti fa crescere'];

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

export default function Hero() {
  return (
    <section id="home" data-tone="light" className="section hero fx-grain">
      <span className="hero__aurora" aria-hidden="true" />

      <div className="wrap hero__wrap">
        <motion.p
          className="hero__eyebrow"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          {COSE.map((c, i) => (
            <span key={c}>
              {i > 0 && <i>/</i>}
              {c}
            </span>
          ))}
        </motion.p>

        <h1 className="hero__title">
          <span className="hero__line">
            {L1.map((w, i) => (
              <Word key={w + i} w={w} i={i} />
            ))}
          </span>
          <span className="hero__line hero__line--slot">
            <TextRotate
              texts={ROTATE}
              mainClassName="hero__pill"
              splitLevelClassName="tr__word--wrap"
              elementLevelClassName="tr__c--pill"
              rotationInterval={2800}
              staggerDuration={0.02}
              staggerFrom="first"
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            />
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
          <a className="btn btn--primary btn--hero" href="#contatti">
            Prenota una call
            <span className="btn__badge">
              <ArrowRight size={16} strokeWidth={2.2} />
            </span>
          </a>
          <a className="btn btn--hero btn--accent" href="#prodotto">
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
