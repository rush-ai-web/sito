import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Wallet,
  Boxes,
  ScanLine,
  TrendingUp,
  ChefHat,
  CalendarClock,
  Trophy,
  MessageSquareText,
  FileSpreadsheet,
} from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

const inViewOnce = { once: true, amount: 0.3 };

function BuildCard({ icon, title, desc, accent = false, wide = false, children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      className={`buildcard card card--lg card--glow ${accent ? 'card--glow-accent buildcard--accent' : ''} ${wide ? 'buildcard--wide' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.6, ease: EASE_MODAL }}
    >
      <span className="buildcard__edge" aria-hidden="true" />
      <span className="buildcard__wash" aria-hidden="true" />
      <div className="buildcard__body">
        <div className="buildcard__head">
          <IconTile icon={icon} size="sm" accent={accent} />
          <h3 className="t-card">{title}</h3>
        </div>
        <p className="t-body buildcard__desc">{desc}</p>
      </div>
      {children ? (
        <div className="buildcard__viz" aria-hidden="true">
          {children}
        </div>
      ) : null}
    </motion.div>
  );
}

/* ── mini-viz: stessa "sfumatura bassa" a barre in ogni card, solo il
   pattern cambia, così tutte e sei restano identiche per stile e altezza ── */
function Bars({ values }) {
  return (
    <div className="rh-bars">
      {values.map((h, i) => (
        <span key={i} className="rh-bars__b" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

const VizIncassi = () => <Bars values={[52, 61, 48, 72, 66, 88, 79]} />;
const VizMagazzino = () => <Bars values={[70, 45, 90, 30, 55, 80, 60]} />;
const VizFatture = () => <Bars values={[40, 55, 35, 70, 60, 85, 50]} />;
const VizFornitori = () => <Bars values={[30, 35, 45, 60, 55, 75, 90]} />;
const VizMenu = () => <Bars values={[90, 40, 65, 25, 80, 50, 35]} />;
const VizTurni = () => <Bars values={[60, 80, 45, 90, 70, 55, 85]} />;

/* voci core minori, in una striscia compatta sotto al bento */
const ALTRO = [
  { Icon: Trophy, t: 'Performance camerieri', d: 'scontrino medio, upselling e classifiche dai dati cassa' },
  { Icon: MessageSquareText, t: 'Dashboard + chat AI', d: 'sei KPI in home e una barra AI che risponde su tutto' },
  { Icon: FileSpreadsheet, t: 'Report per il commercialista', d: 'pacchetto mensile, registro fatture, chiusure cassa' },
];

export default function CoreRisto() {
  return (
    <Section id="prodotto" grid large>
      <Head
        icon={LayoutGrid}
        label="Il core · sempre incluso"
        title={<>Tutto il locale in un posto solo, aggiornato da sé</>}
        sub={
          <>
            Le funzioni che Rush fa <strong>sempre</strong>, comprese nel canone base. I moduli
            extra si accendono quando servono.
          </>
        }
      />

      <div className="build">
        <BuildCard icon={Wallet} title="Registra costi e incassi" desc="Si collega alla tua cassa e alle fatture in arrivo: incassi e spese si registrano da soli, così sai sempre quanto guadagni davvero, non a fine mese.">
          <VizIncassi />
        </BuildCard>

        <BuildCard icon={Boxes} title="Magazzino automatico" desc="Si carica dalle fatture e si scarica dalle vendite. Soglie minime, alert e scarti a fine inventario per stanare furti e sprechi.">
          <VizMagazzino />
        </BuildCard>

        <BuildCard icon={ScanLine} title="Fatture con una foto" desc="Le elettroniche arrivano da sole via SDI. Le cartacee le scatti col telefono: OCR + AI estraggono i dati, tu confermi, il magazzino si aggiorna." accent>
          <VizFatture />
        </BuildCard>

        <BuildCard icon={TrendingUp} title="Fornitori & prezzi" desc="Rush confronta ogni riga fattura con lo storico e ti avvisa quando un fornitore alza i prezzi oltre soglia. Con bozza d'ordine pronta.">
          <VizFornitori />
        </BuildCard>

        <BuildCard icon={ChefHat} title="Ricette, food cost & menu" desc="Costo materie prime per piatto aggiornato a ogni fattura, margini reali e menu engineering: stelle, puzzle, cavalli e cani, in automatico.">
          <VizMenu />
        </BuildCard>

        <BuildCard icon={CalendarClock} title="Personale & turni AI" desc="Turni generati dall'AI su ore e vincoli, timbrature via QR con check WiFi, richieste ferie e export presenze pronto per le paghe.">
          <VizTurni />
        </BuildCard>
      </div>

      <div className="rh-altro">
        {ALTRO.map(({ Icon, t, d }) => (
          <motion.div
            key={t}
            className="rh-altro__item"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE_MODAL }}
          >
            <span className="rh-altro__ic">
              <Icon size={17} strokeWidth={1.9} />
            </span>
            <span className="rh-altro__tx">
              <strong>{t}</strong>
              {d}
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
