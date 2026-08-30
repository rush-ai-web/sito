import { TrendingUp, Clock, ShieldCheck, Gauge, Rocket, Sparkles } from 'lucide-react';
import { Section, Head, Group, Item } from './ui';
import { useCountUp } from '../lib/hooks';

/* ------------------------------------------------------------
   Risultati — i numeri prima di tutto.
   Riga di KPI allineati (stesso bordo alto/basso, divisori interni
   regolari: niente più scalinata sbilanciata), poi tre esiti che
   raccontano cosa cambia per chi guida l'azienda.
   ------------------------------------------------------------ */

const KPI = [
  {
    icon: Clock,
    to: 600,
    prefix: '~',
    suffix: ' ore',
    label: 'restituite ogni anno',
    d: 'In media 12 ore di lavoro manuale a settimana in meno: circa 600 ore l’anno che tornano al business, non ai fogli di calcolo.',
  },
  {
    icon: ShieldCheck,
    to: 92,
    suffix: '%',
    label: 'inserimenti manuali in meno',
    d: 'La lettura automatica registra i documenti in ingresso da sola: meno errori di battitura, meno correzioni, meno sviste da rincorrere.',
  },
  {
    icon: Gauge,
    to: 1,
    prefix: '<',
    suffix: ' min',
    label: 'e il dato è in dashboard',
    d: 'Dal momento in cui un dato entra a quando lo vedi aggiornato. L’azienda a colpo d’occhio, in tempo reale, senza aspettare nessuno.',
  },
  {
    icon: Rocket,
    to: 8,
    suffix: ' sett.',
    label: 'dal via alla produzione',
    d: 'Dal primo incontro al gestionale in uso, con i tuoi dati veri dentro e i primi numeri che iniziano a girare.',
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

function Kpi({ icon: Icon, to, prefix = '', suffix = '', label, d, dec = 0 }) {
  const [ref, val] = useCountUp(to, { dec });
  return (
    <Item className="kstat">
      <span className="kstat__ic">
        <Icon size={18} strokeWidth={1.9} />
      </span>
      <p className="t-kpi num kstat__val" ref={ref}>
        {prefix}
        {val}
        {suffix}
      </p>
      <p className="kstat__label">{label}</p>
      <p className="t-small kstat__d">{d}</p>
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

      <Group className="kstat-row shimmer-top" each={0.1}>
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
