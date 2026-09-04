import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import { EASE_MODAL } from './motion';

const BOOT_TIMEOUT_MS = 1800;
const BOOT_MINIMUM_MS = 220;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
    if (image.complete) {
      image.decode?.().catch(() => {}).finally(resolve);
    }
  });
}

/* Prima di montare le animazioni iniziali prepariamo i font, i loghi visibili
   subito e le varianti Ristorazione usate più avanti. Il timeout evita che
   una risorsa guasta possa mai bloccare la pagina. */
export function useAppReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;

    const fontTasks = document.fonts
      ? [
          document.fonts.load('700 48px Horizon'),
          document.fonts.load('400 18px "Inter Variable"'),
          document.fonts.ready,
        ]
      : [];
    const imageTasks = [
      preloadImage(`${import.meta.env.BASE_URL}rush-logo-192.png`),
      preloadImage(`${import.meta.env.BASE_URL}rush-logo-dark-192.png`),
      preloadImage(`${import.meta.env.BASE_URL}Rush%20ristorazione%20logo.png`),
      preloadImage(`${import.meta.env.BASE_URL}Rush%20ristorazione%20logo%20con%20sfondo%20scuro.png`),
    ];
    const resources = Promise.allSettled([...fontTasks, ...imageTasks]);
    const timeout = new Promise((resolve) => {
      timeoutId = window.setTimeout(resolve, BOOT_TIMEOUT_MS);
    });

    Promise.all([wait(BOOT_MINIMUM_MS), Promise.race([resources, timeout])]).then(() => {
      window.clearTimeout(timeoutId);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setReady(true);
        });
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return ready;
}

/* ---------- Viewport: mobile vs desktop ---------- */
export function useIsMobile(query = '(max-width: 760px)') {
  const [is, setIs] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setIs(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return is;
}

/* ---------- Smooth scroll stile Framer (Lenis) ---------- */
export function useSmoothScroll(enabled = true) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!enabled || reduce) return undefined;
    /* niente smooth su touch: sui telefoni lo scroll nativo è già ottimo
       e Lenis sul wheel non serve. */
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      /* expo-out: parte veloce e si adagia - il feeling dei siti Framer */
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    /* le ancore (#home, #prodotto, #contatti…) passano da Lenis con un
       offset per la nav flottante, invece del salto nativo. */
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -96 });
      if (history.replaceState) history.replaceState(null, '', id);
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, [enabled, reduce]);
}

/* ---------- Tema: light di default, dark alla pari ---------- */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('rush-theme');
    return saved === 'light' || saved === 'dark' ? saved : 'light';
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rush-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#17171A' : '#FAFAF9');
  }, [theme]);

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

/* ---------- Numeri in formato italiano ---------- */
export const fmt = (n, dec = 0) =>
  new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(n);

/* ---------- Conteggio animato - signature move ----------
   Parte quando il numero entra in viewport, si ferma sul valore
   finale. Con prefers-reduced-motion mostra subito il valore. */
export function useCountUp(target, { dec = 0, duration = 1.5 } = {}) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [text, setText] = useState(() => fmt(reduce ? target : 0, dec));

  useEffect(() => {
    if (!seen) return;
    if (reduce) {
      setText(fmt(target, dec));
      return;
    }
    const controls = animate(mv, target, {
      duration,
      ease: EASE_MODAL,
      onUpdate: (v) => setText(fmt(v, dec)),
    });
    return () => controls.stop();
  }, [seen, target, dec, duration, reduce, mv]);

  return [ref, text];
}

/* ---------- Tono della fascia sotto la navbar ----------
   La pillola è sempre l'inverso della fascia che sta attraversando:
   scura sulle sezioni chiare, chiara su quelle scure. */
export function useNavTone() {
  const [tone, setTone] = useState('light');

  useEffect(() => {
    const probe = () => {
      const y = 46; // centro verticale della pillola
      const bands = document.querySelectorAll('[data-tone]');
      let current = 'light';
      bands.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) current = el.getAttribute('data-tone');
      });
      setTone(current);
    };
    probe();
    window.addEventListener('scroll', probe, { passive: true });
    window.addEventListener('resize', probe);
    return () => {
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
    };
  }, []);

  return tone;
}

/* ---------- ⌘K ---------- */
export function useHotkey(handler) {
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handler(true);
      }
      if (e.key === 'Escape') handler(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler]);
}

/* ---------- Flusso documenti in diretta ----------
   Un ciclo continuo: ogni pochi secondi entra una riga nuova in
   cima e l'ultima esce. Serve a far vedere, senza dirlo, che il
   sistema registra da solo mentre guardi. */
const FORNITORI = [
  { chi: 'Distillerie Rossi', tipo: 'SDI', importo: '892' },
  { chi: 'Caseificio Marche', tipo: 'SDI', importo: '340' },
  { chi: 'Frutta & Co', tipo: 'FOTO', importo: '127' },
  { chi: 'Forno Adriatico', tipo: 'SDI', importo: '215' },
  { chi: 'Cantina Verdi', tipo: 'SDI', importo: '564' },
  { chi: 'Ittica Adriatica', tipo: 'FOTO', importo: '298' },
];

export function useLiveFeed(size = 3, ms = 2600) {
  const reduce = useReducedMotion();
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStart((i) => (i + 1) % FORNITORI.length), ms);
    return () => clearInterval(id);
  }, [reduce, ms]);

  return Array.from({ length: size }, (_, k) => {
    const f = FORNITORI[(start + k) % FORNITORI.length];
    return { ...f, id: `${f.chi}-${Math.floor((start + k) / FORNITORI.length)}` };
  });
}
