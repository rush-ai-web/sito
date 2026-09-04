import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Mail } from 'lucide-react';
import { DUR, EASE_MODAL, inView } from '../lib/motion';
import { Group, Item, LiveDot, Pill, Section } from './ui';

const TABS = [
  ['progetto', 'Ho un progetto'],
  ['partner', 'Voglio collaborare'],
];

export default function Cta() {
  const [aud, setAud] = useState('progetto');
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return;
    setSent(true);
  };

  return (
    <Section id="contatti" large grid>
      {/* corner bulbs - clippati dalla section overflow:hidden → stacco netto col footer */}
      <span aria-hidden="true" className="cta-bulb cta-bulb--l" />
      <span aria-hidden="true" className="cta-bulb cta-bulb--r" />
      <div className="row2" style={{ alignItems: 'start', position: 'relative', zIndex: 1 }}>
        <Group className="row2__text stack" each={0.08}>
          <Item>
            <Pill icon={Mail}>Contatti</Pill>
          </Item>
          <Item as="h2" className="t-sec">
            Raccontaci come lavori oggi.
          </Item>
          <Item as="p" className="t-body">
            Il primo incontro serve a capire se un gestionale su misura ha senso per te - e, se non
            ce l'ha, te lo diciamo. Scrivici che software usi e dove si perde più tempo: ti
            rispondiamo con un'idea concreta di perimetro, tempi e costi.
          </Item>
          <Item as="p" className="t-small" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LiveDot />
            Rispondiamo entro due giorni lavorativi.
          </Item>
        </Group>

        <motion.div
          className="card card--lg contrast-card contact-card"
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
                  <input className="input" name="nome" required placeholder="Mario Rossi" />
                </label>

                <label className="field">
                  <span className="field__label">Email</span>
                  <input
                    className="input"
                    type="email"
                    name="email"
                    required
                    placeholder="nome@azienda.it"
                  />
                </label>

                <AnimatePresence mode="wait" initial={false}>
                  {aud === 'progetto' ? (
                    <motion.label
                      key="b"
                      className="field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: DUR.pop, ease: EASE_MODAL }}
                      style={{ overflow: 'hidden' }}
                    >
                      <span className="field__label">Azienda e sistemi che usi</span>
                      <textarea
                        className="input"
                        name="contesto"
                        placeholder="Azienda di produzione, 40 dipendenti. Gestionale legacy per gli ordini, magazzino su Excel, presenze su carta."
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
                        placeholder="Sono consulente e seguo una ventina di aziende: vorrei capire se ha senso proporlo."
                      />
                    </motion.label>
                  )}
                </AnimatePresence>

                <button
                  className="btn btn--primary"
                  type="submit"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Invia richiesta
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
