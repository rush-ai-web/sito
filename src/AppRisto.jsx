import { useEffect, useState } from 'react';
import { useAppReady, useTheme, useSmoothScroll } from './lib/hooks';
import { ThemeCtx } from './components/ui';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Fab from './components/Fab';
import ThemeSwitch from './components/ThemeSwitch';
import Prezzi from './components/Prezzi';
import HeroRisto from './components/ristorazione/HeroRisto';
import ProblemaRisto from './components/ristorazione/ProblemaRisto';
import SoluzioneRisto from './components/ristorazione/SoluzioneRisto';
import ComeRisto from './components/ristorazione/ComeRisto';
import CoreRisto from './components/ristorazione/CoreRisto';
import ChatRisto from './components/ristorazione/ChatRisto';
import ModuliRisto from './components/ristorazione/ModuliRisto';
import FaqRisto from './components/ristorazione/FaqRisto';
import CtaRisto from './components/ristorazione/CtaRisto';

function BootScreen() {
  return (
    <div className="boot-screen" role="status" aria-live="polite" aria-label="Caricamento di Rush Ristorazione">
      <div className="boot-screen__mark" aria-hidden="true">
        <span className="boot-screen__ring" />
        <span className="boot-screen__halo" />
        <img className="boot-screen__logo boot-screen__logo--light" src="./rush-logo-192.png" width="192" height="48" alt="" />
        <img className="boot-screen__logo boot-screen__logo--dark" src="./rush-logo-dark-192.png" width="192" height="48" alt="" />
      </div>
      <span className="boot-screen__label">Prepariamo il tuo locale</span>
      <span className="boot-screen__progress" aria-hidden="true">
        <i />
      </span>
    </div>
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
      {!visible ? <BootScreen /> : null}
      {prepared ? (
        <div className={`site-shell${visible ? ' is-visible' : ''}`} aria-hidden={visible ? undefined : true}>
          <Nav />
          <main>
            {/* aurora curata: vive dietro alle sezioni e scorre col contenuto */}
            <div className="aurora" aria-hidden="true">
              <span className="glow bulb big accent l" style={{ top: '20%' }} />
              <span className="glow bulb white r" style={{ top: '17%' }} />
              <span className="glow haze accent l" style={{ top: '34%' }} />
              <span className="glow bulb big accent r" style={{ top: '46%' }} />
              <span className="glow bulb black l" style={{ top: '50%' }} />
              <span className="glow rings accent r" style={{ top: '58%' }} />
              <span className="glow bulb big accent r" style={{ top: '72%' }} />
              <span className="glow bulb white l" style={{ top: '77%' }} />
              <span className="glow bulb black r" style={{ top: '86%' }} />
            </div>

            <HeroRisto />
            <ProblemaRisto />
            <SoluzioneRisto />
            <ComeRisto />
            <CoreRisto />
            <ChatRisto />
            <ModuliRisto />
            <Prezzi />
            <FaqRisto />
            <CtaRisto />
          </main>
          <Footer />
          <Fab />
          <ThemeSwitch theme={theme} onToggle={toggleTheme} />
        </div>
      ) : null}
    </ThemeCtx.Provider>
  );
}
