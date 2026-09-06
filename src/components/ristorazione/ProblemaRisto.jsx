import { TriangleAlert, Calculator, TrendingUp, Boxes, ClipboardList } from 'lucide-react';
import { Section, Head, Group, DecoratorCard } from '../ui';
import { useIsMobile } from '../../lib/hooks';

const PUNTI = [
  {
    icon: Calculator,
    t: 'Margini a occhio, mai davvero',
    d: 'Sai quanto incassi, ma non quanto guadagni su ogni piatto. Il food cost è una stima di fine mese, quando ormai è tardi per cambiare qualcosa.',
  },
  {
    icon: TrendingUp,
    t: 'Aumenti fornitori invisibili',
    d: 'Il gin è salito del 18%, il burro dell\'11%. Nessuno se ne accorge finché la fattura non è già pagata e il margine è già eroso.',
  },
  {
    icon: Boxes,
    t: 'Magazzino tenuto a mano',
    d: 'Inventario col foglio Excel, ordini a memoria, sprechi e rotture di stock che scopri solo quando un prodotto è già finito.',
  },
  {
    icon: ClipboardList,
    t: 'Dati sparsi in cinque posti',
    d: 'Cassa, fatture, turni, presenze, recensioni: sistemi diversi che non parlano tra loro. Per capire come va il locale devi incrociare tutto a mano.',
  },
];

export default function ProblemaRisto() {
  const isMobile = useIsMobile();
  return (
    <Section id="problema" grid className="section--shine">
      <Head
        className="head--problem-copy"
        icon={TriangleAlert}
        label="Il problema"
        title={<>Gestisci un locale al buio, sui numeri di tre settimane fa</>}
        sub={
          <>
            <strong>I dati ci sono già — sono solo sparsi e in ritardo.</strong>
            <br />
            <span className="problem-copy-line">
              Quando il problema si vede nel bilancio, è successo e basta: non c'è più niente da correggere.
            </span>
          </>
        }
      />

      {isMobile ? (
        <div className="grid grid-2 grid--deco">
          {PUNTI.map(({ icon, t, d }) => (
            <DecoratorCard
              key={t}
              icon={icon}
              title={t}
              className="problem-card"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
            >
              {d}
            </DecoratorCard>
          ))}
        </div>
      ) : (
        <Group className="grid grid-2 grid--deco" each={0.09}>
          {PUNTI.map(({ icon, t, d }) => (
            <DecoratorCard key={t} icon={icon} title={t} className="problem-card">
              {d}
            </DecoratorCard>
          ))}
        </Group>
      )}
    </Section>
  );
}
