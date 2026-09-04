import { Suspense, lazy } from 'react';
import { useTheme, useSmoothScroll } from './lib/hooks';
import { ThemeCtx } from './components/ui';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Fab from './components/Fab';
import ThemeSwitch from './components/ThemeSwitch';

/* Sezioni sotto la piega: code-split così il bundle iniziale resta piccolo
   e il thread principale ha meno JS da valutare nei primi secondi (mobile
   in particolare). Nessun cambio di effetti o layout: sono le stesse
   sezioni, solo caricate/eseguite in chunk separati invece che tutte
   insieme al bootstrap. */
const Problema = lazy(() => import('./components/Problema'));
const Soluzione = lazy(() => import('./components/Soluzione'));
const Ecosistema = lazy(() => import('./components/Ecosistema'));
const Metodo = lazy(() => import('./components/Metodo'));
const Prodotto = lazy(() => import('./components/Prodotto'));
const Numeri = lazy(() => import('./components/Numeri'));
const Ristorazione = lazy(() => import('./components/Ristorazione'));
const Confronto = lazy(() => import('./components/Confronto'));
const Prezzi = lazy(() => import('./components/Prezzi'));
const Faq = lazy(() => import('./components/Faq'));
const Cta = lazy(() => import('./components/Cta'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  const [theme, toggleTheme] = useTheme();
  useSmoothScroll();

  return (
    <ThemeCtx.Provider value={theme}>
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
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Fab />
      <ThemeSwitch theme={theme} onToggle={toggleTheme} />
    </ThemeCtx.Provider>
  );
}
