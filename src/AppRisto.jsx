import { useEffect, useState } from 'react';
import { useAppReady, useTheme, useSmoothScroll } from './lib/hooks';
import { ThemeCtx } from './components/ui';
import BootScreen from './components/BootScreen';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Fab from './components/Fab';
import ThemeSwitch from './components/ThemeSwitch';
import HeroRisto from './components/ristorazione/HeroRisto';
import FunzioniRisto from './components/ristorazione/FunzioniRisto';
import CoreRisto from './components/ristorazione/CoreRisto';
import ChatRisto from './components/ristorazione/ChatRisto';
import MisurabilitaRisto from './components/ristorazione/MisurabilitaRisto';
import PrezziRisto from './components/ristorazione/PrezziRisto';
import FaqRisto from './components/ristorazione/FaqRisto';
import AvvioRisto from './components/ristorazione/AvvioRisto';
import CtaRisto from './components/ristorazione/CtaRisto';

/* Nav e Footer sono condivisi con la home, ma le sezioni di questa
   pagina hanno id diversi: qui sovrascriviamo i link con quelli giusti. */
const NAV_LINKS = [
  ['Funzioni', '#funzioni'],
  ['Prezzi', '#prezzi'],
  ['Come lavoriamo', '#avvio'],
  ['FAQ', '#faq'],
];

const FOOTER_COLUMNS = [
  [
    'Cosa facciamo',
    [
      ['Tutte le funzioni', '#funzioni'],
      ['Il core', '#prodotto'],
      ['Rush AI', '#chat'],
    ],
  ],
  [
    'Rush Ristorazione',
    [
      ['Risultati misurabili', '#misurabilita'],
      ['Prezzi', '#prezzi'],
      ['Come lavoriamo', '#avvio'],
      ['FAQ', '#faq'],
      ['Tutto Rush', '/'],
    ],
  ],
  [
    'Contatti',
    [
      ['Prenota una demo', '#contatti'],
      ['info@rush-ai.it', 'mailto:info@rush-ai.it'],
    ],
  ],
];

function BootWrap() {
  return (
    <BootScreen
      label="Prepariamo il tuo locale"
      ariaLabel="Caricamento di Rush Ristorazione"
      logoLight="./rush-logo-orange.webp"
      logoDark="./rush-logo-orange-dark.webp"
    />
  );
}

export default function AppRisto() {
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
      {/* tutta la pagina vive nello scope arancione del verticale
          ristorazione: bottoni, chip, bulb e logo si ricolorano da soli. */}
      <div className="risto-orange">
        {!visible ? <BootWrap /> : null}
        {prepared ? (
          <div className={`site-shell${visible ? ' is-visible' : ''}`} aria-hidden={visible ? undefined : true}>
            <Nav logoVariant="ristorazione" links={NAV_LINKS} theme={theme} onToggleTheme={toggleTheme} />
            <main>
              {/* aurora curata: vive dietro alle sezioni e scorre col contenuto */}
              <div className="aurora" aria-hidden="true">
                <span className="glow bulb big accent l" style={{ top: '18%' }} />
                <span className="glow bulb white r" style={{ top: '15%' }} />
                <span className="glow haze accent l" style={{ top: '30%' }} />
                <span className="glow bulb big accent r" style={{ top: '42%' }} />
                <span className="glow bulb black l" style={{ top: '48%' }} />
                <span className="glow rings accent r" style={{ top: '56%' }} />
                <span className="glow bulb big accent l" style={{ top: '66%' }} />
                <span className="glow bulb big accent r" style={{ top: '76%' }} />
                <span className="glow bulb white l" style={{ top: '82%' }} />
                <span className="glow bulb black r" style={{ top: '90%' }} />
              </div>

              <HeroRisto />
              <FunzioniRisto />
              <ChatRisto />
              <MisurabilitaRisto />
              <PrezziRisto />
              <CoreRisto />
              <AvvioRisto />
              <FaqRisto />
              <CtaRisto />
            </main>
            <Fab />
            <ThemeSwitch theme={theme} onToggle={toggleTheme} />
            <Footer logoVariant="ristorazione" columns={FOOTER_COLUMNS} />
          </div>
        ) : null}
      </div>
    </ThemeCtx.Provider>
  );
}
