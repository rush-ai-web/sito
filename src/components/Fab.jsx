import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Sparkles, X } from 'lucide-react';
import { DUR, EASE_MODAL } from '../lib/motion';
import { useHotkey, useIsMobile } from '../lib/hooks';
import { ThemeCtx } from './ui';

/* stesso endpoint del form di contatto: /chat e /chat-summary vivono
   sullo stesso Worker, vedi worker/index.js e worker/README.md. */
const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || 'https://rush-contact.withered-voice-c323.workers.dev';

const LOGO = {
  home: { light: './rush-logo.png', dark: './rush-logo-dark.png' },
  ristorazione: { light: './rush-logo-orange.webp', dark: './rush-logo-orange-dark.webp' },
};

/* mini-markdown per le risposte AI: **grassetto**, elenchi puntati/numerati e
   paragrafi — niente librerie esterne, basta quello che Gemini produce davvero */
function formatBold(line, keyPrefix) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    ),
  );
}

function renderMessage(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let para = [];
  let list = null; // { type: 'ul' | 'ol', items: [] }

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const numbered = line.match(/^\d+[.)]\s+(.*)/);
    const bulleted = line.match(/^[-*•]\s+(.*)/);
    /* rete di sicurezza: se il modello mette comunque un titolo Markdown
       (#, ##, ###...) lo trattiamo come un paragrafo in grassetto invece di
       mostrare i cancelletti a schermo */
    const heading = line.match(/^#{1,6}\s+(.*)/);
    if (heading) {
      flushPara();
      flushList();
      para.push(`**${heading[1]}**`);
      flushPara();
    } else if (numbered) {
      flushPara();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(numbered[1]);
    } else if (bulleted) {
      flushPara();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(bulleted[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();

  return blocks.map((block, bi) => {
    if (block.type === 'p') return <p key={bi}>{formatBold(block.text, bi)}</p>;
    const Tag = block.type;
    return (
      <Tag key={bi}>
        {block.items.map((item, ii) => (
          <li key={ii}>{formatBold(item, `${bi}-${ii}`)}</li>
        ))}
      </Tag>
    );
  });
}

const SUGGESTS = {
  home: [
    'Come funziona il metodo di lavoro?',
    'Quanto costa configurare il mio centro operativo?',
    'Quanto tempo serve per partire?',
    'Come garantite la sicurezza dei dati?',
  ],
  ristorazione: [
    'Quanto costa Rush Ristorazione?',
    'Funziona con la cassa che uso già?',
    'Cosa è incluso nel canone base?',
    'Posso vedere una demo senza impegno?',
  ],
};

export default function Fab({ page = 'home' }) {
  const theme = useContext(ThemeCtx);
  const logoSrc = LOGO[page]?.[theme === 'dark' ? 'dark' : 'light'] || LOGO.home.light;
  const suggests = SUGGESTS[page] || SUGGESTS.home;
  const triggerLabel = page === 'ristorazione' ? 'Chiedi a RUSH' : 'Chiedi a Rush';
  /* stessa soglia del CSS mobile del pannello (@media max-width: 560px) */
  const isMobile = useIsMobile('(max-width: 560px)');

  const [open, setOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [messages, setMessages] = useState([]);
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

  /* Il problema di fondo su iOS: quando un input dentro un elemento fixed
     prende il focus, Safari SPOSTA la pagina per "portarlo in vista". Un
     elemento fixed è ancorato alla pagina, quindi si sposta con lei: ecco
     la chat che schizza in alto lasciando il vuoto sotto. Non si corregge
     inseguendola dopo (si vede sempre il fotogramma sbagliato): si blocca
     la pagina con position:fixed, così Safari non ha nulla da spostare e
     il pannello parte e resta già nel punto giusto. */
  useEffect(() => {
    if (!open) return undefined;
    document.documentElement.classList.add('chat-open');
    /* Il lock con position:fixed serve SOLO su iOS per il focus dell'input.
       Su desktop bastano le regole overflow:hidden sull'html: evitiamo così
       il window.scrollTo di ripristino, che Lenis animerebbe in smooth-scroll
       facendo sembrare un salto all'hero e ritorno. */
    const isTouch = typeof window.matchMedia === 'function'
      && window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch) {
      return () => {
        document.documentElement.classList.remove('chat-open');
      };
    }
    const body = document.body;
    const scrollY = window.scrollY;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      document.documentElement.classList.remove('chat-open');
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  /* con la pagina bloccata, l'unica cosa che resta da seguire è QUANTO la
     tastiera restringe lo schermo. Aggiornamento immediato (nessun ritardo,
     nessuna transizione): così l'altezza del pannello si accorcia in
     sincrono con l'animazione della tastiera, senza posizioni intermedie
     sbagliate né correzioni visibili dopo. */
  useEffect(() => {
    if (!open || !window.visualViewport) return undefined;
    const vv = window.visualViewport;
    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--vvh', `${vv.height}px`);
        root.style.setProperty('--vv-top', `${vv.offsetTop}px`);
      });
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      cancelAnimationFrame(raf);
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      root.style.removeProperty('--vvh');
      root.style.removeProperty('--vv-top');
    };
  }, [open]);


  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  /* invia il riepilogo una sola volta, solo se c'è stato almeno un
     messaggio dell'utente - fire-and-forget, non deve mai bloccare la UI.
     `unloading` = la pagina si sta chiudendo davvero (solo lì serve
     sendBeacon, che è l'unica cosa che sopravvive alla chiusura). */
  const sendSummary = useCallback((unloading = false) => {
    if (summarySentRef.current || !hasUserMessageRef.current) return;
    summarySentRef.current = true;
    const payload = JSON.stringify({
      page,
      messages: messages.filter((m) => m.role === 'user' || m.role === 'assistant'),
    });
    const url = `${CONTACT_ENDPOINT}/chat-summary`;

    if (unloading && navigator.sendBeacon) {
      /* il Blob DEVE essere text/plain: application/json non è fra i tipi
         "semplici" per il CORS, quindi richiederebbe una richiesta di
         autorizzazione preliminare che sendBeacon non sa fare — il browser
         scartava tutto in silenzio (e sendBeacon restituiva comunque true,
         quindi non si vedeva alcun errore). Il Worker legge il JSON dal
         corpo a prescindere da come è etichettato. */
      navigator.sendBeacon(url, new Blob([payload], { type: 'text/plain;charset=UTF-8' }));
      return;
    }

    /* chat chiusa con la X o inattività: la pagina è ancora viva, quindi
       una fetch normale è più affidabile (CORS gestito correttamente) */
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [messages, page]);

  /* se la conversazione resta ferma 5 minuti (nessun nuovo messaggio, chat
     magari ancora aperta ma dimenticata lì) mandiamo comunque il riepilogo:
     non serve aspettare che l'utente chiuda o cambi pagina */
  useEffect(() => {
    if (!hasUserMessageRef.current) return undefined;
    const t = setTimeout(() => sendSummary(), 5 * 60 * 1000);
    return () => clearTimeout(t);
  }, [messages, sendSummary]);

  /* rete di sicurezza: se l'utente chiude la scheda invece di premere la X.
     Qui la pagina sta sparendo davvero, quindi serve sendBeacon (true). */
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') sendSummary(true);
    };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [sendSummary]);

  /* iOS Safari a volte resta "zoomato" sulla pagina dopo che l'input perde il
     focus e la tastiera si chiude: forzare per un istante maximum-scale=1 e
     poi ripristinare il viewport originale sistema lo zoom residuo */
  const resetIosZoom = () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    const original = viewport.getAttribute('content');
    viewport.setAttribute('content', `${original}, maximum-scale=1`);
    setTimeout(() => viewport.setAttribute('content', original), 350);
  };

  const closeChat = () => {
    setOpen(false);
    sendSummary();
  };

  const send = async (e, suggested) => {
    e?.preventDefault();
    const text = (suggested ?? input).trim();
    if (!text || loading) return;

    hasUserMessageRef.current = true;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setError(false);
    setLoading(true);

    /* tetto massimo di attesa lato browser: il Worker prova più modelli con un
       suo timeout interno, questo è solo la rete di sicurezza finale perché
       la chat non resti a "scrivere" all'infinito in nessun caso */
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);

    /* i messaggi "degraded" (il testo di riserva quando l'AI ha fallito)
       non vanno rimandati indietro come contesto: il modello li "vedrebbe"
       nella cronologia e si confonderebbe, mettendosi a parlare a caso di
       errori/bug invece di rispondere alla domanda reale */
    const context = next.filter((m) => !m.degraded);

    try {
      const res = await fetch(`${CONTACT_ENDPOINT}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, messages: context }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.detail || data.error || 'errore sconosciuto');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, degraded: !!data.degraded },
      ]);
    } catch (err) {
      const isTimeout = err?.name === 'AbortError';
      setError(isTimeout ? 'Tempo di attesa scaduto' : err?.message || String(err));
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <>
      <motion.a
        href="#home"
        className="back-to-top"
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
      </motion.a>

      <motion.button
        className="fab"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_MODAL, delay: 1.1 }}
        whileHover={{ opacity: 0.9 }}
        aria-label={triggerLabel}
      >
        <span className="fab__glow" aria-hidden="true" />
        <span className="fab__inner">
          <Sparkles size={18} strokeWidth={1.75} />
          <span className="fab__text">{triggerLabel}</span>
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
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: 0.38, ease: EASE_MODAL }}
            role="dialog"
            aria-modal="true"
            aria-label="Chiedi a Rush"
          >
            <div className="chat-panel__head">
              <span className="chat-panel__brand">
                <Sparkles size={15} strokeWidth={2} className="chat-panel__brand-ic" />
                <img src={logoSrc} alt="Rush" className="chat-panel__brand-logo" />
                <span className="chat-panel__brand-ai">AI</span>
              </span>
              <button type="button" className="chat-panel__close" onClick={closeChat} aria-label="Chiudi">
                <X size={18} strokeWidth={2.1} />
              </button>
            </div>

            <div className="chat-panel__list" ref={listRef}>
              {messages.length === 0 ? (
                <div className="chat-panel__empty">
                  <span className="chat-panel__empty-ic" aria-hidden="true">
                    <Sparkles size={26} strokeWidth={1.75} />
                  </span>
                  <h3 className="chat-panel__empty-t">Cosa vuoi sapere?</h3>
                  <p className="chat-panel__empty-d">
                    Chiedimi quello che vuoi su Rush.
                  </p>
                  <div className="chat-panel__suggests">
                    {suggests.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className="chat-panel__suggest"
                        onClick={(e) => send(e, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`chat-panel__msg chat-panel__msg--${m.role}`}>
                    {m.role === 'assistant' ? renderMessage(m.content) : m.content}
                  </div>
                ))
              )}
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
                  <span className="chat-panel__msg-detail">{error}</span>
                </div>
              )}
            </div>

            <form className="chat-panel__foot" onSubmit={send} autoComplete="off">
              <div className="chat-panel__row">
                <input
                  type="text"
                  className="chat-panel__input"
                  placeholder="Scrivi una domanda…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onBlur={resetIosZoom}
                  disabled={loading}
                  autoFocus={!isMobile}
                  /* niente barra password/carta/indirizzo sopra la tastiera:
                     senza questi hint il browser pensa che il campo possa
                     servire per l'autofill e apre quella barra, che copre
                     l'input e sembra farlo "sparire" */
                  name="chat-message"
                  autoComplete="off"
                  autoCorrect="on"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
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
