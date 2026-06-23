# TikTok Shop Radar

Web que muestra los productos top de TikTok Shop por mercado, **ordenados por GMV**,
con ficha de detalle (imágenes, variantes, precio, comisión, datos para pedir muestras).

Datos vía **TikTok Ultra API** en RapidAPI (basada en EchoTik).

## Stack
- Next.js (App Router) + React
- La API key vive **solo en el servidor** (`.env.local`), nunca llega al navegador.
- Caché en memoria (10 min) para no quemar cuota de RapidAPI.

## Arrancar
```bash
npm install
npm run dev          # http://localhost:3010
```
Configura `.env.local`:
```
RAPIDAPI_KEY=...
RAPIDAPI_HOST=tiktok-ultra-api1.p.rapidapi.com
```

## Cómo funciona
- `lib/echotik.js` — cliente de la API (proxy, parseo, normalización, caché, firma de imágenes).
- `app/api/products` — ranking por GMV (endpoint `product/ranklist`).
- `app/api/products/[id]` — ficha de producto (endpoint `product/detail`).
- `app/page.jsx` — UI: controles (mercado/fecha/orden), tabla por GMV, panel de detalle.

Detalles de la API en `API-NOTES.md`.

## Limitaciones / próximos pasos
- **Cuota RapidAPI**: el plan BASIC tiene un tope mensual de requests. Subir de plan o esperar al reset.
- **page_size** del ranking está limitado a 10 por la API → la app pagina de 10 en 10.
- **Nombre de tienda / dirección** para muestras: sacar del endpoint `Shop Detail` vía `seller_id`
  (ahora solo se rellena si viene embebido en la descripción).
- Posibles mejoras: filtros por categoría (endpoints de categorías), histórico de GMV (`product/trend`),
  export a CSV, favoritos/seguimiento de productos.
