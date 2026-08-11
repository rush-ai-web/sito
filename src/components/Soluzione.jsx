import { motion, useReducedMotion } from 'framer-motion';
import {
  Lightbulb,
  Blocks,
  Activity,
  Workflow,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { Section, Head, IconTile } from './ui';
import { floatIn } from '../lib/motion';

/* Le sei card che orbitano attorno al titolo. `pos` è la
   posizione assoluta sul desktop; sotto i 1160px l'orbita si
   spegne e diventano una griglia. */
const ORBIT = [
  { icon: Blocks, t: 'Costruito sui tuoi\nprocessi reali', pos: { top: '4%', left: '30%' } },
  { icon: Activity, t: 'Dati aggiornati\nal secondo', pos: { top: '20%', left: '0%' } },
  { icon: Workflow, t: 'Automazioni al posto\ndel lavoro manuale', pos: { top: '17%', right: '0%' } },
  { icon: Sparkles, t: 'AI integrata\ndove serve davvero', pos: { bottom: '18%', left: '1%' } },
  { icon: ShieldCheck, t: 'Il software resta\ntuo, non in affitto', pos: { bottom: '20%', right: '1%' } },
  { icon: Smartphone, t: 'Stessa esperienza\nda desktop e mobile', pos: { bottom: '2%', left: '31%' } },
];

export default function Soluzione() {
  const reduce = useReducedMotion();

  return (
    <Section id="soluzione" large spot>
      <div className="orbit">
        {ORBIT.map(({ icon, t, pos }, i) => (
          <motion.div
            key={t}
            className="orbit__card"
            style={pos}
            variants={floatIn}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* respiro continuo: ogni card ondeggia con un ritmo suo */}
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: 14 }}
              animate={reduce ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 5.4 + i * 0.6, ease: 'easeInOut', repeat: Infinity, delay: i * 0.35 }}
            >
              <IconTile icon={icon} size="sm" />
              <span>
                {t.split('\n').map((line, k) => (
                  <span key={k} style={{ display: 'block' }}>
                    {line}
                  </span>
                ))}
              </span>
            </motion.div>
          </motion.div>
        ))}

        <Head
          icon={Lightbulb}
          label="La soluzione"
          title={
            <>
              Un gestionale disegnato
              <br />
              attorno a come lavori già
            </>
          }
          sub="Partiamo dai tuoi processi, non da un template. Quello che serve c'è, quello che non serve non lo paghi."
        />
      </div>
    </Section>
  );
}
