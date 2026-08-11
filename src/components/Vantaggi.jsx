import { BellRing, MessageSquare, Package, Percent } from 'lucide-react';
import { Group, IconTile, Item, LiftCard, Reveal, Section } from './ui';

const FATTURE = [
  ['Distillerie Rossi', 'SDI', '12 mag', '€892'],
  ['Caseificio Marche', 'SDI', '11 mag', '€340'],
  ['Frutta & Co', 'FOTO', '10 mag', '€127'],
  ['Forno Adriatico', 'SDI', '9 mag', '€215'],
];

const PICCOLI = [
  {
    icon: BellRing,
    t: 'Nessun aumento passa liscio',
    d: 'Ogni riga viene confrontata con lo storico di quel fornitore. Oltre la soglia che decidi tu, scatta un alert — con il numero, non con la sensazione.',
  },
  {
    icon: Package,
    t: 'Il magazzino si tiene da solo',
    d: 'Si carica dalle fatture, si scarica dalle vendite in cassa. A fine mese vedi lo scarto tra atteso e reale: lì dentro ci sono sprechi, errori e ammanchi.',
  },
  {
    icon: MessageSquare,
    t: 'Chiedi, invece di cercare',
    d: 'Niente report da esportare e incrociare. Fai la domanda in italiano e ottieni il numero, la fonte da cui viene e cosa conviene fare.',
  },
];

export default function Vantaggi() {
  return (
    <Section id="vantaggi" large>
      <div className="section__head">
        <Reveal>
          <p className="t-label">Cosa ci guadagni</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="t-sec" style={{ marginTop: 20 }}>
            Meno tempo a cercare i numeri.
            <br />
            Più tempo a usarli.
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-2" style={{ gap: 20, alignItems: 'start' }}>
        {/* card grande con tabella a righe compresse */}
        <Reveal>
          <LiftCard className="card card--lg" style={{ height: '100%' }}>
            <IconTile icon={Percent} />
            <h3 className="t-card" style={{ marginTop: 22 }}>
              Sai il margine vero, oggi
            </h3>
            <p className="t-small" style={{ marginTop: 12 }}>
              Il costo materie prime di ogni ricetta si aggiorna da solo ogni volta che entra una
              fattura con quei prodotti. Food cost e beverage cost per singolo piatto, non una media
              di reparto.
            </p>

            <div
              style={{
                marginTop: 26,
                paddingTop: 20,
                borderTop: '0.5px solid var(--hairline)',
              }}
            >
              <p className="t-label" style={{ marginBottom: 8 }}>
                Ultime fatture
              </p>
              <table className="tbl">
                <tbody>
                  {FATTURE.map(([nome, canale, data, importo]) => (
                    <tr key={nome}>
                      <td>{nome}</td>
                      <td style={{ paddingLeft: 12 }}>
                        <span className="chip" style={{ height: 24, fontSize: 11 }}>
                          {canale}
                        </span>
                      </td>
                      <td className="faint" style={{ paddingLeft: 12 }}>
                        {data}
                      </td>
                      <td className="num">{importo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LiftCard>
        </Reveal>

        <Group className="stack" delay={0.06} style={{ display: 'grid', gap: 20 }}>
          {PICCOLI.map((p) => (
            <Item key={p.t} style={{ marginTop: 0 }}>
              <LiftCard className="card" style={{ display: 'flex', gap: 18 }}>
                <IconTile icon={p.icon} size="sm" ghost />
                <div>
                  <h3 className="t-card" style={{ fontSize: 19 }}>
                    {p.t}
                  </h3>
                  <p className="t-small" style={{ marginTop: 10 }}>
                    {p.d}
                  </p>
                </div>
              </LiftCard>
            </Item>
          ))}
        </Group>
      </div>
    </Section>
  );
}
