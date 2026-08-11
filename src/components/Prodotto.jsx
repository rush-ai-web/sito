import { motion } from 'framer-motion';
import {
  ChevronRight,
  Layers,
  MessageSquare,
  Plug,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { EASE_MODAL, inView } from '../lib/motion';
import { Group, IconTile, Item, LiftCard, Reveal, Section } from './ui';

const FLUSSO = [
  {
    icon: Plug,
    t: 'Collega',
    d: 'Un bridge legge la cassa ogni 5 minuti, le fatture arrivano da SDI, le cartacee da una foto. Read-only: Rush non tocca i tuoi sistemi.',
  },
  {
    icon: Layers,
    t: 'Capisce',
    d: 'Ogni riga di fattura trova il suo prodotto a magazzino: match esatto, poi fuzzy, poi AI sui casi orfani. Ogni tua correzione diventa una regola.',
  },
  {
    icon: MessageSquare,
    t: 'Risponde',
    d: 'Chiedi in italiano quanto hai speso in Campari a maggio. Ti risponde con il numero, la fattura da cui viene e cosa conviene fare.',
  },
];

const POSTURE = [
  {
    icon: Plug,
    t: 'Integriamo',
    d: 'Cassa, fatturazione elettronica, cassetto contante, contabilità. Se il sistema espone i dati, Rush li legge — senza chiederti di cambiare abitudini.',
  },
  {
    icon: TrendingUp,
    t: 'Miglioriamo',
    d: 'Sopra i dati che già produci, Rush aggiunge quello che nessuno dei tuoi sistemi fa: margini reali per piatto, alert prezzi, menu engineering.',
  },
  {
    icon: RefreshCw,
    t: 'Sostituiamo',
    d: 'Solo dove serve davvero, e solo se conviene a te: magazzino, ricettario, turni. Il resto resta dov’è, e continua a funzionare.',
  },
];

/* anteprima chat: lo stato AI è tre puntini che rimbalzano, mai uno spinner */
function ChatPreview() {
  return (
    <motion.div
      className="card card--lg"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.7, ease: EASE_MODAL }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconTile icon={Sparkles} size="sm" />
        <b style={{ fontWeight: 500, fontSize: 15 }}>Chiedi a Rush</b>
      </div>

      <div
        style={{
          marginTop: 22,
          padding: '13px 16px',
          borderRadius: 12,
          background: 'var(--chip-bg)',
          color: 'var(--text)',
          fontSize: 15,
          marginLeft: 'auto',
          maxWidth: '82%',
        }}
      >
        Quanto ho speso in Campari a maggio?
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.55, ease: EASE_MODAL, delay: 0.45 }}
        style={{ marginTop: 14 }}
      >
        <p className="t-small" style={{ color: 'var(--text)' }}>
          <span className="num">€892</span> su 4 fatture, tutte da Distillerie Rossi. Il prezzo al
          litro è salito del <span className="num">18%</span> rispetto alla media degli ultimi sei
          mesi — sono circa <span className="num">€130</span> all’anno ai volumi attuali.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 14,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span className="chip chip--warn">Prezzo anomalo</span>
          <span className="chip">Distillerie Rossi</span>
        </div>
      </motion.div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '0.5px solid var(--hairline)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
        }}
      >
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="t-small faint">Sta leggendo le fatture di maggio…</span>
      </div>
    </motion.div>
  );
}

export default function Prodotto() {
  return (
    <Section id="prodotto" large>
      <div className="section__head section__head--center">
        <Reveal>
          <span className="chip chip--surface">
            <Sparkles size={14} strokeWidth={1.75} />
            Cos’è Rush
          </span>
        </Reveal>
        <Reveal i={1}>
          <h2 className="t-sec" style={{ marginTop: 22 }}>
            Collega, capisce, risponde.
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="t-body" style={{ marginTop: 20 }}>
            Tre passaggi, sempre gli stessi. Quello che cambia da locale a locale è solo cosa c’è
            all’altro capo del cavo.
          </p>
        </Reveal>
      </div>

      {/* Collega → Capisce → Risponde */}
      <Group className="flow" delay={0.05}>
        {FLUSSO.flatMap((f, i) => {
          const nodes = [
            <Item key={f.t}>
              <LiftCard className="card" style={{ height: '100%' }}>
                <IconTile icon={f.icon} />
                <h3 className="t-card" style={{ marginTop: 22 }}>
                  {f.t}
                </h3>
                <p className="t-small" style={{ marginTop: 12 }}>
                  {f.d}
                </p>
              </LiftCard>
            </Item>,
          ];
          if (i < FLUSSO.length - 1) {
            nodes.push(
              <Item key={`freccia-${i}`} className="flow__arrow">
                <ChevronRight size={22} strokeWidth={1.75} />
              </Item>
            );
          }
          return nodes;
        })}
      </Group>

      {/* Integriamo / Miglioriamo / Sostituiamo + anteprima chat */}
      <div className="row2" style={{ marginTop: 'var(--s-block)' }}>
        <div className="row2__text">
          <Reveal>
            <h3 className="t-sec" style={{ fontSize: 'clamp(26px,2.6vw,34px)' }}>
              Integriamo, miglioriamo, sostituiamo — in quest’ordine.
            </h3>
          </Reveal>
          <Group className="stack" delay={0.08} style={{ marginTop: 30 }}>
            {POSTURE.map((p) => (
              <Item key={p.t} style={{ display: 'flex', gap: 16 }}>
                <IconTile icon={p.icon} size="sm" ghost />
                <div>
                  <b style={{ fontWeight: 600, letterSpacing: '-0.015em' }}>{p.t}</b>
                  <p className="t-small" style={{ marginTop: 6 }}>
                    {p.d}
                  </p>
                </div>
              </Item>
            ))}
          </Group>
        </div>
        <ChatPreview />
      </div>
    </Section>
  );
}
