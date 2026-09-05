import { useEffect, useState } from 'react';
import { useAppReady, useTheme, useSmoothScroll } from './lib/hooks';
import { ThemeCtx } from './components/ui';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Problema from './components/Problema';
import Soluzione from './components/Soluzione';
import Ecosistema from './components/Ecosistema';
import Metodo from './components/Metodo';
import Prodotto from './components/Prodotto';
import Numeri from './components/Numeri';
import Ristorazione from './components/Ristorazione';
import Confronto from './components/Confronto';
import Prezzi from './components/Prezzi';
import Faq from './components/Faq';
import Cta from './components/Cta';
import Footer from './components/Footer';
import Fab from './components/Fab';
import ThemeSwitch from './components/ThemeSwitch';

function BootScreen() {
  return (
    <div className="boot-screen" role="status" aria-live="polite" aria-label="Caricamento del sito Rush">
      <div className="boot-screen__mark" aria-hidden="true">
        <span className="boot-screen__ring" />
        <span className="boot-screen__halo" />
        <img
          className="boot-screen__logo boot-screen__logo--light"
          src="./rush-logo-192.png"
          width="192"
          height="48"
          alt=""
        />
        <img
          className="boot-screen__logo boot-screen__logo--dark"
          src="./rush-logo-dark-192.png"
          width="192"
          height="48"
          alt=""
        />
      </div>
      <span className="boot-screen__label">Prepariamo il tuo gestionale</span>
      <span className="boot-screen__progress" aria-hidden="true">
        <i />
      </span>
    </div>
  );
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const prepared = useAppReady();
  const [visible, setVisible] = useState(false);
  useSmoothScroll(visible);

  useEffect(() => {
    if (!prepared) return undefined;
    let frameId;
    const settleId = window.setTimeout(() => {
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => setVisible(true));
      });
    }, 180);
    return () => {
      window.clearTimeout(settleId);
      cancelAnimationFrame(frameId);
    };
  }, [prepared]);

  return (
    <ThemeCtx.Provider value={theme}>
      {!visible ? <BootScreen /> : null}
      {prepared ? (
        <div className={`site-shell${visible ? ' is-visible' : ''}`} aria-hidden={visible ? undefined : true}>
      <Nav />
      <main>
        {/* aurora curata: composizione variata per regione, mai fasci in fila
            fissa. Vive dentro <main> così scorre col contenuto. */}
        <div className="aurora" aria-hidden="true">
          {/* Problema (grid): nessun glow qui - la sua unica animazione è la
              fascia di luce bianca (.section--shine) che sweepa lo sfondo. */}
          {/* Soluzione: bulb accento a sx + neutro a dx */}
          <span className="glow bulb big accent l" style={{ top: '22%' }} />
          <span className="glow bulb white r" style={{ top: '19%' }} />
          {/* Prodotto (grid): non più un raggio diagonale, ma un lavaggio
              d'accento morbido e diffuso - luce d'ambiente, non una banda */}
          <span className="glow haze accent l" style={{ top: '34%' }} />
          {/* Numeri: bulb accento a dx + neutro a sx */}
          <span className="glow bulb big accent r" style={{ top: '48%' }} />
          <span className="glow bulb black l" style={{ top: '52%' }} />
          {/* Metodo (grid): onde concentriche d'accento molto tenui */}
          <span className="glow rings accent r" style={{ top: '58%' }} />
          {/* Confronto/Prezzi: bulb accento a dx + neutro a sx */}
          <span className="glow bulb big accent r" style={{ top: '73%' }} />
          <span className="glow bulb white l" style={{ top: '78%' }} />
          {/* FAQ: bulb neutro a destra */}
          <span className="glow bulb black r" style={{ top: '86%' }} />
          {/* CTA: i bulb sono direttamente in Cta.jsx, clippati dalla sezione */}
        </div>
        {/* chiaro */}
        <Hero />
        {/* scuro */}
        <Problema />
        {/* chiaro */}
        <Soluzione />
        {/* tutto in un unico posto - diagramma di convergenza */}
        <Ecosistema />
        {/* scuro */}
        <Metodo />
        {/* scuro */}
        <Prodotto />
        {/* chiaro */}
        <Numeri />
        {/* chiaro */}
        <Ristorazione />
        <Confronto />
        <Prezzi />
        <Faq />
        {/* scuro */}
        <Cta />
      </main>
      <Footer />
      <Fab />
      <ThemeSwitch theme={theme} onToggle={toggleTheme} />
        </div>
      ) : null}
    </ThemeCtx.Provider>
  );
}
