import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import { EASE_MODAL } from './motion';

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
export function useSmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return undefined;
    /* niente smooth su touch: sui telefoni lo scroll nativo è già ottimo
       e Lenis sul wheel non serve. */
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    const lenis = new Lenis({
      duration: 1.15,
      /* expo-out: parte veloce e si adagia - il feeling dei siti Framer */
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: coarse ? 1 : 1.5,
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
  }, [reduce]);
}

/* ---------- Tema: light di default, dark alla pari ---------- */
export function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('rush-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rush-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#17171A' : '#FAFAF9');
  }, [theme]);

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

/* ---------- Orologio live - signature move ---------- */
const GIORNI = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MESI = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const p = (n) => String(n).padStart(2, '0');
  return {
    time: `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`,
    date: `${GIORNI[now.getDay()]} ${now.getDate()} ${MESI[now.getMonth()]}`,
  };
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
