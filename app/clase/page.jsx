"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BULLETS = [
  "Por qué TikTok Shop USA es el mercado más rentable del mundo (y cómo entrar desde donde estés)",
  "El método exacto para encontrar productos ganadores antes de que se saturen",
  "Cómo conseguir muestras y creators que vendan tu producto por ti",
  "El error que arruina al 90% de los que empiezan (y cómo evitarlo)",
];

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <svg viewBox="0 0 100 100" fill="none" aria-hidden style={{ width: 21, height: 21 }}>
          <rect x="24" y="52" width="13" height="24" rx="4" fill="#06120b" />
          <rect x="43" y="40" width="13" height="36" rx="4" fill="#06120b" />
          <rect x="62" y="26" width="13" height="50" rx="4" fill="#06120b" />
          <path d="M62 24 L68.5 14 L75 24 Z" fill="#06120b" />
        </svg>
      </span>
      <span className="wordmark"><span>first</span><span className="accent">100</span><span>sales</span></span>
    </div>
  );
}

export default function ClasePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { document.title = "Clase gratis — Vende en TikTok Shop USA | First 100 Sales"; }, []);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Pon un email válido."); return; }
    setSending(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "clase" }),
      });
      try { localStorage.setItem("f100_lead", "1"); } catch {}
      router.push("/clase/ver");
    } catch {
      setError("Algo falló, inténtalo de nuevo.");
      setSending(false);
    }
  }

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner"><Brand /><span className="nav-tag">Clase gratuita</span></div>
      </nav>

      <header className="c-hero">
        <div className="wrap">
          <span className="c-eyebrow"><span className="dot" /> Clase gratis · online</span>
          <h1 className="c-h1">Cómo vender en <span className="grad">TikTok Shop USA</span> y conseguir tus primeras 100 ventas</h1>
          <p className="c-sub">
            En esta clase gratuita te enseño el método con el que vendo en el mercado de TikTok Shop más
            rentable del mundo — y la herramienta que uso para encontrar los productos ganadores. Déjame
            tu email y entra ahora.
          </p>

          <form className="c-form" onSubmit={submit}>
            <div className="col">
              <input className="c-input" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="c-input" type="email" placeholder="Tu mejor email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button className="c-submit" type="submit" disabled={sending}>
                {sending ? "Entrando…" : "Ver la clase gratis →"}
              </button>
            </div>
          </form>
          {error && <div className="c-formnote" style={{ color: "#ff6b6b" }}>{error}</div>}
          <div className="c-formnote">100% gratis · acceso inmediato · sin spam</div>

          <div className="c-bullets">
            {BULLETS.map((b, i) => (
              <div className="c-bullet" key={i}><span className="check">✓</span><span>{b}</span></div>
            ))}
          </div>
        </div>
      </header>

      <div className="footer"><span className="grad">first100sales</span> · clase gratuita de TikTok Shop USA</div>
    </>
  );
}
