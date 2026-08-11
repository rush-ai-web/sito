import { motion, useScroll, useTransform } from 'framer-motion';
import { Moon, Sun, Zap } from 'lucide-react';
import { DUR, EASE_MODAL } from '../lib/motion';
import { useNavTone } from '../lib/hooks';

const LINKS = [
  ['Cosa costruiamo', '#prodotto'],
  ['Come lavoriamo', '#metodo'],
  ['Perché Rush', '#principi'],
  ['Ristorazione', '#ristorazione'],
];

export default function Nav({ theme, onToggleTheme }) {
  const tone = useNavTone();
  const { scrollY } = useScroll();
  /* la pillola si stringe leggermente appena parte lo scroll,
     come nel tema di riferimento */
  const scale = useTransform(scrollY, [0, 160], [1, 0.97]);

  return (
    <motion.header
      className="nav"
      data-on={tone}
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.1 }}
    >
      <motion.div className="nav__pill" style={{ scale }}>
        <a className="nav__brand" href="#home">
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

        <a className="nav__cta" href="#contatti">
          Parliamone
        </a>
      </motion.div>
    </motion.header>
  );
}
