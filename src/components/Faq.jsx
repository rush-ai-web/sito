import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, Plus } from 'lucide-react';
import { Section, Head } from './ui';
import { EASE_MODAL } from '../lib/motion';

/* Categorie FAQ rielaborate sul contesto Rush */
const CATEGORIES = {
  prodotto: 'Il prodotto',
  processo: 'Come lavoriamo',
  costi: 'Costi e supporto',
  tecnologia: 'AI e tecnologia',
};

const FAQ_DATA = {
  prodotto: [
    {
      q: 'Che tipo di gestionali costruite?',
      a: "Costruiamo gestionali su misura per PMI italiane: cassa, magazzino, fatturazione elettronica, ordini, presenze, CRM, produzione. Il perimetro si decide insieme partendo dai tuoi processi reali, non da un template.",
    },
    {
      q: 'Cosa succede al gestionale che uso oggi?',
      a: "Non lo cancelliamo: nella fase di analisi mappiamo cosa fa oggi ogni strumento, cosa vale la pena conservare e cosa può essere sostituito. Rush si integra con l'esistente e lo sostituisce solo dove porta un vantaggio chiaro.",
    },
    {
      q: 'Posso aggiungere funzionalità dopo?',
      a: "Sì. Il gestionale evolve con l'azienda: aggiungiamo moduli, campi, automazioni e report nel tempo. Non paghi mai un piano superiore per sbloccare cose che ti servivano davvero.",
    },
    {
      q: 'Funziona sia da desktop che da mobile?',
      a: "Sì. L'interfaccia è la stessa in ufficio e in movimento: apri, cerchi, aggiorni — senza dover reimparare nulla. Anche dal telefono lavori sui dati veri, non su una versione ridotta.",
    },
  ],
  processo: [
    {
      q: 'Quanto tempo ci vuole per partire?',
      a: "Un primo modulo operativo è tipicamente pronto in 4-8 settimane dall'analisi. Non aspetti mesi prima di vedere qualcosa: rilasciamo per moduli, così cominci ad usare il gestionale mentre il resto si costruisce.",
    },
    {
      q: 'Come funziona la fase di analisi?',
      a: "Passiamo del tempo con te e con chi userà il gestionale ogni giorno. Guardiamo come lavorate oggi, dove perdete tempo, quali dati non tornano. Da lì definiamo insieme le priorità e i moduli.",
    },
    {
      q: 'Dovete stravolgere i miei processi?',
      a: "No, l'opposto. Il software si adatta ai processi che funzionano già. Se qualcosa oggi ti costa tempo, lo mettiamo sul tavolo e decidiamo insieme se cambiare il processo o costruire l'automazione.",
    },
    {
      q: 'Chi lavora sul progetto?',
      a: "Un team piccolo e stabile: un referente unico che conosce il tuo progetto dall'inizio, sviluppatori senior, e chi conosce il tuo settore. Non passi mai da account manager diversi ad ogni telefonata.",
    },
  ],
  costi: [
    {
      q: 'Come funziona il costo del gestionale?',
      a: "Canone mensile fisso e chiaro, che copre uso, hosting, aggiornamenti e supporto. Nessun extra nascosto, nessun rincaro a sorpresa: sai sempre quanto paghi.",
    },
    {
      q: 'Il canone sale ogni anno?',
      a: "No. Il prezzo che concordiamo resta quello, non c'è un listino annuo che ti trascina in un piano più costoso solo perché sei cresciuto.",
    },
    {
      q: 'Che tipo di supporto è incluso?',
      a: "Supporto continuo via chat ed email con tempi di risposta impegnativi, sessioni periodiche per raccogliere feedback e piccoli aggiustamenti gratuiti. Non chiami un call center: parli direttamente con chi ha costruito il tuo gestionale.",
    },
    {
      q: "Posso vedere una demo prima di decidere?",
      a: "Sì. Fissiamo una call di 30 minuti in cui ti mostriamo casi reali dei nostri clienti e capiamo se ha senso proseguire con un'analisi. Zero impegno.",
    },
  ],
  tecnologia: [
    {
      q: "L'AI cosa fa esattamente nel gestionale?",
      a: "Legge i tuoi dati e risponde con numeri veri: 'chi mi ha alzato i prezzi', 'quali clienti stanno rallentando', 'quanto ho perso su questo articolo'. Non è un chatbot appiccicato — è agganciato al database del tuo gestionale.",
    },
    {
      q: "I miei dati sono al sicuro?",
      a: "Sì. Hosting su datacenter europei conformi GDPR, backup automatici, cifratura in transito e a riposo, controlli di accesso per ruolo. I dati sono i tuoi: puoi esportarli sempre, in qualsiasi momento.",
    },
    {
      q: "Vi integrate con i servizi che uso già?",
      a: "Sì. Fatturazione elettronica (SDI), banca, POS, e-commerce, corrieri, piattaforme di pagamento, CRM esterni — praticamente qualsiasi cosa esponga API o file. Se un'integrazione non esiste, la costruiamo.",
    },
    {
      q: 'E se in futuro voglio cambiare fornitore?',
      a: "I dati sono tuoi e ti restano, esportabili in formati aperti (CSV, JSON, dump SQL). Nessun lock-in: se un giorno decidi di andare altrove, non blocchiamo nulla.",
    },
  ],
};

export default function Faq() {
  const cats = Object.keys(CATEGORIES);
  const [sel, setSel] = useState(cats[0]);

  return (
    <Section id="faq" large className="faq-sec">
      <Head
        icon={HelpCircle}
        label="Domande frequenti"
        title={<>Le domande che ci fate più spesso</>}
        sub="Le risposte in due righe. Se ne hai altre, ci sentiamo direttamente."
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
                    layoutId="faq-tab-bg"
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
      <button
        type="button"
        className="faq-item__head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
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
