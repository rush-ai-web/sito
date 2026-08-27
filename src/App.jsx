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
          {/* Problema (sotto la dashboard): UN solo fascio diagonale accento */}
          <span className="glow beam accent r" style={{ top: '15%' }} />
          {/* Soluzione: due bulb, uno per lato — accento a sx, bianco a dx */}
          <span className="glow bulb accent l" style={{ top: '30%' }} />
          <span className="glow bulb sm white r" style={{ top: '26%' }} />
          {/* Prodotto/Numeri: streak bianco morbido da sinistra */}
          <span className="glow beam white l" style={{ top: '47%' }} />
          {/* Metodo/Ristorazione: bulb accento a dx + profondità nera a sx */}
          <span className="glow bulb black l" style={{ top: '61%' }} />
          <span className="glow bulb accent r" style={{ top: '64%' }} />
          {/* Faq: streak accento diagonale da sinistra */}
          <span className="glow beam accent l" style={{ top: '82%' }} />
          {/* CTA/footer: split — accento grande a sx, bianco a dx */}
          <span className="glow bulb big accent l" style={{ top: '93%' }} />
          <span className="glow bulb white r" style={{ top: '91%' }} />
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
