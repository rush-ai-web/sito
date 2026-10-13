# Performance rollout

The site is served by GitHub Pages behind Cloudflare. On 13 October 2026 the
live `/assets/*` responses had `Cache-Control: max-age=14400`; HTML had 600s.
GitHub Pages ignores `_headers` and `.htaccess`, so a repository change alone
cannot fix the browser-cache TTL reported by PageSpeed.

## Cloudflare setting still required

After publishing this build, in the **rush-ai.it** zone open **Caching → Cache
Rules** and add the rule in `cloudflare-cache-rule.json`. This is one rule,
not a replacement for the zone's existing ruleset. Preserve existing rules
and check that a later matching rule does not override it.

- Match only `/assets/` and `/docs/assets/` on the two named hosts.
- Cache eligibility: eligible.
- Browser TTL: override origin, **1 year (31536000 seconds)**.
- Keep the HTML, API, contact forms and other unversioned URLs out of this rule.

The build now gives logos content hashes just like JS and fonts. A changed
logo gets a new URL; the originals remain available for existing links. No
image pixels or dimensions are changed. Do not replace a hashed asset's
contents under the same filename. Cloudflare purges cannot clear browser caches.

Check one JS, font and logo URL with `curl -I` after applying the rule and
confirm `max-age=31536000`. Confirm `/` and `/ristorazione` retain their short
HTML TTL. This rule has not been applied by the code change.

Provider references:
[Cloudflare cache settings](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/),
[browser TTL](https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/).

## Code changes

- Consent defaults and listeners are inlined before the deferred CookieScript
  loader. The banner no longer blocks parsing of the initial HTML.
- GA4 is loaded once, during an idle opportunity, only after consent to the
  Performance category. Returning consent, partial consent, revocation and
  rejection are handled. This switches measurement to **basic consent mode**:
  visits without analytics consent no longer send Google's cookieless pings.
  The banner, measurement ID and analytics for consenting visitors remain.
- Vendor cache policies for `cdn.cookie-script.com`, Google scripts and
  Cloudflare's email protection script are controlled by their providers.
- Page-specific CSS pruning uses all reachable component source, including
  mobile layouts, themes, dialogs and form steps. Keep the safelist in
  `scripts/prerender.mjs` updated when adding dynamically assembled classes.
  Below-the-fold, interactive and responsive CSS is deliberately retained.
- Repeated JS license comments are consolidated in `THIRD_PARTY_NOTICES.txt`.
- Simple entrances and SVG drawing use shared IntersectionObservers and native
  browser animations, preserving distance, duration, easing and thresholds.
  Interactive/layout animations still use Motion. Content already visible
  from prerendering is never hidden again. Without animation APIs it stays visible.
- Feature-card and diagram loops pause individually offscreen, including on
  desktop. Pointer glow updates are limited to one per frame and to light
  layers; they no longer invalidate all card descendants.
- React media-query hooks share one listener per preference and start with the server
  snapshot during hydration, including reduced motion.

CookieScript API references:
[events](https://help.cookie-script.com/en/articles/30242-custom-events),
[current consent](https://help.cookie-script.com/en/articles/30246-custom-functions).

## Validation

Run `node --test tests/*.test.mjs` and `npm run build`. The build regenerates
the tracked `docs/` deployment, prerenders both pages, validates metadata and
anchors, and applies page-specific CSS and versioned logo URLs.

Before release check desktop and mobile, light/dark, reduced motion, navigation,
FAQ categories, pricing switch, feature dialogs, contact form steps and chat.
Compare section heights and computed styles with the prior build. Measure
scroll performance with the same browser, viewport and CPU throttling; local
Lighthouse results are not a promise of the production PageSpeed score.

### Checks completed for this change (13 October 2026)

- `npm test`: all 14 tests passed, including consent, native entrances,
  nested card/section animation lifecycle and existing mobile-keyboard checks.
- `npm run build` and `git diff --check` passed.
- Both pages at 1366x768 and 390x844: unchanged section heights and sampled
  computed styles versus `c73882c`; no JavaScript errors, missing assets or
  horizontal overflow. Light/dark, menu, FAQ, pricing, dialogs, chat and all
  contact-form steps were exercised without submitting a form.
- Reduced motion was checked both on first load and after changing the preference.
- All 6 home card/core entrances and all 22 restaurant card/tile entrances
  were scrolled into view and checked for final visibility.
- Real CookieScript banner: fresh visit/reject made no Google requests;
  accepting Performance loaded GA once; saved consent restored correctly;
  revocation disabled GA. Google requests were intercepted during this check,
  so test visits were not sent to production analytics.

Page-specific inline CSS fell from 144,210 bytes to 112,458 on home (-22%) and
94,762 on Ristorazione (-34%). These are uncompressed CSS sizes, not total
page-transfer savings.

Sequential local Lighthouse mobile runs (same Chrome, default Lighthouse
throttling, gzip server) measured Ristorazione LCP at 5.15s before / 2.96s
after and FCP at 2.93s / 1.91s. Its local performance score was 50 / 74.
The home baseline raised Lighthouse's slow-host-CPU warning, so its score
comparison is not treated as reliable. These are single local runs, not
production PageSpeed measurements or a guarantee on older physical devices.

After the changes both pages passed the render-blocking, JavaScript
minification and unused-CSS audits. No Google script loaded before consent.
Ristorazione still reports about 21 KiB of Motion code unused during initial
load; Motion remains necessary for the existing interactive effects.
Browser cache TTL is still a deployment action, not fixed by this local test.
