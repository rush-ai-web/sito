import { AnimatePresence, motion } from 'framer-motion';
import {
  Layers,
  Blocks,
  BarChart3,
  Workflow,
  Sparkles,
  Plug,
  ArrowUpRight,
} from 'lucide-react';
import { Section, Head, Group, Item, GlowCard, IconTile, LiveDot } from './ui';
import { useClock, useCountUp, useLiveFeed } from '../lib/hooks';
import { DUR, EASE_MODAL } from '../lib/motion';

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

/* La finestra di prodotto: un estratto di dashboard con i quattro
   dettagli riconoscibili — conteggio animato, orologio, dot live,
   e un flusso di documenti che continua a scorrere da solo. */
function Anteprima() {
  const { time, date } = useClock();
  const [rIncassi, incassi] = useCountUp(184200, { dec: 0 });
  const [rOre, ore] = useCountUp(142, { dec: 0 });
  const [rCosto, costo] = useCountUp(28, { dec: 1 });
  const feed = useLiveFeed();

  return (
    <div className="frame">
      <div className="frame__bar">
        <div className="frame__dots">
          <i />
          <i />
          <i />
        </div>
        <span className="t-small num" style={{ marginLeft: 'auto' }}>
          {time}
        </span>
      </div>

      <div className="frame__body">
        <p className="t-small" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="pulse-ring">
            <LiveDot />
          </span>
          In diretta · {date}
        </p>

        <div className="kpi-row">
          <div ref={rIncassi}>
            <p className="t-label">Fatturato · mese</p>
            <p className="t-kpi num">€{incassi}</p>
            <p className="delta delta--pos">+12% vs mese prec.</p>
          </div>
          <div ref={rCosto}>
            <p className="t-label">Costo materie</p>
            <p className="t-kpi num">{costo}%</p>
            <p className="delta delta--pos">−1,5pt</p>
          </div>
          <div ref={rOre}>
            <p className="t-label">Ore lavorate</p>
            <p className="t-kpi num">{ore}h</p>
            <p className="delta delta--warn">3 da approvare</p>
          </div>
        </div>

        <div className="frame__split">
          {/* grafico che continua a muoversi */}
          <div>
            <p className="t-label" style={{ marginBottom: 14 }}>
              Incassi · ultime settimane
            </p>
            <div className="bars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>

          {/* documenti che entrano da soli, uno dopo l'altro */}
          <div>
            <p className="t-label" style={{ marginBottom: 10 }}>
              Documenti registrati ora
            </p>
            <div className="feed">
              <AnimatePresence initial={false} mode="popLayout">
                {feed.map((r) => (
                  <motion.div
                    className="feed__row"
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    transition={{ duration: DUR.pop, ease: EASE_MODAL }}
                  >
                    <span className="feed__k">{r.chi}</span>
                    <span className="chip">{r.tipo}</span>
                    <span className="num feed__v">€{r.importo}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Prodotto() {
  return (
    <Section id="prodotto" invert grid large>
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

      <Group className="stack" style={{ marginTop: 'var(--s-block)' }}>
        <Item>
          <Anteprima />
        </Item>
        <Item as="p" className="t-small" style={{ textAlign: 'center' }}>
          Estratto di una dashboard Rush · i numeri sono di esempio
          <ArrowUpRight size={14} strokeWidth={1.75} style={{ display: 'inline', marginLeft: 4, verticalAlign: -2 }} />
        </Item>
      </Group>
    </Section>
  );
}
