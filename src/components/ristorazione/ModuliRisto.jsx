import { Puzzle, Globe, CalendarCheck, Users, Mail, QrCode, Star } from 'lucide-react';
import { Section, Head, Group, DecoratorCard } from '../ui';

const MODULI = [
  {
    icon: Globe,
    t: 'Sito web',
    d: 'Il sito del locale da template Rush (elegante, casual, cocktail bar, brasserie, moderno). Personalizzi colori, logo, foto e testi, integrato con menu e orari.',
  },
  {
    icon: CalendarCheck,
    t: 'Prenotazioni',
    d: 'Prenotazioni online e telefoniche in un posto, reminder anti no-show, eventi con pagamento anticipato via Stripe e QR di check-in.',
  },
  {
    icon: Users,
    t: 'CRM clienti',
    d: 'Registro clienti da prenotazioni ed eventi: visite, spesa media, compleanni. Segmentazione automatica VIP, nuovi e a rischio churn.',
  },
  {
    icon: Mail,
    t: 'Email marketing',
    d: 'Template pronti (recensione, promo, compleanno, "ci manchi"), campagne segmentate sui dati CRM e consensi GDPR gestiti come si deve.',
  },
  {
    icon: QrCode,
    t: 'Menu QR digitale',
    d: 'Il cliente inquadra e vede il menu con foto, allergeni e disponibilità in tempo reale. Multilingua con traduzione AI automatica.',
  },
  {
    icon: Star,
    t: 'Monitoraggio recensioni',
    d: 'Recensioni da Google, TripAdvisor, TheFork e Facebook in un posto, notifica sulle negative e risposta AI suggerita. Sentiment nel tempo.',
  },
];

export default function ModuliRisto() {
  return (
    <Section id="moduli" grid large>
      <Head
        icon={Puzzle}
        label="Moduli opzionali"
        title={<>Cresci un pezzo alla volta, quando serve</>}
        sub={
          <>
            Il core copre tutto il necessario. <strong>I moduli extra si accendono a scelta</strong>,
            così parti dall'essenziale e aggiungi solo ciò che ti serve davvero.
          </>
        }
      />

      <Group className="grid grid-3 grid--deco" each={0.08}>
        {MODULI.map(({ icon, t, d }) => (
          <DecoratorCard key={t} icon={icon} title={t}>
            {d}
          </DecoratorCard>
        ))}
      </Group>
    </Section>
  );
}
