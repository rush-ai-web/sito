import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import { EASE_MODAL } from './motion';

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

/* ---------- Orologio live — signature move ---------- */
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

/* ---------- Conteggio animato — signature move ----------
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
