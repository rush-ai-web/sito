# Scroll jank follow-up — 13 October 2026

Baseline: production commit `53b1b9e`. This follow-up addresses scroll-time
work on both home and `/ristorazione`, not the initial-load Lighthouse score.

## Changes

- Shared section headings, grouped cards and pricing entrances now use the
  native entrance observer too. A group has one observer target with native
  child animations; entering no longer propagates Motion variants through
  the React component tree. Original direction, duration, easing and stagger
  are retained, as are static mobile headings and pricing cards.
- Entrance observers read viewport dimensions only for initialization and
  before any visibility writes, never for subsequent scroll crossings.
- Navbar width listens to scroll only within its original 0–220px range.
  The back-to-top trigger uses intersection/resize observers, with no normal
  scroll handler. Its home-section and restaurant-midpoint thresholds remain.
- The Method timeline uses cached geometry supplied by observers and only
  tracks scroll while visible. Start-center/end-center progress is unchanged.
- Orbital cards write the non-inherited `translate` property instead of two
  inherited custom properties each frame, avoiding descendant style work.
  Orbit, hover lift, click focus and reduced-motion positions are retained.
- Mobile keyboard handling batches viewport reads before class changes and
  skips viewport geometry altogether on desktop.
- Demo-dashboard alert layout measurements run when the alert list changes,
  not when visibility pauses its timers. Its always-fixed navigation highlight
  is plain DOM, rather than a shared-layout animation that never moves.

No content, section layout, theme, cookie-consent behavior or analytics
configuration changes. No blanket removal of decorative effects or animations.
The build regenerates the tracked GitHub Pages deployment in `docs/`.

## Regression verification

- `npm test`: 19 passing tests. New cases cover grouped entrances and stagger,
  no viewport reads at entry, observer cleanup, navbar clamping/listener
  suspension, back-to-top thresholds and timeline progress/fallback.
- `npm run build` and `git diff --check` pass.
- Chrome browser checks at 1366×844 and 390×844 on both routes: section
  heights and sampled computed styles match the production baseline;
  no horizontal overflow, JavaScript exceptions or missing local assets.
- Light/dark, mobile menu, FAQ tabs/expansion, pricing selection, feature
  dialogs, chat and contact-form steps tested; no form was submitted.
- First-load reduced motion and changing that preference after load tested.
- Both demo dashboards checked on desktop/mobile: three non-overlapping
  alert rows, continued visible updates, offscreen pause and resume on return.
- Dedicated scroll checks cover 46 home / 49 restaurant entry targets on
  desktop and 45 / 49 on mobile, navbar widths at 0/110/300/3000px, instant
  jumps past back-to-top thresholds, reverse timeline progress, and exact
  orbital positions against the baseline with reduced motion.

## Performance methodology and limits

Sequential, fresh Chrome headless contexts on Windows; local gzip servers
with baseline and candidate builds, viewport 1366×768 or 390×768, 4× CPU
throttling. Wait for hydration and initial activity, then send 52 wheel
inputs of 280px, 160ms apart, with the pointer at the viewport edge.
Record long tasks (>50ms), Long Animation Frames and a DevTools trace.
Third-party CMP/analytics requests are blocked equally in both builds to
isolate site scrolling. Tests are run sequentially, not concurrently.

These are single-run diagnostics, not real iPhone/Android/Mac GPU benchmarks
or a guaranteed frame rate. Host load and CPU throttling affect wall-clock
times. Mobile viewport emulation still uses scripted wheel input, not native
touch latency. Check the published site on physical devices as well.

In the final 4× CPU stress sequence the long-task counts were 94→77 on
desktop home, 59→56 on desktop restaurant, 113→81 on mobile-size home and
113→58 on mobile-size restaurant. However, duration/forced-layout results
varied substantially across runs, especially on desktop, and maximum task
duration did not improve consistently. They do **not** establish a universal
percentage speedup or prove that all scroll stalls are eliminated. The code
removes the identified redundant work; validate perceived smoothness on the
affected physical devices after deployment.

A separate sequential desktop comparison without artificial CPU throttling
used the same wheel sequence. DevTools' summed `FunctionCall` time fell from
343ms to 175ms on home and 191ms to 86ms on restaurant. Long Animation Frame
script-attributed forced-layout time fell from 24ms/20ms to less than 0.5ms
on each page (rounded to 0ms). Both builds had zero >50ms long tasks in this
unthrottled run, so it does not reproduce the user's stalls on older devices.
These figures describe sampled JavaScript work, not a 2× overall site speedup;
rendering/painting costs and the third-party consent script remain separate.

The 62ms CookieScript forced-layout item reported by PageSpeed comes from
provider-hosted code. This patch does not edit, proxy or disable that vendor
script. Its initialization cost is separate from the site's scroll-time work.
