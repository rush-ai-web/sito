import { GitBranch, Search, PenTool, Rocket, RefreshCw } from 'lucide-react';
import { Section, Head, Group, Item, IconTile, Pill } from './ui';

const PASSI = [
  {
    n: 'Passo 01',
    icon: Search,
    t: 'Analisi sul campo',
    d: 'Veniamo a vedere come lavori davvero: chi fa cosa, dove si perde tempo, quali dati esistono già e dove sono fermi.',
  },
  {
    n: 'Passo 02',
    icon: PenTool,
    t: 'Progetto e prototipo',
    d: 'Disegniamo il sistema e ti mostriamo le schermate vere prima di scrivere il codice definitivo. Si corregge lì, non dopo.',
  },
  {
    n: 'Passo 03',
    icon: Rocket,
    t: 'Sviluppo e messa in linea',
    d: 'Costruiamo, importiamo i tuoi dati storici, colleghiamo i sistemi esistenti e formiamo chi lo userà ogni giorno.',
  },
  {
    n: 'Passo 04',
    icon: RefreshCw,
    t: 'Evoluzione continua',
    d: "L'azienda cambia e il gestionale la segue: nuovi moduli, nuove automazioni, nuove integrazioni quando servono.",
  },
];

export default function Metodo() {
  return (
    <Section id="metodo" invert grid>
      <Head
        icon={GitBranch}
        label="Come lavoriamo"
        title={
          <>
            Dal primo incontro alla produzione
            <br />
            in otto settimane
          </>
        }
        sub="Niente capitolati da trecento pagine. Si parte da un modulo che risolve il problema più caro, e da lì si cresce."
      />

      <Group className="steps" each={0.1}>
        {PASSI.map(({ n, icon, t, d }) => (
          <Item key={n} className="step">
            <Pill>{n}</Pill>
            <div className="step__line" />
            <IconTile icon={icon} size="sm" ghost />
            <h3 className="t-card" style={{ margin: '18px 0 10px' }}>
              {t}
            </h3>
            <p className="t-small">{d}</p>
          </Item>
        ))}
      </Group>
    </Section>
  );
}
