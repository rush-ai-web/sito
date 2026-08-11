import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { Pill, LiveDot } from './ui';
import { wordUp, fadeUp, EASE_MODAL, DUR } from '../lib/motion';

const TITLE = ['Gestionali', 'su', 'misura,', 'con', "l'AI", 'dentro.'];

const TRUST = ['Software proprietario', 'Dati in tempo reale', 'Automazioni su misura'];

export default function Hero() {
  return (
    <section id="home" data-tone="light" className="section section--lg hero fx-grid fx-spot">
      <span className="fx-brand" aria-hidden="true" />
      <div className="wrap hero__inner">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.modal, ease: EASE_MODAL }}>
          <Pill icon={Sparkles}>Software house · gestionali &amp; AI</Pill>
        </motion.div>

        {/* il titolo si compone parola per parola */}
        <h1 className="t-hero" style={{ maxWidth: '17ch' }}>
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
              {i < TITLE.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>

        <motion.p
          className="t-body hero__sub"
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
        >
          Progettiamo e sviluppiamo il sistema gestionale che la tua azienda usa davvero: costruito
          sui tuoi processi, non su quelli di un software preconfezionato. Dati reali sempre
          aggiornati, automazioni al posto del lavoro manuale, intelligenza artificiale integrata
          dove serve.
        </motion.p>

        <motion.div
          className="btn-row"
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="show"
          style={{ justifyContent: 'center' }}
        >
          <a className="btn btn--primary" href="#contatti">
            Parliamo del tuo progetto
            <ArrowRight size={17} strokeWidth={1.75} />
          </a>
          <a className="btn btn--secondary" href="#soluzione">
            Cosa costruiamo
          </a>
        </motion.div>

        <motion.div className="hero__trust" variants={fadeUp} custom={9} initial="hidden" animate="show">
          {TRUST.map((t) => (
            <span key={t}>
              <Check size={15} strokeWidth={2} />
              {t}
            </span>
          ))}
        </motion.div>

        <motion.p
          className="t-small hero__live"
          variants={fadeUp}
          custom={11}
          initial="hidden"
          animate="show"
        >
          <LiveDot />
          Sistemi in produzione · dati aggiornati in tempo reale
        </motion.p>
      </div>
    </section>
  );
}
