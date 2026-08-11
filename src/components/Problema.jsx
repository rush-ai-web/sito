import { CircleSlash, Boxes, FileWarning, Clock } from 'lucide-react';
import { Section, Head, Group, GlowCard } from './ui';

const PUNTI = [
  {
    icon: Boxes,
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
  return (
    <Section id="problema" invert grid>
      <Head
        icon={CircleSlash}
        label="Il problema"
        title={
          <>
            I gestionali standard costringono
            <br />
            l'azienda ad adattarsi al software
          </>
        }
        sub="Dovrebbe essere il contrario. Un sistema che non segue i tuoi processi diventa una tassa quotidiana su chi ci lavora."
      />

      <Group className="grid grid-3" each={0.09}>
        {PUNTI.map(({ icon, t, d }) => (
          <GlowCard key={t} icon={icon} title={t}>
            {d}
          </GlowCard>
        ))}
      </Group>
    </Section>
  );
}
