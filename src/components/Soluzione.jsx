import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Lightbulb,
  Blocks,
  Activity,
  Workflow,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { Section, Head, IconTile } from './ui';
import { EASE_MODAL } from '../lib/motion';
import { useIsMobile } from '../lib/hooks';

const ORBIT = [
  {
    id: 1,
    icon: Blocks,
    t: 'Costruito sui tuoi\nprocessi reali',
    body: "Nessun template preconfezionato: i moduli, i campi e i flussi seguono come lavori davvero oggi.",
    related: [2, 6],
  },
  {
    id: 2,
    icon: Activity,
    t: 'Dati aggiornati\nal secondo',
    body: 'Ogni movimento - vendita, carico, pagamento - arriva subito nei report. Niente foglio Excel di fine mese.',
    related: [1, 3],
  },
  {
    id: 3,
    icon: Workflow,
    t: 'Automazioni al posto\ndel lavoro manuale',
    body: 'Registrazioni, riordini, promemoria e conciliazioni girano da soli. Tu decidi, il gestionale esegue.',
    related: [2, 4],
  },
  {
    id: 4,
    icon: Sparkles,
    t: 'AI integrata\ndove serve davvero',
    body: "Non un chatbot appiccicato: l'AI legge i tuoi dati e risponde con numeri veri, non con teorie.",
    related: [3, 5],
  },
  {
    id: 5,
    icon: ShieldCheck,
    t: 'Costo fisso,\nnessuna sorpresa',
    body: 'Canone mensile chiaro e invariabile. Nessun extra nascosto, nessun rincaro: sai sempre quanto paghi.',
    related: [4, 6],
  },
  {
    id: 6,
    icon: Smartphone,
    t: 'Stessa esperienza\nda desktop e mobile',
    body: "Interfaccia identica in ufficio e in movimento: apri, cerchi, aggiorni - senza doverlo reimparare.",
    related: [5, 1],
  },
];

const RADIUS_X = 530;
const RADIUS_Y = 270;
const AUTO_SPEED = 0.005; /* deg per ms - un giro ≈ 72 s */
const STEP = 360 / ORBIT.length;
const FOCUS_DURATION = 1100;

function shortestDelta(from, to) {
  return ((((to - from) % 360) + 540) % 360) - 180;
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ---- Mobile: carosello orizzontale con card tap-to-expand ---- */
function SoluzioneMobile() {
  const [openId, setOpenId] = useState(null);
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);

  /* indice attivo dalla posizione di scroll: primo elemento il cui centro
     è più vicino al centro del viewport del track. */
  const onScroll = () => {
    const t = trackRef.current;
    if (!t) return;
    const mid = t.scrollLeft + t.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    for (let k = 0; k < t.children.length; k += 1) {
      const c = t.children[k];
      const cMid = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cMid - mid);
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    }
    setActive(best);
  };

  const goTo = (k) => {
    const t = trackRef.current;
    if (!t || !t.children[k]) return;
    const c = t.children[k];
    t.scrollTo({ left: c.offsetLeft - (t.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <Section id="soluzione" large>
      <span aria-hidden="true" className="soluzione-bulb" />
      <Head
        icon={Lightbulb}
        label="La soluzione"
        title={<>Un gestionale disegnato attorno a come lavori già</>}
        sub="Partiamo dai tuoi processi, non da un template. Quello che serve c'è, quello che non serve non lo paghi."
      />

      <div className="sol-track" ref={trackRef} onScroll={onScroll}>
        {ORBIT.map((item, idx) => {
          const isOpen = openId === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              type="button"
              key={item.id}
              className={`sol-card${isOpen ? ' is-open' : ''}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE_MODAL, delay: (idx % 2) * 0.08 }}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              <span className="sol-card__top">
                <IconTile icon={Icon} size="sm" />
                <span className="sol-card__t">
                  {item.t.split('\n').map((line, k) => (
                    <span key={k} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                </span>
              </span>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.span
                    className="sol-card__body"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: EASE_MODAL }}
                  >
                    <span className="sol-card__body-in">{item.body}</span>
                  </motion.span>
                )}
              </AnimatePresence>

              <span className="sol-card__hint">
                {isOpen ? 'Tocca per chiudere' : 'Tocca per aprire'}
                <ArrowRight size={13} strokeWidth={2.2} />
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="sol-dots">
        {ORBIT.map((item, k) => (
          <button
            type="button"
            key={item.id}
            className={`sol-dot${k === active ? ' is-active' : ''}`}
            aria-label={`Vai alla voce ${k + 1}`}
            aria-current={k === active ? 'true' : undefined}
            onClick={() => goTo(k)}
          />
        ))}
      </div>
    </Section>
  );
}

function SoluzioneDesktop() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState(null);
  const [entered, setEntered] = useState(false);

  const angleRef = useRef(0);
  const focusRef = useRef(null);
  const rafRef = useRef(null);
  const openIdRef = useRef(null);
  const cardRefs = useRef({});
  const rootRef = useRef(null);

  useEffect(() => {
    openIdRef.current = openId;
  }, [openId]);

  /* scrive le posizioni orbitali direttamente sul DOM (proprietà `translate`),
     senza passare da React state - così non ci sono re-render a 60fps. */
  const applyPositions = () => {
    for (let i = 0; i < ORBIT.length; i += 1) {
      const item = ORBIT[i];
      const a = ((i * STEP) + angleRef.current) % 360;
      const rad = (a * Math.PI) / 180;
      const el = cardRefs.current[item.id];
      if (el) {
        el.style.setProperty('--ox', `${Math.cos(rad) * RADIUS_X}px`);
        el.style.setProperty('--oy', `${Math.sin(rad) * RADIUS_Y}px`);
      }
    }
  };

  /* entrata staggerata: appena la sezione entra in viewport. */
  useEffect(() => {
    if (reduce) {
      setEntered(true);
      return undefined;
    }
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setEntered(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    applyPositions();
    if (reduce) return undefined;
    let last = performance.now();
    const loop = (now) => {
      const dt = now - last;
      last = now;
      const f = focusRef.current;
      if (f) {
        const t = Math.min((now - f.start) / FOCUS_DURATION, 1);
        const next = f.from + f.delta * easeInOutCubic(t);
        angleRef.current = ((next % 360) + 360) % 360;
        applyPositions();
        if (t >= 1) focusRef.current = null;
      } else if (openIdRef.current === null) {
        angleRef.current = (angleRef.current + AUTO_SPEED * dt) % 360;
        applyPositions();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduce]);

  const focusNode = (id) => {
    const idx = ORBIT.findIndex((o) => o.id === id);
    if (idx < 0) return;
    let target = -90 - idx * STEP;
    target = ((target % 360) + 360) % 360;
    const from = angleRef.current;
    focusRef.current = { from, delta: shortestDelta(from, target), start: performance.now() };
  };

  const openItem = ORBIT.find((o) => o.id === openId);
  const relatedIds = openItem ? openItem.related : [];

  const onContainerClick = (e) => {
    if (e.target.closest('.orbit-card')) return;
    setOpenId(null);
  };

  return (
    <Section id="soluzione" large>
      <span aria-hidden="true" className="soluzione-bulb" />
      <div className="orbit orbit--radial" ref={rootRef} onClick={onContainerClick}>
        <span className="orbit__ring" aria-hidden="true" />

        <div className="orbit__core">
          <Head
            icon={Lightbulb}
            label="La soluzione"
            title={<>Un gestionale disegnato attorno a come lavori già</>}
            sub="Partiamo dai tuoi processi, non da un template. Quello che serve c'è, quello che non serve non lo paghi."
          />
        </div>

        {ORBIT.map((item, idx) => {
          const isOpen = openId === item.id;
          const isRelated = relatedIds.includes(item.id);
          const isDim = openId !== null && !isOpen && !isRelated;
          const Icon = item.icon;
          const enterCls = reduce ? '' : entered ? ' is-in' : ' is-pre';

          return (
            <button
              type="button"
              key={item.id}
              ref={(el) => {
                cardRefs.current[item.id] = el;
              }}
              className={`orbit__card orbit-card${enterCls}${isOpen ? ' is-open' : ''}${isRelated ? ' is-related' : ''}${isDim ? ' is-dim' : ''}`}
              style={{
                left: '50%',
                top: '50%',
                animationDelay: entered && !reduce ? `${0.1 + idx * 0.14}s` : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (openId === item.id) {
                  setOpenId(null);
                } else {
                  focusNode(item.id);
                  setOpenId(item.id);
                }
              }}
              aria-expanded={isOpen}
            >
              <div className="orbit-card__row">
                <IconTile icon={Icon} size="sm" />
                <span className="orbit-card__t">
                  {item.t.split('\n').map((line, k) => (
                    <span key={k} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                </span>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="orbit-card__pop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE_MODAL, delay: 0.4 }}
                  >
                    <p>{item.body}</p>
                    <span className="orbit-card__chev">
                      <ArrowRight size={14} strokeWidth={2.2} />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

export default function Soluzione() {
  const isMobile = useIsMobile();
  return isMobile ? <SoluzioneMobile /> : <SoluzioneDesktop />;
}
