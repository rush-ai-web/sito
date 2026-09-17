import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Sparkles, X } from 'lucide-react';
import { DUR, EASE_MODAL } from '../lib/motion';
import { useHotkey } from '../lib/hooks';

/* stesso endpoint del form di contatto: /chat e /chat-summary vivono
   sullo stesso Worker, vedi worker/index.js e worker/README.md. */
const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || 'https://rush-contact.withered-voice-c323.workers.dev';

const WELCOME = {
  role: 'assistant',
  content:
    "Ciao! Sono Rush AI: chiedimi pure come funziona il sistema, i prezzi o i tempi. Rispondo in base a quello che c'è scritto su questo sito.",
};

export default function Fab({ page = 'home' }) {
  const [open, setOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const listRef = useRef(null);
  const summarySentRef = useRef(false);
  const hasUserMessageRef = useRef(false);

  const set = useCallback((v) => setOpen(v), []);
  useHotkey(set);

  useEffect(() => {
    let frameId;
    let triggerTop = Number.POSITIVE_INFINITY;

    const measure = () => {
      const section = document.getElementById('ristorazione');
      if (section) {
        triggerTop = section.getBoundingClientRect().top + window.scrollY - window.innerHeight;
      } else {
        const fullHeight = document.documentElement.scrollHeight;
        triggerTop = (fullHeight - window.innerHeight) / 2;
      }
    };

    const update = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY >= triggerTop);
      });
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  /* invia il riepilogo una sola volta, solo se c'è stato almeno un
     messaggio dell'utente - fire-and-forget, non deve mai bloccare la UI */
  const sendSummary = useCallback(() => {
    if (summarySentRef.current || !hasUserMessageRef.current) return;
    summarySentRef.current = true;
    const payload = JSON.stringify({
      page,
      messages: messages.filter((m) => m.role === 'user' || m.role === 'assistant'),
    });
    const url = `${CONTACT_ENDPOINT}/chat-summary`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
    }
  }, [messages, page]);

  /* rete di sicurezza: se l'utente chiude la scheda invece di premere la X */
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') sendSummary();
    };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [sendSummary]);

  const closeChat = () => {
    setOpen(false);
    sendSummary();
  };

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    hasUserMessageRef.current = true;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setError(false);
    setLoading(true);

    try {
      const res = await fetch(`${CONTACT_ENDPOINT}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, messages: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'errore');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={false}
        animate={showBackToTop
          ? { opacity: 1, y: 0, scale: 1, visibility: 'visible' }
          : { opacity: 0, y: 14, scale: 0.88, visibility: 'hidden' }}
        transition={{
          opacity: { duration: 0.34, ease: EASE_MODAL },
          y: { duration: 0.42, ease: EASE_MODAL },
          scale: { duration: 0.42, ease: EASE_MODAL },
          visibility: { delay: showBackToTop ? 0 : 0.42 },
        }}
        style={{ pointerEvents: showBackToTop ? 'auto' : 'none' }}
        tabIndex={showBackToTop ? 0 : -1}
        aria-hidden={!showBackToTop}
        aria-label="Torna all'inizio della pagina"
      >
        <ArrowUp size={19} strokeWidth={2.1} aria-hidden="true" />
      </motion.button>

      <motion.button
        className="fab"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_MODAL, delay: 1.1 }}
        whileHover={{ opacity: 0.9 }}
        aria-label="Chiedi a Rush"
      >
        <span className="fab__glow" aria-hidden="true" />
        <span className="fab__inner">
          <Sparkles size={18} strokeWidth={1.75} />
          <span className="fab__text">Chiedi a Rush</span>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-scrim"
            onClick={closeChat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.pop, ease: EASE_MODAL }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            className="chat-panel"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: EASE_MODAL }}
            role="dialog"
            aria-modal="true"
            aria-label="Chiedi a Rush"
          >
            <div className="chat-panel__head">
              <span className="chat-panel__title">
                <Sparkles size={16} strokeWidth={2} />
                Rush AI
              </span>
              <button type="button" className="chat-panel__close" onClick={closeChat} aria-label="Chiudi">
                <X size={18} strokeWidth={2.1} />
              </button>
            </div>

            <div className="chat-panel__list" ref={listRef}>
              {messages.map((m, i) => (
                <div key={i} className={`chat-panel__msg chat-panel__msg--${m.role}`}>
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="chat-panel__msg chat-panel__msg--assistant chat-panel__msg--typing">
                  <span className="chat-panel__dots" aria-hidden="true">
                    <i /><i /><i />
                  </span>
                </div>
              )}
              {error && (
                <div className="chat-panel__msg chat-panel__msg--assistant chat-panel__msg--error">
                  Non riesco a rispondere in questo momento. Scrivici a{' '}
                  <a href="mailto:info@rush-ai.it">info@rush-ai.it</a> oppure usa il form di contatto.
                </div>
              )}
            </div>

            <form className="chat-panel__foot" onSubmit={send}>
              <div className="chat-panel__row">
                <input
                  type="text"
                  className="chat-panel__input"
                  placeholder="Scrivi una domanda…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
                <button type="submit" className="chat-panel__send" disabled={loading || !input.trim()} aria-label="Invia">
                  <ArrowUp size={16} strokeWidth={2.4} />
                </button>
              </div>
              <p className="chat-panel__hint">Le risposte si basano sui contenuti del sito.</p>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
