import { Group, Item, LiftCard, Reveal, Section } from './ui';

const PASSI = [
  {
    n: '01',
    t: 'Mappiamo quello che hai',
    d: 'Quale cassa, quale portale di fatturazione, quale commercialista, quali fogli Excel tenuti a mano. Prima di scrivere una riga di codice sappiamo da dove arrivano i dati.',
  },
  {
    n: '02',
    t: 'Colleghiamo e ripuliamo',
    d: 'Import di tre-sei mesi di fatture storiche e una sessione dedicata a risolvere gli abbinamenti ambigui. Rush parte già con una mappatura sua, non da zero.',
  },
  {
    n: '03',
    t: 'Restiamo dentro',
    d: 'I moduli si attivano quando servono, non tutti al primo giorno. Ogni correzione che fai stringe il sistema attorno al tuo locale.',
  },
];

const PILASTRI = [
  ['Un cliente alla volta', 'Preferiamo pochi locali seguiti davvero a molti lasciati soli dopo l’onboarding.'],
  ['Moduli, non pacchetti', 'Si parte dall’essenziale e si cresce. Nessuno paga per una sezione che non apre mai.'],
  ['Niente scope infinito', 'Costruiamo per incrementi verificabili. Quello che non è pronto non viene raccontato come se lo fosse.'],
];

export default function Metodo() {
  return (
    <Section id="metodo" large>
      <div className="section__head">
        <Reveal>
          <p className="t-label">Come lavoriamo</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="t-sec" style={{ marginTop: 20 }}>
            Tre passaggi, nessuna sorpresa.
          </h2>
        </Reveal>
      </div>

      <Group className="grid grid-3" delay={0.05}>
        {PASSI.map((p) => (
          <Item key={p.n}>
            <LiftCard className="card card--lg" style={{ height: '100%' }}>
              <span className="num t-label">{p.n}</span>
              <h3 className="t-card" style={{ marginTop: 20 }}>
                {p.t}
              </h3>
              <p className="t-small" style={{ marginTop: 12 }}>
                {p.d}
              </p>
            </LiftCard>
          </Item>
        ))}
      </Group>

      <Group className="grid grid-3" delay={0.1} style={{ marginTop: 'var(--s-sec)' }}>
        {PILASTRI.map(([t, d]) => (
          <Item key={t}>
            <div style={{ paddingTop: 20, borderTop: '0.5px solid var(--hairline)' }}>
              <b style={{ fontWeight: 600, letterSpacing: '-0.015em' }}>{t}</b>
              <p className="t-small" style={{ marginTop: 8 }}>
                {d}
              </p>
            </div>
          </Item>
        ))}
      </Group>
    </Section>
  );
}
