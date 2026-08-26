import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

export default function ThemeSwitch({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <motion.div
      className="tsw-wrap"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_MODAL, delay: 1.2 }}
    >
      <button
        className={`tsw${isDark ? ' is-dark' : ''}`}
        onClick={onToggle}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      >
        <span className="tsw__icon tsw__icon--sun" aria-hidden="true">
          <Sun size={13} strokeWidth={1.75} />
        </span>

        <motion.span
          className="tsw__thumb"
          layout
          transition={{ duration: 0.28, ease: EASE_MODAL }}
        />

        <span className="tsw__icon tsw__icon--moon" aria-hidden="true">
          <Moon size={13} strokeWidth={1.75} />
        </span>
      </button>
    </motion.div>
  );
}
