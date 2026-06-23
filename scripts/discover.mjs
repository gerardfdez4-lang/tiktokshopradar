#!/usr/bin/env node
/** Prueba rutas candidatas para encontrar el endpoint de lista de productos. */

const HOST = "tiktok-ultra-api1.p.rapidapi.com";
const KEY = process.env.RAPIDAPI_KEY;
const BASE = `https://${HOST}`;
const headers = { Accept: "application/json", "x-rapidapi-host": HOST, "x-rapidapi-key": KEY };

const candidates = [
  "/api/v3/echotik/product/list",
  "/api/v3/echotik/products",
  "/api/v3/echotik/product/search",
  "/api/v3/echotik/product/rank",
  "/api/v3/echotik/product/ranking",
  "/api/v3/echotik/sales/product/list",
  "/api/v3/echotik/product/sales/list",
  "/api/v3/echotik/rank/product",
  "/api/v3/echotik/product/trends",
  "/api/v3/echotik/shop/list",
  "/api/v3/echotik/product",
];

for (const path of candidates) {
  const url = `${BASE}${path}?page=1&size=5`;
  try {
    const res = await fetch(url, { headers });
    const text = await res.text();
    let note = "";
    try {
      const j = JSON.parse(text);
      note = `code=${j.code} msg=${j.message ?? ""}`.slice(0, 120);
    } catch {
      note = text.slice(0, 80).replace(/\s+/g, " ");
    }
    console.log(`${res.status}  ${path}\n     ${note}`);
  } catch (e) {
    console.log(`ERR  ${path}  ${e.message}`);
  }
}
