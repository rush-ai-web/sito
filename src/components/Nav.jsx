import { motion } from 'framer-motion';
import { Moon, Sun, Zap } from 'lucide-react';
import { DUR, EASE_MODAL } from '../lib/motion';
import { useNavTone } from '../lib/hooks';

const LINKS = [
  ['Il problema', '#problema'],
  ['Cos’è Rush', '#prodotto'],
  ['Come pensa', '#principi'],
  ['La prova', '#ristorazione'],
];

export default function Nav({ theme, onToggleTheme }) {
  const tone = useNavTone();

  return (
    <motion.header
      className="nav"
      data-on={tone}
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.1 }}
    >
      <div className="nav__pill">
        <a className="nav__brand" href="#top">
          <Zap size={19} strokeWidth={2} />
          Rush
        </a>

        <nav className="nav__links">
          {LINKS.map(([label, href]) => (
            <a key={href} className="nav__link" href={href}>
              {label}
            </a>
          ))}
        </nav>

        <button
          className="nav__icon"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
        >
          <motion.span
            key={theme}
            initial={{ rotate: -35, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: DUR.pop, ease: EASE_MODAL }}
            style={{ display: 'grid' }}
          >
            {theme === 'dark' ? (
              <Sun size={18} strokeWidth={1.75} />
            ) : (
              <Moon size={18} strokeWidth={1.75} />
            )}
          </motion.span>
        </button>

        <a className="nav__cta" href="#accesso">
          Richiedi accesso
        </a>
      </div>
    </motion.header>
  );
}
