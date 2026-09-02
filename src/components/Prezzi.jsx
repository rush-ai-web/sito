import { Banknote, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section, Head, Group, Item } from './ui';

const PIANI = [
  {
    label: 'MVP',
    price: '9.000',
    unit: '€',
    sub: 'progetto una tantum',
    desc: 'Un modulo — il più critico — funzionante in otto settimane, con i tuoi dati veri dentro.',
    features: [
      'Un modulo su misura',
      'Importazione dati storici',
      'Formazione del team',
      'Codice sorgente tuo',
    ],
    cta: 'Parliamone',
    accent: false,
  },
  {
    label: 'Sistema completo',
    price: 'da 22.000',
    unit: '€',
    sub: 'progetto una tantum',
    desc: 'Più moduli collegati, automazioni, dashboard e integrazioni con i sistemi che già usi.',
    features: [
      'Moduli illimitati',
      'Automazioni e notifiche',
      'Dashboard in tempo reale',
      'Integrazioni con sistemi esistenti',
      'Importazione dati storici',
      'Formazione del team',
    ],
    cta: 'Parliamone',
    accent: true,
  },
  {
    label: 'Evoluzione',
    price: '600',
    unit: '€/mese',
    sub: 'canone mensile',
    desc: 'Il sistema cresce con l\'azienda: nuovi moduli, correzioni e aggiornamenti quando servono.',
    features: [
      'Nuovi moduli su richiesta',
      'Supporto prioritario',
      'Aggiornamenti inclusi',
      'Hosting e backup',
    ],
    cta: 'Inizia dal progetto',
    accent: false,
  },
];

export default function Prezzi() {
  return (
    <Section id="prezzi" large>
      <Head
        icon={Banknote}
        label="Prezzi"
        title="Cifre chiare, nessuna sorpresa"
        sub="Preventivo fisso dal primo incontro. Se qualcosa cambia lo diciamo prima, non in fattura."
      />

      <Group className="prezzi-grid" each={0.1}>
        {PIANI.map((piano) => (
          <Item key={piano.label}>
            <div className={`prezzi-card${piano.accent ? ' prezzi-card--accent' : ''}`}>
              <div className="prezzi-card__head">
                <span className="prezzi-label">{piano.label}</span>
                <div className="prezzi-price">
                  <span className="prezzi-price__num">{piano.price}</span>
                  <span className="prezzi-price__unit">{piano.unit}</span>
                </div>
                <span className="prezzi-sub">{piano.sub}</span>
              </div>

              <p className="prezzi-desc">{piano.desc}</p>

              <ul className="prezzi-features">
                {piano.features.map((f) => (
                  <li key={f}>
                    <span className="prezzi-check"><Check size={13} strokeWidth={2.5} /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#contatti" className={`btn${piano.accent ? ' btn--primary' : ' btn--ghost'} prezzi-cta`}>
                {piano.cta}
              </a>
            </div>
          </Item>
        ))}
      </Group>

      <p className="prezzi-note">
        I prezzi sono orientativi. Ogni progetto parte da un'analisi gratuita: il preventivo definitivo arriva con perimetro e tempi precisi.
      </p>
    </Section>
  );
}
