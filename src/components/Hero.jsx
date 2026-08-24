import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroScene from './HeroScene';
import { wordUp, fadeUp, EASE_MODAL } from '../lib/motion';

/* il titolo si compone parola per parola, su due registri:
   la prima riga piena, la seconda a contorno. */
const L1 = ['Un', 'gestionale', 'costruito'];
const L2 = ['attorno', 'alla', 'tua', 'azienda'];

/* cosa facciamo, elencato secco negli angoli */
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

function Word({ w, i, cls = '' }) {
  return (
    <span className={`hero__word ${cls}`}>
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
        {/* riga alta: cosa facciamo a sinistra, cosa significa a destra */}
        <div className="hero__band">
          <motion.ul
            className="hero__list"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
          >
            {COSE.map((c) => (
              <li key={c}>
                <span>/</span>
                {c}
              </li>
            ))}
          </motion.ul>

          <motion.p
            className="hero__note"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
          >
            Progettiamo il sistema attorno ai tuoi processi, non il contrario. I dati restano
            aggiornati da soli, i documenti si registrano da soli, il lavoro ripetitivo esce dalla
            giornata.
          </motion.p>
        </div>

        {/* il titolo, in due registri */}
        <h1 className="hero__title">
          <span className="hero__line">
            {L1.map((w, i) => (
              <Word key={w} w={w} i={i} />
            ))}
          </span>
          <span className="hero__line hero__line--out">
            {L2.map((w, i) => (
              <Word key={w} w={w} i={i + L1.length} />
            ))}
          </span>
        </h1>

        {/* riga bassa: azioni a sinistra, promessa a destra */}
        <motion.div
          className="hero__act"
          variants={fadeUp}
          custom={8}
          initial="hidden"
          animate="show"
        >
          <div className="btn-row">
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
          </div>

          <p className="hero__claim">
            <span className="hero__sub-accent">Software su misura + AI integrata</span>
          </p>
        </motion.div>
      </div>

      {/* il sistema emerge dal fondo della schermata */}
      <motion.div
        className="hero__stage"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_MODAL, delay: 0.45 }}
      >
        <div className="wrap hero__stage-in">
          <HeroScene />
        </div>
      </motion.div>
    </section>
  );
}
