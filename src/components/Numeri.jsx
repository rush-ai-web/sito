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
    d: 'Circa 600 ore di lavoro manuale recuperate ogni anno: in media 12 a settimana, da dedicare alle persone, ai clienti e alla crescita dell’attività.',
  },
  {
    label: 'Avvio',
    to: 8,
    suffix: ' sett.',
    d: 'Dal primo incontro alla prima versione operativa, con i tuoi dati collegati e il team pronto a utilizzarla.',
  },
  {
    label: 'Inserimenti manuali',
    to: 92,
    suffix: '%',
    d: 'Inserimenti manuali eliminati sui documenti in ingresso grazie alla lettura automatica. Meno dati da ricopiare e meno occasioni di errore.',
  },
  {
    label: 'Visibilità',
    to: 1,
    prefix: '<',
    suffix: ' min',
    d: 'Dal momento in cui il dato entra in RUSH alla sua visualizzazione in dashboard. Le informazioni diventano subito più facili da consultare.',
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
        title={<>MENO TEMPO A RINCORRERE DATI. PIÙ SPAZIO PER GUIDARE L’ATTIVITÀ.</>}
        sub="Tempo recuperato, meno inserimenti manuali e informazioni più accessibili: il valore della centralizzazione si misura nel lavoro di ogni giorno."
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
