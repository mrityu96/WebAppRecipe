/* Sattvic Kitchen — nutrition calculator
   Usage (from the project folder):
     node tools/nutrition/compute.js            check every dish, list lowest/highest kcal and any problems
     node tools/nutrition/compute.js --all      print every dish
     node tools/nutrition/compute.js --write    store per-serving "nutrition" in js/data.js
   How it works: each ingredient row is matched (by its English name before the comma) to a food in
   ingredient-map.json, converted to grams with that food's unit weights, and summed using the per-100 g
   values in foods.json (USDA FoodData Central SR Legacy + IFCT 2017-based entries). Salt "to taste" = 1 g
   per serving. If you add a new ingredient, add it to ingredient-map.json (and foods.json if needed). */
const fs = require("fs"), path = require("path");
const DATA = path.join(__dirname, "../../js/data.js");
const src = fs.readFileSync(DATA, "utf8");
const header = src.slice(0, src.indexOf("window.SATTVIC_DATA"));
global.window = {}; eval(src);
const D = window.SATTVIC_DATA;
const FOODS = JSON.parse(fs.readFileSync(path.join(__dirname, "foods.json"), "utf8"));
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "ingredient-map.json"), "utf8"));
const conflicts = [];
const NUTS = ["kcal", "protein", "carbs", "fat", "fiber", "sugar", "satFat", "sodium", "potassium", "calcium", "iron", "magnesium", "zinc", "vitA", "vitC", "folate", "vitB12"];
const food = (id) => FOODS[id];
const keyOf = (en) => {
  const full = en.toLowerCase();
  let k = full.replace(/\(.*?\)/g, " ").split(",")[0].replace(/\s+/g, " ").trim();
  if (/\b(cooked|boiled|steamed)\b/.test(full) && !/\b(cooked|boiled)\b/.test(k)) k += " (cooked)";
  return k;
};
const FR = { "½": 0.5, "¼": 0.25, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3 };
function parseQty(q) {
  const s = q.toLowerCase().trim();
  if (/to taste/.test(s)) return [1, "to taste"];
  if (/as needed/.test(s)) return [1, "as needed"];
  const num = (t) => { const m = t.match(/^(\d+(?:\.\d+)?)?\s*([½¼¾⅓⅔])?/); return m && (m[1] || m[2]) ? Number(m[1] || 0) + (FR[m[2]] || 0) : null; };
  let n = num(s), rest = s.replace(/^[\d.]*\s*[½¼¾⅓⅔]?/, "").trim();
  const range = rest.match(/^[-–]\s*(\d+(?:\.\d+)?)/);
  if (range) { n = (n + Number(range[1])) / 2; rest = rest.replace(/^[-–]\s*\d+(?:\.\d+)?/, "").trim(); }
  let unit = rest || "count";
  unit = { cups: "cup", stalks: "stalk", sheets: "sheet", litres: "litre" }[unit] || unit;
  return [n == null ? 1 : n, unit];
}
const issues = [];
function gramsFor(row, servings) {
  const [q, en] = row, key = keyOf(en), m = map[key];
  if (!m) { issues.push(`no map: "${key}"`); return [key, null, 0]; }
  const [n, unit] = parseQty(q);
  let g;
  if (unit === "to taste") g = /\bsalt\b|namak|सेंधा|नमक/.test(key) ? Math.min(6, 1 * servings) : m.toTaste || 0;
  else if (unit === "as needed") g = m.asNeeded || 0;
  else if (unit === "g") g = n;
  else if (unit === "kg") g = n * 1000;
  else if (unit === "ml") g = n * ((m.g && m.g.ml) || 1);
  else if (unit === "litre") g = n * 1000 * ((m.g && m.g.ml) || 1);
  else if (m.g && [unit, unit + "s", unit.replace(/s$/, "")].some((u) => m.g[u] != null)) g = n * m.g[[unit, unit + "s", unit.replace(/s$/, "")].find((u) => m.g[u] != null)];
  else { issues.push(`no unit "${unit}" for "${key}" (${q})`); g = 0; }
  return [key, m, g];
}
const round = (k, v) => (k === "kcal" || ["sodium", "potassium", "calcium", "magnesium", "vitA", "folate"].includes(k) ? Math.round(v)
  : ["iron", "zinc", "vitB12"].includes(k) ? Math.round(v * 10) / 10 : Math.round(v * 10) / 10);
function nutrition(r) {
  const tot = Object.fromEntries(NUTS.map((k) => [k, 0]));
  let mapped = 0, totalG = 0;
  for (const row of r.ingredients) {
    const [key, m, g] = gramsFor(row, r.servings);
    totalG += g;
    if (!m || m.food === "none" || !g) continue;
    const parts = m.mix || [[m.food, 1]];
    for (const [id, share] of parts) {
      const f = food(id);
      if (!f) { issues.push(`unknown food ${id} for "${key}"`); continue; }
      for (const k of NUTS) tot[k] += ((f.n[k] || 0) * g * share) / 100;
    }
    mapped += g;
  }
  const per = Object.fromEntries(NUTS.map((k) => [k, round(k, tot[k] / r.servings)]));
  return { per, gramsPerServing: Math.round(totalG / r.servings) };
}
const groups = [["plan", D.plan.flatMap((d) => [d.lunch, d.dinner])], ["snack", D.snacks], ["pp", D.postpartum.dishes],
  ["coll", (D.collection && D.collection.dishes) || []]];
const rows = [];
for (const [g, list] of groups) for (const r of list) { const n = nutrition(r); rows.push([g, r, n]); if (process.argv.includes("--write")) r.nutrition = n.per; }
console.log("conflicts:", conflicts.length ? conflicts : "none");
console.log("issues:", issues.length, [...new Set(issues)].slice(0, 40));
const fmt = ([g, r, n]) => `${g.padEnd(5)} ${r.id.padEnd(11)} ${String(n.per.kcal).padStart(5)} kcal  P${String(n.per.protein).padStart(5)}  C${String(n.per.carbs).padStart(6)}  F${String(n.per.fat).padStart(5)}  Fe${String(n.per.iron).padStart(5)}  Ca${String(n.per.calcium).padStart(5)}  Na${String(n.per.sodium).padStart(5)}  ${n.gramsPerServing}g  ${r.servings}sv  ${r.name.en}`;
if (process.argv.includes("--all")) rows.forEach((x) => console.log(fmt(x)));
else {
  const s = [...rows].sort((a, b) => a[2].per.kcal - b[2].per.kcal);
  console.log("lowest:"); s.slice(0, 8).forEach((x) => console.log(fmt(x)));
  console.log("highest:"); s.slice(-8).forEach((x) => console.log(fmt(x)));
}
if (process.argv.includes("--write")) {
  D.meta.nutrition = { basis: "per serving", sources: "USDA FoodData Central (SR Legacy) and IFCT 2017", saltToTaste: "1 g per serving" };
  const ser = (v, ind = "") => { const n2 = ind + "  ";
    if (Array.isArray(v)) { if (v.every((x) => typeof x !== "object" || x === null)) return "[" + v.map((x) => JSON.stringify(x)).join(", ") + "]";
      return "[\n" + v.map((x) => n2 + ser(x, n2)).join(",\n") + "\n" + ind + "]"; }
    if (v && typeof v === "object") { const ks = Object.keys(v);
      if (ks.every((k) => typeof v[k] !== "object") && JSON.stringify(v).length < 110) return "{ " + ks.map((k) => JSON.stringify(k) + ": " + JSON.stringify(v[k])).join(", ") + " }";
      if (ks.length && ks.every((k) => typeof v[k] === "number")) return "{ " + ks.map((k) => JSON.stringify(k) + ": " + JSON.stringify(v[k])).join(", ") + " }";
      return "{\n" + ks.map((k) => n2 + JSON.stringify(k) + ": " + ser(v[k], n2)).join(",\n") + "\n" + ind + "}"; }
    return JSON.stringify(v); };
  let hdr = header;
  if (!hdr.includes('"nutrition"')) hdr = hdr.replace('   - "emoji" is shown only if the photo fails to load.', '   - "emoji" is shown only if the photo fails to load.\n   - "nutrition" (per serving) is calculated from the ingredients with\n     USDA FoodData Central + IFCT 2017 values; regenerate it after edits.\n     Units: kcal; g (protein, carbs, fat, fiber, sugar, satFat);\n     mg (sodium, potassium, calcium, iron, magnesium, zinc, vitC);\n     µg (vitA RAE, folate DFE, vitB12).');
  fs.writeFileSync(DATA, hdr + "window.SATTVIC_DATA = " + ser(D) + ";\n");
  console.log("written");
}
