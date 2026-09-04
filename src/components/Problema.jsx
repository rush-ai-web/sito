import { TriangleAlert, Unplug, FileWarning, Clock } from 'lucide-react';
import { Section, Head, Group, DecoratorCard } from './ui';
import { useIsMobile } from '../lib/hooks';

const PUNTI = [
  {
    icon: Unplug,
    t: 'Software che non parlano tra loro',
    d: 'Gestionale, magazzino, fatturazione, presenze: quattro sistemi, quattro anagrafiche, nessuna che coincide. Ogni riconciliazione è manuale.',
  },
  {
    icon: FileWarning,
    t: 'Dati che arrivano già vecchi',
    d: "Report chiusi a fine mese su numeri di tre settimane prima. Quando il problema si vede nel bilancio, è successo e basta: non c'è più niente da correggere.",
  },
  {
    icon: Clock,
    t: 'Ore di lavoro che nessuno conta',
    d: 'Inserimenti a mano, fogli Excel paralleli, copia-incolla tra un sistema e l\'altro. Lavoro che costa stipendio e non produce niente.',
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
            I gestionali standard costringono l'azienda ad adattarsi al software
          </>
        }
        sub={
          <>
            <strong>Dovrebbe essere il contrario.</strong>
            <br />
            <span className="problem-copy-line">
              Un sistema che non segue i tuoi processi diventa una tassa quotidiana su chi ci lavora.
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
