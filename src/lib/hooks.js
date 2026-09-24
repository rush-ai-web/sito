import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import { warmupScroll } from './warmup';
import { EASE_MODAL } from './motion';

/* The page is immediately usable. Let the browser prioritize visible assets
   instead of eagerly decoding logos and images belonging to other sections. */
export function useAppReady() {
  useEffect(warmupScroll, []);
  useEffect(() => {
    document.getElementById('root')?.removeAttribute('data-prerender');
  }, []);
  return true;
}

/* ---------- Viewport: mobile vs desktop ---------- */
export function useIsMobile(query = '(max-width: 760px)') {
  /* Parte sempre da false, uguale al render lato server: la pagina è
     prerenderizzata senza window, quindi calcolare il match subito sul
     client (prima che l'effect corregga il valore) produce un mismatch
     tra il markup statico e il primo render idratato. Su schermi piccoli
     questo faceva "lampeggiare" gli elementi animati allo scroll: il
     valore giusto arriva un istante dopo il paint iniziale, prima che
     l'utente possa notare la differenza. */
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setIs(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return is;
}

/* Native wheel/touch scrolling; smooth scrolling only for navigation links. */
export function useSmoothScroll(enabled = true) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!enabled) return undefined;
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.getElementById(decodeURIComponent(id.slice(1)));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 96, behavior: reduce ? 'instant' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [enabled, reduce]);
}

/* Demo loops run near the viewport, never in a background tab. */
export function useAnimationActivity() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let nearby = false;
    const update = () => setActive(nearby && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      update();
    }, { rootMargin: '120px 0px' });
    observer.observe(node);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return [ref, active];
}

/* ---------- Tema: light di default, dark alla pari ---------- */
export function useTheme() {
  /* tema del sistema (impostazione del dispositivo/browser) */
  const systemTheme = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const [theme, setTheme] = useState(() => {
    const saved = typeof window === 'undefined' ? null : window.localStorage.getItem('rush-theme');
    /* se l'utente ha scelto a mano si rispetta, altrimenti si segue il sistema */
    return saved === 'light' || saved === 'dark' ? saved : systemTheme();
  });

  /* finché l'utente NON ha scelto a mano, il sito segue in tempo reale le
     impostazioni del dispositivo (chiaro/scuro) */
  useEffect(() => {
    const saved = localStorage.getItem('rush-theme');
    if (saved === 'light' || saved === 'dark') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* NB: qui NON salviamo su localStorage, altrimenti il primo render
     "congelerebbe" il tema di sistema come se fosse una scelta manuale.
     Il salvataggio avviene solo nel toggle sotto. */
  (typeof window === 'undefined' ? useEffect : useLayoutEffect)(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#17171A' : '#FAFAF9');
  }, [theme]);

  const toggle = () =>
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      /* scelta manuale: da ora in poi vince sulle impostazioni del sistema */
      localStorage.setItem('rush-theme', next);
      return next;
    });

  return [theme, toggle];
}

/* ---------- Numeri in formato italiano ---------- */
const numberFormats = new Map();
export const fmt = (n, dec = 0) => {
  if (!numberFormats.has(dec)) numberFormats.set(dec, new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: dec, maximumFractionDigits: dec,
  }));
  return numberFormats.get(dec).format(n);
};

/* ---------- Conteggio animato - signature move ----------
   Parte quando il numero entra in viewport, si ferma sul valore
   finale. Con prefers-reduced-motion mostra subito il valore. */
export function useCountUp(target, { dec = 0, duration = 1.5 } = {}) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [text, setText] = useState(() => fmt(typeof window === 'undefined' || reduce ? target : 0, dec));

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
