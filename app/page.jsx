"use client";

import { useEffect, useState, useCallback } from "react";

const REGIONS = [
  { code: "US", name: "🇺🇸 EE.UU." },
  { code: "GB", name: "🇬🇧 Reino Unido" },
  { code: "ID", name: "🇮🇩 Indonesia" },
  { code: "TH", name: "🇹🇭 Tailandia" },
  { code: "VN", name: "🇻🇳 Vietnam" },
  { code: "MY", name: "🇲🇾 Malasia" },
  { code: "PH", name: "🇵🇭 Filipinas" },
  { code: "ES", name: "🇪🇸 España" },
  { code: "MX", name: "🇲🇽 México" },
];

const RANK_FIELDS = [
  { value: 1, label: "GMV (ventas $)" },
  { value: 2, label: "Unidades vendidas" },
];

function fmtMoney(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Number(n).toFixed(0)}`;
}
function fmtNum(n) {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-ES").format(n);
}
function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() - 3); // ventana segura dentro de los últimos 30 días
  return d.toISOString().slice(0, 10);
}

export default function Home() {
  const [region, setRegion] = useState("US");
  const [date, setDate] = useState(defaultDate());
  const [rankField, setRankField] = useState(1);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ region, date, rankField, page, pageSize: 10 });
      const res = await fetch(`/api/products?${qs}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error");
      setItems(json.items);
    } catch (e) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [region, date, rankField, page]);

  useEffect(() => {
    load();
  }, [load]);

  const totalGmv = items.reduce((s, p) => s + (p.gmv || 0), 0);
  const totalUnits = items.reduce((s, p) => s + (p.unitsSold || 0), 0);

  return (
    <div className="wrap">
      <div className="header">
        <div className="logo">TS</div>
        <h1>TikTok Shop Radar</h1>
      </div>
      <p className="subtitle">
        Productos top de TikTok Shop por mercado, ordenados por GMV · datos vía EchoTik
      </p>

      <div className="controls">
        <div className="field">
          <label>Mercado</label>
          <select value={region} onChange={(e) => { setPage(1); setRegion(e.target.value); }}>
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Fecha (últimos ~30 días)</label>
          <input type="date" value={date} onChange={(e) => { setPage(1); setDate(e.target.value); }} />
        </div>
        <div className="field">
          <label>Ordenar por</label>
          <select value={rankField} onChange={(e) => { setPage(1); setRankField(Number(e.target.value)); }}>
            {RANK_FIELDS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      <div className="stats">
        <div className="stat"><div className="k">Productos</div><div className="v">{items.length}</div></div>
        <div className="stat"><div className="k">GMV (página)</div><div className="v">{fmtMoney(totalGmv)}</div></div>
        <div className="stat"><div className="k">Unidades (página)</div><div className="v">{fmtNum(totalUnits)}</div></div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th className="num">GMV</th>
              <th className="num">Unidades</th>
              <th className="num">Precio medio</th>
              <th className="num">Comisión</th>
              <th className="num">Creators</th>
              <th className="num">Vídeos</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="msg"><span className="spin" /></td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={8} className="msg error">⚠️ {error}</td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr><td colSpan={8} className="msg">Sin datos para este mercado/fecha.</td></tr>
            )}
            {!loading && !error && items.map((p) => (
              <tr key={p.productId} onClick={() => setSelected(p)}>
                <td><span className={`rank-badge rank-${p.rank}`}>{p.rank}</span></td>
                <td>
                  <div className="pname">
                    <span>{p.name}</span>
                  </div>
                </td>
                <td className="num gmv">{fmtMoney(p.gmv)}</td>
                <td className="num">{fmtNum(p.unitsSold)}</td>
                <td className="num">{p.avgPrice != null ? `$${p.avgPrice}` : "—"}</td>
                <td className="num">{p.commissionRate ? `${p.commissionRate}%` : "—"}</td>
                <td className="num">{fmtNum(p.influencers)}</td>
                <td className="num">{fmtNum(p.videos)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pager">
          <button className="btn btn-ghost" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
            ← Anterior
          </button>
          <span className="pill">Página {page}</span>
          <button className="btn btn-ghost" disabled={loading || items.length < 10} onClick={() => setPage((p) => p + 1)}>
            Siguiente →
          </button>
        </div>
      </div>

      {selected && (
        <ProductDrawer item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function ProductDrawer({ item, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetch(`/api/products/${item.productId}`)
      .then((r) => r.json())
      .then((json) => {
        if (!alive) return;
        if (!json.ok) throw new Error(json.error || "Error");
        setDetail(json.product);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [item.productId]);

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer">
        <button className="close" onClick={onClose}>×</button>
        <h2>{item.name}</h2>

        <div className="kv">
          <div className="k">GMV</div><div className="v gmv">{fmtMoney(item.gmv)}</div>
          <div className="k">Unidades vendidas</div><div className="v">{fmtNum(item.unitsSold)}</div>
          <div className="k">Precio</div><div className="v">{item.minPrice === item.maxPrice ? `$${item.minPrice}` : `$${item.minPrice} – $${item.maxPrice}`}</div>
          <div className="k">Comisión afiliado</div><div className="v">{item.commissionRate ? `${item.commissionRate}%` : "—"}</div>
          <div className="k">Creators / Vídeos / Lives</div><div className="v">{fmtNum(item.influencers)} / {fmtNum(item.videos)} / {fmtNum(item.lives)}</div>
        </div>

        {loading && <div className="msg"><span className="spin" /></div>}
        {error && <div className="msg error">⚠️ {error}</div>}

        {detail && (
          <>
            {detail.images.length > 0 && (
              <div className="gallery">
                {detail.images.map((src, i) => (
                  <img key={i} src={src} alt="" loading="lazy" />
                ))}
              </div>
            )}

            <div className="section-title">Tienda · pedir muestras</div>
            <div className="sample-box">
              <div className="kv" style={{ margin: 0 }}>
                <div className="k">Tienda</div><div className="v">{detail.shopName || "—"}</div>
                <div className="k">Dirección</div><div className="v">{detail.shopAddress || "—"}</div>
                <div className="k">Seller ID</div><div className="v">{detail.sellerId || "—"}</div>
              </div>
              <a className="link-btn" href={detail.tiktokUrl} target="_blank" rel="noreferrer">
                Abrir en TikTok Shop ↗
              </a>
            </div>

            {detail.skus.length > 0 && (
              <>
                <div className="section-title">Variantes ({detail.skus.length})</div>
                <div className="sample-box">
                  {detail.skus.slice(0, 8).map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
                      <span style={{ color: "var(--muted)" }}>SKU {s.sku_id}</span>
                      <span>{s.real_price?.price_str || ""}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {detail.description && (
              <>
                <div className="section-title">Descripción</div>
                <div className="desc">{detail.description}</div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
