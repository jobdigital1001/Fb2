# PV-Rechner 2026 / 2027

One self-contained `index.html` (styles and script inline). No build step, no external requests, no cookies.

## Before going live
- Check the two 2026 tariff defaults against the current Bundesnetzagentur table.
- The 2027 fields default to 0 ct because the draft law does not state the transitional payment. Set real values once the law is passed.
- The self-consumption model is a rough approximation. Compare three example roofs with a tool you trust.
- White-label link: `https://DOMAIN/pv-rechner/?name=Solar%20Muster%20GmbH&farbe=0b7a53&kontakt=Tel.%200123`
- Create `/impressum` and `/datenschutz` on the domain, or change the two footer links.
- Update `STAND` at the top of the `<script id="logic">` block when rules or parameters change.

## Upload to IONOS
1. Connect by SFTP or open the Webspace Explorer.
2. Create the folder `pv-rechner` in the web root of the domain.
3. Upload `index.html` into it.
4. Open `https://DOMAIN/pv-rechner/` on a phone and run through once.

## Test
```
node test.js
```
