import { motion } from 'framer-motion';
import { Sparkles, BellRing, ArrowUp } from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const CHAT = [
  {
    role: 'alert',
    t: (
      <>
        Il food cost della <strong>tartare</strong> è salito al 42% questo mese. Il prezzo del
        tonno dal tuo fornitore è aumentato del 18%. Vuoi confrontare costi e porzioni o valutare
        un’alternativa?
      </>
    ),
  },
  { role: 'q', t: 'Qual è il piatto del brunch con il margine percentuale più alto?' },
  {
    role: 'a',
    t: (
      <>
        Il <strong>pancake salato</strong>: margine sulle materie prime del 74%, con 128 porzioni
        vendute a settembre. Vuoi confrontarlo con la tartare per valutare costi e prezzo di vendita?
      </>
    ),
  },
  { role: 'q', t: 'Quante ore ha fatto Marco questo mese?' },
  {
    role: 'a',
    t: (
      <>
        Marco ha registrato <strong>142 ore</strong>, 6 oltre il monte ore contrattuale. Nei suoi
        turni risultano anche 3 recensioni che citano attese al brunch della domenica: possiamo
        confrontare affluenza e copertura del servizio prima di trarre conclusioni.
      </>
    ),
  },
];

const SUGGESTS = [
  'Quanto ho speso in Campari questo mese?',
  'Quali scorte sono sotto soglia?',
  'Quali vendite aggiuntive risultano per addetto?',
  'Prepara una proposta d’ordine per i fornitori.',
];

export default function ChatRisto() {
  return (
    <Section id="chat" large>
      <Head
        icon={Sparkles}
        label="Rush AI"
        title={<>I dati sono collegati,{' '}<br className="desktop-title-break" />l’AI ti aiuta a capire cosa fare</>}
        className="head--chat-risto"
        sub={
          <>
            Chiedi quali costi sono aumentati, cosa va riordinato o come stanno andando le vendite.
            RUSH legge i dati collegati, segnala le anomalie previste dai controlli attivi e prepara
            proposte da valutare. <strong>Tu hai le informazioni e mantieni il controllo sulle decisioni.</strong>
          </>
        }
      />

      <motion.div
        className="rh-chat card card--lg contrast-card"
        initial={{ opacity: 0, transform: 'translateY(24px)' }}
        whileInView={{ opacity: 1, transform: 'none' }}
        viewport={inView}
        transition={{ duration: 0.65, ease: EASE_MODAL }}
      >
        <div className="rh-chat__thread">
          {CHAT.map((m, i) => (
            <motion.div
              key={i}
              className={`rh-chat__msg rh-chat__msg--${m.role}`}
              initial={{ opacity: 0, transform: 'translateY(12px)' }}
              whileInView={{ opacity: 1, transform: 'none' }}
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
          <span className="rh-chat__input">Fai una domanda sui dati del tuo locale…</span>
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
