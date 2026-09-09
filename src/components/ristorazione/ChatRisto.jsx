import { motion } from 'framer-motion';
import { Sparkles, BellRing, ArrowUp } from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const CHAT = [
  {
    role: 'alert',
    t: (
      <>
        Il food cost della <strong>tartare</strong> è salito al 42% questo mese: il tonno costa il
        18% in più da Distillerie Rossi. Vuoi che ti proponga un piatto con margine simile?
      </>
    ),
  },
  { role: 'q', t: 'Qual è il piatto del brunch più redditizio?' },
  {
    role: 'a',
    t: (
      <>
        Il <strong>pancake salato</strong>: margine 74%, 128 venduti a settembre. Il meno redditizio
        è proprio la <strong>tartare</strong> di cui ti ho appena parlato.
      </>
    ),
  },
  { role: 'q', t: 'Quante ore ha fatto Marco questo mese?' },
  {
    role: 'a',
    t: (
      <>
        Marco è a <strong>142 ore</strong>, 6 sopra il monte ore contrattuale. Le 3 recensioni lente
        del brunch della domenica erano tutte su suoi turni.
      </>
    ),
  },
];

const SUGGESTS = [
  'Quanto ho speso in Campari questo mese?',
  'Cosa sta per finire in magazzino?',
  'Chi è la mia cameriera con più upselling?',
  'Prepara gli ordini fornitori della settimana',
];

export default function ChatRisto() {
  return (
    <Section id="chat" large>
      <Head
        icon={Sparkles}
        label="La chat AI"
        title={<>Non solo risposte. Anche segnalazioni e consigli, da sola</>}
        sub={
          <>
            Chiedi come parli e ti risponde con i numeri veri, ma non aspetta che tu chieda:{' '}
            <strong>accede da sola a fatture, magazzino, vendite, cassa, ricette e personale,
            li analizza e ti avvisa se qualcosa non torna</strong>, con un consiglio pronto,
            prima ancora che tu te ne accorga.
          </>
        }
      />

      <motion.div
        className="rh-chat card card--lg contrast-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.65, ease: EASE_MODAL }}
      >
        <div className="rh-chat__thread">
          {CHAT.map((m, i) => (
            <motion.div
              key={i}
              className={`rh-chat__msg rh-chat__msg--${m.role}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, ease: EASE_MODAL, delay: i * 0.12 }}
            >
              {m.role !== 'q' && (
                <span className="rh-chat__ai" aria-hidden="true">
                  {m.role === 'alert' ? (
                    <BellRing size={14} strokeWidth={2} />
                  ) : (
                    <Sparkles size={14} strokeWidth={2} />
                  )}
                </span>
              )}
              <span className="rh-chat__bubble">
                {m.role === 'alert' && <span className="rh-chat__flag">Rush nota da solo</span>}
                {m.t}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="rh-chat__bar">
          <span className="rh-chat__input">Chiedi qualsiasi cosa sul tuo locale…</span>
          <span className="rh-chat__send" aria-hidden="true">
            <ArrowUp size={16} strokeWidth={2.4} />
          </span>
        </div>
      </motion.div>

      <div className="rh-suggests">
        {SUGGESTS.map((s) => (
          <span className="chip chip--surface" key={s}>
            {s}
          </span>
        ))}
      </div>
    </Section>
  );
}
