import { startTransition } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { MotionGlobalConfig } from 'framer-motion';

/* La build prerenderizza la pagina dentro #root. Idratarla riusa quel DOM
   invece di distruggerlo e ricostruirlo: niente ricalcolo di stile e layout
   su tutta la pagina proprio mentre il JS arriva al primo accesso.

   Se il visitatore ha già visto l'HTML statico (primo paint avvenuto prima
   del JS, tipico senza cache) le animazioni d'entrata già a schermo non
   ripartono da zero: si chiudono subito sul loro stato finale. Con la cache
   il JS arriva prima del paint e l'entrata si vede come sempre.

   L'idratazione parte in una transition: React la spezza in blocchi brevi
   e cede il thread al browser tra l'uno e l'altro, invece di occuparlo per
   centinaia di millisecondi mentre la pagina è già visibile. */
let released = true;
const releaseListeners = new Set();

export function mount(element) {
  const root = document.getElementById('root');
  if (!root.hasAttribute('data-prerender')) {
    createRoot(root).render(element);
    return;
  }

  released = false;

  const painted = performance.getEntriesByName('first-contentful-paint').length > 0;
  if (painted) MotionGlobalConfig.skipAnimations = true;
  startTransition(() => {
    hydrateRoot(root, element);
  });
}

/* Chiamato dopo il commit dell'idratazione: aspetta che Motion abbia scritto
   gli stati iniziali, poi toglie la rete di sicurezza del prerender. */
export function releasePrerender() {
  let second;
  const first = requestAnimationFrame(() => {
    second = requestAnimationFrame(() => {
      MotionGlobalConfig.skipAnimations = false;
      document.getElementById('root')?.removeAttribute('data-prerender');
      released = true;
      releaseListeners.forEach((listener) => listener());
      releaseListeners.clear();
    });
  });
  return () => {
    cancelAnimationFrame(first);
    cancelAnimationFrame(second);
  };
}

/* I loop decorativi partono solo a idratazione conclusa: avviati mentre le
   entrate vengono saltate, Motion li chiuderebbe subito e resterebbero fermi. */
export function onPrerenderReleased(listener) {
  if (released) {
    listener();
    return () => {};
  }
  releaseListeners.add(listener);
  return () => releaseListeners.delete(listener);
}
