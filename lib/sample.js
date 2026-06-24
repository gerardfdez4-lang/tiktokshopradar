// Datos de muestra (modo demo) para enseñar la UI sin gastar cuota de la API.
// 10 productos curados (reales observados en TikTok Shop US) + 40 generados.

const CURATED = [
  { name: "[medicube] PDRN Pink Collagen Volume Multi Balm", gmv: 831800, units: 11047, avg: 75.3, min: 25.1, max: 75.99, comm: 15, ifl: 130, vid: 152, live: 48 },
  { name: "SEESE Cordless Pressure Washer + Charger Base", gmv: 544700, units: 8108, avg: 67.19, min: 39.99, max: 89.99, comm: 12, ifl: 35, vid: 29, live: 12 },
  { name: "Toplux Magnesium Complex 8 — Essential Supplement", gmv: 247582, units: 6967, avg: 29.97, min: 19.99, max: 39.99, comm: 20, ifl: 60, vid: 60, live: 22 },
  { name: "FreshHood Apparel — 100% Cotton T-Shirts", gmv: 185100, units: 6085, avg: 30.42, min: 19.99, max: 34.99, comm: 10, ifl: 44, vid: 61, live: 8 },
  { name: "Body Glaze Perfume — Retiring Scents Closeout", gmv: 163400, units: 9012, avg: 18.13, min: 9.99, max: 24.99, comm: 25, ifl: 78, vid: 95, live: 14 },
  { name: "GlowDrip Hydrating Lip Oil Set (Pack of 3)", gmv: 132500, units: 7340, avg: 18.05, min: 12.99, max: 22.99, comm: 22, ifl: 112, vid: 180, live: 20 },
  { name: "PawsPer Reusable Pet Hair Remover Roller", gmv: 98700, units: 6420, avg: 15.37, min: 9.99, max: 19.99, comm: 18, ifl: 54, vid: 40, live: 9 },
  { name: "Loaded Tea Single Packet — Hydration Mix", gmv: 44000, units: 5653, avg: 7.79, min: 5.99, max: 12.99, comm: 13, ifl: 8, vid: 6, live: 3 },
  { name: "AuraSleep Magnesium Sleep Spray", gmv: 38900, units: 2510, avg: 15.5, min: 12.99, max: 18.99, comm: 20, ifl: 33, vid: 47, live: 6 },
  { name: "FlexFit Resistance Bands Kit (5 Levels)", gmv: 31200, units: 2080, avg: 15.0, min: 11.99, max: 19.99, comm: 17, ifl: 21, vid: 18, live: 4 },
];

const MORE_NAMES = [
  "Hydrating Vitamin C Brightening Serum", "Sculpting Gua Sha & Roller Set", "Mini Portable USB Blender",
  "LED Light Therapy Face Mask", "Heatless Curling Rod Headband", "Collagen Peptides Powder (Unflavored)",
  "Sea Moss Gummies — Immune Support", "Magnetic Lash & Eyeliner Kit", "Posture Corrector Back Brace",
  "Cloud Slides Pillow Sandals", "40oz Insulated Tumbler with Straw", "Reusable Makeup Remover Pads",
  "Scalp Massager Shampoo Brush", "Blackhead Remover Pore Vacuum", "Wireless Lavalier Microphone",
  "Acrylic Press-On Nails Kit", "Lip Sleeping Mask Overnight", "Castor Oil Eyebrow Growth Serum",
  "Foldable Phone Tripod & Ring Light", "Heated Eyelash Curler", "Tinted Lip Oil Gloss",
  "Resistance Bands Booty Set", "Sunset Projection Lamp", "Hydrocolloid Pimple Patches",
  "Detangling Wet Hair Brush", "Self-Tanning Mousse Drops", "Electric Spin Scrubber",
  "Memory Foam Cloud Pillow", "Mushroom Coffee Blend", "Snail Mucin Repairing Essence",
  "Waterproof Microblading Brow Pen", "Mini Deep-Tissue Massage Gun", "Crystal Hair Eraser",
  "Glow Body Oil Shimmer Drops", "Velvet Matte Liquid Blush", "Rosemary Hair Growth Oil",
  "Compression Socks (3 Pack)", "Reusable Magnetic Eyelashes", "Whitening Toothpaste Foam",
  "Anti-Frizz Heatless Silk Scrunchie",
];

const AVGS = [9.99, 14.99, 19.99, 24.99, 12.99, 29.99, 16.99, 34.99];

const GENERATED = MORE_NAMES.map((name, i) => {
  const gmv = Math.round(28000 - i * 580);
  const avg = AVGS[i % AVGS.length];
  return {
    name,
    gmv,
    units: Math.round(gmv / avg),
    avg,
    min: Math.max(1.99, Math.round((avg - 3) * 100) / 100),
    max: Math.round((avg + 10) * 100) / 100,
    comm: 8 + (i % 18),
    ifl: Math.max(2, 42 - Math.floor(i / 2)),
    vid: Math.max(1, 52 - Math.floor(i / 2)),
    live: Math.max(0, 12 - Math.floor(i / 4)),
  };
});

const RAW = [...CURATED, ...GENERATED];

export const SAMPLE_RANKING = RAW.map((r, i) => ({
  rank: i + 1,
  productId: `demo-${1730000000000 + i}`,
  name: r.name,
  region: "US",
  categoryId: "600001",
  categoryL2Id: "0",
  categoryL3Id: "0",
  minPrice: r.min,
  maxPrice: r.max,
  avgPrice: r.avg,
  commissionRate: r.comm,
  gmv: r.gmv,
  unitsSold: r.units,
  influencers: r.ifl,
  videos: r.vid,
  lives: r.live,
  tiktokUrl: "https://shop.tiktok.com",
}));

export function sampleDetail(id) {
  const item = SAMPLE_RANKING.find((p) => p.productId === id) || SAMPLE_RANKING[0];
  return {
    productId: item.productId,
    name: item.name,
    region: item.region,
    minPrice: item.minPrice,
    maxPrice: item.maxPrice,
    avgPrice: item.avgPrice,
    commissionRate: item.commissionRate,
    sellerId: "7495808609650510251",
    images: [],
    description:
      "Producto de muestra (modo demo). En producción, aquí aparece la descripción real del producto, ingredientes, beneficios y detalles de envío extraídos directamente de TikTok Shop.",
    shopName: "Demo Store",
    shopAddress: "New York, United States",
    skus: [
      { sku_id: "demo-sku-1", real_price: { price_str: `$${item.minPrice}` } },
      { sku_id: "demo-sku-2", real_price: { price_str: `$${item.maxPrice}` } },
    ],
    saleProps: [],
    tiktokUrl: item.tiktokUrl,
  };
}
