import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Mail } from 'lucide-react';
import { DUR, EASE_MODAL, inView } from '../lib/motion';
import { Group, Item, LiveDot, Pill, Section } from './ui';

const TABS = [
  ['progetto', 'Ho un progetto'],
  ['partner', 'Voglio collaborare'],
];

/* URL della funzione che invia l'email (Cloudflare Worker + Resend).
   Si può sovrascrivere in build con VITE_CONTACT_ENDPOINT. Finché è vuoto,
   il form propone la scrittura diretta via email invece di fingere l'invio. */
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || 'https://rush-contact.withered-voice-c323.workers.dev';

export default function Cta() {
  const [aud, setAud] = useState('progetto');
  const [sent, setSent] = useState(false);
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | error

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;
    const data = new FormData(form);
    const payload = {
      nome: String(data.get('nome') || '').trim(),
      email: String(data.get('email') || '').trim(),
      aud,
      contesto: String(data.get('contesto') || '').trim(),
      website: String(data.get('website') || ''), // honeypot anti-spam
    };
    setNome(payload.nome);

    if (!CONTACT_ENDPOINT) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('bad response');
      setStatus('idle');
      setSent(true);
    } catch {
      setStatus('error');
    }
  };

  return (
    <Section id="contatti" large grid>
      {/* corner bulbs - clippati dalla section overflow:hidden → stacco netto col footer */}
      <span aria-hidden="true" className="cta-bulb cta-bulb--l" />
      <span aria-hidden="true" className="cta-bulb cta-bulb--r" />
      <div className="row2" style={{ alignItems: 'start', position: 'relative', zIndex: 1 }}>
        <Group className="row2__text stack contact-copy" each={0.08}>
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
                className="cta-confirm"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR.modal, ease: EASE_MODAL }}
              >
                {/* barra nera con il logo Rush: coerente e brandizzata in
                    entrambi i temi */}
                <div className="cta-confirm__bar">
                  <img
                    src="./rush-logo-dark.png"
                    srcSet="./rush-logo-dark-192.png 192w, ./rush-logo-dark-320.png 320w, ./rush-logo-dark.png 800w"
                    sizes="104px"
                    alt="Rush"
                    width="800"
                    height="200"
                    className="cta-confirm__logo"
                  />
                </div>

                <div className="cta-confirm__body">
                  <span className="cta-confirm__check">
                    <Check size={22} strokeWidth={2.4} />
                  </span>
                  <h3 className="t-card">
                    {nome ? `Grazie, ${nome.split(' ')[0]}!` : 'Grazie!'}
                  </h3>
                  <p className="t-small">
                    Abbiamo ricevuto la tua richiesta. Ti rispondiamo entro due giorni lavorativi
                    all'indirizzo email che ci hai lasciato.
                  </p>
                </div>
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

                {/* honeypot anti-spam: nascosto agli umani, riempito dai bot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />

                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={status === 'sending'}
                  style={{ width: '100%', justifyContent: 'center', opacity: status === 'sending' ? 0.7 : 1 }}
                >
                  {status === 'sending' ? 'Invio…' : 'Invia richiesta'}
                </button>

                {status === 'error' ? (
                  <p className="t-small" style={{ fontSize: 13, color: 'var(--neg)' }}>
                    Ops, l'invio non è andato a buon fine. Scrivici direttamente a{' '}
                    <a href="mailto:info@rush-ai.it" style={{ color: 'inherit', textDecoration: 'underline' }}>
                      info@rush-ai.it
                    </a>
                    .
                  </p>
                ) : (
                  <p className="t-small faint" style={{ fontSize: 13 }}>
                    Usiamo questi dati solo per risponderti. Nessuna newsletter, nessuna cessione a
                    terzi.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}
