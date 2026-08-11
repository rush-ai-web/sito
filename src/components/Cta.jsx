import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { DUR, EASE_MODAL, inView } from '../lib/motion';
import { LiveDot, Reveal, Section } from './ui';

const TABS = [
  ['business', 'Ho un’attività'],
  ['partner', 'Voglio collaborare'],
];

export default function Cta() {
  const [aud, setAud] = useState('business');
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return;
    setSent(true);
  };

  return (
    <Section id="accesso" invert large>
      <div className="row2" style={{ alignItems: 'start' }}>
        <div className="row2__text">
          <Reveal>
            <p className="t-label">Accesso anticipato</p>
          </Reveal>
          <Reveal i={1}>
            <h2 className="t-sec" style={{ marginTop: 20 }}>
              Raccontaci com’è messo il tuo locale.
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="t-body" style={{ marginTop: 20 }}>
              Apriamo pochi accessi per volta, perché ogni attivazione parte da una mappatura fatta
              a mano. Scrivici quali sistemi usi: ti diciamo se Rush ci si collega già oggi o cosa
              manca.
            </p>
          </Reveal>
          <Reveal i={3}>
            <p
              className="t-small"
              style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <LiveDot />
              Rispondiamo entro due giorni lavorativi.
            </p>
          </Reveal>
        </div>

        <motion.div
          className="card card--lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.65, ease: EASE_MODAL }}
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.modal, ease: EASE_MODAL }}
                style={{ textAlign: 'center', padding: '30px 0' }}
              >
                <span
                  className="icon-tile"
                  style={{ marginInline: 'auto', background: 'var(--pos)', color: '#fff' }}
                >
                  <Check size={20} strokeWidth={1.75} />
                </span>
                <h3 className="t-card" style={{ marginTop: 20 }}>
                  Ricevuto.
                </h3>
                <p className="t-small" style={{ marginTop: 10 }}>
                  Ti scriviamo noi. Se nel frattempo ti viene in mente un dettaglio sui sistemi che
                  usi, rispondi pure alla mail di conferma.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate={false}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: DUR.pop, ease: EASE_MODAL }}
                style={{ display: 'grid', gap: 16 }}
              >
                <div className="segbar" style={{ justifySelf: 'start' }}>
                  {TABS.map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      data-active={aud === id}
                      onClick={() => setAud(id)}
                      style={{ position: 'relative', zIndex: 0 }}
                    >
                      {aud === id && (
                        <motion.span
                          layoutId="segpill"
                          className="segbar__pill"
                          transition={{ duration: DUR.lift, ease: [0.2, 0.8, 0.2, 1] }}
                        />
                      )}
                      {label}
                    </button>
                  ))}
                </div>

                <label className="field">
                  <span className="field__label">Nome e cognome</span>
                  <input className="input" name="nome" required placeholder="Veronica Pazzaglia" />
                </label>

                <label className="field">
                  <span className="field__label">Email</span>
                  <input
                    className="input"
                    type="email"
                    name="email"
                    required
                    placeholder="nome@illocale.it"
                  />
                </label>

                <AnimatePresence mode="wait" initial={false}>
                  {aud === 'business' ? (
                    <motion.label
                      key="b"
                      className="field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: DUR.pop, ease: EASE_MODAL }}
                      style={{ overflow: 'hidden' }}
                    >
                      <span className="field__label">Attività e sistemi che usi</span>
                      <textarea
                        className="input"
                        name="contesto"
                        placeholder="Bar con cucina a Fano. Cassa Zucchetti, fatture su Aruba, magazzino su Excel."
                      />
                    </motion.label>
                  ) : (
                    <motion.label
                      key="p"
                      className="field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: DUR.pop, ease: EASE_MODAL }}
                      style={{ overflow: 'hidden' }}
                    >
                      <span className="field__label">Come vorresti collaborare</span>
                      <textarea
                        className="input"
                        name="contesto"
                        placeholder="Seguo una ventina di locali come consulente e vorrei capire se ha senso proporlo."
                      />
                    </motion.label>
                  )}
                </AnimatePresence>

                <button className="btn btn--primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                  Richiedi accesso
                </button>

                <p className="t-small faint" style={{ fontSize: 13 }}>
                  Usiamo questi dati solo per risponderti. Nessuna newsletter, nessuna cessione a
                  terzi.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}
