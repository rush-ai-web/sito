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
          {/* Soluzione (no-grid): due bulb grandi e rotondi, uno per lato */}
          <span className="glow bulb big accent l" style={{ top: '22%' }} />
          <span className="glow bulb white r" style={{ top: '19%' }} />
          {/* Prodotto (grid): bulb bianco morbido da sinistra */}
          <span className="glow bulb white l" style={{ top: '40%' }} />
          {/* Numeri (no-grid): un bulb accento grande e rotondo a destra */}
          <span className="glow bulb big accent r" style={{ top: '48%' }} />
          {/* Metodo (grid): bulb accento da destra */}
          <span className="glow bulb accent r" style={{ top: '57%' }} />
          {/* Ristorazione/Principi (no-grid): bulb nero a sx + accento a dx */}
          <span className="glow bulb black l" style={{ top: '69%' }} />
          <span className="glow bulb big accent r" style={{ top: '73%' }} />
          {/* Faq (no-grid): un bulb accento grande e rotondo a sinistra */}
          <span className="glow bulb big accent l" style={{ top: '84%' }} />
          {/* CTA (grid): due bulb grandi negli angoli in basso — accento sx, bianco dx */}
          <span className="glow bulb big accent l" style={{ top: '93%' }} />
          <span className="glow bulb big white r" style={{ top: '93%' }} />
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
