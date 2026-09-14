import { Reveal, Section } from './ui';

const FAQ = [
  {
    q: 'Che cos’è Rush e a cosa serve?',
    a: <>Rush è un gestionale intelligente per bar e ristoranti. Collega i dati già presenti in cassa, fatture, magazzino, ricettario e contabilità per restituire risposte verificabili: margini per piatto, variazioni dei prezzi, scorte, incassi e scostamenti. Non è una semplice chat: ogni risposta utile mostra il numero e la fonte da cui deriva.</>,
  },
  {
    q: 'Devo sostituire la cassa o il gestionale che uso già?',
    a: <>No. Rush nasce per integrarsi con i sistemi esistenti e leggerne i dati senza cambiare le abitudini del locale. Il percorso parte dalla <a className="text-link" href="#metodo">mappatura degli strumenti in uso</a>; un modulo viene sostituito soltanto quando serve davvero e porta un vantaggio concreto.</>,
  },
  {
    q: 'Come aiuta a controllare food cost e prezzi dei fornitori?',
    a: <>Le righe delle fatture vengono abbinate ai prodotti e confrontate con lo storico. Il costo delle ricette può così aggiornarsi quando cambia il prezzo di un ingrediente, mentre gli aumenti oltre soglia generano un avviso. La sezione <a className="text-link" href="#vantaggi">vantaggi operativi</a> mostra esempi del flusso; numeri e fornitori presenti nella demo sono illustrativi.</>,
  },
  {
    q: 'Come vengono protetti i dati del locale?',
    a: <>L’architettura dichiarata prevede infrastruttura europea, accesso in sola lettura alle fonti e isolamento dei dati per cliente. Il trattamento va definito nel contratto e nell’informativa applicabile. Per approfondire i principi normativi consulta il <a className="text-link" href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noreferrer">testo ufficiale del GDPR su EUR-Lex</a> e le <a className="text-link" href="https://www.garanteprivacy.it/regolamentoue" target="_blank" rel="noreferrer">risorse del Garante per la protezione dei dati personali</a>.</>,
  },
  {
    q: 'Rush prende decisioni al posto del gestore?',
    a: <>No. Rush organizza dati, evidenzia anomalie e propone informazioni utili; la decisione resta alla persona. È un’impostazione coerente con l’approccio europeo a un’AI affidabile descritto dalla <a className="text-link" href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noreferrer">Commissione europea</a>. Ogni correzione dell’utente può inoltre diventare una regola per i casi successivi.</>,
  },
  {
    q: 'Come posso richiedere una prima valutazione?',
    a: <>Indica il tipo di attività e i sistemi che usi nel modulo di <a className="text-link" href="#accesso">accesso anticipato</a>. Il team verifica quali collegamenti sono già disponibili e quali richiedono lavoro. L’attivazione procede per moduli e parte dall’importazione di uno storico utile a riconoscere prodotti, fornitori e abitudini del locale.</>,
  },
];

export default function Faq() {
  return (
    <Section id="faq" large>
      <div className="section__head">
        <Reveal><p className="t-label">Domande frequenti</p></Reveal>
        <Reveal i={1}><h2 className="t-sec" style={{ marginTop: 20 }}>Cosa sapere prima di provare Rush?</h2></Reveal>
        <Reveal i={2}><p className="t-body" style={{ marginTop: 20 }}>Risposte concrete su funzionamento, integrazioni, sicurezza e attivazione del gestionale AI.</p></Reveal>
      </div>
      <div className="faq-list">
        {FAQ.map(({ q, a }, i) => (
          <Reveal key={q} i={i % 3}>
            <article className="faq-item">
              <h3 className="t-card">{q}</h3>
              <p className="t-body" style={{ marginTop: 14 }}>{a}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
