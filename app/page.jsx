"use client";

import { useEffect, useState, useCallback, useRef } from "react";

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

const SORTS = [
  { value: "gmv", label: "GMV (ventas $)" },
  { value: "units", label: "Unidades vendidas" },
  { value: "creators", label: "Nº de creators" },
];

const TARGET = 50;
const PAGE_SIZE = 10;

function fmtMoney(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Number(n).toFixed(0)}`;
}
function fmtNum(n) {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-ES").format(Math.round(n));
}
function fmtCompact(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function prettyDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function LogoMark() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="24" y="52" width="13" height="24" rx="4" fill="#06120b" />
      <rect x="43" y="40" width="13" height="36" rx="4" fill="#06120b" />
      <rect x="62" y="26" width="13" height="50" rx="4" fill="#06120b" />
      <path d="M62 24 L68.5 14 L75 24 Z" fill="#06120b" />
    </svg>
  );
}

function useCountUp(value, duration = 900) {
  const [n, setN] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const start = performance.now();
    cancelAnimationFrame(ref.current);
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return n;
}

function StatMoney({ value }) { return <>{fmtMoney(useCountUp(value))}</>; }
function StatNum({ value }) { return <>{fmtNum(useCountUp(value))}</>; }

function sortItems(items, sort) {
  const key = sort === "units" ? "unitsSold" : sort === "creators" ? "influencers" : "gmv";
  return [...items].sort((a, b) => (b[key] || 0) - (a[key] || 0)).map((p, i) => ({ ...p, rank: i + 1 }));
}

export default function Home() {
  const [region, setRegion] = useState("US");
  const [date, setDate] = useState(yesterday());
  const [sort, setSort] = useState("gmv");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [selected, setSelected] = useState(null);
  const itemsRef = useRef([]);
  const loadingRef = useRef(false);

  useEffect(() => { itemsRef.current = items; }, [items]);

  const fetchPage = useCallback(async (p, append) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (append) setLoadingMore(true);
    else { setLoading(true); setError(null); }
    try {
      const qs = new URLSearchParams({ region, date, rankField: 1, page: p, pageSize: PAGE_SIZE });
      const res = await fetch(`/api/products?${qs}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error");
      setIsDemo(!!json.demo);
      const incoming = json.items || [];
      const base = append ? itemsRef.current : [];
      const merged = [...base, ...incoming].slice(0, TARGET);
      setItems(merged);
      setPage(p);
      const apiExhausted = incoming.length < PAGE_SIZE;
      setHasMore(merged.length < TARGET && !apiExhausted);
    } catch (e) {
      if (!append) { setError(e.message); setItems([]); setHasMore(false); }
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [region, date]);

  // Carga inicial / al cambiar mercado o fecha
  useEffect(() => { loadingRef.current = false; fetchPage(1, false); }, [fetchPage]);

  // Scroll infinito: carga la siguiente página al acercarse al final
  useEffect(() => {
    const onScroll = () => {
      if (!hasMore || loadingRef.current) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        fetchPage(page + 1, true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, page, fetchPage]);

  const sorted = sortItems(items, sort);
  const maxGmv = Math.max(1, ...sorted.map((p) => p.gmv || 0));
  const totalGmv = sorted.reduce((s, p) => s + (p.gmv || 0), 0);
  const totalUnits = sorted.reduce((s, p) => s + (p.unitsSold || 0), 0);
  const ready = !loading && !error && sorted.length > 0;

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="brand">
            <span className="brand-mark"><LogoMark /></span>
            <span className="wordmark"><span>first</span><span className="accent">100</span><span>sales</span></span>
          </div>
          <span className="nav-tag">Radar de productos · TikTok Shop</span>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <span className="badge"><span className="dot" /> Productos reales de TikTok Shop · actualizado a diario</span>
          <h1>Encuentra productos <span className="grad">ganadores</span><br />y consigue tus primeras 100 ventas</h1>
          <p>
            El radar de productos para creadores que empiezan en TikTok Shop. Mira qué se vende
            de verdad en cada mercado, ordenado por GMV, y pide muestras a las mejores tiendas.
          </p>
          <div className="chips">
            <span className="chip"><span className="ic">●</span> <b>9</b> mercados</span>
            <span className="chip"><span className="ic">↗</span> ordenado por <b>GMV real</b></span>
            <span className="chip"><span className="ic">✦</span> datos de <b>{prettyDate(date)}</b></span>
          </div>
        </div>
      </header>

      <main className="wrap" id="ranking">
        <div className="controls">
          <div className="field">
            <label>Mercado</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Ordenar por</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <button className="btn" onClick={() => fetchPage(1, false)} disabled={loading}>{loading ? "Cargando…" : "Actualizar"}</button>
          {isDemo && <span className="demo-pill">✦ Datos de ejemplo (demo)</span>}
        </div>

        <div className="stats">
          <div className="stat rise"><div className="k">Productos cargados</div><div className="v">{ready ? <StatNum value={sorted.length} /> : "—"}</div></div>
          <div className="stat rise" style={{ animationDelay: "60ms" }}><div className="k">GMV combinado</div><div className="v accent">{ready ? <StatMoney value={totalGmv} /> : "—"}</div></div>
          <div className="stat rise" style={{ animationDelay: "120ms" }}><div className="k">Unidades vendidas</div><div className="v">{ready ? <StatNum value={totalUnits} /> : "—"}</div></div>
        </div>

        {ready && sorted.length >= 3 && (
          <section id="top">
            <div className="sec-head">
              <h2>🏆 Top 3 del día</h2>
              <span className="hint">{REGIONS.find((r) => r.code === region)?.name} · {prettyDate(date)}</span>
            </div>
            <div className="podium">
              {sorted.slice(0, 3).map((p) => (
                <div key={p.productId} className={`pod rise feat-${p.rank}`} style={{ animationDelay: `${p.rank * 70}ms` }} onClick={() => setSelected(p)}>
                  <span className={`pod-rank pod-${p.rank}`}>{p.rank}</span>
                  <div className="pod-name">{p.name}</div>
                  <div className="pod-gmv">{fmtMoney(p.gmv)}</div>
                  <div className="pod-sub">GMV · {sort === "units" ? "ordenado por unidades" : sort === "creators" ? "ordenado por creators" : "ordenado por GMV"}</div>
                  <div className="pod-foot">
                    <span><b>{fmtNum(p.unitsSold)}</b> uds</span>
                    <span><b>{fmtNum(p.influencers)}</b> creators</span>
                    <span><b>{p.commissionRate ? `${p.commissionRate}%` : "—"}</b> comisión</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="sec-head">
          <h2>Ranking completo</h2>
          <span className="hint">Haz clic en un producto para ver la ficha y la tienda</span>
        </div>

        <div className="table-wrap">
          <div className="table-scroll">
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
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={7} className="msg"><span className="spin" /></td></tr>}
                {!loading && error && (
                  <tr><td colSpan={7} className="msg error"><div className="big">No se pudieron cargar los productos</div><div>{error}</div></td></tr>
                )}
                {!loading && !error && sorted.length === 0 && (
                  <tr><td colSpan={7} className="msg"><div className="big">Sin datos para este mercado y fecha</div><div>Prueba con otro mercado o una fecha de los últimos 30 días.</div></td></tr>
                )}
                {ready && sorted.map((p, i) => (
                  <tr key={p.productId} className="rise" style={{ animationDelay: `${Math.min(i % PAGE_SIZE, 10) * 35}ms` }} onClick={() => setSelected(p)}>
                    <td><span className={`rank ${p.rank <= 3 ? `top rank-${p.rank}` : ""}`}>{p.rank}</span></td>
                    <td className="pname"><div className="line">{p.name}</div></td>
                    <td className="num gmv-cell">
                      <div className="gmv-val">{fmtMoney(p.gmv)}</div>
                      <div className="gmv-bar-track"><div className="gmv-bar" style={{ width: `${Math.max(6, (p.gmv / maxGmv) * 100)}%`, marginLeft: "auto" }} /></div>
                    </td>
                    <td className="num">{fmtNum(p.unitsSold)}</td>
                    <td className="num">{p.avgPrice != null ? `$${p.avgPrice}` : "—"}</td>
                    <td className="num muted-cell">{p.commissionRate ? `${p.commissionRate}%` : "—"}</td>
                    <td className="num muted-cell">{fmtNum(p.influencers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pager">
            {loadingMore && <span className="spin" />}
            {!loadingMore && ready && !hasMore && <span className="pill">Mostrando los {sorted.length} productos top</span>}
            {!loadingMore && ready && hasMore && <span className="pill">Baja para ver más ↓</span>}
          </div>
        </div>

        <div className="cta-band">
          <div>
            <h3>¿List@ para tu primera venta?</h3>
            <p>Elige un producto ganador, pide una muestra a la tienda y empieza a crear. Tu meta: las primeras 100 ventas.</p>
          </div>
          <a className="btn-dark" href="#top">Ver el top del día →</a>
        </div>

        <div className="footer">
          <span className="grad">first100sales</span> · tu atajo a las primeras 100 ventas en TikTok Shop
        </div>
      </main>

      {selected && <ProductDrawer item={selected} onClose={() => setSelected(null)} />}
    </>
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
        <div className="region-tag">Mercado: {item.region} · Rank #{item.rank}</div>

        <div className="kv">
          <div className="k">GMV</div><div className="v gmv">{fmtMoney(item.gmv)}</div>
          <div className="k">Unidades vendidas</div><div className="v">{fmtNum(item.unitsSold)}</div>
          <div className="k">Precio</div><div className="v">{item.minPrice === item.maxPrice ? `$${item.minPrice}` : `$${item.minPrice} – $${item.maxPrice}`}</div>
          <div className="k">Comisión afiliado</div><div className="v">{item.commissionRate ? `${item.commissionRate}%` : "—"}</div>
          <div className="k">Creators / Vídeos / Lives</div><div className="v">{fmtNum(item.influencers)} / {fmtNum(item.videos)} / {fmtNum(item.lives)}</div>
        </div>

        {loading && <div className="msg"><span className="spin" /></div>}
        {error && <div className="msg error"><div className="big">Error al cargar el detalle</div><div>{error}</div></div>}

        {detail && (
          <>
            {detail.images.length > 0 && (
              <div className="gallery">{detail.images.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}</div>
            )}
            <div className="section-title">Tienda · pedir muestras</div>
            <div className="box">
              <div className="kv" style={{ margin: 0 }}>
                <div className="k">Tienda</div><div className="v">{detail.shopName || "—"}</div>
                <div className="k">Dirección</div><div className="v">{detail.shopAddress || "—"}</div>
                <div className="k">Seller ID</div><div className="v">{detail.sellerId || "—"}</div>
              </div>
              <a className="link-btn" href={detail.tiktokUrl} target="_blank" rel="noreferrer">Abrir en TikTok Shop ↗</a>
            </div>

            {detail.videos?.length > 0 && (
              <>
                <div className="section-title">🎬 Vídeos de referencia</div>
                <div className="vid-grid">
                  {detail.videos.map((v) => (
                    <a key={v.id} className="vid-card" href={v.url} target="_blank" rel="noreferrer">
                      <div className="vid-thumb" style={v.cover ? { backgroundImage: `url(${v.cover})` } : undefined}>
                        <span className="vid-play">▶</span>
                        <span className="vid-views">{fmtCompact(v.views)} views</span>
                      </div>
                      <div className="vid-creator">{v.creator}</div>
                    </a>
                  ))}
                </div>
              </>
            )}

            {detail.creators?.length > 0 && (
              <>
                <div className="section-title">⭐ Creators que lo promocionan</div>
                <div className="creator-list">
                  {detail.creators.map((c, i) => (
                    <div key={i} className="creator-chip">
                      <span className="creator-av">{(c.name || c.handle || "?").replace("@", "").slice(0, 1).toUpperCase()}</span>
                      <span className="creator-info"><b>{c.handle || c.name}</b><small>{fmtCompact(c.followers)} seguidores</small></span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {detail.skus.length > 0 && (
              <>
                <div className="section-title">Variantes ({detail.skus.length})</div>
                <div className="box">
                  {detail.skus.slice(0, 8).map((s, i) => (
                    <div key={i} className="sku-row"><span className="muted-cell">SKU {s.sku_id}</span><span>{s.real_price?.price_str || ""}</span></div>
                  ))}
                </div>
              </>
            )}
            {detail.description && (
              <>
                <div className="section-title">Descripción</div>
                <div className="box desc">{detail.description}</div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
