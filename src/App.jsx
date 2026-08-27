import { useTheme, useSmoothScroll } from './lib/hooks';
import { ThemeCtx } from './components/ui';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Problema from './components/Problema';
import Soluzione from './components/Soluzione';
import Prodotto from './components/Prodotto';
import Numeri from './components/Numeri';
import Metodo from './components/Metodo';
import Ristorazione from './components/Ristorazione';
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
          {/* Prodotto (grid): un raggio di luce diagonale accento */}
          <span className="glow beam accent l" style={{ top: '38%' }} />
          {/* Numeri: bulb accento a dx + neutro a sx */}
          <span className="glow bulb big accent r" style={{ top: '48%' }} />
          <span className="glow bulb black l" style={{ top: '52%' }} />
          {/* Metodo (grid): un raggio di luce diagonale accento */}
          <span className="glow beam accent r" style={{ top: '60%' }} />
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
