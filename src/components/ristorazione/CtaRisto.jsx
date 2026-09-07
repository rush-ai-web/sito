import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CalendarClock } from 'lucide-react';
import { DUR, EASE_MODAL, inView } from '../../lib/motion';
import { Group, Item, LiveDot, Pill, Section } from '../ui';

const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || 'https://rush-contact.withered-voice-c323.workers.dev';

const PRIVACY_URL = 'https://www.iubenda.com/privacy-policy/64941360';

export default function CtaRisto() {
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | error

  const [nome, setNome] = useState('');
  const [locale, setLocale] = useState('');
  const [citta, setCitta] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cassa, setCassa] = useState('');
  const [messaggio, setMessaggio] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSend = Boolean(nome.trim() && locale.trim() && emailOk && privacy);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSend || status === 'sending') return;

    if (website.trim()) {
      setSent(true);
      return;
    }

    /* impacchettiamo i dettagli del locale nel campo contesto: l'email al
       team li mostra sotto "Azienda e sistemi che usa", senza modifiche extra. */
    const contesto = [
      '[Richiesta demo · Rush Ristorazione]',
      `Locale: ${locale.trim()}`,
      citta.trim() && `Città: ${citta.trim()}`,
      cassa.trim() && `Cassa attuale: ${cassa.trim()}`,
      messaggio.trim() && `Note: ${messaggio.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      aud: 'progetto',
      settore: 'Ristorazione',
      contesto,
      privacy,
      website,
    };

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
      <span aria-hidden="true" className="cta-bulb cta-bulb--l" />
      <span aria-hidden="true" className="cta-bulb cta-bulb--r" />
      <div className="row2" style={{ alignItems: 'start', position: 'relative', zIndex: 1 }}>
        <Group className="row2__text stack contact-copy" each={0.08}>
          <Item>
            <Pill icon={CalendarClock}>Prenota una demo</Pill>
          </Item>
          <Item as="h2" className="t-sec">
            Vediamo Rush sul tuo locale.
          </Item>
          <Item as="p" className="t-body">
            In una call di 30 minuti ti mostriamo Rush su dati reali di un bar, verifichiamo la
            compatibilità con la tua cassa e capiamo se ha senso per te. Zero impegno.
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
                <div className="cta-confirm__bar">
                  <img
                    src="./rush-logo-orange-dark.webp"
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
                  <h3 className="t-card">{nome ? `Grazie, ${nome.split(' ')[0]}!` : 'Grazie!'}</h3>
                  <p className="t-small">
                    Abbiamo ricevuto la richiesta per {locale ? locale : 'il tuo locale'}. Ti
                    ricontattiamo entro due giorni lavorativi per fissare la demo.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form key="form" onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
                <div className="rh-form-grid">
                  <label className="field">
                    <span className="field__label">Nome e cognome</span>
                    <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Mario Rossi" autoComplete="name" required />
                  </label>
                  <label className="field">
                    <span className="field__label">Nome del locale</span>
                    <input className="input" value={locale} onChange={(e) => setLocale(e.target.value)} placeholder="Caffè Centrale" required />
                  </label>
                  <label className="field">
                    <span className="field__label">Città</span>
                    <input className="input" value={citta} onChange={(e) => setCitta(e.target.value)} placeholder="Fano" />
                  </label>
                  <label className="field">
                    <span className="field__label">Cassa che usi (facoltativo)</span>
                    <input className="input" value={cassa} onChange={(e) => setCassa(e.target.value)} placeholder="Es. Zucchetti, Scloby…" />
                  </label>
                  <label className="field">
                    <span className="field__label">Email</span>
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@locale.it" autoComplete="email" required />
                  </label>
                  <label className="field">
                    <span className="field__label">Telefono (facoltativo)</span>
                    <input className="input" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+39 333 1234567" autoComplete="tel" />
                  </label>
                </div>

                <label className="field">
                  <span className="field__label">Qualcosa su di te (facoltativo)</span>
                  <textarea className="input" value={messaggio} onChange={(e) => setMessaggio(e.target.value)} placeholder="Es. bar con brunch, 8 persone in squadra, magazzino su Excel." rows={3} />
                </label>

                {/* honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />

                <label className="wiz-consent">
                  <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} required />
                  <span>
                    Ho letto e accetto la{' '}
                    <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                    . Usiamo i dati solo per ricontattarti.
                  </span>
                </label>

                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={!canSend || status === 'sending'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {status === 'sending' ? 'Invio…' : 'Prenota la demo'}
                </button>

                {status === 'error' && (
                  <p className="t-small" style={{ fontSize: 13, color: 'var(--neg)' }}>
                    Ops, l'invio non è andato a buon fine. Scrivici a{' '}
                    <a href="mailto:info@rush-ai.it" style={{ color: 'inherit', textDecoration: 'underline' }}>
                      info@rush-ai.it
                    </a>
                    .
                  </p>
                )}
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}
