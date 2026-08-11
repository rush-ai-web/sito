import { useTheme } from './lib/hooks';
import { ThemeCtx } from './components/ui';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Problema from './components/Problema';
import Prodotto from './components/Prodotto';
import Vantaggi from './components/Vantaggi';
import Principi from './components/Principi';
import Ristorazione from './components/Ristorazione';
import Metodo from './components/Metodo';
import Visione from './components/Visione';
import Cta from './components/Cta';
import Footer from './components/Footer';
import Fab from './components/Fab';

export default function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <ThemeCtx.Provider value={theme}>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Problema />
        <Prodotto />
        <Vantaggi />
        <Principi />
        <Ristorazione />
        <Metodo />
        <Visione />
        <Cta />
      </main>
      <Footer />
      <Fab />
    </ThemeCtx.Provider>
  );
}
