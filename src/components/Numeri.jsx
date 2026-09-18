import { TrendingUp } from 'lucide-react';
import { Section, Head, Group, Item, Pill } from './ui';
import { useCountUp, useIsMobile } from '../lib/hooks';
import EsitiShowcase from './EsitiShowcase';

/* ------------------------------------------------------------
   Risultati - i numeri prima di tutto.
   La scalinata di KPI (le quattro colonne a gradino), poi tre esiti
   che raccontano cosa cambia per chi guida l'azienda.
   ------------------------------------------------------------ */

const KPI = [
  {
    label: 'Tempo',
    to: 600,
    prefix: '~',
    suffix: ' ore',
    d: 'Ore di lavoro manuale che tornano ogni anno a una PMI: in media 12 a settimana, circa 600 l’anno, tolte dai fogli di calcolo.',
  },
  {
    label: 'Consegna',
    to: 8,
    suffix: ' sett.',
    d: 'Dal primo incontro alla prima versione in produzione, con i tuoi dati veri dentro e i primi numeri che iniziano a girare.',
  },
  {
    label: 'Errori',
    to: 92,
    suffix: '%',
    d: 'Inserimenti manuali eliminati sui documenti in ingresso grazie alla lettura automatica: meno sviste, meno correzioni.',
  },
  {
    label: 'Fine mese',
    to: 0,
    suffix: ' giorni',
    d: 'Giorni di attesa per avere i numeri: zero. Non si aspetta il report di fine mese, i conti si aggiornano mentre l’azienda lavora.',
  },
];

function Kpi({ label, to, prefix = '', suffix = '', d, dec = 0 }) {
  const [ref, val] = useCountUp(to, { dec });
  return (
    <Item className="stair__col">
      <Pill>{label}</Pill>
      <p className="t-kpi num stair__val" ref={ref}>
        {prefix}
        {val}
        {suffix}
      </p>
      <p className="t-small">{d}</p>
    </Item>
  );
}

export default function Numeri() {
  const isMobile = useIsMobile();
  return (
    <Section id="numeri" large>
      <Head
        className="head--wide-summary"
        icon={TrendingUp}
        label="Risultati"
        title={<>Quanto lavoro ti toglie, misurato in numeri</>}
        sub="Ore restituite ogni anno, inserimenti manuali quasi azzerati, dati in dashboard in tempo reale: gli effetti concreti quando un sistema Rush entra in produzione."
      />

      <Group className="stair shimmer-top" each={0.1}>
        {KPI.map((k) => (
          <Kpi key={k.label} {...k} />
        ))}
      </Group>

      {!isMobile && (
        <div style={{ marginTop: 'var(--s-block)' }}>
          <EsitiShowcase />
        </div>
      )}
    </Section>
  );
}
