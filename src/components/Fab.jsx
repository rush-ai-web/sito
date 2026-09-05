import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Package, Receipt, Search, Sparkles, Users } from 'lucide-react';
import { DUR, EASE_MODAL } from '../lib/motion';
import { useHotkey } from '../lib/hooks';
import { IconTile } from './ui';

/* risultati con icona + valore, come nella guida ai componenti */
const RISULTATI = [
  { icon: Receipt, t: 'Fattura Distillerie Rossi · 12 mag', v: '€892' },
  { icon: Package, t: 'Campari 1L - magazzino', v: '2 pz' },
  { icon: Users, t: 'Marco Bernardini - ore di maggio', v: '142h' },
];

export default function Fab() {
  const [open, setOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const set = useCallback((v) => setOpen(v), []);
  useHotkey(set);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 640);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.22, ease: EASE_MODAL }}
            aria-label="Torna all'inizio della pagina"
          >
            <ArrowUp size={19} strokeWidth={2.1} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        className="fab"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_MODAL, delay: 1.1 }}
        whileHover={{ opacity: 0.9 }}
        aria-label="Chiedi a Rush"
      >
        {/* raggio di luce che ruota dietro al contenuto */}
        <span className="fab__glow" aria-hidden="true" />
        <span className="fab__inner">
          <Sparkles size={18} strokeWidth={1.75} />
          <span className="fab__text">Chiedi a Rush</span>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="palette__scrim"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.pop, ease: EASE_MODAL }}
          >
            <motion.div
              className="palette"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: DUR.modal, ease: EASE_MODAL }}
              role="dialog"
              aria-label="Chiedi a Rush"
            >
              <div className="palette__field">
                <Search size={18} strokeWidth={1.75} style={{ color: 'var(--text-3)' }} />
                <input autoFocus placeholder="quanto ho speso in Campari" />
                <span className="chip" style={{ height: 26, fontSize: 11 }}>
                  ESC
                </span>
              </div>

              {RISULTATI.map((r, i) => (
                <motion.div
                  key={r.t}
                  className="palette__row"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: EASE_MODAL, delay: 0.08 + i * 0.05 }}
                >
                  <IconTile icon={r.icon} size="sm" ghost />
                  <span style={{ fontSize: 15 }}>{r.t}</span>
                  <b className="num">{r.v}</b>
                </motion.div>
              ))}

              <div
                className="palette__row"
                style={{ gap: 9, color: 'var(--text-3)', fontSize: 13.5 }}
              >
                <span className="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                Anteprima dimostrativa - nella dashboard risponde sui tuoi dati.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
