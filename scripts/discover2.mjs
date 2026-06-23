#!/usr/bin/env node
/** Busca endpoints de ranking/ventas de producto. */
const HOST = "tiktok-ultra-api1.p.rapidapi.com";
const KEY = process.env.RAPIDAPI_KEY;
const headers = { Accept: "application/json", "x-rapidapi-host": HOST, "x-rapidapi-key": KEY };
const BASE = `https://${HOST}`;

const candidates = [
  "/api/v3/echotik/product/sales/rank",
  "/api/v3/echotik/product/rank/list",
  "/api/v3/echotik/product/sale/list",
  "/api/v3/echotik/product/hot",
  "/api/v3/echotik/product/top",
  "/api/v3/echotik/product/board",
  "/api/v3/echotik/sales/list",
  "/api/v3/echotik/sales/product",
  "/api/v3/echotik/rank/product/list",
  "/api/v3/echotik/hot/product",
  "/api/v3/echotik/leaderboard/product",
  "/api/v3/echotik/product/detail",
  "/api/v3/echotik/product/trend",
];

for (const path of candidates) {
  try {
    const res = await fetch(`${BASE}${path}?page_num=1&page_size=2&region=US`, { headers });
    const text = await res.text();
    let note = "";
    try { const j = JSON.parse(text); note = `code=${j.code} ${(j.message ?? "").slice(0,90)}`; }
    catch { note = text.slice(0, 70).replace(/\s+/g, " "); }
    console.log(`${res.status}  ${path}\n     ${note}`);
  } catch (e) { console.log(`ERR  ${path}  ${e.message}`); }
}
