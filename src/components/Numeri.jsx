import { TrendingUp, Gauge, ShieldCheck, Sparkles } from 'lucide-react';
import { Section, Head, Group, Item, Pill } from './ui';
import { useCountUp } from '../lib/hooks';

/* ------------------------------------------------------------
   Risultati — i numeri prima di tutto.
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
    label: 'Visibilità',
    to: 1,
    prefix: '<',
    suffix: ' min',
    d: 'Ritardo con cui un dato entra nel sistema e diventa leggibile in dashboard. L’azienda a colpo d’occhio, in tempo reale.',
  },
];

/* cosa cambia per chi guida l'azienda */
const ESITI = [
  {
    icon: Gauge,
    t: 'L’azienda a colpo d’occhio',
    d: 'Margini, incassi e scorte sempre aggiornati: capisci come sta andando quando vuoi, senza aspettare la chiamata del commercialista.',
  },
  {
    icon: ShieldCheck,
    t: 'Niente più cose che sfuggono',
    d: 'Scadenze, errori e anomalie li nota il sistema prima di te. Meno stress da dimenticanze, più notti tranquille.',
  },
  {
    icon: Sparkles,
    t: 'Testa solo al business',
    d: 'Consulti i margini e prendi le decisioni che contano, con l’AI che analizza i numeri insieme a te e ti segnala dove guardare.',
    accent: true,
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
  return (
    <Section id="numeri" large>
      <Head
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

      <Group className="kbenefit" each={0.09} style={{ marginTop: 'var(--s-block)' }}>
        {ESITI.map(({ icon: Icon, t, d, accent }) => (
          <Item key={t} className={`kbenefit__card card card--lg card--glow ${accent ? 'card--glow-accent' : ''}`}>
            <span className={`kstat__ic ${accent ? 'kstat__ic--accent' : ''}`}>
              <Icon size={18} strokeWidth={1.9} />
            </span>
            <h3 className="t-card kbenefit__t">{t}</h3>
            <p className="t-body kbenefit__d">{d}</p>
          </Item>
        ))}
      </Group>
    </Section>
  );
}
