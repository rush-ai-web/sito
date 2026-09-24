# Scroll performance regression checks

Run `node --test tests/motion-lifecycle.test.mjs` and `npm run build`.
The lifecycle test covers offscreen CSS/SVG animation suspension, re-entry,
background-tab suspension and effect cleanup/remount (React StrictMode).

Browser checks performed on both landing pages at 1366×768 and 390×844:

- Main content and section heights compared with the previous build (b56ff91).
- No horizontal overflow or JavaScript exceptions.
- Mobile menu, section anchors and 96px navbar offset.
- FAQ expansion and category selection, feature details, chat open/close,
  billing selection and light/dark theme.
- Dashboard remains unchanged for five seconds offscreen, resumes in view,
  and stops updating when the document becomes hidden.

Performance comparison uses Chrome headless on Windows, a fresh context per
page, disabled browser cache and 4× CPU throttling. Scroll with 45 wheel inputs
of 440px, 320ms apart, after loading the page and dismissing consent. For a
mobile-size comparison use a touch-enabled 390×844 viewport; this is responsive
emulation, not a physical phone/GPU benchmark. Compare long tasks (>50ms),
layout/style/script work and active animations, not just average FPS.

Desktop first-pass results: long tasks during the scripted scroll fell from
199 to 83 on the home page and from 186 to 74 on Ristorazione. At the bottom,
running animations fell from 87 to 3 and from 41 to 3 respectively. These are
single-run diagnostic results, not a universal frame-rate guarantee; repeat
on the target Windows laptop and phone with cold and warm caches.

With the same wheel sequence in mobile viewport emulation, long tasks fell
from 182 to 117 (home) and from 182 to 77 (Ristorazione). Native touch gesture
latency on a real phone was not measured.

Implementation deliberately retains content, section geometry and entrance
animations. Wheel/touch scrolling is native, while menu links still scroll
smoothly. Decorative loops and demo timers pause outside the viewport or in
hidden tabs. KPI text updates bypass React rendering on every frame, chart
bars use transforms, animated gradient angles no longer invalidate entire
descendant trees, and image decoding is left to browser prioritization.
