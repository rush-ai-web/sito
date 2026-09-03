import { useContext } from 'react';
import { useClock } from '../lib/hooks';
import { LiveDot, ThemeCtx } from './ui';

const COLONNE = [
  [
    'Cosa facciamo',
    [
      ['Gestionali su misura', '#prodotto'],
      ['Automazioni', '#prodotto'],
      ['AI integrata', '#prodotto'],
      ['Integrazioni', '#prodotto'],
    ],
  ],
  [
    'Azienda',
    [
      ['Come lavoriamo', '#metodo'],
      ['Perché Rush', '#principi'],
      ['Risultati', '#numeri'],
      ['Ristorazione', '#ristorazione'],
    ],
  ],
  [
    'Contatti',
    [
      ['Parliamo del tuo progetto', '#contatti'],
      ['info@rush.it', 'mailto:info@rush.it'],
    ],
  ],
];

export default function Footer() {
  const { time, date } = useClock();
  const theme = useContext(ThemeCtx);
  const logoSrc = theme === 'dark' ? './rush-logo-dark.png' : './rush-logo.png';

  return (
    <footer className="footer" data-tone="light">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <a href="#home" className="footer__brand" aria-label="Rush — torna all'inizio">
              <img src={logoSrc} alt="Rush" className="footer__logo" />
            </a>
            <p className="t-small" style={{ marginTop: 16, maxWidth: 320 }}>
              Software house italiana. Progettiamo e sviluppiamo gestionali su misura, con dati in
              tempo reale, automazioni e intelligenza artificiale integrata.
            </p>
            {/* orologio live — signature move */}
            <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <LiveDot />
              <span>
                <time className="num" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>
                  {time}
                </time>
                <span className="t-small faint" style={{ display: 'block', fontSize: 13 }}>
                  {date}
                </span>
              </span>
            </div>
          </div>

          {COLONNE.map(([titolo, voci]) => (
            <div className="footer__col" key={titolo}>
              <h4>{titolo}</h4>
              {voci.map(([label, href]) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer__base">
          <span>© {new Date().getFullYear()} Rush. Tutti i diritti riservati.</span>
          <span>Demo — contenuti e integrazioni in evoluzione</span>
        </div>

        {/* logo gigante, sfumato verso il basso */}
        <span className="wordmark" aria-hidden="true">
          <img src={logoSrc} alt="" className="wordmark__logo" />
        </span>
      </div>
    </footer>
  );
}
