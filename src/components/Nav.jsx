import { motion, useScroll, useTransform } from 'framer-motion';
import { Moon, Sun, ArrowRight } from 'lucide-react';
import { DUR, EASE_MODAL } from '../lib/motion';

function LogoMark() {
  return (
    <span className="nav__logo-wrap">
      <img src="./rush-logo-dark.png" alt="" aria-hidden="true" className="nav__logo-img" />
    </span>
  );
}

const LINKS = [
  ['Cosa costruiamo', '#prodotto'],
  ['Come lavoriamo', '#metodo'],
  ['Perché Rush', '#principi'],
  ['Ristorazione', '#ristorazione'],
  ['FAQ', '#faq'],
];

export default function Nav({ theme, onToggleTheme }) {
  const { scrollY } = useScroll();
  /* wide at the top (almost full screen), shrinks to a compact pill on scroll */
  const navW = useTransform(scrollY, [0, 220], [1160, 740]);

  return (
    <motion.header
      className="nav"
      style={{ width: navW }}
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.1 }}
    >
      <div className="nav__pill">
        <a className="nav__brand" href="#home">
          <LogoMark />
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

        <a className="btn btn--accent btn--hero nav__cta" href="#contatti">
          Parliamone
          <span className="btn__badge">
            <ArrowRight size={14} strokeWidth={2.4} />
          </span>
        </a>
      </div>
    </motion.header>
  );
}
