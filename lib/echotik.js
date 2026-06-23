// Cliente server-side de la TikTok Ultra API (RapidAPI / datos EchoTik).
// La API key vive solo aquí (servidor), nunca se envía al navegador.

const HOST = process.env.RAPIDAPI_HOST || "tiktok-ultra-api1.p.rapidapi.com";
const KEY = process.env.RAPIDAPI_KEY;
const BASE = `https://${HOST}`;

function headers() {
  if (!KEY) throw new Error("Falta RAPIDAPI_KEY en .env.local");
  return {
    Accept: "application/json",
    "x-rapidapi-host": HOST,
    "x-rapidapi-key": KEY,
  };
}

// Caché en memoria con TTL para no quemar cuota de RapidAPI con consultas repetidas.
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min
const _cache = new Map();

async function call(path, params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    )
  ).toString();
  const url = `${BASE}${path}${qs ? `?${qs}` : ""}`;

  const cached = _cache.get(url);
  if (cached && Date.now() - cached.t < CACHE_TTL_MS) {
    return cached.data;
  }

  const res = await fetch(url, { headers: headers(), cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (json.code !== 0) {
    const msg = json.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.code = json.code;
    err.httpStatus = res.status;
    throw err;
  }
  _cache.set(url, { t: Date.now(), data: json.data });
  return json.data;
}

// Algunos campos vienen como string JSON. Parseo defensivo.
function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// Extrae las URLs de portada (vienen como string JSON [{url,index}]).
function coverUrls(raw) {
  const arr = parseJson(raw, []);
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((x) => x && x.url)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((x) => x.url);
}

// Aplana desc_detail (string JSON con bloques text/image/ul) a texto plano + imágenes.
function parseDescription(raw) {
  const blocks = parseJson(raw, []);
  if (!Array.isArray(blocks)) return { text: "", images: [], shop: null, address: null };
  const texts = [];
  const images = [];
  let shop = null;
  let address = null;
  for (const b of blocks) {
    if (!b) continue;
    if (b.type === "text" && b.text) {
      texts.push(b.text);
    } else if (b.type === "ul" && Array.isArray(b.content)) {
      for (const line of b.content) {
        texts.push(line);
        const m1 = /shop name\s*[:：]\s*(.+)/i.exec(line);
        if (m1) shop = m1[1].trim();
        const m2 = /business address\s*[:：]\s*(.+)/i.exec(line);
        if (m2) address = m2[1].trim();
      }
    } else if (b.type === "image" && b.image) {
      const u = b.image.url_list?.[0] || b.image.url;
      if (u) images.push(u);
    }
  }
  return { text: texts.join("\n").trim(), images, shop, address };
}

// Firma las URLs de portada de echosell (requieren firma TOS para cargar).
async function signCovers(urls) {
  const toSign = urls.filter((u) => u && u.includes("echosell-images"));
  if (toSign.length === 0) return urls;
  try {
    const data = await call("/api/v3/echotik/batch/cover/download", {
      cover_urls: toSign.join(","),
    });
    // data: [{ "<origUrl>": "<signedUrl>" }, ...]
    const map = {};
    if (Array.isArray(data)) {
      for (const entry of data) {
        if (entry && typeof entry === "object") {
          for (const [k, v] of Object.entries(entry)) map[k] = v;
        }
      }
    }
    return urls.map((u) => map[u] || u);
  } catch {
    return urls; // si falla la firma, devolvemos las originales
  }
}

// ----- Modelo normalizado para la UI -----

function normalizeRankItem(p, idx, offset = 0) {
  return {
    rank: offset + idx + 1,
    productId: p.product_id,
    name: p.product_name,
    region: p.region,
    categoryId: p.category_id,
    categoryL2Id: p.category_l2_id,
    categoryL3Id: p.category_l3_id,
    minPrice: p.min_price,
    maxPrice: p.max_price,
    avgPrice: p.spu_avg_price,
    commissionRate: p.product_commission_rate,
    gmv: p.total_sale_gmv_amt ?? 0,
    unitsSold: p.total_sale_cnt ?? 0,
    influencers: p.total_ifl_cnt ?? 0,
    videos: p.total_video_cnt ?? 0,
    lives: p.total_live_cnt ?? 0,
    tiktokUrl: `https://shop.tiktok.com/view/product/${p.product_id}`,
  };
}

// ----- API pública del módulo -----

export async function getRanking({
  region = "US",
  date,
  rankType = 1,
  rankField = 1,
  page = 1,
  pageSize = 20,
}) {
  const data = await call("/api/v3/echotik/product/ranklist", {
    rank_type: rankType,
    product_rank_field: rankField,
    page_num: page,
    page_size: pageSize,
    region,
    date,
  });
  const list = Array.isArray(data) ? data : [];
  return list.map((p, i) => normalizeRankItem(p, i, (page - 1) * pageSize));
}

export async function getProductDetail(productId) {
  const data = await call("/api/v3/echotik/product/detail", {
    product_ids: productId,
  });
  const p = Array.isArray(data) ? data[0] : data;
  if (!p) return null;
  const desc = parseDescription(p.desc_detail);
  const skus = parseJson(p.skus, []);
  const saleProps = parseJson(p.sale_props, []);
  const rawImages = coverUrls(p.cover_url).concat(desc.images).slice(0, 12);
  const images = await signCovers(rawImages);
  return {
    productId: p.product_id,
    name: p.product_name,
    region: p.region,
    minPrice: p.min_price,
    maxPrice: p.max_price,
    avgPrice: p.spu_avg_price,
    commissionRate: p.product_commission_rate,
    sellerId: p.seller_id,
    images,
    description: desc.text,
    shopName: desc.shop,
    shopAddress: desc.address,
    skus: Array.isArray(skus) ? skus : [],
    saleProps: Array.isArray(saleProps) ? saleProps : [],
    tiktokUrl: `https://shop.tiktok.com/view/product/${p.product_id}`,
  };
}

export const REGIONS = ["US", "GB", "ID", "TH", "VN", "MY", "PH", "ES", "MX"];

// product_rank_field: campos por los que se puede rankear.
export const RANK_FIELDS = [
  { value: 1, label: "GMV (ventas $)" },
  { value: 2, label: "Unidades vendidas" },
];
