import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Head, Section } from './ui';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  return <div className={`faq-item${open ? ' is-open' : ''}`}>
    <h3 style={{ margin: 0 }}><button className="faq-item__head" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <span className="faq-item__q">{q}</span><motion.span aria-hidden="true" animate={{ rotate: open ? 45 : 0 }}>+</motion.span>
    </button></h3>
    <motion.div id={id} className="faq-item__body" initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={!open} inert={!open ? '' : undefined}>
      <p className="faq-item__a">{a}</p>
    </motion.div>
  </div>;
}

export default function ReadableFaq({ data, categories, restaurant = false }) {
  const keys = Object.keys(categories);
  const [selected, setSelected] = useState(keys[0]);
  const prefix = restaurant ? 'faq-risto' : 'faq-home';
  function onKeyDown(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % keys.length;
    else if (event.key === 'ArrowLeft') next = (index + keys.length - 1) % keys.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = keys.length - 1;
    else return;
    event.preventDefault();
    setSelected(keys[next]);
    document.getElementById(`${prefix}-tab-${keys[next]}`)?.focus();
  }
  return <Section id="faq" large className="faq-sec">
    <Head icon={HelpCircle} label="Domande frequenti"
      title={restaurant ? 'Quello che vorresti sapere prima di scegliere' : 'Le domande che ci fate più spesso'}
      sub={restaurant ? 'Costi, tempi, affidabilità e lavoro quotidiano: le risposte utili prima di portare un nuovo sistema nel locale.' : 'Le risposte in due righe. Se ne hai altre, ci sentiamo direttamente.'} />
    <div className="faq-tabs" role="tablist" aria-label="Categorie FAQ">
      {keys.map((key, index) => <button key={key} type="button" role="tab"
        id={`${prefix}-tab-${key}`} aria-controls={`${prefix}-panel-${key}`}
        aria-selected={selected === key} tabIndex={selected === key ? 0 : -1}
        className={`faq-tab${selected === key ? ' is-sel' : ''}`}
        onClick={() => setSelected(key)} onKeyDown={event => onKeyDown(event, index)}>
        {selected === key && <motion.span className="faq-tab__bg" layoutId={`${prefix}-tab-bg`} transition={{ duration: 0.25 }} />}
        <span className="faq-tab__t">{categories[key]}</span>
      </button>)}
    </div>
    <div className="faq-list">
      {keys.map(key => <div key={key} role="tabpanel" id={`${prefix}-panel-${key}`}
        aria-labelledby={`${prefix}-tab-${key}`} hidden={selected !== key}
        style={selected !== key ? { display: 'none' } : undefined} className="faq-list__inner">
        {data[key].map(item => <FaqItem key={item.q} {...item} />)}
      </div>)}
    </div>
    <p className="t-body" style={{ marginTop: 28, textAlign: 'center' }}>
      {restaurant ? <>Scopri le <a href="#funzioni">funzioni per il locale</a>, confronta i <a href="#prezzi">prezzi</a> e approfondisci il <a href="#avvio">percorso di attivazione</a>.</> : <>Approfondisci il <a href="#metodo">metodo di lavoro</a>, consulta i <a href="#prezzi">costi del progetto</a> o <a href="#contatti">parlaci delle tue esigenze</a>.</>}
    </p>
  </Section>;
}
