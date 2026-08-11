import { TrendingUp, Timer, Boxes, Receipt } from 'lucide-react';
import { Section, Head, Group, Item, Pill, PillCard } from './ui';
import { useCountUp } from '../lib/hooks';

/* La scalinata del tema: quattro colonne divise da hairline,
   ognuna un gradino più in basso della precedente. */
const KPI = [
  {
    label: 'Tempo',
    to: 12,
    suffix: ' ore',
    d: 'Ore di lavoro manuale tolte ogni settimana da una PMI dopo il passaggio a un gestionale su misura.',
  },
  {
    label: 'Consegna',
    to: 8,
    suffix: ' sett.',
    d: 'Dal primo incontro alla prima versione in produzione, con i tuoi dati veri dentro.',
  },
  {
    label: 'Errori',
    to: 92,
    suffix: '%',
    d: 'Inserimenti manuali eliminati sui documenti in ingresso grazie alla lettura automatica.',
  },
  {
    label: 'Visibilità',
    to: 1,
    prefix: '<',
    suffix: ' min',
    d: 'Ritardo con cui un dato entra nel sistema e diventa leggibile in dashboard.',
  },
];

const ESITI = [
  { icon: Receipt, t: 'Fatture registrate da sole, in tempo reale' },
  { icon: Boxes, t: 'Scorte sotto soglia segnalate prima della rottura' },
  { icon: Timer, t: 'Chiusura mensile da giorni a minuti' },
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
  return (
    <Section id="numeri" large>
      <Head
        icon={TrendingUp}
        label="Risultati"
        title={
          <>
            Un gestionale si giudica da quanto lavoro ti toglie
          </>
        }
        sub="Non da quante funzioni ha nel listino. Questi sono gli effetti che misuriamo quando un sistema Rush entra in produzione."
      />

      <Group className="stair shimmer-top" each={0.1}>
        {KPI.map((k) => (
          <Kpi key={k.label} {...k} />
        ))}
      </Group>

      <Group className="grid grid-3" each={0.08} style={{ marginTop: 'var(--s-block)' }}>
        {ESITI.map(({ icon, t }) => (
          <Item key={t}>
            <PillCard icon={icon}>{t}</PillCard>
          </Item>
        ))}
      </Group>
    </Section>
  );
}
