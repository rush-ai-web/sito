import { BarChart3, Coins, TrendingUp, Utensils } from 'lucide-react';
import { useCountUp } from '../lib/hooks';
import { Group, IconTile, Item, LiftCard, LiveDot, Reveal, Section } from './ui';

/* colonne sfalsate: ogni numero parte quando entra in viewport */
const NUMERI = [
  {
    tag: 'Magazzino',
    val: 400,
    pre: '~',
    d: 'Referenze importate dal sistema cassa al primo giorno, con categoria, fornitore e soglia minima.',
  },
  {
    tag: 'Cassa',
    val: 5,
    suf: ' min',
    d: 'Ogni quanto il bridge rilegge vendite, chiusure, metodi di pagamento e operatore.',
  },
  {
    tag: 'Matching',
    val: 4,
    d: 'Gli strati che portano una riga di fattura al prodotto giusto, prima di disturbare te.',
  },
  {
    tag: 'Ricettario',
    val: 27,
    d: 'Piatti food digitalizzati, più caffetteria e cocktail, con dosi e costo che si aggiorna da solo.',
  },
];

const MODULI = [
  {
    icon: BarChart3,
    t: 'Menu engineering',
    d: 'Popolarità per redditività, quattro quadranti: stelle, puzzle, cavalli, cani.',
  },
  {
    icon: TrendingUp,
    t: 'Alert prezzi fornitori',
    d: 'Ogni riga confrontata con lo storico, soglia configurabile, avviso appena si sfora.',
  },
  {
    icon: Coins,
    t: 'Riconciliazione contante',
    d: 'Contante atteso dalla cassa contro contante reale dal cassetto automatico.',
  },
];

function Colonna({ n, i }) {
  const [ref, val] = useCountUp(n.val, { duration: 1.4 });
  return (
    <div className="cascade__col">
      <span className="chip">{n.tag}</span>
      <p ref={ref} className="t-kpi" style={{ marginTop: 18 }}>
        {n.pre || ''}
        {val}
        {n.suf || ''}
      </p>
      <p className="t-small" style={{ marginTop: 14, maxWidth: 230 }}>
        {n.d}
      </p>
    </div>
  );
}

export default function Ristorazione() {
  return (
    <Section id="ristorazione" invert large>
      <div className="section__head" style={{ maxWidth: 720 }}>
        <Reveal>
          <span className="chip chip--surface">
            <Utensils size={14} strokeWidth={1.75} />
            La prova
          </span>
        </Reveal>
        <Reveal i={1}>
          <h2 className="t-sec" style={{ marginTop: 22 }}>
            Rush è nato in un bar, non in una slide.
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="t-body" style={{ marginTop: 20 }}>
            La ristorazione è il verticale più ostile che potessimo scegliere: margini sottili,
            centinaia di referenze, prezzi che ballano ogni settimana. Se il modello regge qui,
            regge quasi ovunque.
          </p>
        </Reveal>
      </div>

      <Reveal>
        <div className="cascade">
          {NUMERI.map((n, i) => (
            <Colonna key={n.tag} n={n} i={i} />
          ))}
        </div>
      </Reveal>

      <Group
        className="grid grid-3"
        delay={0.08}
        style={{ marginTop: 'var(--s-block)' }}
      >
        {MODULI.map((m) => (
          <Item key={m.t}>
            <LiftCard className="card" style={{ display: 'flex', gap: 16, height: '100%' }}>
              <IconTile icon={m.icon} size="sm" ghost />
              <div>
                <b style={{ fontWeight: 600, letterSpacing: '-0.015em' }}>{m.t}</b>
                <p className="t-small" style={{ marginTop: 8 }}>
                  {m.d}
                </p>
              </div>
            </LiftCard>
          </Item>
        ))}
      </Group>

      <Reveal>
        <p
          className="t-small"
          style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <LiveDot />
          Primo locale attivo a Fano. Il verticale ristorazione — moduli, numeri e casi nel
          dettaglio — avrà una pagina sua.
        </p>
      </Reveal>
    </Section>
  );
}
