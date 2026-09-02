import { useTheme, useSmoothScroll } from './lib/hooks';
import { ThemeCtx } from './components/ui';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Problema from './components/Problema';
import Ecosistema from './components/Ecosistema';
import Soluzione from './components/Soluzione';
import Prodotto from './components/Prodotto';
import Numeri from './components/Numeri';
import Metodo from './components/Metodo';
import Ristorazione from './components/Ristorazione';
import Confronto from './components/Confronto';
import Prezzi from './components/Prezzi';
import Principi from './components/Principi';
import Faq from './components/Faq';
import Cta from './components/Cta';
import Footer from './components/Footer';
import Fab from './components/Fab';
import ThemeSwitch from './components/ThemeSwitch';

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
          {/* Problema (grid): nessun glow qui — la sua unica animazione è la
              fascia di luce bianca (.section--shine) che sweepa lo sfondo. */}
          {/* Soluzione: bulb accento a sx + neutro a dx */}
          <span className="glow bulb big accent l" style={{ top: '22%' }} />
          <span className="glow bulb white r" style={{ top: '19%' }} />
          {/* Prodotto (grid): non più un raggio diagonale, ma un lavaggio
              d'accento morbido e diffuso — luce d'ambiente, non una banda */}
          <span className="glow haze accent l" style={{ top: '34%' }} />
          {/* Numeri: bulb accento a dx + neutro a sx */}
          <span className="glow bulb big accent r" style={{ top: '48%' }} />
          <span className="glow bulb black l" style={{ top: '52%' }} />
          {/* Metodo (grid): onde concentriche d'accento molto tenui — un
              motivo diverso dai bulb, che richiama la connessione */}
          <span className="glow rings accent r" style={{ top: '58%' }} />
          {/* Principi: bulb accento a dx + neutro a sx */}
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
        {/* tutto in un unico posto — diagramma di convergenza */}
        <Ecosistema />
        {/* chiaro */}
        <Soluzione />
        {/* scuro */}
        <Prodotto />
        {/* chiaro */}
        <Numeri />
        {/* scuro */}
        <Metodo />
        {/* chiaro */}
        <Ristorazione />
        <Confronto />
        <Prezzi />
        <Principi />
        <Faq />
        {/* scuro */}
        <Cta />
      </main>
      <Footer />
      <Fab />
      <ThemeSwitch theme={theme} onToggle={toggleTheme} />
    </ThemeCtx.Provider>
  );
}
