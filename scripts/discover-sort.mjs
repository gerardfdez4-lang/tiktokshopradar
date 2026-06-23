#!/usr/bin/env node
/** Busca el parámetro de ordenación por GMV en product/list. */

const HOST = "tiktok-ultra-api1.p.rapidapi.com";
const KEY = process.env.RAPIDAPI_KEY;
const headers = { Accept: "application/json", "x-rapidapi-host": HOST, "x-rapidapi-key": KEY };
const BASE = `https://${HOST}/api/v3/echotik/product/list`;

const combos = [
  "sort_field=total_sale_gmv_amt&sort_type=desc",
  "sort_field=total_sale_gmv_90d_amt&sort_type=desc",
  "sort=total_sale_gmv_amt&order=desc",
  "order_by=total_sale_gmv_amt&order_type=desc",
  "sort_field=gmv&sort_type=desc",
  "sort_by=gmv&sort_type=desc",
  "order_field=total_sale_gmv_amt&order_type=2",
  "sort_field=total_sale_gmv_amt&sort_type=2",
  "sales_flag=1&sort_field=total_sale_gmv_amt&sort_type=desc",
];

for (const c of combos) {
  const url = `${BASE}?page_num=1&page_size=3&region=US&${c}`;
  try {
    const res = await fetch(url, { headers });
    const j = await res.json();
    const p = j?.data?.[0];
    const gmv = p ? `gmv_all=${p.total_sale_gmv_amt} gmv_90d=${p.total_sale_gmv_90d_amt} sales=${p.total_sale_cnt}` : `code=${j.code} ${j.message ?? ""}`;
    console.log(`[${c}]\n   ${p?.product_name?.slice(0, 50) ?? "—"} | ${gmv}`);
  } catch (e) {
    console.log(`[${c}] ERR ${e.message}`);
  }
}
