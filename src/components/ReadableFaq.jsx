import React from 'react';

export default function ReadableFaq({ data, restaurant = false }) {
  return <section id="faq" className="section faq-sec"><div className="wrap">
    <h2 className="t-sec">{restaurant ? 'Domande sul gestionale per bar e ristoranti' : 'Domande sui sistemi su misura e sulle automazioni'}</h2>
    <p className="t-body" style={{ marginBlock: 24 }}>
      {restaurant ? <>Scopri le <a href="#funzioni">funzioni per il locale</a>, confronta i <a href="#prezzi">prezzi</a> e approfondisci il <a href="#avvio">percorso di attivazione</a>. Per esigenze di altri settori visita i <a href="/">sistemi su misura Rush</a>.</> : <>Approfondisci il <a href="#metodo">metodo di lavoro</a>, consulta i <a href="#prezzi">costi del progetto</a> e scopri un’applicazione concreta con <a href="/ristorazione">Rush Ristorazione</a>.</>}
    </p>
    <div className="faq-list faq-list__inner">
      {Object.values(data).flat().map(({ q, a }) => <details className="faq-item" key={q}>
        <summary className="faq-item__head"><h3 className="faq-item__q">{q}</h3><span aria-hidden="true">+</span></summary>
        <div className="faq-item__body"><p className="faq-item__a">{a}</p></div>
      </details>)}
    </div>
    <h3 className="t-card" style={{ marginTop: 36 }}>Dati e AI: riferimenti per approfondire</h3>
    <p className="t-body" style={{ marginTop: 16 }}>Per valutare un progetto è utile capire come vengono descritti e condivisi i dati: le <a href="https://www.w3.org/TR/dwbp/">buone pratiche W3C sui dati</a> affrontano qualità, provenienza e interoperabilità. Per l’intelligenza artificiale, il <a href="https://www.nist.gov/itl/ai-risk-management-framework">framework NIST sulla gestione dei rischi AI</a> offre un riferimento per valutarne affidabilità e limiti. Sono risorse di approfondimento, non certificazioni di Rush.</p>
  </div></section>;
}
