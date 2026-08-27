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
        {/* aurora strutturata: fasci diagonali alternati sinistra/destra che
            scendono lungo la pagina ciclando blu accento → bianco → nero,
            con lo stesso peso. Vive dentro <main> così scorre col contenuto. */}
        <div className="aurora" aria-hidden="true">
          <span className="aurora__beam b-accent s-r" style={{ top: '2%' }} />
          <span className="aurora__beam b-white s-l" style={{ top: '13%' }} />
          <span className="aurora__beam b-black s-r" style={{ top: '24%' }} />
          <span className="aurora__beam b-accent s-l" style={{ top: '35%' }} />
          <span className="aurora__beam b-white s-r" style={{ top: '46%' }} />
          <span className="aurora__beam b-black s-l" style={{ top: '57%' }} />
          <span className="aurora__beam b-accent s-r" style={{ top: '68%' }} />
          <span className="aurora__beam b-white s-l" style={{ top: '79%' }} />
          <span className="aurora__beam b-black s-r" style={{ top: '90%' }} />
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
