[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/xeraaGH/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/xeraaGH/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

# Bargain Lantern — Black Friday Deal Finder

A static deal finder for Black Friday & Cyber Monday 2026: 44 real deals across 6 stores and 10 categories, each price-checked on 27 November 2026 at its store or in a deals roundup that names the store. Every card shows the product, store, sale price, usual price, discount, a store link and when the price was checked — plus an honest verdict (true low, strong deal or routine sale) with the evidence behind it. Search and filters by category, store, discount and verdict all work, and deals can be sorted by discount, verdict, saving or price. Opening a deal shows a side-by-side comparison of the same product at every store that carries it, cheapest first, each with its own store link.

Bounty: https://make.fun/c/black-friday-deal-finder-01

## Run it

Any static server works — `app/` is the site root, no build step, no network requests:

```sh
node serve.ts
```

then open http://localhost:8080 in a browser (add `--port` for another port). The layout works on desktop and on a phone.

## Layout

- `app/index.html` — page shell, toolbar and method note
- `app/deals.js` — the 44 checked deals (product, store, prices, verdict, evidence, source)
- `app/filters.js` — discount maths, filtering and sorting (pure functions)
- `app/render.js` — deal cards and the detail view with cross-store comparison
- `app/main.js` — toolbar wiring, hash routing, counts
- `app/style.css` — the lantern-night theme
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json`
- `screenshots/` — 4 real renders of the site (desktop cover, filtered view, deal detail, phone)
