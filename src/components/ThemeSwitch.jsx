import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

export default function ThemeSwitch({ theme, onToggle }) {
  const isDark = theme === 'dark';
  /* icona mostrata = destinazione del click (opposto del tema attuale):
     in light → luna (passa al dark), in dark → sole (passa al light) */
  const Icon = isDark ? Sun : Moon;

  return (
    <motion.button
      className="tsw"
      onClick={onToggle}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'sun' : 'moon'}
          className="tsw__ic"
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.28, ease: EASE_MODAL }}
        >
          <Icon size={18} strokeWidth={1.9} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
