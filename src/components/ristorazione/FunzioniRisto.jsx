import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid,
  ArrowRight,
  Boxes,
  BellRing,
  UsersRound,
  ScanLine,
  TrendingUp,
  Megaphone,
  Globe,
  CalendarCheck,
  Phone,
  Star,
  Search,
  Sparkles,
  Share2,
  MapPin,
  Workflow,
  Languages,
} from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { DUR, EASE_MODAL, inView } from '../../lib/motion';

/* tutto quello che Rush Ristorazione fa, in un'unica griglia: il
   gestionale e la strategia intorno, allo stesso livello. Presentiamo
   il perimetro completo, senza distinguere cosa è già pronto e cosa no.
   Ogni voce spiega il problema reale che risolve, non solo la funzione. */
const FUNZIONI = [
  {
    icon: Boxes,
    t: 'Magazzino',
    featured: true,
    content: (
      <>
        <p>
          Il magazzino si aggiorna mentre il locale lavora: <strong>la cassa comunica cosa
          esce, le fatture cosa entra</strong>. Così sai cosa hai, quanto vale e quale partita
          stai realmente consumando, senza dover controllare scaffali e celle ogni volta.
        </p>
        <ul>
          <li>ricostruisce tutti i movimenti e rende visibili differenze, sprechi o ammanchi;</li>
          <li>segnala subito i rincari dei fornitori e mostra come cambiano nel tempo;</li>
          <li>scarica gli ingredienti corretti in base alla composizione di piatti e bevande.</li>
        </ul>
        <p>
          Anche i documenti cartacei entrano nel flusso: basta una foto e il sistema compila i
          campi da controllare. Il risultato è <u>una giacenza leggibile e verificabile</u>, non
          un numero ricostruito a fine mese.
        </p>
      </>
    ),
  },
  {
    icon: BellRing,
    t: 'Scorte e riordini',
    content: (
      <>
        <p>
          Rush controlla le quantità al posto tuo e ti avvisa <strong>prima che un prodotto
          diventi un problema durante il servizio</strong>. Ogni articolo può avere una soglia
          di preallarme e una critica, così distingui ciò che va monitorato da ciò che va
          ordinato subito.
        </p>
        <p>
          Quando serve, prepara una proposta di riordino con quantità convertite in confezioni
          reali, prodotti raggruppati per fornitore e costo previsto. Può preparare anche il
          messaggio da inviare: tu controlli e confermi, senza ripartire ogni volta da un foglio
          o dalla memoria.
        </p>
      </>
    ),
  },
  {
    icon: UsersRound,
    t: 'Gestione personale',
    content: (
      <>
        <p>
          Turni, disponibilità, comunicazioni e presenze vivono in un unico posto. Ogni persona
          riceve gli aggiornamenti, vede <strong>quando lavora e con chi</strong> e accede alla
          propria area per consultare il calendario o richiedere ferie, permessi, malattia e
          indisponibilità.
        </p>
        <ul>
          <li>il QR del locale registra gli orari reali di entrata e uscita;</li>
          <li>l’AI aiuta a comporre i turni rispettando esigenze, ore e disponibilità;</li>
          <li>un export precompilato riassume ore, ferie e permessi per il commercialista.</li>
        </ul>
        <p>
          Se colleghi anche la cassa, puoi leggere lo scontrino medio per addetto e trasformare
          i dati in formazione, obiettivi e premi. <u>Non per controllare le persone</u>, ma per
          capire dove il team può lavorare meglio.
        </p>
      </>
    ),
  },
  {
    icon: ScanLine,
    t: 'Fatture',
    content: (
      <>
        <p>
          Tutte le fatture sono raccolte nello stesso registro, filtrabili e ordinabili come ti
          è più utile. Quelle elettroniche si caricano automaticamente e <strong>aggiornano
          prodotti, quantità e costi di magazzino</strong>; per un documento cartaceo è
          sufficiente scattare una foto e verificare i dati letti dal sistema.
        </p>
        <p>
          Hai subito sotto controllo fornitori, scadenze, importi e variazioni di prezzo, senza
          copiare due volte le stesse informazioni. Quando serve, prepari un file già ordinato
          per il commercialista: <u>meno inserimenti manuali, meno errori e meno documenti
          sparsi</u>.
        </p>
      </>
    ),
  },
  {
    icon: TrendingUp,
    t: 'Costi e ricavi',
    featured: true,
    content: (
      <>
        <p>
          Incassi, costi fissi, costi variabili e utile lordo della giornata diventano numeri
          leggibili nello stesso cruscotto. Per ogni piatto o bevanda vedi <strong>food cost,
          margine reale per porzione e contributo complessivo alle vendite</strong>, calcolati
          sul costo della partita effettivamente consumata.
        </p>
        <ul>
          <li>capisci quali proposte valorizzare, riprezzare o rivedere;</li>
          <li>intercetti gli aumenti dei fornitori prima che erodano il margine;</li>
          <li>confronti popolarità e redditività attraverso il menu engineering.</li>
        </ul>
        <p>
          L’AI legge questi dati nel contesto del tuo locale e ti aiuta a individuare dove
          intervenire. Non un consiglio generico: <u>una decisione basata su ciò che sta
          succedendo davvero</u>.
        </p>
      </>
    ),
  },
  {
    icon: Megaphone,
    t: 'Marketing',
    content: (
      <>
        <p>
          Promozioni, iniziative e comunicazioni partono dallo stesso sistema in cui già
          gestisci clienti e prenotazioni. Puoi creare un’offerta, scegliere a chi mostrarla e
          distribuirla sul sito, online o nel locale senza mantenere versioni diverse.
        </p>
        <p>
          Poi ne segui i risultati: quante persone l’hanno ricevuta, utilizzata e trasformata in
          una visita. L’obiettivo non è pubblicare più messaggi, ma <strong>costruire una
          clientela riconoscibile e mantenerla nel tempo</strong> con iniziative misurabili.
        </p>
      </>
    ),
  },
  {
    icon: Globe,
    t: 'Sito web',
    featured: true,
    content: (
      <>
        <p>
          Il sito racconta il locale prima ancora che il cliente entri: proposta, atmosfera,
          orari, contatti e menu. Lo costruiamo con un’identità visiva coerente al tuo stile e al
          tuo tono di voce, perché sia <strong>bello da vedere ma soprattutto facile da trovare
          e da usare</strong>.
        </p>
        <ul>
          <li>ti rende riconoscibile tra i concorrenti su Google e nelle nuove ricerche AI;</li>
          <li>mostra menu e informazioni sempre aggiornabili;</li>
          <li>può raccogliere prenotazioni direttamente, senza passaggi inutili.</li>
        </ul>
        <p>
          Senza una presenza proprietaria è più difficile essere scoperti e consigliati online.
          Il sito diventa la base digitale del locale: <u>uno spazio tuo, non il profilo di una
          piattaforma</u>.
        </p>
      </>
    ),
  },
  {
    icon: CalendarCheck,
    t: 'Prenotazioni',
    content: (
      <>
        <p>
          Le richieste dal sito, quelle ricevute al telefono e quelle inserite in sala arrivano
          nello stesso calendario. Il sistema controlla disponibilità e capienza, permette al
          cliente di indicare dove preferisce stare e <strong>impedisce di assegnare lo stesso
          tavolo a più persone</strong>.
        </p>
        <p>
          Conferme e promemoria partono in automatico, riducendo telefonate e dimenticanze. Tu
          mantieni una vista chiara del servizio; il cliente riceve informazioni precise senza
          dover richiamare.
        </p>
      </>
    ),
  },
  {
    icon: Phone,
    t: 'Chiamate e chat AI',
    content: (
      <>
        <p>
          Metti l’intelligenza artificiale al servizio del locale anche quando il team è
          impegnato. L’assistente può rispondere a chiamate e chat, gestire le domande ricorrenti
          e accompagnare il cliente verso una prenotazione.
        </p>
        <p>
          Le risposte non sono improvvisate: si basano sulle informazioni del tuo gestionale —
          orari, menu, disponibilità, servizi e regole del locale — per mantenere un tono
          coerente. <strong>Meno occasioni perse durante il servizio</strong>, senza chiedere a
          chi è in sala di interrompere continuamente il lavoro.
        </p>
      </>
    ),
  },
  {
    icon: Star,
    t: 'Recensioni',
    content: (
      <>
        <p>
          Dopo la visita, chi ha prenotato può ricevere automaticamente una richiesta di
          recensione. Aumentare le testimonianze autentiche significa <strong>più fiducia per
          chi deve sceglierti e più visibilità su Google e nelle ricerche AI</strong>.
        </p>
        <ul>
          <li>tieni traccia delle recensioni e vieni avvisato quando ne arriva una negativa;</li>
          <li>l’AI prepara una risposta coerente, che puoi controllare prima di pubblicare;</li>
          <li>capisci quali aspetti dell’esperienza vengono citati più spesso.</li>
        </ul>
        <p>
          Puoi aggiungere anche le card fisiche Business Review nel locale: il cliente avvicina
          il telefono e trova subito la pagina Google corretta. È il momento ideale quando fa i
          complimenti alla cassa: <u>trasformi un apprezzamento a voce in reputazione che
          rimane</u>.
        </p>
      </>
    ),
  },
  {
    icon: Search,
    t: 'Visibilità SEO',
    content: (
      <>
        <p>
          Essere online non basta: il locale deve comparire quando una persona cerca davvero
          dove mangiare nella tua zona. Organizziamo sito, contenuti, menu e informazioni locali
          perché Google comprenda <strong>chi sei, cosa proponi e dove ti trovi</strong>.
        </p>
        <p>
          Lavoriamo sulla struttura tecnica, sulle ricerche pertinenti e sulla coerenza dei dati
          tra sito e profili locali. Così aumenti le occasioni di essere trovato da clienti che
          ancora non conoscono il tuo nome, ma stanno già cercando un locale come il tuo.
        </p>
      </>
    ),
  },
  {
    icon: Sparkles,
    t: 'Visibilità sugli assistenti AI',
    content: (
      <>
        <p>
          Sempre più persone chiedono a ChatGPT e agli altri assistenti dove andare, cosa
          mangiare o quale locale scegliere per un’occasione specifica. Rendiamo menu, orari,
          servizi e specialità <strong>chiari, strutturati e collegati a fonti autorevoli</strong>,
          così possono essere interpretati correttamente anche da questi sistemi.
        </p>
        <p>
          Nessuno può garantire una citazione, ma una presenza proprietaria completa e coerente
          aumenta la possibilità di essere compresi, confrontati e proposti. È la nuova
          estensione della visibilità organica, non una scorciatoia separata dal sito.
        </p>
      </>
    ),
  },
  {
    icon: Share2,
    t: 'Social, video e foto',
    featured: true,
    content: (
      <>
        <p>
          Un servizio complementare per mostrare davvero ciò che rende riconoscibile il locale:
          piatti, persone, atmosfera ed esperienza. Shooting fotografici, video e gestione
          social costruiscono una presenza continuativa, senza chiederti di improvvisare
          contenuti tra un servizio e l’altro.
        </p>
        <p>
          Per questa parte lavoriamo con <strong>Aletheia Marketing</strong>, agenzia di
          comunicazione specializzata nella ristorazione. Strategia e produzione restano
          collegate agli obiettivi del locale: ampliare la clientela, sostenere un lancio o dare
          continuità alla relazione con chi è già venuto.
        </p>
        <a
          className="rh-fx-modal__link"
          href="https://aletheia-marketing.it/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vedi come lavora Aletheia
          <ArrowRight size={15} strokeWidth={2} />
        </a>
      </>
    ),
  },
  {
    icon: MapPin,
    t: 'ADV su Maps, Google e Meta',
    content: (
      <>
        <p>
          Le campagne vengono costruite attorno a intenzioni e territorio, non a un pubblico
          generico. Su Maps puoi comparire tra i primi risultati e misurare chi chiede
          indicazioni; su Google intercetti ricerche precise; su Meta raggiungi persone vicine
          che ancora non ti conoscono.
        </p>
        <ul>
          <li>promuovi offerte e serate nei giorni in cui vuoi riempire il locale;</li>
          <li>concentri il budget solo nelle aree realmente raggiungibili;</li>
          <li>colleghi clic, richieste e prenotazioni per capire cosa sta funzionando.</li>
        </ul>
        <p>
          <strong>Ogni canale ha un compito diverso</strong>, ma tutti lavorano verso lo stesso
          risultato: portare persone giuste nel locale, non soltanto impression sullo schermo.
        </p>
      </>
    ),
  },
  {
    icon: Workflow,
    t: 'Automazioni',
    content: (
      <>
        <p>
          Ogni locale ha attività ripetitive diverse. Per questo le automazioni non partono da
          un pacchetto rigido: analizziamo ciò che fai ogni giorno e colleghiamo eventi, regole e
          azioni perché il sistema <strong>si occupi della routine al momento giusto</strong>.
        </p>
        <p>
          Promemoria ai clienti, avvisi sulle scorte, ordini ai fornitori, aggiornamenti dei
          turni, documenti da classificare o dati da riportare altrove: ciò che oggi dipende da
          memoria e copia-incolla può diventare un flusso controllabile. Tu gestisci le eccezioni
          e le decisioni; Rush pensa a quello che si ripete.
        </p>
      </>
    ),
  },
  {
    icon: Languages,
    t: 'Menu multilingua',
    content: (
      <>
        <p>
          Un solo menu da aggiornare, disponibile nelle lingue utili al tuo pubblico. Modifichi
          piatti, prezzi, ingredienti o disponibilità nel gestionale e mantieni tutte le versioni
          allineate, senza ristampare ogni volta o correggere file separati.
        </p>
        <p>
          Il cliente lo apre facilmente dal sito o tramite QR e consulta le informazioni nella
          propria lingua. Un menu digitale ben strutturato aiuta anche Google a comprendere
          meglio la proposta del locale. <strong>Più accessibile per chi arriva, più semplice da
          governare per chi lavora</strong>.
        </p>
      </>
    ),
  },
];

const ORDERED_FUNZIONI = [...FUNZIONI].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
);

export default function FunzioniRisto() {
  const [openIdx, setOpenIdx] = useState(null);
  const active = openIdx !== null ? ORDERED_FUNZIONI[openIdx] : null;

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenIdx(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIdx]);

  return (
    <Section id="funzioni" grid large>
      <Head
        icon={LayoutGrid}
        label="Tutto in un posto"
        title={<>Automatizzato e su misura<br />per il tuo locale</>}
        sub={
          <>
            Non un gestionale e poi il resto sparso altrove: <strong>tutto quello che serve per
            mandare avanti e far crescere il locale vive nello stesso sistema.</strong>
          </>
        }
      />

      <div className="rh-fx-grid">
        {ORDERED_FUNZIONI.map(({ icon: Icon, t, featured }, i) => (
          <motion.button
            type="button"
            key={t}
            className={`rh-fx-tile${featured ? ' is-featured' : ''}`}
            onClick={() => setOpenIdx(i)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.45, ease: EASE_MODAL, delay: (i % 8) * 0.04 }}
          >
            <IconTile icon={Icon} size="sm" />
            <span className="rh-fx-tile__t">{t}</span>
            <span className="rh-fx-tile__cta">
              Scopri di più
              <ArrowRight size={12} strokeWidth={2.2} />
            </span>
          </motion.button>
        ))}
      </div>

      <p className="rh-fx-note t-body">
        Costruito su misura per tutto il locale: <strong>paghi solo quello che ti serve</strong>,
        non un pacchetto fisso uguale per tutti.
      </p>

      <AnimatePresence>
        {active && (
          <motion.div
            className="palette__scrim rh-fx-modal-scrim"
            onClick={() => setOpenIdx(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.pop, ease: EASE_MODAL }}
          >
            <motion.div
              className="palette rh-fx-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: DUR.modal, ease: EASE_MODAL }}
              role="dialog"
              aria-label={active.t}
            >
              <div className="rh-fx-modal__head">
                <IconTile icon={active.icon} />
                <strong>{active.t}</strong>
              </div>
              <div className="rh-fx-modal__body">
                {active.content}
              </div>
              <button
                type="button"
                className="rh-fx-modal__close"
                onClick={() => setOpenIdx(null)}
                aria-label="Chiudi"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
