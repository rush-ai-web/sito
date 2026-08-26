import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

/* thumb travels: track 84px - padding 6px*2 - thumb 30px = 42px */
const THUMB_TRAVEL = 42;

export default function ThemeSwitch({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <motion.div
      className="tsw-wrap"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
    >
      <button
        className={`tsw${isDark ? ' is-dark' : ''}`}
        onClick={onToggle}
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      >
        <span className="tsw__icon tsw__icon--sun" aria-hidden="true">
          <Sun size={15} strokeWidth={1.75} />
        </span>

        <motion.span
          className="tsw__thumb"
          animate={{ x: isDark ? THUMB_TRAVEL : 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28, mass: 0.8 }}
        />

        <span className="tsw__icon tsw__icon--moon" aria-hidden="true">
          <Moon size={15} strokeWidth={1.75} />
        </span>
      </button>
    </motion.div>
  );
}
