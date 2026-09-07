/* Schermata di caricamento iniziale, condivisa da home e landing.
   Combina l'anello rotante d'accento (già nel tema del sito) con
   un'etichetta che si accende lettera per lettera - stessa idea di
   un loader "AI typing", ma nei colori e nel font del brand. */
export default function BootScreen({
  label = 'Prepariamo il tuo gestionale',
  ariaLabel = 'Caricamento del sito Rush',
  logoLight = './rush-logo-192.png',
  logoDark = './rush-logo-dark-192.png',
}) {
  const letters = Array.from(label);

  return (
    <div className="boot-screen" role="status" aria-live="polite" aria-label={ariaLabel}>
      <div className="boot-screen__mark" aria-hidden="true">
        <img className="boot-screen__logo boot-screen__logo--light" src={logoLight} width="192" height="48" alt="" />
        <img className="boot-screen__logo boot-screen__logo--dark" src={logoDark} width="192" height="48" alt="" />
      </div>

      <span className="boot-screen__label" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="boot-screen__letter" style={{ animationDelay: `${i * 0.045}s` }}>
            {ch}
          </span>
        ))}
      </span>

      <span className="boot-screen__progress" aria-hidden="true">
        <i />
      </span>
    </div>
  );
}
