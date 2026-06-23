#!/usr/bin/env node
/**
 * Sondeo de la TikTok Ultra API (RapidAPI / datos EchoTik).
 *
 * Uso:
 *   RAPIDAPI_KEY="xxx" node scripts/probe.mjs <ruta-endpoint> [query=string&otra=cosa]
 *
 * Ejemplo:
 *   RAPIDAPI_KEY="xxx" node scripts/probe.mjs /api/v3/echotik/product/list "region=ES&page=1"
 */

const HOST = process.env.RAPIDAPI_HOST || "tiktok-ultra-api1.p.rapidapi.com";
const KEY = process.env.RAPIDAPI_KEY;
const BASE = `https://${HOST}`;

if (!KEY) {
  console.error("Falta RAPIDAPI_KEY");
  process.exit(1);
}

const path = process.argv[2] || "/";
const query = process.argv[3] ? `?${process.argv[3]}` : "";
const url = `${BASE}${path}${query}`;

const headers = {
  Accept: "application/json",
  "x-rapidapi-host": HOST,
  "x-rapidapi-key": KEY,
};

console.log(`\n→ GET ${url}\n`);

try {
  const res = await fetch(url, { headers });
  console.log(`← HTTP ${res.status} ${res.statusText}`);
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    console.log(JSON.stringify(json, null, 2).slice(0, 8000));
  } catch {
    console.log(text.slice(0, 2000));
  }
} catch (err) {
  console.error("Error de red:", err.message);
}
