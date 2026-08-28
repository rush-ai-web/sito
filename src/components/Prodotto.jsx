import { motion } from 'framer-motion';
import { Layers, Blocks, BarChart3, Workflow, Sparkles, Plug } from 'lucide-react';
import { Section, Head, Group, Item, GlowCard, IconTile } from './ui';

const CARDS = [
  {
    icon: Blocks,
    t: 'Gestionale su misura',
    d: 'Anagrafiche, ordini, magazzino, documenti, presenze: i moduli che ti servono, con i campi e le regole della tua azienda. Nessun compromesso su come lavori.',
  },
  {
    icon: BarChart3,
    t: 'Dati reali, non report morti',
    d: 'Margini, costi, scorte e scadenze aggiornati in continuo. I numeri che contano sono in prima schermata, non in un export da ricostruire ogni volta.',
  },
  {
    icon: Workflow,
    t: 'Automazioni end-to-end',
    d: 'Documenti che si registrano da soli, soglie che avvisano prima del problema, attività che si assegnano da sole. Il lavoro ripetitivo esce dalla giornata.',
  },
  {
    icon: Sparkles,
    t: 'AI integrata nel flusso',
    d: 'Legge i documenti, controlla le anomalie, risponde alle domande sui tuoi dati. Non un chatbot appiccicato sopra: un livello dentro al gestionale.',
    accent: true,
  },
];

export default function Prodotto() {
  return (
    <Section id="prodotto" grid large>
      <Head
        icon={Layers}
        label="Cosa costruiamo"
        title={
          <>
            Un solo sistema al posto di sei strumenti scollegati
          </>
        }
        sub="Tutto quello che oggi vive in gestionali diversi, fogli di calcolo e messaggi torna in un posto solo — e resta aggiornato da solo."
      />

      <div className="bento">
        <Group className="bento__tall card card--lg card--glow" each={0.08} style={{ padding: 0 }}>
          <Item style={{ padding: 'var(--s-card) var(--s-card) 0' }}>
            <IconTile icon={Plug} />
            <h3 className="t-card" style={{ margin: '26px 0 12px' }}>
              Si collega a quello che hai già
            </h3>
            <p className="t-body">
              Cassa, e-commerce, fatturazione elettronica, banca, fornitori. Il gestionale nuovo non
              cancella gli strumenti che funzionano: li mette in fila.
            </p>
          </Item>
          <Item style={{ padding: '0 var(--s-card) var(--s-card)' }}>
            <div className="rows">
              {[
                ['Fatturazione elettronica', 'SDI'],
                ['Sistemi di cassa', 'POS'],
                ['E-commerce e marketplace', 'API'],
                ['Banche e pagamenti', 'PSD2'],
              ].map(([k, v]) => (
                <div className="rowline" key={k}>
                  <span className="rowline__k">{k}</span>
                  <span className="rowline__v chip">{v}</span>
                </div>
              ))}
            </div>
          </Item>
        </Group>

        {CARDS.map(({ icon, t, d, accent }) => (
          <motion.div
            key={t}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            style={{ display: 'flex' }}
          >
            <GlowCard icon={icon} title={t} accent={accent} className="bento__cell">
              {d}
            </GlowCard>
          </motion.div>
        ))}
      </div>

    </Section>
  );
}
