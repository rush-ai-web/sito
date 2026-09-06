import { motion } from 'framer-motion';
import { Workflow, Plug, Database, BellRing, MessageSquareText } from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const STEPS = [
  {
    Icon: Plug,
    t: 'Colleghi cassa e fatture',
    d: 'Rush si aggancia in sola lettura ai sistemi che già usi. All\'avvio importiamo 3-6 mesi di fatture storiche, così parte già ricco di dati.',
  },
  {
    Icon: Database,
    t: 'Rush legge e mette in ordine',
    d: 'Vendite, magazzino, ricette, prezzi fornitori: tutto collegato e aggiornato ogni pochi minuti. Il food cost si ricalcola da solo a ogni fattura nuova.',
  },
  {
    Icon: BellRing,
    t: 'Ti avvisa prima che sia tardi',
    d: 'Scorte sotto soglia, aumenti prezzo oltre la soglia, fatture in scadenza, scarti anomali a fine inventario. Gli alert arrivano mentre puoi ancora agire.',
  },
  {
    Icon: MessageSquareText,
    t: 'Chiedi e decidi',
    d: 'La barra AI risponde a parole tue con numeri veri e le fonti, e ti propone l\'azione: prepara l\'ordine, scrivi al fornitore, rivedi il menu.',
  },
];

export default function ComeRisto() {
  return (
    <Section id="metodo" grid large>
      <Head
        icon={Workflow}
        label="Come funziona"
        title={<>Dal caos dei dati alle decisioni, in quattro passi</>}
        sub="Nessun cambio di abitudini per il team. Rush lavora dietro le quinte sui dati che già produci ogni giorno."
      />

      <div className="rh-steps">
        <div className="prezzi2__steps">
          {STEPS.map(({ Icon, t, d }, i) => (
            <motion.div
              key={t}
              className="prezzi2__step"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.55, ease: EASE_MODAL, delay: i * 0.08 }}
            >
              <div className="prezzi2__step-track">
                <span className="prezzi2__step-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <span className="prezzi2__step-line" aria-hidden="true" />
              </div>
              <div className="prezzi2__step-body">
                <p className="prezzi2__step-t">{t}</p>
                <p className="prezzi2__step-d">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
