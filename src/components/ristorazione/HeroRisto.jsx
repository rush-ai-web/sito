import { motion } from 'framer-motion';
import {
  ArrowDown,
  UtensilsCrossed,
  Sparkles,
  TrendingUp,
  Boxes,
  Coins,
} from 'lucide-react';
import { wordUp, fadeUp, EASE_MODAL } from '../../lib/motion';

/* titolo composto parola per parola, come nella home */
const TITLE = ['Il', 'cervello', 'del', 'tuo', 'locale.'];

function Word({ w, i }) {
  return (
    <span className="hero__word">
      <motion.span style={{ display: 'inline-block' }} variants={wordUp} custom={i} initial="hidden" animate="show">
        {w}
      </motion.span>
    </span>
  );
}

/* mini-dashboard: tre KPI + una risposta della chat AI. Puro CSS/markup,
   coerente con le card del sito. */
function HeroMock() {
  const kpis = [
    { Icon: Coins, k: 'Margine lordo', v: '68,4%', d: '+3,1%', up: true },
    { Icon: Boxes, k: 'Food cost', v: '27,9%', d: '−1,4%', up: true },
    { Icon: TrendingUp, k: 'Incassi mese', v: '€ 42.180', d: '+9%', up: true },
  ];
  return (
    <motion.div
      className="rh-mock"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE_MODAL, delay: 0.4 }}
    >
      <div className="rh-mock__bar" aria-hidden="true">
        <span className="rh-mock__dot" />
        <span className="rh-mock__dot" />
        <span className="rh-mock__dot" />
        <span className="rh-mock__title">Rush · Caffè Centrale</span>
      </div>

      <div className="rh-mock__body">
        <div className="rh-mock__kpis">
          {kpis.map(({ Icon, k, v, d, up }) => (
            <div className="rh-mock__kpi" key={k}>
              <span className="rh-mock__kpi-ic">
                <Icon size={15} strokeWidth={2} />
              </span>
              <span className="rh-mock__kpi-k">{k}</span>
              <span className="rh-mock__kpi-v">{v}</span>
              <span className={`rh-mock__kpi-d ${up ? 'is-up' : 'is-down'}`}>{d}</span>
            </div>
          ))}
        </div>

        <div className="rh-mock__chat">
          <div className="rh-mock__q">Chi mi ha alzato i prezzi questo mese?</div>
          <div className="rh-mock__a">
            <span className="rh-mock__a-ic">
              <Sparkles size={14} strokeWidth={2} />
            </span>
            <span>
              <strong>Distillerie Rossi</strong>: Gin +18% vs media. Anche
              <strong> Latteria Bianchi</strong>: burro +11%. Vuoi che prepari una mail?
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroRisto() {
  return (
    <section id="home" data-tone="light" className="section hero fx-grain">
      <span className="hero__aurora" aria-hidden="true" />

      <div className="wrap hero__wrap">
        <motion.div className="hero__logo-eyebrow" variants={fadeUp} custom={0} initial="hidden" animate="show">
          <span className="chip chip--surface" style={{ fontSize: 14 }}>
            <UtensilsCrossed size={14} strokeWidth={1.9} />
            Rush Ristorazione
          </span>
        </motion.div>

        <h1 className="hero__title">
          <span className="hero__line">
            {TITLE.slice(0, 3).map((w, i) => (
              <Word key={w + i} w={w} i={i} />
            ))}
            <span className="hero__br" aria-hidden="true" />
            {TITLE.slice(3).map((w, i) => (
              <Word key={w + i + 3} w={w} i={i + 3} />
            ))}
          </span>
        </h1>

        <motion.p className="hero__note" variants={fadeUp} custom={0} initial="hidden" animate="show">
          <strong>Non sostituisce la cassa che già usi: la fa parlare col resto.</strong>{' '}
          <br className="hero-note-break" />
          Rush collega incassi, fatture e magazzino e ci aggiunge sopra l'AI che ti dice come sta
          andando davvero il locale.
        </motion.p>

        <motion.div className="btn-row hero__cta" variants={fadeUp} custom={9} initial="hidden" animate="show">
          <a className="btn btn--hero btn--accent" href="#contatti">
            Prenota una demo
            <span className="btn__badge">
              <ArrowDown size={16} strokeWidth={2.2} />
            </span>
          </a>
          <a className="btn btn--primary btn--hero" href="#metodo">
            Scopri come funziona
            <span className="btn__badge">
              <ArrowDown size={16} strokeWidth={2.2} />
            </span>
          </a>
        </motion.div>
      </div>

      <motion.div
        className="hero__stage"
        initial={{ opacity: 0, y: 44 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_MODAL, delay: 0.4 }}
      >
        <span className="hero__beam" aria-hidden="true" />
        <div className="wrap">
          <HeroMock />
        </div>
      </motion.div>
    </section>
  );
}
