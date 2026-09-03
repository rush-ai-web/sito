import { UtensilsCrossed, ArrowRight, Receipt, Calculator, Users } from 'lucide-react';
import { Section, Group, Item, Pill, PillCard, LiveDot } from './ui';
import { useCountUp } from '../lib/hooks';

const DETTAGLI = [
  { icon: Receipt, t: 'Fatture fornitore lette in automatico' },
  { icon: Calculator, t: 'Food cost per piatto sempre aggiornato' },
  { icon: Users, t: 'Turni e presenze nello stesso sistema' },
];

/* Un solo caso, raccontato di lato: la ristorazione è il settore
   in cui abbiamo spinto più a fondo, non l'unico in cui lavoriamo. */
export default function Ristorazione() {
  const [ref, risparmio] = useCountUp(1300, { dec: 0 });

  return (
    <Section id="ristorazione">
      <div className="row2">
        <Group className="row2__text stack" each={0.08}>
          <Item>
            <Pill icon={UtensilsCrossed}>Un caso concreto</Pill>
          </Item>
          <Item as="h2" className="t-sec">
            Rush per bar e ristoranti
          </Item>
          <Item as="p" className="t-body">
            È il settore da cui siamo partiti, e quello in cui il nostro gestionale è più maturo:
            confronta ogni fattura fornitore con lo storico, calcola il costo reale di ogni piatto e
            ti avvisa quando un prezzo si muove.
          </Item>
          <Item as="p" className="t-body">
            Lo stesso impianto - dati reali, automazioni, AI sui documenti - lo portiamo in
            produzione, logistica, retail e servizi.
          </Item>
          <Item>
            <a className="btn btn--secondary" href="#contatti">
              Chiedi una demo del verticale
              <ArrowRight size={17} strokeWidth={1.75} />
            </a>
          </Item>
        </Group>

        <Group className="row2__side stack-sm" each={0.09}>
          <Item className="card card--lg card--glow card--marked" ref={ref}>
            <p className="t-label">Recuperato in un anno · locale singolo</p>
            <p className="t-kpi num" style={{ margin: '14px 0 10px' }}>
              €{risparmio}
            </p>
            <p className="t-small">
              Solo dal confronto automatico dei listini fornitore: rincari intercettati il giorno in
              cui arrivano, non a bilancio chiuso.
            </p>
          </Item>

          {DETTAGLI.map(({ icon, t }) => (
            <Item key={t}>
              <PillCard icon={icon}>{t}</PillCard>
            </Item>
          ))}

          <Item as="p" className="t-small" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LiveDot />
            Sistema attivo su locali reali
          </Item>
        </Group>
      </div>
    </Section>
  );
}
