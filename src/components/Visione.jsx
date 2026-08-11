import { Group, Item, Reveal, Section } from './ui';

const TAPPE = [
  {
    when: 'Oggi',
    t: 'Un cervello per il locale',
    d: 'Cassa, fatture, magazzino, ricettario, personale. Un posto solo dove i numeri arrivano già incrociati, e una chat che li sa leggere al posto tuo.',
  },
  {
    when: 'Prossimi 18–24 mesi',
    t: 'Lo stesso metodo, altri settori',
    d: 'Il problema non è della ristorazione: è di chiunque abbia sistemi che non si parlano. Cambiano le integrazioni e il vocabolario, non l’impianto.',
  },
];

export default function Visione() {
  return (
    <Section id="visione">
      <div className="row2" style={{ alignItems: 'start' }}>
        <div className="row2__text">
          <Reveal>
            <p className="t-label">Dove stiamo andando</p>
          </Reveal>
          <Reveal i={1}>
            <h2 className="t-sec" style={{ marginTop: 20 }}>
              Un gestionale che smette di essere un archivio.
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="t-body" style={{ marginTop: 20 }}>
              Per vent’anni i gestionali hanno registrato. Il salto non è registrare meglio: è avere
              qualcosa che legge quel registro tutti i giorni e ti dice cosa ci ha trovato.
            </p>
          </Reveal>
        </div>

        <Group className="stack" delay={0.08} style={{ display: 'grid', gap: 0 }}>
          {TAPPE.map((t, i) => (
            <Item
              key={t.when}
              style={{
                marginTop: 0,
                paddingLeft: 26,
                paddingBottom: i === 0 ? 34 : 0,
                borderLeft: '0.5px solid var(--hairline)',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: -4.5,
                  top: 7,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--accent)' : 'var(--text-3)',
                }}
                aria-hidden="true"
              />
              <p className="t-label">{t.when}</p>
              <h3 className="t-card" style={{ marginTop: 12 }}>
                {t.t}
              </h3>
              <p className="t-small" style={{ marginTop: 10 }}>
                {t.d}
              </p>
            </Item>
          ))}
        </Group>
      </div>
    </Section>
  );
}
