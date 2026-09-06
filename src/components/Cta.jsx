import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Mail,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Handshake,
  UtensilsCrossed,
  Store,
  Factory,
  Briefcase,
  ShoppingCart,
  MoreHorizontal,
} from 'lucide-react';
import { DUR, EASE_MODAL, inView } from '../lib/motion';
import { Group, Item, LiveDot, Pill, Section } from './ui';

/* URL della funzione che invia l'email (Cloudflare Worker + Resend).
   Si può sovrascrivere in build con VITE_CONTACT_ENDPOINT. */
const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || 'https://rush-contact.withered-voice-c323.workers.dev';

const PRIVACY_URL = 'https://www.iubenda.com/privacy-policy/64941360';

/* obiettivo del contatto: sceglie il tono del resto del percorso */
const AUDIENCES = [
  {
    id: 'progetto',
    icon: Rocket,
    t: 'Ho un progetto',
    d: 'Voglio un gestionale su misura per la mia attività.',
  },
  {
    id: 'partner',
    icon: Handshake,
    t: 'Voglio collaborare',
    d: 'Sono un professionista o un partner e voglio lavorare con Rush.',
  },
];

/* settore / tipo di attività */
const SETTORI = [
  { id: 'Ristorazione', icon: UtensilsCrossed, t: 'Ristorazione' },
  { id: 'Retail e negozi', icon: Store, t: 'Retail e negozi' },
  { id: 'Produzione', icon: Factory, t: 'Produzione' },
  { id: 'Servizi e consulenza', icon: Briefcase, t: 'Servizi e consulenza' },
  { id: 'E-commerce', icon: ShoppingCart, t: 'E-commerce' },
  { id: 'Altro', icon: MoreHorizontal, t: 'Altro' },
];

/* dimensione del team */
const TEAM = ['1–5', '6–20', '21–50', '50+'];

const TOTAL_STEPS = 4;

export default function Cta() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // 1 avanti, -1 indietro
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | error

  /* dati raccolti lungo il percorso */
  const [aud, setAud] = useState('progetto');
  const [settore, setSettore] = useState('');
  const [settoreAltro, setSettoreAltro] = useState(''); // testo libero quando settore = "Altro"
  const [team, setTeam] = useState('');
  const [contesto, setContesto] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot anti-spam

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  /* se il settore è "Altro" serve anche il testo libero compilato */
  const settoreOk = settore === 'Altro' ? Boolean(settoreAltro.trim()) : Boolean(settore);

  /* condizione per poter proseguire, step per step */
  const canNext =
    step === 0
      ? Boolean(aud)
      : step === 1
        ? Boolean(settoreOk && team)
        : step === 2
          ? true // il contesto è facoltativo
          : Boolean(nome.trim() && emailOk && privacy);

  const go = (delta) => {
    setDir(delta);
    setStep((s) => Math.min(TOTAL_STEPS - 1, Math.max(0, s + delta)));
  };

  const submit = async () => {
    if (!canNext || status === 'sending') return;

    if (website.trim()) {
      /* honeypot compilato → è un bot: fingiamo successo e usciamo */
      setSent(true);
      return;
    }

    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      aud,
      /* se "Altro", mandiamo il settore scritto dall'utente */
      settore: settore === 'Altro' ? `Altro: ${settoreAltro.trim()}` : settore,
      team,
      contesto: contesto.trim(),
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

  const onSubmit = (e) => {
    e.preventDefault();
    if (step < TOTAL_STEPS - 1) {
      if (canNext) go(1);
    } else {
      submit();
    }
  };

  /* animazione di scorrimento tra gli step */
  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 26 : -26 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -26 : 26 }),
  };

  const contestoLabel =
    aud === 'partner' ? 'Come vorresti collaborare' : 'Cosa usi oggi e dove si perde tempo';
  const contestoPlaceholder =
    aud === 'partner'
      ? 'Sono consulente e seguo una ventina di aziende: vorrei capire se ha senso proporlo.'
      : 'Gestionale legacy per gli ordini, magazzino su Excel, presenze su carta. Perdiamo tempo nei doppi inserimenti.';

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
            ce l'ha, te lo diciamo. Pochi passaggi e ti ricontattiamo con un'idea concreta di
            perimetro, tempi e costi.
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
                {/* barra col logo Rush: coerente e brandizzata in entrambi i temi */}
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
                  <h3 className="t-card">{nome ? `Grazie, ${nome.split(' ')[0]}!` : 'Grazie!'}</h3>
                  <p className="t-small">
                    Abbiamo ricevuto la tua richiesta. Ti rispondiamo entro due giorni lavorativi
                    all'indirizzo email che ci hai lasciato.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form key="form" onSubmit={onSubmit} className="wiz">
                {/* barra di avanzamento */}
                <div className="wiz__progress" aria-hidden="true">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <span key={i} className={`wiz__seg${i <= step ? ' is-done' : ''}`} />
                  ))}
                </div>
                <p className="wiz__count">
                  Passo {step + 1} di {TOTAL_STEPS}
                </p>

                <div className="wiz__stage">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.32, ease: EASE_MODAL }}
                      className="wiz__step"
                    >
                      {step === 0 && (
                        <fieldset className="wiz__fs">
                          <legend className="wiz__q">Cosa ti porta qui?</legend>
                          <div className="wiz__cards">
                            {AUDIENCES.map(({ id, icon: Icon, t, d }) => (
                              <button
                                type="button"
                                key={id}
                                className={`wiz-card${aud === id ? ' is-on' : ''}`}
                                onClick={() => setAud(id)}
                                aria-pressed={aud === id}
                              >
                                <span className="wiz-card__ic">
                                  <Icon size={20} strokeWidth={2} />
                                </span>
                                <span className="wiz-card__t">{t}</span>
                                <span className="wiz-card__d">{d}</span>
                              </button>
                            ))}
                          </div>
                        </fieldset>
                      )}

                      {step === 1 && (
                        <div className="wiz__group">
                          <fieldset className="wiz__fs">
                            <legend className="wiz__q">In che settore operi?</legend>
                            <div className="wiz__chips">
                              {SETTORI.map(({ id, icon: Icon, t }) => (
                                <button
                                  type="button"
                                  key={id}
                                  className={`wiz-chip${settore === id ? ' is-on' : ''}`}
                                  onClick={() => setSettore(id)}
                                  aria-pressed={settore === id}
                                >
                                  <Icon size={16} strokeWidth={2} />
                                  {t}
                                </button>
                              ))}
                            </div>

                            <AnimatePresence initial={false}>
                              {settore === 'Altro' && (
                                <motion.div
                                  key="altro"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: DUR.pop, ease: EASE_MODAL }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <label className="field" style={{ marginTop: 12 }}>
                                    <span className="field__label">Quale settore?</span>
                                    <input
                                      className="input"
                                      name="settore-altro"
                                      value={settoreAltro}
                                      onChange={(e) => setSettoreAltro(e.target.value)}
                                      placeholder="Es. Studio medico, palestra, agenzia…"
                                      autoFocus
                                    />
                                  </label>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </fieldset>

                          <fieldset className="wiz__fs">
                            <legend className="wiz__q">Quante persone nel team?</legend>
                            <div className="wiz__chips">
                              {TEAM.map((t) => (
                                <button
                                  type="button"
                                  key={t}
                                  className={`wiz-chip${team === t ? ' is-on' : ''}`}
                                  onClick={() => setTeam(t)}
                                  aria-pressed={team === t}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                      )}

                      {step === 2 && (
                        <fieldset className="wiz__fs">
                          <legend className="wiz__q">{contestoLabel}</legend>
                          <label className="field">
                            <span className="field__label">Facoltativo, ma ci aiuta molto</span>
                            <textarea
                              className="input"
                              name="contesto"
                              value={contesto}
                              onChange={(e) => setContesto(e.target.value)}
                              placeholder={contestoPlaceholder}
                              rows={4}
                            />
                          </label>
                        </fieldset>
                      )}

                      {step === 3 && (
                        <fieldset className="wiz__fs">
                          <legend className="wiz__q">Dove ti ricontattiamo?</legend>
                          <div className="wiz__group">
                            <label className="field">
                              <span className="field__label">Nome e cognome</span>
                              <input
                                className="input"
                                name="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Mario Rossi"
                                autoComplete="name"
                                required
                              />
                            </label>
                            <label className="field">
                              <span className="field__label">Email</span>
                              <input
                                className="input"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nome@azienda.it"
                                autoComplete="email"
                                required
                              />
                            </label>
                            <label className="field">
                              <span className="field__label">Telefono (facoltativo)</span>
                              <input
                                className="input"
                                type="tel"
                                name="telefono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="+39 333 1234567"
                                autoComplete="tel"
                              />
                            </label>

                            <label className="wiz-consent">
                              <input
                                type="checkbox"
                                checked={privacy}
                                onChange={(e) => setPrivacy(e.target.checked)}
                                required
                              />
                              <span>
                                Ho letto e accetto la{' '}
                                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
                                  Privacy Policy
                                </a>
                                . Usiamo i dati solo per risponderti.
                              </span>
                            </label>
                          </div>
                        </fieldset>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* honeypot anti-spam: nascosto agli umani, riempito dai bot */}
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

                <div className="wiz__nav">
                  {step > 0 ? (
                    <button
                      type="button"
                      className="btn btn--ghost wiz__back"
                      onClick={() => go(-1)}
                    >
                      <ArrowLeft size={16} strokeWidth={2.2} />
                      Indietro
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < TOTAL_STEPS - 1 ? (
                    <button
                      type="submit"
                      className="btn btn--primary wiz__next"
                      disabled={!canNext}
                    >
                      Continua
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn--primary wiz__next"
                      disabled={!canNext || status === 'sending'}
                    >
                      {status === 'sending' ? 'Invio…' : 'Invia richiesta'}
                    </button>
                  )}
                </div>

                {status === 'error' && (
                  <p className="t-small" style={{ fontSize: 13, color: 'var(--neg)', marginTop: 4 }}>
                    Ops, l'invio non è andato a buon fine. Scrivici direttamente a{' '}
                    <a
                      href="mailto:info@rush-ai.it"
                      style={{ color: 'inherit', textDecoration: 'underline' }}
                    >
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
