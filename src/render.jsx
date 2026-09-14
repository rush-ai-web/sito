import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import App from './App';
import AppRisto from './AppRisto';
import { FAQ_DATA as general } from './components/Faq';
import { FAQ_DATA as restaurantFaq } from './components/ristorazione/FaqRisto';

export function render(restaurant) {
  const data = restaurant ? restaurantFaq : general;
  const url = `https://rush-ai.it/${restaurant ? 'ristorazione' : ''}`;
  return {
    html: renderToString(restaurant ? <AppRisto /> : <App />),
    schema: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'Organization', '@id': 'https://rush-ai.it/#organization', name: 'Rush', url: 'https://rush-ai.it/', logo: 'https://rush-ai.it/favicon.png' },
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: restaurant ? 'Gestionale AI per bar e ristoranti' : 'Gestionali su misura, automazioni e AI', dateModified: '2026-09-14', inLanguage: 'it-IT' },
      { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: Object.values(data).flat().map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: renderToStaticMarkup(<>{a}</>).replace(/<[^>]+>/g, '') } })) },
    ] },
  };
}
