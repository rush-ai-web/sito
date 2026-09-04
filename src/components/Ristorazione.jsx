import { useContext } from 'react';
import {
  UtensilsCrossed,
  ArrowRight,
  Boxes,
  Coins,
  Truck,
  ChefHat,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import { Section, GlowCard, Group, Item, Pill, LiveDot, ThemeCtx } from './ui';

const STATS = [
  { n: '1', l: 'gestionale per tutta l’azienda' },
  { n: '∞', l: 'sedi sotto lo stesso tetto' },
  { n: '0', l: 'sistemi da sostituire' },
];

const FEATURES = [
  {
    icon: Boxes,
    t: 'Magazzino a movimenti',
    d: 'Ogni carico e scarico è tracciato con data, quantità e costo: la giacenza è sempre la somma esatta dei movimenti, mai un numero che cade dal cielo.',
  },
  {
    icon: Coins,
    t: 'Food cost reale, non l’ultimo prezzo',
    d: 'Costing FIFO a strati: ogni piatto costa la partita che stai davvero consumando. Lo storico dei margini è un dato preciso, non una stima.',
  },
  {
    icon: Truck,
    t: 'Riordino per fornitore',
    d: 'Rush raggruppa i sotto-scorta per fornitore e calcola quante confezioni ordinare, con la spesa stimata. La bozza è pronta, la invii tu.',
  },
  {
    icon: ChefHat,
    t: 'Ricette e food cost per piatto',
    d: 'Distinta base ingrediente per ingrediente, con conversione delle unità e conto economico completo: prezzo, IVA, food cost e margine.',
  },
  {
    icon: Users,
    t: 'Personale, turni e presenze',
    d: 'Pianificatore turni settimanale, richieste di ferie e permessi, timbratura con QR code e verifica di rete. Tutto nello stesso sistema.',
  },
  {
    icon: LayoutDashboard,
    t: 'Dashboard in tempo reale',
    d: 'Valore di magazzino al costo FIFO, prodotti sotto-scorta, rincari in arrivo, movimenti del mese: i numeri veri del locale a colpo d’occhio.',
  },
];

export default function Ristorazione() {
  const theme = useContext(ThemeCtx);
  const logoSrc = theme === 'dark' ? './rush-logo-dark.png' : './rush-logo.png';
  const logoSrcSet = theme === 'dark'
    ? './rush-logo-dark-192.png 192w, ./rush-logo-dark-320.png 320w, ./rush-logo-dark.png 800w'
    : './rush-logo-192.png 192w, ./rush-logo-320.png 320w, ./rush-logo.png 800w';

  return (
    <Section id="ristorazione" large>
      {/* intestazione — logo Rush del verticale (diventerà rosso) + titolo */}
      <Group className="risto-head" each={0.09}>
        <Item className="risto-brand">
          <img
            src={logoSrc}
            srcSet={logoSrcSet}
            sizes="150px"
            alt="Rush per la ristorazione"
            width="800"
            height="200"
            loading="lazy"
            className="risto-logo"
          />
          <span className="risto-brand__seg">Ristorazione</span>
        </Item>
        <Item>
          <Pill icon={UtensilsCrossed}>Bar &amp; ristoranti</Pill>
        </Item>
        <Item as="h2" className="t-sec">
          Il gestionale che capisce il tuo locale
        </Item>
        <Item as="p" className="t-body risto-intro">
          Una piattaforma costruita attorno a un’idea semplice: i dati che generi ogni giorno —
          fatture, scontrini, movimenti di magazzino — valgono più di quanto sembri. Rush li
          raccoglie, li fa dialogare e li trasforma in decisioni concrete.
        </Item>
      </Group>

      {/* numeri chiave */}
      <Group className="risto-stats" each={0.08}>
        {STATS.map(({ n, l }) => (
          <Item key={l} className="risto-stat">
            <span className="risto-stat__n num">{n}</span>
            <span className="risto-stat__l">{l}</span>
          </Item>
        ))}
      </Group>

      {/* cosa fa già, oggi */}
      <div className="risto-grid">
        {FEATURES.map(({ icon, t, d }) => (
          <GlowCard key={t} icon={icon} title={t}>
            {d}
          </GlowCard>
        ))}
      </div>

      {/* dove si mette Rush */}
      <p className="risto-note">
        Rush non sostituisce la cassa, il programma di fatturazione o il commercialista: si mette nel
        mezzo, legge i sistemi che hai già e ci costruisce sopra lo strato di intelligenza che ti
        mancava. Un unico posto da cui guardare il locale — magazzino, costi, personale, vendite.
      </p>

      <div className="risto-cta">
        <a className="btn btn--primary btn--hero" href="#contatti">
          Chiedi una demo per il tuo locale
          <span className="btn__badge">
            <ArrowRight size={16} strokeWidth={2.2} />
          </span>
        </a>
        <span className="risto-live">
          <LiveDot />
          Attivo su locali reali
        </span>
      </div>
    </Section>
  );
}
