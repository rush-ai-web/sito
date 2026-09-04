import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

function LogoMark() {
  return (
    <span className="nav__logo-wrap">
      <img
        src="./rush-logo-dark.png"
        srcSet="./rush-logo-dark-192.png 192w, ./rush-logo-dark-320.png 320w, ./rush-logo-dark.png 800w"
        sizes="(max-width: 760px) 72px, 96px"
        alt="Rush"
        width="800"
        height="200"
        className="nav__logo-img"
      />
    </span>
  );
}

const LINKS = [
  ['Problema', '#problema'],
  ['Soluzione', '#soluzione'],
  ['Metodo', '#metodo'],
  ['Risultati', '#numeri'],
  ['Prezzi', '#prezzi'],
];

export default function Nav() {
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
        <a className="nav__brand" href="#home" rel="home" aria-label="Rush, torna all'inizio">
          <LogoMark />
        </a>

        <nav className="nav__links">
          {LINKS.map(([label, href]) => (
            <a key={href} className="nav__link" href={href}>
              {label}
            </a>
          ))}
        </nav>

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
