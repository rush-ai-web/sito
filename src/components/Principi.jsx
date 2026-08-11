import { Fingerprint, Code2, Users, KeyRound, Gauge, MessageSquare } from 'lucide-react';
import { Section, Head, Group, GlowCard } from './ui';

const PRINCIPI = [
  {
    icon: Code2,
    t: 'Scriviamo il software, non lo rivendiamo',
    d: 'Il gestionale è nostro dalla prima riga. Quando serve una modifica non si apre un ticket a un fornitore terzo: si fa.',
  },
  {
    icon: KeyRound,
    t: 'I dati restano tuoi',
    d: 'Esportabili in qualsiasi momento, in formato aperto. Nessun ostaggio, nessuna penale per andarsene.',
  },
  {
    icon: Users,
    t: 'Parli con chi costruisce',
    d: 'Niente filiera di account manager. Chi raccoglie i tuoi requisiti è la stessa persona che poi mette le mani nel codice.',
  },
  {
    icon: Gauge,
    t: 'Veloce anche fra tre anni',
    d: 'Progettato per reggere lo storico che accumulerai, non solo la demo del primo mese.',
  },
  {
    icon: MessageSquare,
    t: 'Preventivi con un numero dentro',
    d: 'Perimetro chiaro, cifra chiara, tempi chiari. Se qualcosa cambia lo diciamo prima, non in fattura.',
  },
  {
    icon: Fingerprint,
    t: 'Un sistema riconoscibile',
    d: "Stessa interfaccia dal gestionale all'app dei dipendenti. Chi impara una schermata le sa usare tutte.",
  },
];

export default function Principi() {
  return (
    <Section id="principi" large>
      <Head
        icon={Fingerprint}
        label="Perché Rush"
        title={
          <>
            Una software house, non un rivenditore di licenze
          </>
        }
        sub="La differenza si sente il giorno in cui chiedi una modifica: da noi diventa una release, non un preventivo."
      />

      <Group className="grid grid-3" each={0.07}>
        {PRINCIPI.map(({ icon, t, d }) => (
          <GlowCard key={t} icon={icon} title={t}>
            {d}
          </GlowCard>
        ))}
      </Group>
    </Section>
  );
}
