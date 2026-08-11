import { Zap } from 'lucide-react';
import { useClock } from '../lib/hooks';
import { LiveDot } from './ui';

const COLONNE = [
  [
    'Prodotto',
    [
      ['Il problema', '#problema'],
      ['Cos’è Rush', '#prodotto'],
      ['Cosa ci guadagni', '#vantaggi'],
      ['Come pensa', '#principi'],
    ],
  ],
  [
    'Azienda',
    [
      ['Come lavoriamo', '#metodo'],
      ['Visione', '#visione'],
      ['La prova: ristorazione', '#ristorazione'],
    ],
  ],
  [
    'Contatti',
    [
      ['Richiedi accesso', '#accesso'],
      ['info@rush.it', 'mailto:info@rush.it'],
    ],
  ],
];

export default function Footer() {
  const { time, date } = useClock();

  return (
    <footer className="footer" data-tone="light">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <a href="#top" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em' }}>
              <Zap size={20} strokeWidth={2} />
              Rush
            </a>
            <p className="t-small" style={{ marginTop: 16, maxWidth: 300 }}>
              Un gestionale intelligente per chi ha già tutti i sistemi che gli servono, e nessuno
              che glieli faccia parlare.
            </p>
            {/* orologio live — signature move */}
            <div
              style={{
                marginTop: 24,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
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
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer__base">
          <span>© {new Date().getFullYear()} Rush · Infrastruttura europea, GDPR compliant</span>
          <span>Prima demo — contenuti e integrazioni in evoluzione</span>
        </div>
      </div>
    </footer>
  );
}
