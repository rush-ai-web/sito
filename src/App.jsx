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
      {/* aurora di sfondo: layer fisso, sfumature accento + neutro dietro tutta la pagina */}
      <div className="aurora-bg" aria-hidden="true">
        <span className="aurora-bg__b b1" />
        <span className="aurora-bg__b b2" />
        <span className="aurora-bg__b b3" />
        <span className="aurora-bg__b b4" />
      </div>
      <Nav />
      <main>
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
