# Claude SEO plugin

Installato nel repo da https://github.com/AgriciDaniel/claude-seo (MIT License), versione v2.6.3.

Contiene 29 skill (`.claude/skills/seo*`) e 20 agenti (`.claude/agents/seo-*.md`) per audit SEO tecnico,
qualità contenuti (E-E-A-T), schema markup, sitemap, GEO (AI Overviews/ChatGPT/Perplexity), SEO locale,
e-commerce, backlink, hreflang e pianificazione contenuti/blog.

Comando principale: `/seo <sotto-comando> <url>` (es. `/seo plan blog`, `/seo content-brief <topic>`,
`/seo cluster <keyword>`, `/seo audit <url>`).

Prima di usare gli script Python bundle (analisi tecniche, rendering headless), esegui una volta:
`/seo setup` — prepara l'ambiente Python e il browser headless senza toccare il resto del sistema.
Verifica lo stato con `/seo doctor`.

Alcune sotto-skill (seo-ahrefs, seo-dataforseo, seo-seranking, seo-profound, seo-bing, seo-matomo,
seo-posthog, seo-firecrawl, seo-image-gen, seo-shopify, seo-unlighthouse) sono estensioni opzionali
che richiedono API key o MCP server esterni — non necessarie per iniziare, utili per dati live.
