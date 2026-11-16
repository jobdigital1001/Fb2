// Runs the pure logic blocks of both tools in Node. Usage: node test.js
const fs = require("fs");
const assert = require("assert");

function loadLogic(file) {
  const html = fs.readFileSync(file, "utf8");
  const m = html.match(/<script id="logic">([\s\S]*?)<\/script>/);
  const mod = { exports: {} };
  new Function("module", m[1])(mod);
  return { api: mod.exports, html };
}

// ---------- PV-Rechner ----------
const pv = loadLogic(__dirname + "/index.html");
const { energy, tariff2026, economics, rates2026, rates2027 } = pv.api;
const e1 = energy(10, 950, 4500, 0);
const e2 = energy(10, 950, 4500, 8);
console.log("\n10 kWp, 4.500 kWh, ohne Speicher:", Math.round(e1.self), "kWh selbst,", Math.round(e1.autarky * 100) + " % Autarkie");
console.log("10 kWp, 4.500 kWh, 8 kWh Speicher:", Math.round(e2.self), "kWh selbst,", Math.round(e2.autarky * 100) + " % Autarkie");
assert(Math.abs(e1.self + e1.feed - 9500) < 1e-6);
assert(e2.self > e1.self && e2.autarky <= 0.95);
assert(energy(2, 950, 20000, 20).self <= 1900 + 1e-9); // never more than produced
assert(Math.abs(tariff2026(10, 7.7, 6.66) - 7.7) < 1e-9);
assert(Math.abs(tariff2026(20, 7.7, 6.66) - 7.18) < 1e-9);
const a = economics(e1, 35, 16000, rates2026(10, 7.7, 6.66));
const b = economics(e1, 35, 16000, rates2027(0, 3, 0));
console.log("Amortisation 2026:", a.payback.toFixed(1), "Jahre | Entwurf 2027 (0 ct):", b.payback === null ? "über 20" : b.payback.toFixed(1), "Jahre");
// hand check: yearly = self*0.35 + feed*0.077
const yearly = e1.self * 0.35 + e1.feed * 0.077;
assert(Math.abs(a.payback - 16000 / yearly) < 1e-6);
assert(Math.abs(a.net20 - (20 * yearly - 16000)) < 1e-6);
assert(b.net20 < a.net20);

for (const t of [pv]) {
  assert(!/(src|href)="https?:\/\//.test(t.html), "external request found");
  assert(!/localStorage|document\.cookie|fetch\(|XMLHttpRequest/.test(t.html), "storage or network call found");
  assert(!/rechtssicher|garantiert|zertifiziert|offiziell/i.test(t.html), "forbidden wording found");
}
console.log("\nAlle Tests bestanden.");
