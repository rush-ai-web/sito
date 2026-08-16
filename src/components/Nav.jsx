import { motion, useScroll, useTransform } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { DUR, EASE_MODAL } from '../lib/motion';

function LogoMark({ size = 26 }) {
  const h = size;
  const w = Math.round(size * 0.9);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 90 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* left vertical bar */}
      <rect x="9" y="9" width="15" height="82" fill="currentColor" />
      {/* top crossbar */}
      <rect x="9" y="9" width="72" height="15" fill="currentColor" />
      {/* bowl right wall */}
      <rect x="66" y="9" width="15" height="38" fill="currentColor" />
      {/* bowl base — trapezoid that narrows toward the leg */}
      <polygon points="24,38 81,38 81,47 43,47" fill="currentColor" />
      {/* diagonal leg — parallelogram going down-right */}
      <polygon points="43,47 61,47 81,91 63,91" fill="currentColor" />
      {/* brand accent — blue rhombus in the gap */}
      <polygon points="24,71 39,55 57,71 42,87" fill="#5B80D0" />
    </svg>
  );
}

const LINKS = [
  ['Cosa costruiamo', '#prodotto'],
  ['Come lavoriamo', '#metodo'],
  ['Perché Rush', '#principi'],
  ['Ristorazione', '#ristorazione'],
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
          <LogoMark size={26} />
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
      </div>
    </motion.header>
  );
}
