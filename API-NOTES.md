# TikTok Ultra API (RapidAPI / datos EchoTik) — Notas

## Conexión
- Base URL: `https://tiktok-ultra-api1.p.rapidapi.com`
- Headers: `x-rapidapi-host: tiktok-ultra-api1.p.rapidapi.com`, `x-rapidapi-key: <KEY>`
- Sobre de respuesta: `{ code, message, data, requestId }`. `code: 0` = éxito.

## Endpoints confirmados
| Endpoint | Params obligatorios | Notas |
|---|---|---|
| `GET /api/v3/echotik/product/list` | `page_num`, `page_size`, `region` | Catálogo. `sort_field` (string) + `sort_type` (int 0/1). GMV sale 0 con sort_field=total_sale_gmv_amt → campo de orden inválido o datos no incluidos en este plan. |
| `GET /api/v3/echotik/product/detail` | `product_ids` | Detalle por id(s). |
| `GET /api/v3/echotik/product/trend` | `product_id`, `start_date`, `end_date` | Serie temporal por producto. |
| `GET /api/v3/echotik/batch/cover/download` | `cover_urls` | Firma URLs de imágenes. |

## Campos de un producto (product/list)
- Identidad: `product_id`, `product_name`, `region`, `category_id/_l2_id/_l3_id`
- Precio: `min_price`, `max_price`, `spu_avg_price`, `skus` (JSON string), `sale_props` (JSON string, variantes con imagen)
- GMV/ventas: `total_sale_gmv_amt` + ventanas `_1d/_7d/_15d/_30d/_60d/_90d`; desglose `_video_` y `_live_`; `total_sale_cnt`
- Tienda: `seller_id`, `shop_type`, `is_s_shop`; dentro de `desc_detail` (JSON string) hay "Shop name" y "Business address"
- Comisión: `product_commission_rate`
- Influencers: `total_ifl_*` (cnt por ventana)
- Imágenes: `cover_url` (JSON string array de {url,index})
- Estado: `off_mark`, `from_flag`, `first_crawl_dt`, `last_crawl_dt`

## ⭐ Endpoint clave para la app: ranklist
`GET /api/v3/echotik/product/ranklist`
- Params: `rank_type` (int, 1 = solo fechas de los últimos ~30 días), `product_rank_field` (int, 1 = GMV), `page_num`, `page_size`, `region`, `date` (YYYY-MM-DD).
- Devuelve productos ORDENADOS por GMV con datos reales.
- Campos por item: `product_id`, `product_name`, `region`, `category_id/_l2_id/_l3_id`,
  `min_price`, `max_price`, `spu_avg_price`, `product_commission_rate`,
  `total_sale_gmv_amt` (GMV), `total_sale_cnt` (unidades),
  `total_ifl_cnt` (influencers), `total_video_cnt`, `total_live_cnt`.

## Endpoints completos disponibles (RapidAPI)
Product: categories L1/L2/L3, detail web/app realtime, product-id-from-share-link,
search products, review list, list(enriched), detail(enriched), trends, influencer list,
video list, livestream list, **ranklist** (ranking).
Shop: product list, list, detail, trends, influencer list, video list, livestream list, ranking.
Influencer / Video / Live / Search (incl. image search) / Social analysis. Ver panel RapidAPI.

## PENDIENTE
- Encontrar cómo obtener productos ORDENADOS por GMV con datos reales:
  - ¿valores válidos de `sort_field`?
  - ¿endpoint de ranking/sales board dedicado? (los probados dan 404)
- Valores válidos de `region` (probado: US ✓). Faltan ES, GB, etc.
