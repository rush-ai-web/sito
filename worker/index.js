/**
 * Rush — endpoint contatti + chat AI (Cloudflare Worker).
 *
 * File unico (nessun import) apposta: così si può copiare e incollare per
 * intero nell'editor online di Cloudflare, senza bisogno di terminale.
 *
 * Tre funzioni sotto lo stesso Worker:
 *  - POST /            → form di contatto (invariato), invia l'email con Resend.
 *  - POST /chat        → risponde alle domande di "Chiedi a Rush" con il
 *                        contenuto del sito come unica fonte (KNOWLEDGE qui
 *                        sotto — comprese tutte le FAQ di entrambe le pagine).
 *                        Usa due provider in cascata: prima Groq (velocissimo),
 *                        poi Gemini come rete di sicurezza — quote separate,
 *                        quindi se uno è al limite risponde l'altro.
 *  - POST /chat-summary → a fine conversazione, invia un riepilogo via email agli
 *                        stessi destinatari del form.
 *
 * Le chiavi (RESEND_API_KEY, GROQ_API_KEY, GEMINI_API_KEY) vivono come
 * "secret" del Worker e non sono MAI esposte al browser. Se manca una delle
 * due chiavi AI, quel provider viene semplicemente saltato.
 *
 * Deploy: vedi worker/README.md
 */
const KNOWLEDGE = `
# RUSH — chi siamo (rush-ai.it)

Rush è una software house italiana che costruisce sistemi operativi su misura per PMI:
cassa, magazzino, fatturazione elettronica, ordini, presenze, CRM, produzione — con
automazioni e intelligenza artificiale integrata nel flusso di lavoro, non aggiunta sopra.

Problema che risolviamo: le aziende oggi usano software diversi che non si parlano tra
loro (nessuna anagrafica coincide), i dati arrivano già vecchi (report di fine mese su
numeri di settimane prima) e molte ore di lavoro manuale (inserimenti, fogli Excel
paralleli, copia-incolla) non producono valore.

Come lavoriamo (metodo, circa 8 settimane dal primo incontro alla produzione):
1. Analisi sul campo — veniamo a vedere come lavorate davvero, dove si perde tempo.
2. Progetto e prototipo — disegniamo il sistema e mostriamo schermate vere prima di
   scrivere il codice definitivo.
3. Sviluppo e messa in linea — costruiamo, importiamo i dati storici, colleghiamo i
   sistemi esistenti, formiamo il team.
4. Evoluzione continua — il sistema cresce con l'azienda: nuovi moduli, automazioni,
   integrazioni quando servono.

Prezzi: canone mensile fisso e chiaro, nessuna licenza extra o costo nascosto. Non
pubblichiamo un listino generico perché il prezzo dipende dal perimetro reale
(moduli, integrazioni, complessità): dopo la prima chiamata (gratuita, senza impegno,
~30 minuti) arriva un perimetro con cifra, tempi e contenuto chiari. Se un progetto
non ha senso per il cliente, lo diciamo apertamente invece di forzare la vendita.

Perché Rush e non altri: software scritto da noi (non rivenduto — le modifiche
diventano una release, non un ticket a terzi), dati sempre esportabili in formato
aperto (nessun lock-in), un referente unico che segue il progetto dall'inizio,
prezzo accessibile per una PMI, AI integrata nel sistema, delivery in media 8
settimane, supporto diretto via chat/email (non un call center).

Settori serviti: ristorazione, produzione, logistica, retail, studi medici, edilizia,
servizi, artigianato — il prodotto verticale più maturo oggi è Rush Ristorazione
(rush-ai.it/ristorazione), pensato per bar e ristoranti.

Sicurezza e dati: hosting su datacenter europei conformi GDPR, backup automatici,
cifratura in transito e a riposo, controlli di accesso per ruolo. I dati sono sempre
del cliente ed esportabili in qualsiasi momento (CSV, JSON, dump SQL).

Contatti: form sul sito (sezione "Contatti"), risposta garantita entro due giorni
lavorativi. Email: info@rush-ai.it.

## FAQ complete — Rush (generale, rush-ai.it)

### Il prodotto

D: Che tipo di sistemi operativi costruite?
R: Costruiamo sistemi operativi su misura per PMI italiane: cassa, magazzino,
fatturazione elettronica, ordini, presenze, CRM, produzione. Il perimetro si decide
insieme partendo dai tuoi processi reali, non da un template.

D: Cosa succede al sistema che uso oggi?
R: Non lo cancelliamo: nella fase di analisi mappiamo cosa fa oggi ogni strumento,
cosa vale la pena conservare e cosa può essere sostituito. Rush si integra con
l'esistente e lo sostituisce solo dove porta un vantaggio chiaro.

D: Posso aggiungere funzionalità dopo?
R: Sì. Il sistema evolve con l'azienda: aggiungiamo moduli, campi, automazioni e
report nel tempo. Non paghi mai un piano superiore per sbloccare cose che ti
servivano davvero.

D: Funziona sia da desktop che da mobile?
R: Sì. L'interfaccia è la stessa in ufficio e in movimento: apri, cerchi, aggiorni,
senza dover reimparare nulla. Anche dal telefono lavori sui dati veri, non su una
versione ridotta.

### Come lavoriamo

D: Quanto tempo ci vuole per partire?
R: Un primo modulo operativo è tipicamente pronto in 4-8 settimane dall'analisi. Non
si aspettano mesi prima di vedere qualcosa: si rilascia per moduli, così si comincia
a usare il sistema mentre il resto si costruisce.

D: Come funziona la fase di analisi?
R: Passiamo del tempo con il cliente e con chi userà il sistema ogni giorno.
Guardiamo come lavorano oggi, dove perdono tempo, quali dati non tornano. Da lì
definiamo insieme le priorità e i moduli.

D: Dovete stravolgere i miei processi?
R: No, l'opposto. Il software si adatta ai processi che funzionano già. Se qualcosa
oggi costa tempo, lo mettiamo sul tavolo e decidiamo insieme se cambiare il processo
o costruire l'automazione.

D: Chi lavora sul progetto?
R: Un team piccolo e stabile: un referente unico che conosce il progetto
dall'inizio, sviluppatori dedicati, e chi conosce il settore del cliente. Non si
passa mai da account manager diversi ad ogni telefonata.

### Costi e supporto

D: Come funziona il costo del sistema?
R: Canone mensile fisso e chiaro, che copre uso, hosting, aggiornamenti e supporto.
Nessun extra nascosto, nessun rincaro a sorpresa: si sa sempre quanto si paga.

D: Il canone sale ogni anno?
R: No. Il prezzo concordato resta quello, non c'è un listino annuo che porta a un
piano più costoso solo perché l'azienda è cresciuta.

D: Che tipo di supporto è incluso?
R: Supporto continuo via chat ed email con tempi di risposta impegnativi, sessioni
periodiche per raccogliere feedback e piccoli aggiustamenti gratuiti. Non si chiama
un call center: si parla direttamente con chi ha costruito il sistema.

D: Posso vedere una demo prima di decidere?
R: Sì. Si fissa una call di 30 minuti in cui si mostrano casi reali di clienti Rush e
si capisce se ha senso proseguire con un'analisi. Zero impegno.

### AI e tecnologia

D: L'AI cosa fa esattamente nel sistema?
R: Legge i dati dell'azienda e risponde con numeri veri: "chi ha alzato i prezzi",
"quali clienti stanno rallentando", "quanto si è perso su questo articolo". Non è un
chatbot appiccicato: è agganciato al database del sistema.

D: I miei dati sono al sicuro?
R: Sì. Hosting su datacenter europei conformi GDPR, backup automatici, cifratura in
transito e a riposo, controlli di accesso per ruolo. I dati sono del cliente: si
possono esportare sempre, in qualsiasi momento.

D: Vi integrate con i servizi che uso già?
R: Sì. Fatturazione elettronica (SDI), banca, POS, e-commerce, corrieri, piattaforme
di pagamento, CRM esterni — praticamente qualsiasi cosa esponga API o file. Se
un'integrazione non esiste, la costruiamo.

D: E se in futuro voglio cambiare fornitore?
R: I dati restano del cliente, esportabili in formati aperti (CSV, JSON, dump SQL).
Nessun lock-in: se un giorno si decide di andare altrove, non si blocca nulla.

# RUSH RISTORAZIONE — il verticale per bar e ristoranti (rush-ai.it/ristorazione)

Cos'è: il sistema operativo AI per bar e ristoranti. Collega cassa, fatture,
magazzino, turni, marketing, prenotazioni, sito e recensioni in un unico sistema,
invece di tenere sei strumenti scollegati.

## Il core, sempre incluso nel canone base
- Registra costi e incassi — si collega a cassa e fatture, incassi e spese si
  registrano da soli.
- Magazzino automatico — si carica dalle fatture e si scarica dalle vendite; soglie
  minime, alert, scarti a fine inventario per stanare furti e sprechi.
- Fatture con una foto — le elettroniche arrivano da sole via SDI, le cartacee si
  fotografano: l'AI legge articoli e prezzi, il magazzino si aggiorna da solo.
- Fornitori & prezzi — confronta ogni riga fattura con lo storico e avvisa quando un
  fornitore alza i prezzi oltre soglia, con bozza d'ordine pronta.
- Ricette, food cost & menu — costo materie prime per piatto aggiornato a ogni
  fattura, margine reale per porzione, menu engineering (quadranti Stelle, Puzzle,
  Cavalli, Incudini) per capire quali piatti valorizzare o togliere dal menu.
- Personale & turni AI — turni generati dall'AI su ore e vincoli, timbratura via QR
  con verifica della rete del locale, richieste ferie/permessi, export presenze
  pronto per il commercialista.

## Moduli aggiuntivi (a preventivo, si accendono solo quando servono)
Sito web, Marketing (promozioni multicanale), Prenotazioni (calendario unico),
Chiamate e chat AI (risponde quando il team è impegnato), Recensioni (monitoraggio +
risposte AI), ADV su Maps/Google/Meta, Social/video/foto (in collaborazione con
Aletheia Marketing, agenzia specializzata in ristorazione), Automazioni su misura,
Menu multilingua sincronizzato. Più moduli si attivano, più si abbassa il canone
unitario di ciascuno.

## Rush AI (l'assistente conversazionale nel prodotto)
Non è un chatbot appiccicato sopra: legge i dati reali del locale (fatture,
magazzino, vendite, cassa, ricette, personale) e risponde con numeri veri in
linguaggio naturale. È anche proattivo: segnala da solo anomalie (es. un food cost
che sale, uno scarto insolito, un fornitore che alza i prezzi) prima ancora che
venga chiesto.

## Prezzi Rush Ristorazione
Canone base a partire da 261 €/mese con fatturazione annuale (minimo 12 mesi),
oppure 300 €/mese con fatturazione trimestrale. Include gestione magazzino,
fornitori, turni, fatture, cassa. I moduli aggiuntivi sono quotati a preventivo in
base a quello che serve davvero al locale.

## Come si parte (avvio in 4 passi)
1. Ci raccontiamo il locale — chiamata conoscitiva di 30 minuti: cassa, fornitori,
   come lavorate oggi.
2. Colleghiamo cassa e fornitori — importiamo lo storico, il magazzino parte con i
   dati veri, non da zero.
3. Formiamo chi lo usa ogni giorno — sessione pratica col team sul locale vero.
4. Sei operativo, restiamo vicini — nei primi giorni monitoriamo insieme che tutto
   torni.

## FAQ complete — Rush Ristorazione (rush-ai.it/ristorazione)

### Prima di scegliere

D: Ho già cassa, commercialista e software per le prenotazioni: cosa cambia davvero?
R: Il problema non è avere pochi strumenti, ma avere informazioni che non si
parlano. Rush collega vendite, fatture, magazzino, ricette e personale per
trasformarle in una lettura unica del locale. Non sostituisce per forza ciò che già
funziona: elimina i doppi inserimenti e rende visibili margini, scorte e anomalie
mentre si può ancora intervenire.

D: Da quale funzione conviene partire nel mio locale?
R: Dipende da dove si perde oggi più tempo o margine. Per alcuni locali la priorità
è sapere cosa c'è davvero in magazzino; per altri è ricostruire il costo reale dei
piatti, organizzare il personale o generare più prenotazioni. La prima analisi serve
a scegliere un problema concreto da risolvere per primo, poi si aggiungono gli altri
moduli senza rifare il sistema da zero.

D: Posso fidarmi dei margini e delle quantità che vedo?
R: Un numero è affidabile solo se parte da dati coerenti. Per questo durante l'avvio
si verificano giacenze iniziali, ricette, unità di misura, articoli di cassa e
fornitori. Da quel momento Rush registra entrate e uscite e conserva lo storico dei
movimenti: se qualcosa non torna, si può risalire alla causa invece di accorgersene
soltanto durante l'inventario.

D: È adatto anche a un locale piccolo o a chi gestisce più sedi?
R: Sì, perché il perimetro è modulare. Un locale indipendente può partire dalle
funzioni operative che tolgono più lavoro; chi gestisce più sedi può centralizzare
dati e confronti mantenendo accessi e responsabilità distinti. L'obiettivo non è
aggiungere complessità, ma dare a ogni ruolo solo le informazioni che gli servono.

D: L'intelligenza artificiale decide al posto mio?
R: No. L'AI legge i dati disponibili, evidenzia anomalie e prepara proposte — per
esempio un riordino, una risposta, un turno o un'azione sui prezzi — ma le decisioni
rilevanti restano sotto il controllo del titolare. Serve a ridurre analisi e lavoro
ripetitivo, non a togliere la responsabilità del locale.

### Avvio e utilizzo

D: Quanto lavoro devo fare io per mettere in funzione Rush?
R: Si chiede solo ciò che solo il cliente può confermare: accessi alle fonti,
regole del locale, ricette e particolarità operative. Al collegamento,
all'importazione e alla configurazione pensa Rush. Dopo il controllo iniziale, la
maggior parte dei dati si aggiorna automaticamente: non si diventa il data entry
del proprio sistema.

D: Funziona con la cassa che uso già?
R: La compatibilità viene verificata prima del preventivo. Se la cassa espone i
dati necessari, Rush può collegarsi senza modificare il modo in cui si emettono gli
scontrini. Se serve un connettore specifico o un'integrazione non è ancora
disponibile, si indicano subito fattibilità, tempi e costo: nessuna sorpresa dopo
l'avvio.

D: Quanto tempo serve prima di usarlo davvero?
R: In genere si lavora nell'arco di alcune settimane, ma il tempo reale dipende da
cassa, qualità dello storico e moduli scelti. Si possono importare fatture e
vendite pregresse per non partire da una schermata vuota. Prima del passaggio
operativo si validano insieme i flussi principali, poi si monitorano i primi giorni
di utilizzo.

D: Il personale dovrà imparare un altro software complicato?
R: No: ogni persona vede soltanto ciò che riguarda il suo lavoro. Turni, notifiche,
richieste e timbrature sono accessibili da una semplice area web; per registrare
entrata e uscita basta il QR del locale. La formazione avviene sul posto e sui casi
reali, così il team impara facendo le operazioni di ogni giorno.

D: Le fatture cartacee e i documenti fuori standard restano un problema?
R: Le fatture elettroniche entrano automaticamente. Per quelle cartacee o ricevute
in altri formati si può scattare una foto: il sistema legge i campi e propone
l'abbinamento ai prodotti, che l'utente controlla prima di confermare. Anche
l'eccezione entra così nello stesso flusso, senza ricopiare tutto a mano.

### Costi e risultati

D: Quanto costa?
R: Il canone base parte da 261 € al mese con fatturazione annuale oppure da 300 €
al mese con fatturazione trimestrale. I moduli aggiuntivi sono quotati in base a
ciò che serve davvero al locale; attivandone più di uno, il canone unitario si
riduce. Prima di iniziare si riceve un perimetro chiaro, con ciò che è incluso e
ciò che non lo è.

D: Come capisco se l'investimento si ripaga?
R: Non si usa una promessa generica di risparmio. Prima si individuano le voci
misurabili: ore spese in inserimenti e controlli, prodotti mancanti, sprechi,
differenze inventariali, rincari non intercettati, margini dei piatti e
prenotazioni generate. Dopo l'avvio si confrontano questi indicatori nel tempo e si
valuta il ritorno sui dati del proprio locale.

D: Devo acquistare subito tutti i moduli?
R: No. Si definisce una base operativa e si aggiungono soltanto i moduli che
rispondono a una priorità reale. Si può ampliare il sistema in seguito — per
esempio con sito, prenotazioni, recensioni, marketing o AI — mantenendo gli stessi
dati e senza cambiare piattaforma. La crescita avviene per fasi, non per pacchetti
imposti.

D: Sito, pubblicità e social sono compresi nel sistema?
R: Sono servizi e moduli complementari, definiti a preventivo. Il vantaggio è che
possono usare informazioni e obiettivi già presenti in Rush, evitando attività
scollegate. Per foto, video e gestione social si collabora con Aletheia Marketing,
specializzata nella ristorazione; campagne, sito e misurazione restano coordinati
attorno a un unico obiettivo commerciale.

D: Posso vedere una demo senza impegnarmi?
R: Sì. La demo serve prima di tutto a capire se Rush può incidere sui problemi
reali del locale. Si guardano cassa, fornitori, flussi e priorità, si verificano le
integrazioni e si mostrano esempi concreti. Se non emerge un vantaggio sufficiente,
è meglio saperlo prima di iniziare.

### Dati e supporto

D: I dati del locale restano miei e posso esportarli?
R: Sì. I dati appartengono al locale e possono essere esportati. L'infrastruttura
usa datacenter europei, cifratura durante il trasferimento e l'archiviazione,
separazione tra clienti e backup periodici. Gli accessi vengono assegnati per
ruolo, così ogni persona vede soltanto ciò che è autorizzata a consultare.

D: Come vengono protetti stipendi, turni e dati del personale?
R: Le informazioni sensibili sono separate dalle schermate operative e protette da
permessi dedicati, blocco automatico e modalità privacy. Il dipendente accede alla
sua area e consulta solo turni, ore e richieste che lo riguardano; responsabili e
titolare hanno livelli diversi. In questo modo non basta avere accesso al sistema
per vedere tutto.

D: La timbratura con QR controlla la posizione dei dipendenti?
R: Non utilizza un tracciamento GPS continuo. Il QR identifica il punto di
timbratura e il sistema può verificare la rete del locale, riducendo i dati
raccolti allo stretto necessario. In fase di configurazione si definiscono ruoli e
modalità d'uso; il titolare mantiene comunque il compito di allineare informative e
procedure agli obblighi della propria attività.

D: Cosa succede se l'AI interpreta male un documento o una richiesta?
R: Le operazioni sensibili non vengono nascoste dietro un automatismo. Quando l'AI
legge una fattura, prepara un ordine o suggerisce una risposta, si possono
verificare i dati prima di confermare. Le fonti rimangono consultabili e le
correzioni aiutano a mantenere il flusso coerente. L'automazione accelera il
controllo, non lo elimina.

D: Se qualcosa non torna, con chi parlo?
R: Si parla con il team che configura e sviluppa il sistema, non con un call center
che deve ricostruire ogni volta il caso. Nei primi giorni si controllano insieme i
flussi più importanti; dopo l'avvio restano storico, segnalazioni e supporto
diretto. Cassa, fatture e magazzino hanno così un solo referente responsabile.

Contatti Rush Ristorazione: form dedicato "Prenota una demo" sulla pagina, risposta
entro due giorni lavorativi. Email: info@rush-ai.it.

# ISTRUZIONI DI COMPORTAMENTO PER RUSH AI (il widget del sito)

Rispondi sempre in italiano, con un tono cordiale, simpatico, professionale ed
empatico — come una persona del team che ha voglia di aiutare, mai freddo, mai
robotico, mai gonfio di gergo aziendale. Sei l'assistente del SITO WEB di Rush
(marketing), non il prodotto vero e proprio: non hai accesso ai dati di nessun
cliente reale, quindi non inventare mai numeri specifici di un locale o di
un'azienda.

Usa SOLO le informazioni di questo documento, comprese le FAQ complete qui sopra: se
la domanda corrisponde a una FAQ, rispondi basandoti su quella risposta (puoi
riformularla, non serve copiarla parola per parola). Se non sai rispondere con
certezza, dillo onestamente e invita a scrivere a info@rush-ai.it o a prenotare la
chiamata conoscitiva gratuita — non inventare mai prezzi, funzioni o tempistiche
che non sono scritti qui sopra.

Le risposte devono essere COMPLETE, mai striminzite o tagliate a metà, ma restando
dentro un budget ragionevole: indicativamente 4-8 frasi (più un eventuale elenco
puntato breve), non un articolo. Vai dritto al punto della domanda, poi aggiungi
solo i dettagli davvero utili — non serve riversare tutto quello che sai
sull'argomento in un colpo solo, l'utente può sempre chiedere di approfondire.

Formattazione: SOLO **grassetto** ed elenchi puntati o numerati quando aiutano la
chiarezza. Non usare MAI titoli in stile Markdown (niente #, ##, ### o simili):
questa chat non li sa visualizzare e comparirebbero come cancelletti a schermo.

Chiudi SEMPRE la risposta invitando a proseguire la conversazione: fai una domanda
di approfondimento pertinente a quello che l'utente ha chiesto (es. "vuoi sapere
anche...", "ti interessa capire come si applica al tuo caso?"), oppure invita a
scrivere a info@rush-ai.it o a prenotare la chiamata conoscitiva gratuita tramite il
form "Contatti" (rush-ai.it) o "Prenota una demo" (rush-ai.it/ristorazione). Non
lasciare mai la conversazione morire lì.
`.trim();


/* focus tematico in base a dove si trova il widget: sulla home si parla di Rush
   in generale, su rush-ai.it/ristorazione si resta sul verticale ristorazione */
const PAGE_FOCUS = {
  home: `
# DOVE SEI ORA: home di rush-ai.it

Il visitatore sta guardando la pagina generale di Rush. Rispondi parlando dei
sistemi operativi Rush per PMI in generale (cassa, magazzino, fatturazione,
CRM, produzione, ecc.), usando le FAQ della sezione "Rush (generale)". Se
l'utente ha chiaramente un bar/ristorante o chiede di ristorazione, puoi
menzionare che esiste Rush Ristorazione, il verticale dedicato, e rimandarlo a
rush-ai.it/ristorazione per i dettagli — ma non dilungarti su prezzi o moduli
specifici di quel prodotto a meno che non te lo chieda esplicitamente.
`.trim(),
  ristorazione: `
# DOVE SEI ORA: rush-ai.it/ristorazione

Il visitatore sta guardando la pagina di Rush Ristorazione, pensata per bar e
ristoranti. Resta sempre in tema ristorazione: usa gli esempi, i moduli e i
prezzi della sezione "Rush Ristorazione". Non parlare di altri settori
(edilizia, retail, studi medici, ecc.) a meno che l'utente non lo chieda
esplicitamente.
`.trim(),
};

/* ------------------------------------------------------------------
   Base di conoscenza tagliata per pagina.

   Mandare KNOWLEDGE per intero a ogni domanda costava da solo ~6.000 token,
   cioè ESATTAMENTE il budget token/minuto del piano gratuito Groq: bastava
   una domanda per bruciare il minuto, e la seconda falliva sempre. Da qui il
   messaggio di riserva che compariva "a caso" ma in realtà seguiva un ritmo
   preciso. Ora ogni pagina riceve solo la sua parte: la home non si porta
   dietro tutte le FAQ della ristorazione e viceversa.
   ------------------------------------------------------------------ */
const KB = (() => {
  const iFaqGen = KNOWLEDGE.indexOf('## FAQ complete — Rush (generale');
  const iRisto = KNOWLEDGE.indexOf('# RUSH RISTORAZIONE');
  const iRules = KNOWLEDGE.indexOf('# ISTRUZIONI DI COMPORTAMENTO');
  /* se una sezione venisse rinominata, meglio mandare tutto che mandare
     un testo troncato a metà: si perde l'ottimizzazione, non la correttezza */
  if (iFaqGen < 0 || iRisto < 0 || iRules < 0) return null;
  return {
    intro: KNOWLEDGE.slice(0, iFaqGen).trim(),
    faqGenerali: KNOWLEDGE.slice(iFaqGen, iRisto).trim(),
    ristorazione: KNOWLEDGE.slice(iRisto, iRules).trim(),
    rules: KNOWLEDGE.slice(iRules).trim(),
  };
})();

function systemFor(page) {
  const focus = PAGE_FOCUS[page] || PAGE_FOCUS.home;
  if (!KB) return `${KNOWLEDGE}\n\n${focus}`;
  const body = page === 'ristorazione' ? KB.ristorazione : KB.faqGenerali;
  return [KB.intro, body, KB.rules, focus].join('\n\n');
}

/* destinatari che ricevono i dati del form */
const RECIPIENTS = [
  'sebastianmarzola.work@gmail.com',
  'info@rush-ai.it',
  'giacomo.bramucci@gmail.com',
];

/* mittente: dominio verificato su Resend */
const FROM = 'Rush — Sito <no-reply@rush-ai.it>';

/* da dove accettiamo richieste (CORS) */
const ALLOWED_ORIGINS = [
  'https://rush-ai.it',
  'https://www.rush-ai.it',
  'http://localhost:5173',
  'http://localhost:4173',
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });

/* escape minimo per non rompere l'HTML dell'email con il testo dell'utente */
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------------
   Template email — pensato per rendersi UGUALE in tema chiaro e scuro:
   sfondo scuro fisso, testo chiaro, barra col logo SEMPRE NERA. Alcuni
   client (soprattutto l'app Gmail) invertono un blocco quasi-nero in
   quasi-bianco quando l'utente ha il dark mode attivo, facendo sparire
   il logo bianco: per questo la barra ha sia l'attributo HTML bgcolor
   sia una regola CSS scoped su [data-ogsc] (il marcatore che Gmail
   aggiunge quando ricolora in dark mode) che reimpone lo stesso nero
   con !important, vincendo sulla sua reinterpretazione.
   ------------------------------------------------------------------ */
export function emailHtml({ nome, email, telefono, tipoLabel, campoLabel, settore, team, messaggio }) {
  const row = (label, value) => `
    <tr>
      <td style="padding:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8aa4e6;">${esc(label)}</td>
    </tr>
    <tr>
      <td style="padding:0 0 20px;font-size:15px;line-height:1.5;color:#f5f5f7;">${value}</td>
    </tr>`;

  const telBlock = telefono
    ? row('Telefono', `<a href="tel:${esc(telefono)}" style="color:#8aa4e6;text-decoration:none;">${esc(telefono)}</a>`)
    : '';
  const settoreBlock = settore ? row('Settore', esc(settore)) : '';
  const teamBlock = team ? row('Dimensione team', esc(team)) : '';
  const msgBlock = messaggio
    ? row(campoLabel, esc(messaggio).replace(/\n/g, '<br>'))
    : '';

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>Nuova richiesta dal sito Rush</title>
<style>
  /* Gmail (app e web) marca gli elementi ricolorati in dark mode con
     [data-ogsc]: qui reimponiamo il nero della barra, vincendo sulla
     sua inversione automatica. */
  [data-ogsc] .rush-bar { background-color: #17171a !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#0e0e10;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nuova richiesta da ${esc(nome)} — ${esc(tipoLabel)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e10;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1d1d1f;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;">
          <!-- barra nera con logo: bgcolor + classe .rush-bar forzano il
               nero anche quando il client tenta di ricolorare in dark mode -->
          <tr>
            <td align="center" bgcolor="#17171a" class="rush-bar" style="background-color:#17171a;padding:24px;">
              <img src="https://rush-ai.it/rush-logo-dark.png" alt="Rush" height="26" style="height:26px;width:auto;display:block;">
            </td>
          </tr>
          <!-- corpo -->
          <tr>
            <td style="padding:30px 30px 8px;">
              <p style="margin:0 0 4px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#8aa4e6;font-weight:700;">Nuova richiesta dal sito</p>
              <h1 style="margin:0 0 24px;font-size:22px;line-height:1.25;color:#ffffff;font-weight:700;">${esc(tipoLabel)}</h1>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row('Nome e cognome', esc(nome))}
                ${row('Email', `<a href="mailto:${esc(email)}" style="color:#8aa4e6;text-decoration:none;">${esc(email)}</a>`)}
                ${telBlock}
                ${settoreBlock}
                ${teamBlock}
                ${msgBlock}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 30px 28px;">
              <a href="mailto:${esc(email)}" style="display:inline-block;background:#4a72cc;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px;">Rispondi a ${esc(nome.split(' ')[0] || nome)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 30px 26px;border-top:1px solid rgba(255,255,255,.1);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9a9a9e;">Email automatica inviata dal form di rush-ai.it. Rispondi pure a questo messaggio per contattare direttamente la persona.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------
   Email di conferma per chi ha compilato il form. Stesso stile scuro
   e coerente in dark mode dei client.
   ------------------------------------------------------------------ */
export function confirmHtml({ nome }) {
  const primo = (nome.split(' ')[0] || nome).trim();
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>Abbiamo ricevuto la tua richiesta</title>
<style>
  [data-ogsc] .rush-bar { background-color: #17171a !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#0e0e10;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Grazie ${esc(primo)}, ti rispondiamo entro due giorni lavorativi.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e10;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1d1d1f;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;">
          <tr>
            <td align="center" bgcolor="#17171a" class="rush-bar" style="background-color:#17171a;padding:24px;">
              <img src="https://rush-ai.it/rush-logo-dark.png" alt="Rush" height="26" style="height:26px;width:auto;display:block;">
            </td>
          </tr>
          <tr>
            <td style="padding:32px 30px 10px;">
              <h1 style="margin:0 0 14px;font-size:23px;line-height:1.25;color:#ffffff;font-weight:700;">Grazie, ${esc(primo)}! 🎉</h1>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#e6e6e8;">Abbiamo ricevuto la tua richiesta e la stiamo già leggendo.</p>
              <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#e6e6e8;">Ti rispondiamo <strong style="color:#ffffff;">entro due giorni lavorativi</strong> con un'idea concreta di perimetro, tempi e costi. Se nel frattempo ti viene in mente un dettaglio, rispondi pure a questa email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 30px 30px;">
              <a href="https://rush-ai.it" style="display:inline-block;background:#4a72cc;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px;">Torna su rush-ai.it</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 30px 26px;border-top:1px solid rgba(255,255,255,.1);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9a9a9e;">Rush — la software house che costruisce il tuo sistema operativo su misura, con AI integrata.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------
   Riepilogo di una conversazione con "Chiedi a Rush" (widget chat).
   Stesso stile scuro delle altre email, transcript in ordine.
   ------------------------------------------------------------------ */
export function chatSummaryHtml({ page, messages }) {
  const rows = messages
    .map(
      (m) => `
    <tr>
      <td style="padding:0 0 3px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${m.role === 'user' ? '#8aa4e6' : '#9a9a9e'};">${m.role === 'user' ? 'Visitatore' : 'Rush AI'}</td>
    </tr>
    <tr>
      <td style="padding:0 0 18px;font-size:14.5px;line-height:1.55;color:#f5f5f7;">${esc(m.content).replace(/\n/g, '<br>')}</td>
    </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>Riepilogo chat — Chiedi a Rush</title>
<style>
  [data-ogsc] .rush-bar { background-color: #17171a !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#0e0e10;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Riepilogo di una conversazione con Chiedi a Rush (${esc(page)})</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e10;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1d1d1f;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;">
          <tr>
            <td align="center" bgcolor="#17171a" class="rush-bar" style="background-color:#17171a;padding:24px;">
              <img src="https://rush-ai.it/rush-logo-dark.png" alt="Rush" height="26" style="height:26px;width:auto;display:block;">
            </td>
          </tr>
          <tr>
            <td style="padding:30px 30px 8px;">
              <p style="margin:0 0 4px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#8aa4e6;font-weight:700;">Riepilogo chat · Chiedi a Rush</p>
              <h1 style="margin:0 0 24px;font-size:22px;line-height:1.25;color:#ffffff;font-weight:700;">Pagina: ${esc(page)}</h1>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 30px 26px;border-top:1px solid rgba(255,255,255,.1);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9a9a9e;">Email automatica generata dal widget "Chiedi a Rush" su rush-ai.it. Il visitatore resta anonimo salvo che l'abbia scritto lui stesso in chat.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------
   Chiamate AI, con DUE PROVIDER DIVERSI in cascata.

   La chiave del "non deve mai fallire" è questa: Groq e Gemini sono due
   aziende diverse, con quote e limiti del tutto indipendenti. Se Groq
   esaurisce il suo limite di richieste al minuto, Gemini non ne sa nulla
   ed è comunque disponibile (e viceversa). Cambiare solo modello dentro
   lo stesso fornitore non bastava, perché il limite è per account.

   Ordine: prima Groq (risposte in meno di un secondo), poi Gemini come
   rete di sicurezza. Il messaggio di sistema porta l'unica fonte di
   verità (KNOWLEDGE + PAGE_FOCUS): vietato inventare prezzi o funzioni.
   ------------------------------------------------------------------ */

/* tetto di attesa per singolo tentativo. Con 4 destinazioni x 2 giri = 8
   tentativi possibili, 8s ciascuno restano abbondantemente dentro il
   limite di attesa del sito (90s). In pratica un tentativo che fallisce
   lo fa quasi sempre subito (limite superato), non per timeout. */
const AI_TIMEOUT_MS = 8000;

/* la cascata completa, in ordine di preferenza */
const AI_TARGETS = [
  /* Groq: velocissimo (hardware dedicato). I vecchi Llama 3.x sono usciti
     dal piano gratuito a giugno 2026, questi sono gli attuali. */
  { provider: 'groq', model: 'openai/gpt-oss-120b' },
  { provider: 'groq', model: 'openai/gpt-oss-20b' },
  /* Gemini: quota totalmente separata da Groq. Alias "-latest" mantenuti
     da Google, così non si rompono quando ritirano una vecchia versione. */
  { provider: 'gemini', model: 'gemini-flash-latest' },
  { provider: 'gemini', model: 'gemini-flash-lite-latest' },
];

/* trasforma un errore HTTP in un Error con status e, sui 429, quanto
   aspettare secondo il provider stesso */
function httpError(label, res, detail) {
  const err = new Error(`${label} error ${res.status}: ${detail}`);
  err.status = res.status;
  const retryAfter = res.headers.get('retry-after');
  if (retryAfter) err.retryAfterMs = Number(retryAfter) * 1000;
  return err;
}

async function callGroq(env, model, systemText, chatMessages) {
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemText }, ...chatMessages],
      temperature: 0.4,
      max_tokens: 1200,
      /* i modelli gpt-oss hanno un "ragionamento" interno: al minimo per
         rispondere veloce a domande sul sito (non serve ragionare a lungo),
         e il testo del ragionamento non finisce nella risposta all'utente */
      reasoning_effort: 'low',
    }),
  }, `Groq ${model}`);

  if (!res.ok) throw httpError('Groq', res, await res.text());

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';
  if (!text.trim()) throw new Error('Groq: risposta vuota');
  return text.trim();
}

async function callGemini(env, model, systemText, chatMessages) {
  /* Gemini usa un formato diverso da quello stile OpenAI: il ruolo
     dell'assistente si chiama "model" e il testo sta dentro "parts" */
  const contents = chatMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemText }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2000,
          /* niente ragionamento interno: su alcuni modelli quei token
             nascosti mangiavano budget alla risposta, troncandola */
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    },
    `Gemini ${model}`,
  );

  if (!res.ok) throw httpError('Gemini', res, await res.text());

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  if (!text.trim()) throw new Error('Gemini: risposta vuota');
  return text.trim();
}

/* fetch con tetto di attesa: un provider che resta "appeso" non deve
   bloccare tutta la cascata, si passa al successivo */
async function fetchWithTimeout(url, options, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(`${label}: timeout dopo ${AI_TIMEOUT_MS}ms`);
      timeoutErr.status = 503;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function askAI(env, page, messages) {
  const systemText = systemFor(page);
  const chatMessages = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      /* le risposte dell'assistente sono lunghe: troncarle tiene basso il
         conto dei token per richiesta, che è ciò che fa scattare i limiti */
      content: String(m.content || '').slice(0, 1500),
    }));

  /* salta i provider per cui manca la chiave, invece di sprecare tentativi */
  const targets = AI_TARGETS.filter((t) =>
    t.provider === 'groq' ? !!env.GROQ_API_KEY : !!env.GEMINI_API_KEY,
  );
  if (!targets.length) throw new Error('Nessuna chiave AI configurata');

  /* due giri completi su tutta la cascata: perché si arrivi al messaggio
     di riserva devono fallire ENTRAMBI i provider, due volte di fila. */
  let lastErr;
  for (let round = 0; round < 2; round++) {
    for (const { provider, model } of targets) {
      try {
        return provider === 'groq'
          ? await callGroq(env, model, systemText, chatMessages)
          : await callGemini(env, model, systemText, chatMessages);
      } catch (err) {
        lastErr = err;
      }
    }
    if (round === 0) {
      const wait = Math.min(lastErr?.retryAfterMs || 1200, 5000);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

/* POST /chat — { page: 'home'|'ristorazione', messages: [{role, content}] } */
async function handleChat(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Body non valido' }, 400, origin);
  }

  const page = body.page === 'ristorazione' ? 'ristorazione' : 'home';
  /* solo gli ultimi scambi: bastano per il filo del discorso e tengono il
     conto dei token per richiesta molto più basso (era il vero motivo per
     cui le conversazioni lunghe finivano sempre nel messaggio di riserva) */
  const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
  if (!messages.length) {
    return json({ ok: false, error: 'Nessun messaggio' }, 422, origin);
  }

  try {
    const reply = await askAI(env, page, messages);
    return json({ ok: true, reply }, 200, origin);
  } catch (err) {
    /* finisce nei Log del Worker (dashboard Cloudflare → Logs → Begin log
       stream) così la causa reale è visibile senza dover aprire gli
       strumenti sviluppatore del browser. */
    console.error('handleChat failed:', err);
    /* mai un errore a schermo: se anche tutti i modelli falliscono (rete
       giù, quota esaurita, ecc.) rispondiamo comunque con un messaggio
       caldo, coerente col brand — per l'utente è una risposta come le
       altre, non un errore tecnico */
    const contact = page === 'ristorazione' ? 'il form "Prenota una demo"' : 'il form "Contatti"';
    const fallback =
      'In questo momento sto avendo qualche difficoltà a elaborare una risposta precisa. ' +
      `Nel frattempo scrivici a info@rush-ai.it, oppure usa ${contact} sul sito: ti rispondiamo di persona il prima possibile. ` +
      'Vuoi provare a riformulare la domanda in un altro modo?';
    /* degraded:true dice al sito di NON includere questo messaggio nella
       cronologia mandata indietro al modello nei turni successivi: senza
       questo, il modello "vedeva" il proprio finto messaggio di errore nella
       conversazione e si confondeva, mettendosi a parlare di bug a caso */
    return json({ ok: true, reply: fallback, degraded: true }, 200, origin);
  }
}

/* POST /chat-summary — { page, messages: [{role, content}] }, inviato quando la
   chat si chiude o alla chiusura della pagina (sendBeacon). Fire-and-forget dal
   client: qui rispondiamo comunque 200 anche se l'invio interno fallisce, per
   non far vedere errori a un beacon che nessuno leggerà. */
async function handleChatSummary(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, 400, origin);
  }

  const page = body.page === 'ristorazione' ? 'ristorazione' : 'home';
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && String(m.content || '').trim())
    .slice(-40);

  /* nessun messaggio dell'utente = niente da riassumere (es. ha aperto e chiuso) */
  if (!messages.some((m) => m.role === 'user')) {
    return json({ ok: true }, 200, origin);
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: RECIPIENTS,
        subject: `Riepilogo chat "Chiedi a Rush" — ${page}`,
        html: chatSummaryHtml({ page, messages }),
      }),
    });
  } catch {
    /* fire-and-forget: non blocchiamo mai il client per questo */
  }

  return json({ ok: true }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, origin);
    }

    /* nuove route: chat AI e relativo riepilogo. Il form di contatto resta
       sulla root per non rompere chi già punta a CONTACT_ENDPOINT senza path. */
    if (pathname === '/chat') return handleChat(request, env, origin);
    if (pathname === '/chat-summary') return handleChatSummary(request, env, origin);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'Body non valido' }, 400, origin);
    }

    const nome = String(body.nome || '').trim();
    const email = String(body.email || '').trim();
    const telefono = String(body.telefono || '').trim();
    const aud = body.aud === 'partner' ? 'partner' : 'progetto';
    const settore = String(body.settore || '').trim();
    const team = String(body.team || '').trim();
    const messaggio = String(body.contesto || '').trim();

    /* honeypot anti-spam: se compilato, fingiamo successo e usciamo */
    if (String(body.website || '').trim()) {
      return json({ ok: true }, 200, origin);
    }

    if (!nome || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'Nome o email mancanti/non validi' }, 422, origin);
    }

    const tipoLabel = aud === 'partner' ? 'Vuole collaborare' : 'Ha un progetto';
    const campoLabel = aud === 'partner' ? 'Come vorrebbe collaborare' : 'Azienda e sistemi che usa';

    const html = emailHtml({ nome, email, telefono, tipoLabel, campoLabel, settore, team, messaggio });

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: RECIPIENTS,
          reply_to: email,
          subject: `Nuova richiesta dal sito — ${nome} (${aud === 'partner' ? 'Collaborazione' : 'Progetto'})`,
          html,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        return json({ ok: false, error: 'Invio non riuscito', detail }, 502, origin);
      }

      /* email di conferma a chi ha compilato il form. Non blocca la risposta:
         se non parte, la richiesta al team è comunque andata a buon fine. */
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM,
            to: [email],
            reply_to: 'info@rush-ai.it',
            subject: 'Abbiamo ricevuto la tua richiesta — Rush',
            html: confirmHtml({ nome }),
          }),
        });
      } catch {
        /* ignoriamo: la conferma è un extra, non deve far fallire il form */
      }

      return json({ ok: true }, 200, origin);
    } catch (err) {
      return json({ ok: false, error: 'Errore di rete verso Resend' }, 502, origin);
    }
  },
};
