import {
  Boxes,
  TrendingUp,
  Globe,
  Share2,
  BellRing,
  UsersRound,
  ScanLine,
  Megaphone,
  CalendarCheck,
  Phone,
  Star,
  Search,
  Sparkles,
  MapPin,
  Workflow,
  Languages,
  ArrowRight,
} from 'lucide-react';

export const FUNZIONI_RISTO = [
  {
    icon: Boxes,
    t: 'Magazzino',
    featured: true,
    content: (
      <>
        <p>
          Sai cosa entra, cosa viene consumato e dove le quantità non tornano. RUSH collega
          <strong> fatture, vendite e ricette</strong> per aggiornare le giacenze e ricostruire i
          movimenti del magazzino.
        </p>
        <ul>
          <li>Carichi e consumi confluiscono nello stesso registro.</li>
          <li>Gli ingredienti vengono scaricati in base alle ricette configurate.</li>
          <li>Il confronto con l’inventario mette in evidenza le differenze da verificare.</li>
        </ul>
        <p>
          Anche i documenti cartacei entrano nel flusso: fotografi la fattura, controlli i dati
          letti dall’AI e confermi. Hai una <u>base ordinata per controllare scorte, consumi e
          valore del magazzino</u>.
        </p>
      </>
    ),
  },
  {
    icon: TrendingUp,
    t: 'Costi e margini',
    featured: true,
    content: (
      <>
        <p>
          Un locale pieno è un buon segnale. Capire quanto resta richiede di collegare i numeri.
          RUSH riunisce <strong>incassi e costi registrati</strong> e mette in relazione vendite,
          ricette e prezzi di acquisto.
        </p>
        <ul>
          <li>Leggi il food cost e il margine sulle materie prime di ogni piatto o bevanda.</li>
          <li>Individui i rincari che incidono sulla tua proposta.</li>
          <li>Confronti quantità vendute e redditività per capire quali piatti valorizzare o rivedere.</li>
        </ul>
        <p>
          Il calcolo FIFO utilizza il costo dei lotti secondo l’ordine di entrata registrato.
          L’AI ti aiuta a leggere le variazioni e a <u>valutare prezzi, ricette e fornitori con
          dati più chiari</u>.
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
          Il cliente comincia a conoscere il tuo locale prima di sedersi a tavola. Costruiamo un
          sito che renda chiari <strong>la tua proposta, l’atmosfera e le informazioni utili</strong>
          per sceglierti.
        </p>
        <ul>
          <li>Menu, orari e contatti facili da consultare.</li>
          <li>Identità visiva e tono coerenti con il locale.</li>
          <li>Prenotazioni e promozioni collegate ai moduli attivi.</li>
        </ul>
        <p>
          Quando aggiorni le informazioni collegate in RUSH, il sito può riceverle nello stesso
          flusso. Riduci le versioni da tenere allineate e rendi più semplice il percorso <u>dalla
          scoperta alla prenotazione</u>.
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
          Ci sono locali che ricordi per un piatto. Altri per chi ti accoglie, per l’atmosfera o
          per come ti fanno sentire. Insieme ad <strong>Aletheia Marketing</strong> raccontiamo
          ciò che rende riconoscibile il tuo locale, attraverso strategia, foto, video e gestione
          social.
        </p>
        <p>
          La comunicazione segue <u>gli obiettivi della tua attività</u>: far conoscere una nuova
          proposta, sostenere un evento o coltivare il rapporto con chi è già stato da te. È un
          servizio complementare, definito su preventivo e coordinato con le iniziative seguite
          attraverso RUSH.
        </p>
        <a className="rh-fx-modal__link" href="https://aletheia-marketing.it/" target="_blank" rel="noopener noreferrer">
          Vedi come lavora Aletheia
          <ArrowRight size={15} strokeWidth={2} />
        </a>
      </>
    ),
  },
  {
    icon: BellRing,
    t: 'Scorte e riordini',
    content: (
      <>
        <p>
          Accorgerti che manca un ingrediente durante il servizio significa dover cambiare
          programma. RUSH monitora le giacenze registrate e <strong>segnala quando un articolo
          raggiunge le soglie impostate</strong>.
        </p>
        <p>
          Distingui ciò che va tenuto d’occhio da ciò che richiede un riordino. Il sistema può
          preparare una proposta con <u>prodotti raggruppati per fornitore, quantità convertite in
          confezioni e costo previsto</u>. <strong>Controlli, confermi e procedi con l’ordine.</strong>
        </p>
      </>
    ),
  },
  {
    icon: UsersRound,
    t: 'Personale e turni',
    content: (
      <>
        <p>
          <strong>Disponibilità, turni, presenze e richieste del team</strong> si ritrovano nello stesso ambiente.
          Ogni persona consulta ciò che riguarda il proprio lavoro; tu hai una visione più chiara
          della copertura del servizio.
        </p>
        <ul>
          <li>L’AI propone i turni sulla base di ore, disponibilità e vincoli impostati.</li>
          <li>Le timbrature via QR registrano entrate e uscite.</li>
          <li>Ore, ferie e permessi confluiscono nell’export per chi prepara le paghe.</li>
        </ul>
        <p>
          Quando i dati di cassa lo consentono, puoi leggere anche scontrino medio e vendite per
          addetto: informazioni da valutare nel contesto del servizio e usare per <u>la formazione
          del team</u>.
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
          Ogni fattura contiene informazioni utili per il lavoro del locale: cosa hai comprato,
          quanto hai speso e quali prezzi sono cambiati. RUSH le raccoglie in <strong>un unico
          registro</strong> e le collega a fornitori, articoli e magazzino.
        </p>
        <p>
          Le fatture elettroniche arrivano tramite il collegamento configurato. Per quelle
          cartacee basta una foto: l’AI legge i dati e propone gli abbinamenti da controllare.
          Dopo la conferma, le informazioni entrano nel flusso senza doverle ricopiare in più
          strumenti.
        </p>
        <p><u>Ritrovi importi, scadenze e documenti e prepari un export ordinato per il commercialista.</u></p>
      </>
    ),
  },
  {
    icon: Megaphone,
    t: 'Marketing',
    content: (
      <>
        <p>
          <strong>Una promozione è utile quando porta un risultato che sai riconoscere.</strong> Con il modulo
          marketing coordini offerte, iniziative e comunicazioni usando i dati e i canali
          collegati a RUSH.
        </p>
        <p>
          Crei l’iniziativa, scegli il pubblico e la distribuisci sui punti di contatto previsti,
          dal sito al QR nel locale. Poi segui le risposte registrate: utilizzi della promo,
          coupon e prenotazioni attribuite. Hai più elementi per capire <u>cosa riproporre, cosa
          correggere e come mantenere il rapporto con i clienti</u>.
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
          Le richieste dai canali collegati e quelle inserite dal team confluiscono nello <strong>stesso
          calendario</strong>. Sala e responsabili consultano disponibilità, capienza e preferenze dei
          clienti senza ricostruire il servizio tra telefonate e messaggi.
        </p>
        <p>
          Le regole di assegnazione aiutano a evitare sovrapposizioni. Conferme e promemoria
          automatici tengono informato il cliente e riducono i passaggi manuali. Se usi già un
          sistema di prenotazione, <u>verifichiamo come collegarlo al tuo centro operativo</u>.
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
          Durante il servizio non puoi interromperti a ogni richiesta. L’assistente AI può
          <strong>rispondere alle domande ricorrenti e accompagnare il cliente verso la prenotazione</strong>,
          attraverso i canali configurati.
        </p>
        <p>
          Utilizza le informazioni messe a disposizione dal locale: orari, menu, servizi,
          disponibilità e regole. Il lavoro di risposta entra così <u>nello stesso flusso operativo</u>,
          con modalità e limiti definiti insieme al team.
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
          Le recensioni raccontano come le persone hanno vissuto il tuo locale. RUSH ti aiuta a
          <strong>raccoglierle e seguirle</strong>: puoi inviare una richiesta dopo la visita, ricevere avvisi e
          individuare i temi che ricorrono nei commenti.
        </p>
        <p>
          L’AI prepara bozze di risposta che controlli prima di pubblicare. Puoi affiancare le
          card fisiche Business Review per rendere facile lasciare una recensione su Google. Un
          flusso ordinato per ascoltare i clienti e <u>curare la reputazione del locale</u>.
        </p>
      </>
    ),
  },
  {
    icon: Search,
    t: 'Visibilità su Google',
    content: (
      <>
        <p>
          Aiutiamo chi cerca un locale nella tua zona a trovare <strong>informazioni chiare sulla tua
          proposta</strong>. Lavoriamo sulla struttura del sito, sui contenuti e sulla coerenza di menu,
          orari e contatti tra i punti di presenza online.
        </p>
        <p>
          La SEO entra in un progetto coordinato con il sito e gli obiettivi del locale. Puoi
          seguirne l’andamento attraverso gli indicatori disponibili, come ricerche e visite,
          <u>senza confondere la visibilità con le prenotazioni effettive</u>.
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
          Organizziamo le informazioni sul locale perché siano <strong>chiare anche per i sistemi che
          elaborano risposte: proposta, menu, orari, servizi e specialità, coerenti con le fonti
          pubblicate online</strong>.
        </p>
        <p>
          Questo lavoro affianca sito e SEO. Serve a rendere il locale più comprensibile ai
          sistemi di ricerca, <u>senza garantire citazioni o raccomandazioni</u> da parte degli
          assistenti AI.
        </p>
      </>
    ),
  },
  {
    icon: MapPin,
    t: 'ADV su Maps, Google e Meta',
    content: (
      <>
        <p>
          Colleghiamo la pubblicità a <strong>un obiettivo concreto del locale</strong>: promuovere una serata,
          sostenere una nuova proposta o raccogliere prenotazioni. Definiamo territorio,
          pubblico e messaggi in funzione di quell’obiettivo.
        </p>
        <p>
          Segui clic, richieste di indicazioni e prenotazioni tracciate dai canali attivati. RUSH
          riunisce gli indicatori disponibili per aiutarti a <u>valutare le campagne e decidere
          come distribuire l’investimento</u>.
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
          Promemoria ai clienti, avvisi sulle scorte, documenti da registrare, proposte d’ordine:
          ogni giorno ci sono <strong>passaggi che si ripetono</strong>. Li individuiamo e li colleghiamo
          attraverso regole definite sui tuoi processi.
        </p>
        <p>
          RUSH esegue le attività previste e rende visibili le eccezioni. Tu e il team mantenete
          <u>il controllo sui passaggi che richiedono una verifica o una decisione</u>.
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
          <strong>Un menu da aggiornare, più lingue per accogliere i tuoi clienti.</strong> Piatti, prezzi e
          disponibilità vengono gestiti nello stesso flusso e resi consultabili dal sito o
          tramite QR.
        </p>
        <p>
          Riduci i file da correggere separatamente e rendi la proposta più accessibile. Le
          <u>traduzioni e le informazioni sugli ingredienti vengono controllate prima della
          pubblicazione</u>.
        </p>
      </>
    ),
  },
];
