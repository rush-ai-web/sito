import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

function LogoMark() {
  return (
    <span className="nav__logo-wrap">
      <img
        src="./rush-logo-dark.png"
        srcSet="./rush-logo-dark-192.png 192w, ./rush-logo-dark-320.png 320w, ./rush-logo-dark.png 800w"
        sizes="(max-width: 980px) 76px, 96px"
        alt="Rush"
        width="800"
        height="200"
        className="nav__logo-img nav__logo-img--on-dark"
      />
      <img
        src="./rush-logo.png"
        srcSet="./rush-logo-192.png 192w, ./rush-logo-320.png 320w, ./rush-logo.png 800w"
        sizes="(max-width: 980px) 76px, 96px"
        alt=""
        aria-hidden="true"
        width="800"
        height="200"
        className="nav__logo-img nav__logo-img--on-light"
      />
    </span>
  );
}

const LINKS = [
  ['Servizio', '#soluzione'],
  ['Metodo', '#metodo'],
  ['Prezzi', '#prezzi'],
  ['FAQ', '#faq'],
];

function ContactLink({ className = '', onClick }) {
  return (
    <a className={`btn btn--accent btn--hero nav__cta ${className}`} href="#contatti" onClick={onClick}>
      Parliamone
      <span className="btn__badge">
        <ArrowRight size={14} strokeWidth={2.4} />
      </span>
    </a>
  );
}

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  /* wide at the top (almost full screen), shrinks to a compact pill on scroll */
  const navW = useTransform(scrollY, [0, 220], [1160, 740]);

  useEffect(() => {
    const closeWithKeyboard = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 980) setMobileOpen(false);
    };

    window.addEventListener('keydown', closeWithKeyboard);
    window.addEventListener('resize', closeOnDesktop);
    document.documentElement.classList.toggle('nav-menu-open', mobileOpen);

    return () => {
      window.removeEventListener('keydown', closeWithKeyboard);
      window.removeEventListener('resize', closeOnDesktop);
      document.documentElement.classList.remove('nav-menu-open');
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <motion.header
      className={`nav${mobileOpen ? ' is-open' : ''}`}
      style={{ width: navW }}
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_MODAL, delay: 0.1 }}
    >
      <div className="nav__pill">
        <a className="nav__brand" href="#home" rel="home" aria-label="Rush, torna all'inizio" onClick={closeMobile}>
          <LogoMark />
        </a>

        <nav className="nav__links" aria-label="Navigazione principale">
          {LINKS.map(([label, href]) => (
            <a key={href} className="nav__link" href={href}>
              {label}
            </a>
          ))}
        </nav>

        <ContactLink />

        <button
          type="button"
          className="nav__menu-toggle"
          aria-expanded={mobileOpen}
          aria-controls="nav-mobile-menu"
          aria-label={mobileOpen ? 'Chiudi il menu' : 'Apri il menu'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.nav
            id="nav-mobile-menu"
            className="nav__mobile-panel"
            aria-label="Navigazione mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_MODAL }}
          >
            <div className="nav__mobile-inner">
              {LINKS.map(([label, href], index) => (
                <motion.a
                  key={href}
                  className="nav__mobile-link"
                  href={href}
                  onClick={closeMobile}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: 0.04 + index * 0.035, ease: EASE_MODAL }}
                >
                  {label}
                </motion.a>
              ))}
              <ContactLink className="nav__mobile-cta" onClick={closeMobile} />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
