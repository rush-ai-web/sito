import { TriangleAlert, Unplug, FileWarning, Clock } from 'lucide-react';
import { Section, Head, Group, DecoratorCard } from './ui';
import { useIsMobile } from '../lib/hooks';

const PUNTI = [
  {
    icon: Unplug,
    t: 'Strumenti separati, lavoro doppio',
    d: 'Cassa, magazzino, fatturazione, presenze: quattro sistemi, quattro anagrafiche da allineare. Tocca al tuo team ricostruire il quadro, un passaggio alla volta.',
  },
  {
    icon: FileWarning,
    t: 'I problemi emergono troppo tardi',
    d: 'A fine mese leggi numeri di tre settimane prima. Nel frattempo i costi sono cambiati e le occasioni per intervenire si sono ridotte.',
  },
  {
    icon: Clock,
    t: 'Ore che paghi senza accorgertene',
    d: 'Copia e incolla, fogli Excel paralleli, dati inseriti più volte. Piccole operazioni che si ripetono ogni giorno e sottraggono tempo al lavoro che fa crescere l’attività.',
  },
];

export default function Problema() {
  const isMobile = useIsMobile();
  return (
    <Section id="problema" grid className="section--shine">
      <Head
        className="head--problem-copy"
        icon={TriangleAlert}
        label="Il problema"
        title={
          <>
            QUANDO I TUOI STRUMENTI NON COMUNICANO, IL LAVORO RICADE SU DI TE
          </>
        }
        sub={
          <>
            <strong>Ogni informazione da rincorrere ha un costo.</strong>
            <br />
            <span className="problem-copy-line">
              Dati sparsi, controlli manuali e risposte in ritardo assorbono tempo e rendono più difficile capire dove perdi margine.
            </span>
          </>
        }
      />

      {isMobile ? (
        /* su mobile ogni card compare per conto suo quando entra in
           viewport: una alla volta mentre si scrolla */
        <div className="grid grid-3 grid--deco">
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
        <Group className="grid grid-3 grid--deco" each={0.09}>
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
