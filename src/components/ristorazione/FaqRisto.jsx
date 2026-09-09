import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, Plus } from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL } from '../../lib/motion';

const CATEGORIES = {
  prodotto: 'Il prodotto',
  avvio: 'Avvio e cassa',
  costi: 'Costi e supporto',
  dati: 'Dati e privacy',
};

const FAQ_DATA = {
  prodotto: [
    {
      q: 'Rush sostituisce la mia cassa?',
      a: "No, e non vuole farlo. Rush si aggancia in sola lettura alla cassa che usi da anni e le fa parlare col resto: fatture, magazzino, ricette. Non tocchi lo scontrino, non cambi le abitudini del team.",
    },
    {
      q: 'Funziona con la cassa che ho io?',
      a: "Partiamo da Zucchetti ilConto e stiamo estendendo il supporto ai principali sistemi HORECA italiani (Cassa in Cloud, Scloby, TCPos, Cassanova). In demo verifichiamo insieme la tua cassa specifica: se non è ancora supportata, ti diciamo tempi reali.",
    },
    {
      q: 'Devo cambiare il modo in cui lavoro?',
      a: "No. Rush lavora dietro le quinte sui dati che già produci battendo gli scontrini e ricevendo le fatture. Il team continua come prima; sei tu che, dalla dashboard, vedi finalmente i numeri veri.",
    },
    {
      q: 'Le fatture cartacee come le gestisco?',
      a: "Le fotografi col telefono. L'intelligenza artificiale legge fornitore, prodotti e importi, tu confermi in pochi secondi e il magazzino si aggiorna. Le fatture elettroniche invece arrivano da sole.",
    },
  ],
  avvio: [
    {
      q: 'Quanto ci mette a partire?',
      a: "L'onboarding importa 3-6 mesi di fatture storiche e le vendite dalla cassa, così parti già con dati veri dentro. In poche settimane hai dashboard, magazzino, fatture e chat AI operativi.",
    },
    {
      q: 'Devo installare qualcosa nel locale?',
      a: "Un piccolo ponte legge i dati dalla cassa e li invia a Rush in modo sicuro. Per le timbrature basta un QR stampato: il dipendente lo inquadra col telefono, senza hardware dedicato.",
    },
    {
      q: 'I miei dipendenti come lo usano?',
      a: "Hanno un'app web con login via link: vedono solo i propri turni, timbrano col QR, chiedono ferie e consultano le ore. Tutto il resto lo gestisci tu dalla dashboard.",
    },
  ],
  costi: [
    {
      q: 'Quanto costa?',
      a: "Un canone chiaro a partire da 259€/mese (annuale) o 299€/mese (trimestrale), senza costi nascosti. I moduli opzionali si aggiungono solo se li attivi. Il prezzo esatto dipende dalla complessità e dai moduli scelti.",
    },
    {
      q: 'Il canone sale ogni anno?',
      a: "No. Il prezzo che concordiamo resta quello. Nessun listino che ti trascina in un piano più costoso solo perché il locale cresce.",
    },
    {
      q: 'Posso vedere una demo prima?',
      a: "Sì, ed è il modo giusto per capire se fa per te. In una call ti mostriamo Rush su dati reali di un locale e verifichiamo la compatibilità con la tua cassa. Zero impegno.",
    },
  ],
  dati: [
    {
      q: 'I dati del locale sono al sicuro?',
      a: "Sì. Infrastruttura europea, cifratura in transito e a riposo, isolamento tra clienti a livello di database, backup giornalieri. I dati sono i tuoi: li esporti quando vuoi.",
    },
    {
      q: 'E i dati sensibili del personale?',
      a: "Nomi, stipendi e ore stanno dietro un PIN dedicato con blocco automatico dopo pochi minuti, più una modalità privacy per oscurare i dati se mostri lo schermo a qualcuno.",
    },
    {
      q: 'Le timbrature rispettano la normativa?',
      a: "Sì. La verifica è leggera e GDPR-safe: controlliamo che il telefono sia sul WiFi del locale, senza geolocalizzazione GPS diretta del lavoratore (che richiederebbe accordo sindacale).",
    },
  ],
};

export default function FaqRisto() {
  const cats = Object.keys(CATEGORIES);
  const [sel, setSel] = useState(cats[0]);

  return (
    <Section id="faq" large className="faq-sec">
      <Head
        icon={HelpCircle}
        label="Domande frequenti"
        title={<>Le domande che ci fanno i ristoratori</>}
        sub="Le risposte in due righe. Se ne hai altre, ne parliamo in demo."
      />

      <div className="faq-tabs" role="tablist" aria-label="Categorie">
        {cats.map((k) => {
          const isSel = sel === k;
          return (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={isSel}
              onClick={() => setSel(k)}
              className={`faq-tab${isSel ? ' is-sel' : ''}`}
            >
              <AnimatePresence>
                {isSel && (
                  <motion.span
                    className="faq-tab__bg"
                    layoutId="faq-risto-tab-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_MODAL }}
                  />
                )}
              </AnimatePresence>
              <span className="faq-tab__t">{CATEGORIES[k]}</span>
            </button>
          );
        })}
      </div>

      <div className="faq-list">
        <AnimatePresence mode="wait">
          <motion.div
            key={sel}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: EASE_MODAL }}
            className="faq-list__inner"
          >
            {FAQ_DATA[sel].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' is-open' : ''}`}>
      <button type="button" className="faq-item__head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="faq-item__q">{q}</span>
        <motion.span
          className="faq-item__ic"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.24, ease: EASE_MODAL }}
        >
          <Plus size={20} strokeWidth={2.2} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-item__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_MODAL }}
          >
            <p className="faq-item__a">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
